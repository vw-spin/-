//Recebimentos de dados do arduino e transmissão de dados para o banco de dados
// Variáveis globais para armazenar a porta e o leitor serial
let serialPort;
let reader;

// -----------------------------------------------------
// 1. Configuração da Conexão
// -----------------------------------------------------

// Adiciona um evento ao botão de conexão para iniciar a comunicação
document.getElementById('connectButton').addEventListener('click', connectSerial);

/**
 * Função principal para iniciar a conexão serial.
 * É chamada quando o usuário clica no botão.
 */
async function connectSerial() {
    // 1.1. Verifica a compatibilidade do navegador
    document.getElementById('status').textContent = 'Tentando conectar...';
    if (!('serial' in navigator)) {
        alert("Seu navegador não suporta a Web Serial API. Use Chrome ou Edge.");
        document.getElementById('status').textContent = 'Erro: Navegador não suportado.';
        return;
    }

    try {
        // 1.2. Solicita a Porta Serial e a Permissão do Usuário
        // O navegador abre uma caixa de diálogo para o usuário selecionar o dispositivo Arduino.
        serialPort = await navigator.serial.requestPort();
        
        // 1.3. Abre a Porta
        // Deve usar a mesma taxa de baud configurada no Arduino (9600)
        await serialPort.open({ baudRate: 9600 });
        
        // 1.4. Cria o Leitor
        // O getReader() bloqueia o acesso, garantindo que apenas uma parte do código leia por vez.
        reader = serialPort.readable.getReader();
        
        document.getElementById('status').textContent = 'Conectado. Recebendo dados...';
        
        // 1.5. Inicia o Loop de Leitura Contínua
        readSerial(reader);

    } catch (error) {
        // 1.6. Tratamento de Erros
        // Captura erros como: usuário cancelou, porta ocupada (Monitor Serial aberto), ou permissão negada.
        console.error("Erro na conexão serial:", error);
        document.getElementById('status').textContent = `Falha na Conexão: ${error.message}`;
    }
}

// -----------------------------------------------------
// 2. Loop de Leitura e Análise dos Dados
// -----------------------------------------------------

/**
 * Loop que lê continuamente os dados que chegam pela porta serial.
 * @param {ReadableStreamDefaultReader} reader - O leitor da porta serial.
 */
async function readSerial(reader) {
    const decoder = new TextDecoder(); // Converte bytes (dados serial) em caracteres (string)
    let dataBuffer = ''; // Buffer para armazenar chunks até que uma linha completa chegue

    while (true) {
        // 2.1. Lê um Chunk de Dados
        const { value, done } = await reader.read();
        
        // 'done' indica que o stream serial foi fechado
        if (done) {
            console.log('Leitor fechado. Encerrando loop.');
            document.getElementById('status').textContent = 'Conexão encerrada.';
            break;
        }

        // 2.2. Decodifica e Adiciona ao Buffer
        // O { stream: true } permite decodificar chunks incompletos
        dataBuffer += decoder.decode(value, { stream: true });

        // 2.3. Processa Linhas (Mensagens JSON)
        // O Arduino usa Serial.println(), que adiciona '\n' (nova linha) no final de cada JSON
        let newLineIndex;
        while ((newLineIndex = dataBuffer.indexOf('\n')) !== -1) {
            
            // Pega a linha completa de JSON (do início até o '\n')
            const jsonString = dataBuffer.substring(0, newLineIndex).trim(); 
            
            // Remove a linha processada do buffer para ler a próxima
            dataBuffer = dataBuffer.substring(newLineIndex + 1);

            // Tenta processar apenas se a string parecer um JSON
            if (jsonString.startsWith('{') && jsonString.endsWith('}')) {
                try {
                    // 2.4. ANÁLISE DO JSON
                    // Converte a string JSON para um objeto JavaScript utilizável
                    const data = JSON.parse(jsonString);

                    // 2.5. USO E ATUALIZAÇÃO DA INTERFACE
                    updateDisplay(data);
                    
                } catch (e) {
                    // Captura JSONs malformados ou lixo serial
                    console.warn("Lixo serial ou JSON inválido:", jsonString);
                }
            }
        }
    }
}

// -----------------------------------------------------
// 3. Atualização da Interface (Funcionalidade de Cada Variável)
// -----------------------------------------------------

/**
 * Atualiza os elementos da página com base nos dados recebidos do Arduino.
 * @param {object} data - Objeto JavaScript contendo as variáveis (ck1..ck6, Retrabalho, Problema).
 */
function updateDisplay(data) {
    // 3.1. ATUALIZAÇÃO DAS CONTAGENS (ck1 a ck6)
    // O JS usa os dados recebidos (data.ckX) para atualizar o HTML.
    document.getElementById('count_1').textContent = data.ck1 !== undefined ? data.ck1 : 'N/A';
    // Você pode atualizar todos os tactos aqui:
    // document.getElementById('count_2').textContent = data.ck2;
    // ...
    document.getElementById('count_6').textContent = data.ck6 !== undefined ? data.ck6 : 'N/A';

    // 3.2. SINALIZAÇÃO DE RETRABALHO
    const retrabElement = document.getElementById('status_retrab');
    if (data.Retrabalho === 1) {
        retrabElement.textContent = 'RETRABALHO NECESSÁRIO!';
        retrabElement.style.color = 'red';
        // Aqui você pode adicionar lógica mais complexa, como tocar um som ou piscar
    } else {
        retrabElement.textContent = 'OK';
        retrabElement.style.color = 'green';
    }

    // 3.3. SINALIZAÇÃO DE PROBLEMA / PARADA DE LINHA
    const probElement = document.getElementById('status_prob');
    if (data.Problema === 1) {
        probElement.textContent = 'LINHA PARADA!';
        probElement.style.color = 'darkorange';
    } else {
        probElement.textContent = 'OK';
        probElement.style.color = 'green';
    }
}