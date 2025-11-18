const formCompra = document.getElementById('formCompra');
window.DEFAULT_ETAPAS = 6;

async function sincronizarContadorGlobal() {
    if (window.getContadorGlobal && typeof window.getContadorGlobal === 'function') {
        try {
            const valor = await window.getContadorGlobal();
            const contadorAtual = parseInt(valor, 10) || 0;
            localStorage.setItem('contador', String(contadorAtual));
            console.log(`✅ Contador sincronizado com Firebase: ${contadorAtual}`);
            return contadorAtual;
        } catch (err) {
            console.warn('⚠️ Falha ao sincronizar contador global:', err);
        }
    }
    return parseInt(localStorage.getItem("contador")) || 0;
}

let conta = 0;
let contaAtual = parseInt(localStorage.getItem("contador")) || 0;

(async () => {
    conta = await sincronizarContadorGlobal();
 
    try {
        const stored = parseInt(localStorage.getItem('contador'), 10);
        contaAtual = isNaN(stored) ? (conta || 0) : stored;
    } catch (e) { contaAtual = conta || 0; }
0
    try {
        const localCodigos = JSON.parse(localStorage.getItem('codigos')) || [];
        const localCoisas = JSON.parse(localStorage.getItem('coisas1')) || {};
        const hasCodigos = (Array.isArray(localCodigos) && localCodigos.length > 0) || (localCoisas && Object.keys(localCoisas).length > 0);
        if (!hasCodigos) {
                try {
                localStorage.setItem('coisas1', JSON.stringify({}));
                localStorage.setItem('coisas', JSON.stringify({}));
                localStorage.setItem('codigos', JSON.stringify([]));
                localStorage.setItem('contador', String(0));
                contaAtual = 0;
            } catch (e) { /* ignore */ }
        }
    } catch (e) { /* ignore */ }
})();



var coisas1 = JSON.parse(localStorage.getItem("coisas1")) || [];

function fecharPopup1() {
    document.getElementById("popup1").style.display = "none";
}



if (formCompra) {
    const numeros = document.getElementById('div1');
    const numeros2 = document.getElementById('div2');

    formCompra.addEventListener('submit', async function (e) {
        e.preventDefault();

        const limite = 6;
        const nome = document.getElementById('nomeUsuario').value;
const resultadoDiv = document.getElementById('resultadoCompra');

        let contaAtual = 0;
        try {
            if (window.getContadorGlobal && typeof window.getContadorGlobal === 'function') {
                const contadorGlobal = await window.getContadorGlobal();
                const parsed = parseInt(contadorGlobal, 10);
                contaAtual = Number.isNaN(parsed) ? (parseInt(localStorage.getItem('contador'), 10) || 0) : parsed;
            } else {
                contaAtual = parseInt(localStorage.getItem('contador'), 10) || 0;
            }
        } catch (err) {
            console.warn('Falha ao obter contadorGlobal, usando fallback local:', err);
            contaAtual = parseInt(localStorage.getItem('contador'), 10) || 0;
        }

        if (contaAtual >= limite) {
            
            resultadoDiv.innerHTML = `<p style="color: red; font-weight: bold;">🚫 LIMITE ATINGIDO!</p>`;
            numeros.innerHTML = `Olá, ${nome}.`;
            numeros2.innerHTML = `O limite de **${limite} códigos** foi atingido.`;
          
            try { numeros.style.display = "block"; numeros.style.backgroundColor = "white"; } catch (e) {}
            try { numeros2.style.display = "block"; numeros2.style.backgroundColor = 'white'; } catch (e) {}
           
            try { abrirPopup1(); } catch (e) { console.warn('Não foi possível abrir o popup:', e); }
            return; 
        } else {
            fecharPopup1();
        }

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
       
                const payload = { nome, etapa: 0, createdAt: Date.now() };
                const generated = await window.addCodigo(payload);
     
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
         
            numeros2.innerHTML = `<strong>O seu código é: ${codigo}</strong>`;
            try {
        
                var codigos = JSON.parse(localStorage.getItem("codigos")) || [];
                if (contaAtual <= limite) {
                    setTimeout(function() {
                    codigos.push({ codigo, nome })
                    localStorage.setItem("codigos", JSON.stringify(codigos))   
                }, 1000); 
                }
               
            } catch (e) { console.warn('Falha ao atualizar localStorage codigos:', e); }

            try {
       
                let stored = JSON.parse(localStorage.getItem("coisas1")) || {};
                if (Array.isArray(stored)) {
            
                    const obj = {};
                    stored.forEach((v, i) => { obj[String(i + 1).padStart(4, '0')] = v; });
                    stored = obj;
                }
              
                stored[codigo] = 0;
                localStorage.setItem("coisas1", JSON.stringify(stored));
                try { localStorage.setItem("coisas", JSON.stringify(stored)); } catch (e) {}
            } catch (e) { console.warn('Falha ao atualizar localStorage coisas1:', e); }

            
        } else {
           
            try {
                let localCont = parseInt(localStorage.getItem('contador'), 10);
                if (isNaN(localCont)) localCont = 0;
                localCont = localCont + 1; 
                codigo = String(localCont).padStart(4, '0');

                numeros2.innerHTML = `<strong>O seu código é: ${codigo}</strong>`;

                var codigos = JSON.parse(localStorage.getItem("codigos")) || [];
                codigos.push({ codigo, nome });
                localStorage.setItem("codigos", JSON.stringify(codigos));

                let stored = JSON.parse(localStorage.getItem("coisas1")) || {};
                if (Array.isArray(stored)) {
                    const obj = {};
                    stored.forEach((v, i) => { obj[String(i + 1).padStart(4, '0')] = v; });
                    stored = obj;
                }
                stored[codigo] = 0;
                localStorage.setItem("coisas1", JSON.stringify(stored));
                try { localStorage.setItem("coisas", JSON.stringify(stored)); } catch (e) {}

                localStorage.setItem("contador", String(localCont));
            } catch (e) {
                console.warn('Falha no fallback local ao gerar código:', e);
            }
        }

        console.log("Códigos salvos:", codigo);
        console.log(window.coisas1 || JSON.parse(localStorage.getItem('coisas1')));
    });
}

const resetBtn = document.getElementById('resetar');

function abrirPopup1() {
    document.getElementById("popup1").style.display = "flex";
}