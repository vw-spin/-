// Admin UI - controle de etapas e criação de códigos
var etapa1 = 1;
var B1 = document.getElementById('b1');
var B2 = document.getElementById('b2');
var B3 = document.getElementById('b3');
var B4 = document.getElementById('b4');
var B5 = document.getElementById('b5');
var B6 = document.getElementById('b6');
var B7 = document.getElementById('b7');
var B8 = document.getElementById('b8');
var B9 = document.getElementById('b9');
var EtapasAdmin1 = document.getElementById('EtapasAdmin');

// Define que o sistema tem 6 etapas
window.DEFAULT_ETAPAS = 6;

var QetapaÉ = '';
var conta = parseInt(localStorage.getItem("contador")) || 0;

retrabalho = 0; // etapa destinada ao retrabalho 
corB = 0; // define a cor do botão

function getCoisas1() {
    return (window.coisas1 && typeof window.coisas1 === 'object') ? window.coisas1 : (JSON.parse(localStorage.getItem("coisas1")) || []);
}

// Verifica se um código já existe
function codeExists(codigoStr) {
    try {
        if (window.codigosMap && window.codigosMap[codigoStr]) return true;
        var localCodigos = JSON.parse(localStorage.getItem('codigos')) || [];
        if (Array.isArray(localCodigos) && localCodigos.find(c => c.codigo === codigoStr)) return true;
    } catch (e) { /* ignore parse errors */ }
    return false;
}

var etapa = 1;
var sequenciamento;

// Inicializa estado visual: primeiro círculo amarelo por padrão
try {
    resetador();
    if (B1) B1.style.backgroundColor = 'yellow';
} catch (e) { 
    
 }

function b1() {
    etapa1 = 1;
    resetador();
    B1.style.backgroundColor = 'yellow';
}

function b2() {
    etapa1 = 2;
    resetador();
    B2.style.backgroundColor = 'yellow';
}

function b3() {
    etapa1 = 3;
    resetador();
    B3.style.backgroundColor = 'yellow';
}

function b4() {
    etapa1 = 4;
    resetador();
    B4.style.backgroundColor = 'yellow';
}

function b5() {
    etapa1 = 5;
    resetador();
    B5.style.backgroundColor = 'yellow';
}

function b8() {
    etapa1 = 0;
    resetador();
}

function resetador() {
    B1.style.backgroundColor = 'white';
    B2.style.backgroundColor = 'white';
    B3.style.backgroundColor = 'white';
    B4.style.backgroundColor = 'white';
    B5.style.backgroundColor = 'white';
    B6.style.backgroundColor = 'white';

    retrabalho = 0;
    corB = 0;

    switch (etapa1) {
        case 2:
            B1.style.backgroundColor = 'green';
            break;
        case 3:
            B1.style.backgroundColor = 'green';
            B2.style.backgroundColor = 'green';
            break;
        case 4:
            B1.style.backgroundColor = 'green';
            B2.style.backgroundColor = 'green';
            B3.style.backgroundColor = 'green';
            break;
        case 5:
            B1.style.backgroundColor = 'green';
            B2.style.backgroundColor = 'green';
            B3.style.backgroundColor = 'green';
            B4.style.backgroundColor = 'green';
            break;
        case 6:
            B1.style.backgroundColor = 'green';
            B2.style.backgroundColor = 'green';
            B3.style.backgroundColor = 'green';
            B4.style.backgroundColor = 'green';
            B5.style.backgroundColor = 'green';
            break;
        default:
            break;
    }
}

function b6() {
    if (corB == 0) {
        B6.style.backgroundColor = 'cyan';
        retrabalho = 1;
        corB = 1;
        console.log("Retrabalho ATIVADO");
    } else {
        B6.style.backgroundColor = 'white';
        retrabalho = 0;
        corB = 0;
        console.log("Retrabalho DESATIVADO");
    }
}

function b7() {
    // botão de finalizar
    etapa1 = 6;
    B1.style.backgroundColor = 'green';
    B2.style.backgroundColor = 'green';
    B3.style.backgroundColor = 'green';
    B4.style.backgroundColor = 'green';
    B5.style.backgroundColor = 'green';
    
    b9();
}

