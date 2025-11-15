const formCompra = document.getElementById('formCompra');
window.DEFAULT_ETAPAS = 6;

async function sincronizarContadorGlobal() {
    if (window.getContadorGlobal && typeof window.getContadorGlobal === 'function') {
        try {
            const valor = await window.getContadorGlobal();
            const contadorAtual = parseInt(valor, 10) || 0;
            localStorage.setItem('contador', String(contadorAtual + 1));
            console.log(`✅ Contador sincronizado com Firebase: ${contadorAtual}`);
            return contadorAtual;
        } catch (err) {
            console.warn('⚠️ Falha ao sincronizar contador global:', err);
        }
    }
    return parseInt(localStorage.getItem("contador")) || 1;
}

let conta = 1;
(async () => {
    conta = await sincronizarContadorGlobal();
})();



var coisas1 = JSON.parse(localStorage.getItem("coisas1")) || [];

function fecharPopup1() {
    document.getElementById("popup1").style.display = "none";
}

var contaAtual = parseInt(localStorage.getItem("contador")) || 1;

if (formCompra) {
    const numeros = document.getElementById('div1');
    const numeros2 = document.getElementById('div2');

    formCompra.addEventListener('submit', async function (e) {
        e.preventDefault();

        //VERIFICAÇÃO DO LIMITE DE CÓDIGOS
        const limite = 6;
        const nome = document.getElementById('nomeUsuario').value;
const resultadoDiv = document.getElementById('resultadoCompra');

const contadorGlobal = await window.getContadorGlobal();
const contaAtual = parseInt(contadorGlobal, 10) || 0;

if (contaAtual >= limite) {


            // Limpa a div de resultado e mostra a mensagem de erro
            resultadoDiv.innerHTML = `<p style="color: red; font-weight: bold;">🚫 LIMITE ATINGIDO!</p>`;
            numeros.innerHTML = `Olá, ${nome}.`;
            numeros2.innerHTML = `O limite de **${limite} códigos** foi atingido.`;
            div1.style.display = "block";
            div1.style.backgroundColor = "white";
            div2.style.display = "block";
            div2.style.backgroundColor = 'white';
            return; // Interrompe a execução para não gerar mais códigos
        }else{
            fecharPopup1()
        }
        
        // mostra pro usuário (preparação da UI)
        resultadoDiv.innerHTML = "";
        numeros.innerHTML = `Muito Obrigado(a) ${nome}`;
        div1.style.display = "block";
        div1.style.backgroundColor = "white";
        div2.style.display = "block";
        div2.style.backgroundColor = 'white';

        var codigo = null;
        var wroteToFirebase = false;
        try {
            if (window.addCodigo && typeof window.addCodigo === 'function') {
                // envie somente os dados relevantes; deixe o Firebase gerar o código sequencial
                const payload = { nome, etapa: 1, createdAt: Date.now() };
                const generated = await window.addCodigo(payload);
                // addCodigo retorna a string do código gerado (ex: "0001")
                if (generated) {
                    codigo = String(generated).padStart(4, '0');
                    wroteToFirebase = true;
                }
            }
        } catch (err) {
            console.warn('Falha ao gravar no Firebase, usaremos fallback local:', err);
            wroteToFirebase = false;
        }

        if (wroteToFirebase) {
            // usa o código gerado pelo Firebase para mostrar ao usuário e atualizar localStorage
            numeros2.innerHTML = `<strong>O seu código é: ${codigo}</strong>`;
            try {
                // atualiza lista de codigos local para UI/backup
                var codigos = JSON.parse(localStorage.getItem("codigos")) || [];
                if (contaAtual <= limite) {
                    setTimeout(function() {
                    codigos.push({ codigo, nome })
                    localStorage.setItem("codigos", JSON.stringify(codigos))   
                }, 1000); 
                }
               
            } catch (e) { console.warn('Falha ao atualizar localStorage codigos:', e); }

            try {
                // atualiza coisas1 local (objeto mapeado por código)
                let stored = JSON.parse(localStorage.getItem("coisas1")) || {};
                if (Array.isArray(stored)) {
                    // converte array para objeto mantendo compatibilidade mínima
                    const obj = {};
                    stored.forEach((v, i) => { obj[String(i + 1).padStart(4, '0')] = v; });
                    stored = obj;
                }
                stored[codigo] = 1;
                localStorage.setItem("coisas1", JSON.stringify(stored));
            } catch (e) { console.warn('Falha ao atualizar localStorage coisas1:', e); }

            // sincroniza contador local para evitar gerar o mesmo número localmente quando offline
            try {
                const nextNum = parseInt(codigo, 10) + 1;
                if (!isNaN(nextNum)) localStorage.setItem('contador', String(nextNum));
            } catch (e) {}
        } else {
            let contaLocal = contaAtual;
            codigo = contaLocal.toString().padStart(4, '0');
            contaLocal++; // Prepara o contador para o próximo
            numeros2.innerHTML = `<strong>O seu código é: ${codigo}</strong>`;

            var codigos = JSON.parse(localStorage.getItem("codigos")) || [];
            codigos.push({ codigo, nome });
            localStorage.setItem("codigos", JSON.stringify(codigos));

            // atualiza coisas1 local como array ou objeto
            let stored = JSON.parse(localStorage.getItem("coisas1"));
            if (!stored) stored = [];
            if (Array.isArray(stored)) {
                stored.push(1);
            } else if (typeof stored === 'object') {
                stored[codigo] = 1;
            }
            localStorage.setItem("coisas1", JSON.stringify(stored));

            localStorage.setItem("contador", contaLocal); // Salva o contador incrementado
        }

        console.log("Códigos salvos:", codigo);
        console.log(window.coisas1 || JSON.parse(localStorage.getItem('coisas1')));
    });
}

const resetBtn = document.getElementById('resetar');

function abrirPopup1() {
    document.getElementById("popup1").style.display = "flex";
}