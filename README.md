# Projeto de Login Facial com JavaScript e face-api.js

Gustavo Kawamura RM: 99679
Manoella Hererrias RM: 98906
Felipe Capriotti RM: 98460
Victor Hugo RM: 550996

Este projeto é uma demonstração de como implementar um sistema de login facial simples diretamente no navegador. A biblioteca `face-api.js` é usada para realizar a detecção e o reconhecimento de rostos em tempo real.

Ao clicar em "Login", o sistema acessa a webcam do usuário, procura por um rosto e o compara com um banco de imagens de rostos autorizados. Se um rosto correspondente for encontrado, o usuário é redirecionado para uma página de boas-vindas.

## Funcionalidades

-   **Página de Login Limpa**: Inicia com um único botão de login.
-   **Ativação sob Demanda**: A câmera só é ativada após o clique no botão.
-   **Reconhecimento em Tempo Real**: A `face-api.js` analisa o feed da webcam continuamente.
-   **Feedback Visual**: Desenha um retângulo ao redor do rosto detectado, com um rótulo (o nome da pessoa ou "unknown").
-   **Redirecionamento em Caso de Sucesso**: Ao identificar um usuário autorizado, o sistema interrompe a câmera e redireciona para uma página `bemvindo.html`, passando o nome do usuário como parâmetro na URL.


## Estrutura do Projeto

```
projeto_login_facial/
|
├── index.html           (A página de login principal)
├── bemvindo.html        (A página de sucesso)
├── script.js            (Toda a lógica do face-api)
├── style.css            (Folha de estilos)
|
├── rostos_conhecidos/   <-- (VOCÊ PRECISA ADICIONAR SUAS FOTOS AQUI)
|   ├── ana_silva.jpg
|   └── joao_souza.jpg
|
└── models/              <-- (VOCÊ PRECISA BAIXAR OS MODELOS AQUI)
    ├── tiny_face_detector_model-weights
    ├── face_landmark_68_net_model-weights
    ├── face_recognition_net_model-weights
    ├── ssd_mobilenetv1_model-weights
    └── ... (e outros arquivos de modelo)
```

## Instalação e Configuração

Siga estes passos para configurar o projeto localmente.

### Passo 1: Obter os Modelos da `face-api.js`

A `face-api.js` não funciona sem seus arquivos de modelo pré-treinados.

1.  Vá até o repositório oficial da `face-api.js`: [https://github.com/justadudewhohacks/face-api.js](https://github.com/justadudewhohacks/face-api.js)
2.  Clique no botão "Code" e "Download ZIP".
3.  Descompacte o arquivo.
4.  Encontre a pasta `weights` dentro do que você baixou.
5.  **Copie** todo o conteúdo da pasta `weights` para a pasta `models/` do seu projeto.

### Passo 2: Adicionar Rostos Autorizados

1.  Na pasta `rostos_conhecidos/`, adicione uma imagem `.jpg` de cada pessoa que você deseja que o sistema reconheça.
2.  Use fotos claras, com boa iluminação e onde o rosto esteja virado para a frente (como uma foto 3x4).

### Passo 3: Configurar o `script.js`

1.  Abra o arquivo `script.js`.
2.  No topo do arquivo, encontre a array `labels`:
    ```javascript
    const labels = ['ana_silva', 'joao_souza'];
    ```
3.  Modifique esta array para que ela contenha **exatamente** os nomes dos arquivos de imagem que você adicionou na pasta `rostos_conhecidos/` (sem a extensão `.jpg`).

## Como Executar

**⚠️ IMPORTANTE: Você não pode simplesmente abrir o `index.html` com um clique-duplo.**

Devido às políticas de segurança dos navegadores (CORS), o JavaScript não terá permissão para carregar os arquivos da pasta `models/` ou `rostos_conhecidos/` se você abrir o arquivo diretamente (`file:///...`).

Você **DEVE** executar este projeto a partir de um **servidor web local**.

A forma mais fácil é usando o **Visual Studio Code**:

### Opção 1: Extensão "Live Server" (Recomendado)

1.  No VS Code, vá até a aba de Extensões.
2.  Procure por **"Live Server"** (de Ritwick Dey) e instale-a.
3.  Clique com o botão direito no seu arquivo `index.html`.
4.  Escolha a opção **"Open with Live Server"**.

### Opção 2: Servidor Embutido do Python

Se você tem Python instalado, pode usá-lo para criar um servidor simples:

1.  Abra um terminal (Cmd, PowerShell, etc.) na pasta raiz do seu projeto.
2.  Execute o comando:
    ```bash
    python -m http.server
    ```
3.  Abra seu navegador e acesse: `http://localhost:8000`

## Aviso de Segurança

Este projeto é uma **demonstração tecnológica** e **NÃO DEVE** ser usado como um sistema de segurança real.

A verificação é feita 100% no *client-side* (navegador do usuário). Isso significa que uma pessoa com conhecimento técnico pode facilmente burlar o script e "forçar" o login. Um login facial seguro de verdade exigiria verificação no *back-end* (servidor) e detecção de "prova de vida" (para evitar que o sistema seja enganado por uma foto ou vídeo).
