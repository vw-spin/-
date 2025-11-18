var nomeCodigos = document.getElementById('codigos-container');

setInterval(atualizadorNomeCodigos, 1000);

function atualizadorNomeCodigos() {
   
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
                  <th style="padding: 30px;font-size: 18px;">Nome</th>
                    <th style="font-size: 18px;">Código</th>
                    <th style="text-align: center;font-size: 18px;">Progresso das Etapas</th>
                </tr>
            </thead>
            <tbody>
                ${codigos.map(item => {
                   
                    const etapaAtual = coisas1[item.codigo] || 0;
                    
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
                        case 0: nomeEtapa = 'Compra registrada'; break;
                        case 1: nomeEtapa = 'Distribuição dos materiais em andamento'; break;
                        case 2: nomeEtapa = 'Montagem dos meios'; break;
                        case 3: nomeEtapa = 'Montagem das quinas'; break;
                        case 4: nomeEtapa = 'Testes de qualidade'; break;
                        case 5: nomeEtapa = 'Montagem das tampas'; break;
                        case 6: nomeEtapa = 'Colocação do produto na embalagem'; break;
                        default: nomeEtapa = 'Etapa desconhecida';
                    }
                    
                    return `
                    <tr>
                       <td data-label="Nome" style="padding: 30px;; font-size: 18px">${item.nome}</td>
                        <td data-label="Código" style="font-size: 18px;">${item.codigo}</td>
                        <td data-label="Progresso" style="text-align: center;font-size: 18px;">
                            <div style="margin-bottom: 8px;font-size: 18px;">
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