async function b9() {
    const codigoElem = document.getElementById('codigo2');
    QetapaÉ = codigoElem ? codigoElem.value : '';
    const codigoTrim = (QetapaÉ || '').toString().trim();

    if (codigoTrim === '') {
        const EtapasAdmin1 = document.getElementById('EtapasAdmin');
        if (EtapasAdmin1) EtapasAdmin1.innerHTML = `<strong>Por favor, digite um código</strong>`;
        if (codigoElem) codigoElem.focus();
        console.log('Nenhum código fornecido em b9; operação cancelada.');
        return;
    }

    const codigoStr = String(codigoTrim).padStart(4, '0');
    const codigoNum = parseInt(codigoTrim, 10);

    // exige que o código exista antes de permitir mudar a etapa
    if (!codeExists(codigoStr)) {
        const EtapasAdmin1 = document.getElementById('EtapasAdmin');
        if (EtapasAdmin1) EtapasAdmin1.innerHTML = `<strong>Código não encontrado. Crie o código antes de alterar a etapa.</strong>`;
        console.warn('Tentativa de atualizar código inexistente:', codigoStr);
        return;
    }

    // atualiza etapa localmente e no Firebase quando possível
    try {
        if (window.updateCodigoEtapa && typeof window.updateCodigoEtapa === 'function') {
            try {
                await window.updateCodigoEtapa(codigoStr, etapa1);
                
                // Atualiza o status de retrabalho no Firebase
                if (window.updateCodigoRetrabalho && typeof window.updateCodigoRetrabalho === 'function') {
                    await window.updateCodigoRetrabalho(codigoStr, retrabalho === 1);
                    console.log(`Retrabalho ${retrabalho === 1 ? 'ATIVADO' : 'DESATIVADO'} para código ${codigoStr}`);
                }
                
                try {
                    if (window.coisas1 && typeof window.coisas1 === 'object') {
                        window.coisas1[codigoStr] = etapa1;
                    }
                    const ls = JSON.parse(localStorage.getItem('coisas1')) || {};
                    ls[codigoStr] = etapa1;
                    localStorage.setItem('coisas1', JSON.stringify(ls));
                } catch (e) { console.warn('Falha ao ajustar coisas1 localmente após updateCodigoEtapa:', e); }
            } catch (err) {
                console.warn(err);
            }
        } else {
            const arr = getCoisas1();
            if (Array.isArray(arr)) {
                if (!isNaN(codigoNum)) {
                    arr[codigoNum - 1] = etapa1;
                } else {
                    arr.push(etapa1);
                }
            } else if (typeof arr === 'object') {
                arr[codigoStr] = etapa1;
            }
            localStorage.setItem("coisas1", JSON.stringify(arr));
            console.log('Fallback updated coisas1:', arr);
        }
    } catch (e) {
        console.warn('Erro ao atualizar etapa:', e);
    }
    b11();
}

function b10() {
    const nome = document.getElementById('codigo3').value;
    (async () => {
        try {
            if (window.addCodigo && typeof window.addCodigo === 'function') {
                // etapa inicia em 0 (tacto = 0)
                const payload = { nome, etapa: 0, createdAt: Date.now() };
                const generated = await window.addCodigo(payload);
                const codigoStr = String(generated).padStart(4, '0');
                
                var codigos = JSON.parse(localStorage.getItem("codigos")) || [];
                codigos.push({ codigo: codigoStr, nome });
                localStorage.setItem("codigos", JSON.stringify(codigos));

                const arr = getCoisas1();
                let stored = arr;
                if (Array.isArray(stored)) {
                    const obj = {};
                    stored.forEach((v, i) => { obj[String(i + 1).padStart(4, '0')] = v; });
                    stored = obj;
                }
                if (typeof stored === 'object') {
                    stored[codigoStr] = 1;
                }
                localStorage.setItem("coisas1", JSON.stringify(stored));

                console.log("Códigos salvos (firebase):", codigoStr, nome);
            } else {
                var codigo = conta.toString().padStart(4, '0');
               
                var codigos = JSON.parse(localStorage.getItem("codigos")) || [];
                codigos.push({ codigo, nome });
                localStorage.setItem("codigos", JSON.stringify(codigos));
                
                const arr = getCoisas1();
                if (Array.isArray(arr)) {
                    arr.push(1);
                } else if (typeof arr === 'object') {
                    arr[codigo] = 1;
                }
                localStorage.setItem("coisas1", JSON.stringify(arr));
                
                console.log("Códigos salvos (fallback):", codigo, nome);
            }
        } catch (e) {
            console.warn('Erro ao criar código:', e);
        }
    })();
}

