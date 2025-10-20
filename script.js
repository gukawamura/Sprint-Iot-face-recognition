// --- Elementos do HTML ---
const loginButton = document.getElementById('loginButton');
const videoContainer = document.getElementById('video-container');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const statusText = document.getElementById('status');
const displaySize = { width: 640, height: 480 };


const labels = ['gustavo'];

// --- Variáveis de Controle ---
let faceMatcher = null;
let loginSuccess = false;
let intervalId = null;

// --- 1. CARREGAR OS MODELOS DA IA ---
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(loadLabeledImages); 

// --- 2. CARREGAR OS ROSTOS CONHECIDOS ---
async function loadLabeledImages() {
    statusText.innerText = "Carregando rostos conhecidos...";
    try {
        const descriptions = await Promise.all(
            labels.map(async label => {
                const img = await faceapi.fetchImage(`/rostos_conhecidos/${label}.jpg`);
                const detections = await faceapi.detectSingleFace(img)
                                            .withFaceLandmarks()
                                            .withFaceDescriptor();
                if (!detections) {
                    throw new Error(`Nenhum rosto detectado para ${label}`);
                }
                return new faceapi.LabeledFaceDescriptors(label, [detections.descriptor]);
            })
        );

        faceMatcher = new faceapi.FaceMatcher(descriptions, 0.5);

        // Libera o botão de login
        statusText.innerText = "Pronto para o login. Clique no botão.";
        loginButton.innerText = "Login com Rosto";
        loginButton.disabled = false;

    } catch (error) {
        console.error("Erro ao carregar rostos:", error);
        statusText.innerText = "Erro ao carregar modelos. Tente recarregar a página.";
    }
}

// --- 3. AÇÃO DO BOTÃO: INICIAR A CÂMERA ---
loginButton.addEventListener('click', async () => {
    if (loginSuccess) return; 

    statusText.innerText = "Iniciando câmera...";
    loginButton.disabled = true; 
    videoContainer.classList.add('active');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
        video.play();
    } catch (err) {
        console.error("Erro ao acessar a webcam: ", err);
        statusText.innerText = "Erro ao acessar a webcam. Permita o acesso.";
    }
});

// --- 4. INICIAR O RECONHECIMENTO QUANDO O VÍDEO COMEÇAR ---
video.addEventListener('play', () => {
    statusText.innerText = "Câmera iniciada. Olhe para a câmera.";
    
    faceapi.matchDimensions(canvas, displaySize);

    intervalId = setInterval(async () => {
        if (loginSuccess) return; // Para o loop se o login foi feito

        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                                        .withFaceLandmarks()
                                        .withFaceDescriptors();


        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        
        if (detections.length === 0) {
            statusText.innerText = "Nenhum rosto detectado.";
            return;
        }

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        for (const detection of resizedDetections) {
            const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
            let label = bestMatch.toString(false);
            let color = 'red';

            if (bestMatch.label !== 'unknown') {
                // --- SUCESSO NO LOGIN ---
                loginSuccess = true; // Trava o login
                label = bestMatch.label.replace(/_/g, ' ').replace(/-/g, ' '); // Formata o nome
                color = '#2ecc71'; // Verde

                statusText.innerText = `Rosto reconhecido! Redirecionando...`;
                
                clearInterval(intervalId);
                stopWebcam();

                window.location.href = `bemvindo.html?nome=${encodeURIComponent(label)}`;
            } else {
                statusText.innerText = "Rosto não reconhecido.";
            }
            
            const drawBox = new faceapi.draw.DrawBox(detection.detection.box, { label: label, boxColor: color });
            drawBox.draw(canvas);
        }

    }, 200);
});

function stopWebcam() {
    const stream = video.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
}