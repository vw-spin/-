var nomeCodigos = document.getElementById('codigos-container');

setInterval(atualizadorNomeCodigos, 1000);

function atualizadorNomeCodigos() {
    // Pega os códigos do Firebase ou localStorage
    var codigos = (window.codigos && Array.isArray(window.codigos) && window.codigos.length > 0) 
        ? window.codigos 
        : (JSON.parse(localStorage.getItem("codigos")) || []);
    
    // Pega as etapas atuais de cada código
    var coisas1 = (window.coisas1 && typeof window.coisas1 === 'object') 
        ? window.coisas1 
        : (JSON.parse(localStorage.getItem("coisas1")) || {});
    
    if (codigos && Array.isArray(codigos) && codigos.length > 0) {
        let tabela = `<table class="tabela-codigos">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Código</th>
                    <th style="text-align: center;">Progresso das Etapas</th>
                </tr>
            </thead>
            <tbody>
                ${codigos.map(item => {
                   
                    const etapaAtual = coisas1[item.codigo] || 1;
                    
                    // Verifica se tem retrabalho ativo
                    const temRetrabalho = (window.codigosMap && 
                                          window.codigosMap[item.codigo] && 
                                          window.codigosMap[item.codigo].retrabalho) ? true : false;
                    
                    // Gera as 6 bolinhas coloridas
                    let bolinhas = '';
                    for (let i = 1; i <= 6; i++) {
                        // Verde se já passou pela etapa, branco se ainda não
                        const cor = i <= etapaAtual ? 'green' : 'white';
                        bolinhas += `<div class="circulo-etapa" style="background-color: ${cor};"></div>`;
                    }
                    
                    const avisoRetrabalho = (temRetrabalho && etapaAtual < 6) 
                        ? '<div style="margin-top: 8px;"><span style="color: #d97706; font-weight: bold;">⚠️ Retrabalho Ativo</span></div>' 
                        : '';
                    
                    let nomeEtapa = '';
                    switch(etapaAtual) {
                        case 1: nomeEtapa = 'Compra registrada'; break;
                        case 2: nomeEtapa = 'Montagem dos meios'; break;
                        case 3: nomeEtapa = 'Montagem das quinas'; break;
                        case 4: nomeEtapa = 'Testes de qualidade'; break;
                        case 5: nomeEtapa = 'Montagem das tampas'; break;
                        case 6: nomeEtapa = 'Finalizado ✓'; break;
                        default: nomeEtapa = 'Etapa desconhecida';
                    }
                    
                    return `
                    <tr>
                        <td data-label="Nome">${item.nome}</td>
                        <td data-label="Código">${item.codigo}</td>
                        <td data-label="Progresso" style="text-align: center;">
                            <div style="margin-bottom: 8px;">
                                <strong>${nomeEtapa}</strong>
                            </div>
                            <div class="circulos-container" style="justify-content: center;">
                                ${bolinhas}
                            </div>
                            ${avisoRetrabalho}
                        </td>
                    </tr>
                    `;
                }).join('')}
            </tbody>
        </table>`;
        nomeCodigos.innerHTML = tabela;
    } else {
        nomeCodigos.innerHTML = `<p style="text-align: center; padding: 20px;">Nenhum código gerado ainda.</p>`;
    }
}

atualizadorNomeCodigos();