function b11() {
    const codigoInput = document.getElementById('codigo2').value;
    const codigoTrim = (codigoInput || '').toString().trim();

    if (codigoTrim === '') {
        const EtapasAdmin1 = document.getElementById('EtapasAdmin');
        if (EtapasAdmin1) EtapasAdmin1.innerHTML = `<strong>Por favor, digite um código</strong>`;
        console.log('Nenhum código fornecido em b11; operação cancelada.');
        return;
    }

    const codigoStr = String(codigoTrim).padStart(4, '0');
    const codigoNum = parseInt(codigoTrim, 10);
    const coisas = getCoisas1();
    var etapaAtual;

    if (typeof coisas === 'object' && !Array.isArray(coisas) && coisas[codigoStr] !== undefined) {
        etapaAtual = coisas[codigoStr];
    } else if (Array.isArray(coisas) && !isNaN(codigoNum)) {
        etapaAtual = coisas[codigoNum - 1];
    } else {
        etapaAtual = undefined;
    }
    
    var sequenciamento = "";

    switch (etapaAtual) {
        case 0:
            sequenciamento = "Compra registrada";
            break;
        case 1:
            sequenciamento = "Distribuição dos materiais em andamento";
            break;
        case 2:
            sequenciamento = "Montagem dos meios em andamento";
            break;
        case 3:
            sequenciamento = "Montagem das quinas em andamento";
            break;
        case 4:
            sequenciamento = "Testes de qualidade em andamento";
            break;
        case 5:
            sequenciamento = "Ajuste dos parafusos e montagem das tampas em andamento";
            break;
        case 6:
            sequenciamento = "Colocação do produto na embalagem";
            break;
        default:
            sequenciamento = "Etapa desconhecida";
            break;
    }

    // Verifica se há retrabalho ativo
    let hasRetrabalho = false;
    if (window.codigosMap && window.codigosMap[codigoStr]) {
        hasRetrabalho = window.codigosMap[codigoStr].retrabalho || false;
    }

    if (hasRetrabalho && etapaAtual < 6) {
        sequenciamento += " ⚠️ ATENÇÃO: Retrabalho ativo";
    }

    const EtapasAdmin1 = document.getElementById('EtapasAdmin');
    if (EtapasAdmin1) EtapasAdmin1.innerHTML = `<strong>${sequenciamento}</strong>`;
    console.log("Etapa:", sequenciamento);
    console.log('etapaAtual, coisas1 snapshot, codigo:', etapaAtual, getCoisas1(), codigoStr);
}

const reset = document.getElementById('resetar');

if (reset) {
    reset.addEventListener('click', async function () {
        window.tempo = 0;
        if (typeof tempo !== 'undefined') tempo = 0;
        
        try {
            if (window.resetCodigos && typeof window.resetCodigos === 'function') {
                const p = window.resetCodigos();
                const timeout = new Promise((res, rej) => setTimeout(() => rej(new Error('timeout')), 5000));
                try {
                    await Promise.race([p, timeout]);
                    console.log('Firebase reset (resetCodigos) concluído');
                } catch (err) {
                    console.warn('Falha/timeout ao resetar no Firebase (resetCodigos):', err);
                }

                if (window.setContadorGlobal && typeof window.setContadorGlobal === 'function') {
                    try {
                        const p2 = window.setContadorGlobal(0);
                        const timeout2 = new Promise((res, rej) => setTimeout(() => rej(new Error('timeout')), 5000));
                        await Promise.race([p2, timeout2]);
                        console.log('contadorGlobal ajustado para 0 no Firebase');

                        if (window.getContadorGlobal && typeof window.getContadorGlobal === 'function') {
                            try {
                                const got = await window.getContadorGlobal();
                                console.log('contadorGlobal agora é:', got);
                            } catch (e) { console.warn('Falha ao ler contadorGlobal após set:', e); }
                        }
                    } catch (e) {
                        console.warn('Falha ao setar contadorGlobal via setContadorGlobal:', e);
                    }
                }
            }

            if (window.getCodigosOnce && typeof window.getCodigosOnce === 'function') {
                try {
                    const remaining = await window.getCodigosOnce();
                    if (Array.isArray(remaining) && remaining.length > 0) {
                        console.warn('Ainda existem códigos após reset, tentando remover individualmente:', remaining);
                        if (window.removeCodigo && typeof window.removeCodigo === 'function') {
                            for (const item of remaining) {
                                try { await window.removeCodigo(item.codigo); } catch (e) { console.warn('Falha ao remover', item.codigo, e); }
                            }
                        }
                    }
                } catch (e) {
                    console.warn('Erro ao verificar códigos restantes:', e);
                }
            }
        } catch (e) { console.warn(e); }
        
        localStorage.setItem("coisas1", JSON.stringify({}));
        try { localStorage.setItem("coisas", JSON.stringify({})); } catch (e) {}
        localStorage.setItem("codigos", JSON.stringify([]));
        localStorage.setItem("contador", String(0));
        
        window.tempo = 0;
        
        var nomeCodigos = document.getElementById('codigos-container');
        if (nomeCodigos) nomeCodigos.innerHTML = ``;
        
        location.reload();
    });
}