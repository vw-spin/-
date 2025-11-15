var tempo = 0;
window.tempo = tempo;
var celulaTempo;
var minutos;
var segundos;
var operador;
var currentDisplayedCodigo = '';

// Define que o sistema tem 6 etapas
window.DEFAULT_ETAPAS = 6;

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function computeTempoSeconds(etapasTotal, etapaAtual, hasRetrabalho) {
  const total = (typeof etapasTotal === 'number') ? etapasTotal : parseInt(etapasTotal, 10) || (window.DEFAULT_ETAPAS || 6);
  const etapa = (typeof etapaAtual === 'number') ? etapaAtual : parseInt(etapaAtual, 10) || 1;

  const secsArray = Array.isArray(window.SECS_PER_STAGE) ? window.SECS_PER_STAGE : null;
  if (secsArray && secsArray.length > 0) {
    // Retorna diretamente os SEGUNDOS configurados
    let baseTime = Number(secsArray[etapa] || 0);
    
    if (hasRetrabalho && etapa < 6) {
      baseTime = Math.floor(baseTime * (window.RETRABALHO_MULTIPLIER || 1.0));
    }
    
    return baseTime;
  }

  const remainingStages = Math.max(0, total - etapa + 1);
  let baseTime = remainingStages * 60;
  
  if (hasRetrabalho && etapa < 6) {
    baseTime = Math.floor(baseTime * (window.RETRABALHO_MULTIPLIER || 1.0));
  }
  
  return baseTime;
}

if (!window.SECS_PER_STAGE) {
  // Tempo em SEGUNDOS por etapa
  window.SECS_PER_STAGE = [0, 35, 48, 40, 15, 20, 15, 0];
}

if (!window.RETRABALHO_MULTIPLIER) {
  window.RETRABALHO_MULTIPLIER = 1.0;
}

// Mapeamento de operador por etapa
function operatorForStage(etapa) {
  switch (Number(etapa)) {
    case 1: return 'Maria Clara de Lima Rodrigues';
    case 2: return 'Matheus Gabriel Mendes Villa';
    case 3: return 'Maki Yoshitake Rocha';
    case 4: return 'Matheus Domingues Barbosa Ativo';
    case 5: return 'Rafael Negoseki Claudino';
    case 6: return 'Murilo Silva Alves';
    default: return '';
  }
}

function isMobile() {
  return /Mobi|Android|iPhone|iPad|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.matchMedia('(max-width: 700px)').matches;
}

if (typeof document !== 'undefined') {
  if (isMobile()) document.body.classList.add('is-mobile');
}

var cEtapa1, cEtapa2, cEtapa3, cEtapa4, cEtapa5, cEtapa6;

window.addEventListener && window.addEventListener('firebaseSync:codigos', function (ev) {
  try {
    const detail = ev && ev.detail;
    if (!detail) return;

    const codigoElem = document.getElementById('codigoProduto');
    const codigoAtual = codigoElem ? codigoElem.value.trim() : '';
    if (!codigoAtual) return;
    const map = window.codigosMap || (detail.map || {});
    if (map && map[codigoAtual]) {
      const rec = map[codigoAtual];
      const hasRetrabalho = rec.retrabalho || false;
      
      if (rec.tempo != null) {
        tempo = Number(rec.tempo) || 0;
      } else {
        const etapasTotal = rec.etapasTotal || (window.DEFAULT_ETAPAS || 6);
        const etapaAtual = rec.etapa || 1;
        tempo = computeTempoSeconds(etapasTotal, etapaAtual, hasRetrabalho);
      }
      if (celulaTempo) {
        const tempoTexto = formatTime(tempo);
        celulaTempo.querySelector('.value').textContent = tempoTexto;
      }
    }
  } catch (e) { console.warn('Erro ao processar evento firebaseSync:codigos', e); }
});

function bindFormHandler() {
  var form = document.getElementById('formRastreamento');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let codigoInput = (document.getElementById('codigoProduto') || {}).value ? document.getElementById('codigoProduto').value.trim() : '';
    
    if (!/^\d{4}$/.test(codigoInput)) {
      const resultado = document.getElementById('resultado');
      const tabelaBody = document.querySelector('#tabelaProcessos tbody');
      tabelaBody.innerHTML = '';
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 6;
      cell.textContent = 'Nenhum processo encontrado para este código.';
      row.appendChild(cell);
      tabelaBody.appendChild(row);
      resultado.style.display = 'block';
      celulaTempo = null;
      return;
    }
    
    const codigo = codigoInput;
    const resultado = document.getElementById('resultado');
    const tabelaBody = document.querySelector('#tabelaProcessos tbody');
    tabelaBody.innerHTML = '';

    var etapa = 1;
    var sequenciamento;
    var hasRetrabalho = false;

    var codigos = (window.codigos && Array.isArray(window.codigos)) ? window.codigos : (JSON.parse(localStorage.getItem("codigos")) || []);
    var coisas1 = (window.coisas1 && typeof window.coisas1 === 'object') ? window.coisas1 : (JSON.parse(localStorage.getItem("coisas1")) || []);

    var encontrado = null;
    if (window.codigosMap && window.codigosMap[codigo]) {
      encontrado = { codigo: codigo, nome: window.codigosMap[codigo].nome };
      hasRetrabalho = window.codigosMap[codigo].retrabalho || false;
    } else {
      encontrado = codigos.find(c => c.codigo === codigo);
    }

    if (encontrado && codigo != 0) {
      currentDisplayedCodigo = codigo;
      const dataAtual = new Date();
      const dia = dataAtual.getDate();
      const mes = dataAtual.getMonth() + 1;
      const ano = dataAtual.getFullYear();

      var index = codigos.findIndex(c => c.codigo === codigo);
     
      if (typeof coisas1 === 'object' && !Array.isArray(coisas1) && coisas1[codigo] !== undefined) {
        etapa = coisas1[codigo];
      } else {
        etapa = coisas1[index];
      }
      console.log('Etapa:', etapa, 'Retrabalho:', hasRetrabalho);

      var tempoFromDb = null;
      if (window.codigosMap && window.codigosMap[codigo]) {
        const rec = window.codigosMap[codigo];
        if (rec.tempo != null) {
          tempoFromDb = Number(rec.tempo) || 0;
        } else if (rec.etapasTotal != null) {
          tempoFromDb = computeTempoSeconds(rec.etapasTotal, etapa, hasRetrabalho);
        }
      }
      
      switch (etapa) {
        case 1:
          sequenciamento = "Compra registrada";
          if (tempoFromDb !== null) tempo = tempoFromDb; 
          else tempo = computeTempoSeconds(null, etapa, hasRetrabalho);
          operador = operatorForStage(etapa);
          resetarCirculos();
          cEtapa1 && (cEtapa1.style.backgroundColor = 'green');
          break;
          
        case 2:
          sequenciamento = "Montagem dos meios em andamento";
          if (tempoFromDb !== null) tempo = tempoFromDb; 
          else tempo = computeTempoSeconds(null, etapa, hasRetrabalho);
          operador = operatorForStage(etapa);
          resetarCirculos();
          cEtapa1 && (cEtapa1.style.backgroundColor = 'green');
          cEtapa2 && (cEtapa2.style.backgroundColor = 'green');
          break;
          
        case 3:
          sequenciamento = "Montagem das quinas em andamento";
          if (tempoFromDb !== null) tempo = tempoFromDb; 
          else tempo = computeTempoSeconds(null, etapa, hasRetrabalho);
          operador = operatorForStage(etapa);
          resetarCirculos();
          cEtapa1 && (cEtapa1.style.backgroundColor = 'green');
          cEtapa2 && (cEtapa2.style.backgroundColor = 'green');
          cEtapa3 && (cEtapa3.style.backgroundColor = 'green');
          break;
          
        case 4:
          sequenciamento = "Testes de qualidade em andamento";
          if (tempoFromDb !== null) tempo = tempoFromDb; 
          else tempo = computeTempoSeconds(null, etapa, hasRetrabalho);
          operador = operatorForStage(etapa);
          resetarCirculos();
          cEtapa1 && (cEtapa1.style.backgroundColor = 'green');
          cEtapa2 && (cEtapa2.style.backgroundColor = 'green');
          cEtapa3 && (cEtapa3.style.backgroundColor = 'green');
          cEtapa4 && (cEtapa4.style.backgroundColor = 'green');
          break;
          
        case 5:
          sequenciamento = "Ajuste dos parafusos e montagem das tampas em andamento";
          if (tempoFromDb !== null) tempo = tempoFromDb; 
          else tempo = computeTempoSeconds(null, etapa, hasRetrabalho);
          operador = operatorForStage(etapa);
          resetarCirculos();
          cEtapa1 && (cEtapa1.style.backgroundColor = 'green');
          cEtapa2 && (cEtapa2.style.backgroundColor = 'green');
          cEtapa3 && (cEtapa3.style.backgroundColor = 'green');
          cEtapa4 && (cEtapa4.style.backgroundColor = 'green');
          cEtapa5 && (cEtapa5.style.backgroundColor = 'green');
          break;
          
        case 6:
          sequenciamento = "Montagem finalizada";
          operador = operatorForStage(etapa);
          resetarCirculos();
          cEtapa1 && (cEtapa1.style.backgroundColor = 'green');
          cEtapa2 && (cEtapa2.style.backgroundColor = 'green');
          cEtapa3 && (cEtapa3.style.backgroundColor = 'green');
          cEtapa4 && (cEtapa4.style.backgroundColor = 'green');
          cEtapa5 && (cEtapa5.style.backgroundColor = 'green');
          cEtapa6 && (cEtapa6.style.backgroundColor = 'green');
          tempo = 0;
          break;
          
        default:
          sequenciamento = "Etapa desconhecida";
          tempo = 0;
          operador = "Erro ao encontrar o produto, Verifique se o código está escrito corretamente";
          resetarCirculos();
      }

      // Adiciona aviso de retrabalho se necessário
      if (hasRetrabalho && etapa < 6) {
        sequenciamento += " ⚠️ Retrabalho";
      }

      const row = document.createElement('tr');
      const headers = ['Código do Produto', 'Etapa', 'Data', 'Tempo estimado', 'Cliente', 'Operador'];
      const tempoTexto = formatTime(tempo);
      const values = [encontrado.codigo, sequenciamento, `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`, tempoTexto, encontrado.nome, operador];

      values.forEach((text, index) => {
        const cell = document.createElement('td');
        const span = document.createElement('span');
        span.className = 'value';
        span.textContent = text;
        
        // Aplica cor de aviso se for retrabalho
        if (hasRetrabalho && etapa < 6 && (index === 1 || index === 3)) {
          span.style.color = '#d97706';
          span.style.fontWeight = 'bold';
        }
        
        cell.appendChild(span);
        cell.setAttribute('data-label', headers[index]);

        if (index === 0) cell.id = 'codigo-cell';
        if (index === 1) cell.id = 'etapa-text';
        if (index === 2) cell.id = 'data-text';
        if (index === 3) {
          cell.id = 'tempo-estimado';
          celulaTempo = cell;
        }
        if (index === 5) {
          cell.id = 'operador';
        }
        row.appendChild(cell);
      });

      tabelaBody.appendChild(row);
      resultado.style.display = 'block';

    } else {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 6;
      cell.textContent = 'Nenhum processo encontrado para este código.';
      resetarCirculos()
      row.appendChild(cell);
      tabelaBody.appendChild(row);
      resultado.style.display = 'block';
      celulaTempo = null;
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    cEtapa1 = document.getElementById('cEtapa1');
    cEtapa2 = document.getElementById('cEtapa2');
    cEtapa3 = document.getElementById('cEtapa3');
    cEtapa4 = document.getElementById('cEtapa4');
    cEtapa5 = document.getElementById('cEtapa5');
    cEtapa6 = document.getElementById('cEtapa6');
    if (isMobile() && document.body) document.body.classList.add('is-mobile');
    bindFormHandler();
  });
} else {
  cEtapa1 = document.getElementById('cEtapa1');
  cEtapa2 = document.getElementById('cEtapa2');
  cEtapa3 = document.getElementById('cEtapa3');
  cEtapa4 = document.getElementById('cEtapa4');
  cEtapa5 = document.getElementById('cEtapa5');
  cEtapa6 = document.getElementById('cEtapa6');
  if (isMobile() && document.body) document.body.classList.add('is-mobile');
  bindFormHandler();
}

function resetarCirculos() {
  cEtapa1 && (cEtapa1.style.backgroundColor = 'white');
  cEtapa2 && (cEtapa2.style.backgroundColor = 'white');
  cEtapa3 && (cEtapa3.style.backgroundColor = 'white');
  cEtapa4 && (cEtapa4.style.backgroundColor = 'white');
  cEtapa5 && (cEtapa5.style.backgroundColor = 'white');
  cEtapa6 && (cEtapa6.style.backgroundColor = 'white');
}

function updateDisplayedCodigo() {
  if (!currentDisplayedCodigo) return;
  try {
    const codigo = currentDisplayedCodigo;
    const codigoCell = document.getElementById('codigo-cell');
    const etapaText = document.getElementById('etapa-text');
    const dataText = document.getElementById('data-text');
    const operadorCell = document.getElementById('operador');
    const tempoCell = document.getElementById('tempo-estimado');

    const map = window.codigosMap || {};
    const tempos = window.temposMap || {};
    const coisas = window.coisas1 || {};

    if (codigoCell) codigoCell.querySelector('.value').textContent = codigo;

    let etapa = undefined;
    let hasRetrabalho = false;
    
    if (typeof coisas === 'object' && coisas[codigo] !== undefined) etapa = coisas[codigo];
    else {
      const found = (window.codigos || []).find(c => c.codigo === codigo);
      if (found && found.etapa != null) etapa = found.etapa;
    }

    // Verifica se há retrabalho
    if (map && map[codigo]) {
      hasRetrabalho = map[codigo].retrabalho || false;
    }

    let sequenciamento = 'Etapa desconhecida';
    if (etapa) {
      switch (etapa) {
        case 1: sequenciamento = 'Compra registrada'; break;
        case 2: sequenciamento = 'Montagem dos meios em andamento'; break;
        case 3: sequenciamento = 'Montagem das quinas em andamento'; break;
        case 4: sequenciamento = 'Testes de qualidade em andamento'; break;
        case 5: sequenciamento = 'Ajuste dos parafusos e montagem das tampas em andamento'; break;
        case 6: sequenciamento = 'Montagem finalizada'; break;
        default: sequenciamento = 'Etapa desconhecida';
      }
      
      // Adiciona aviso de retrabalho
      if (hasRetrabalho && etapa < 6) {
        sequenciamento += " ⚠️ ATENÇÃO: Problema inesperado detectado";
      }
    }

    if (etapaText) {
      const spanEtapa = etapaText.querySelector('.value');
      spanEtapa.textContent = sequenciamento;
      if (hasRetrabalho && etapa < 6) {
        spanEtapa.style.color = '#d97706';
        spanEtapa.style.fontWeight = 'bold';
      } else {
        spanEtapa.style.color = '';
        spanEtapa.style.fontWeight = '';
      }
    }

    if (dataText) dataText.querySelector('.value').textContent = new Date().toLocaleDateString();

    let operadorNome = '';
    if (map && map[codigo] && map[codigo].operador) {
      operadorNome = map[codigo].operador;
    } else {
      operadorNome = operatorForStage(etapa || 0);
    }
    if (operadorCell) operadorCell.querySelector('.value').textContent = operadorNome;

    let tempoVal = null;
    if (tempos && tempos[codigo] != null) {
      tempoVal = Number(tempos[codigo]);
    } else if (map && map[codigo] && map[codigo].tempo != null) {
      tempoVal = Number(map[codigo].tempo);
    } else if (etapa) {
      tempoVal = computeTempoSeconds((map[codigo] && map[codigo].etapasTotal) || (window.DEFAULT_ETAPAS || 6), etapa, hasRetrabalho);
    }

    if (tempoVal != null) {
      tempo = tempoVal;
      if (tempoCell) {
        const spanTempo = tempoCell.querySelector('.value');
        const tempoTexto = formatTime(tempoVal);
        spanTempo.textContent = tempoTexto;
        if (hasRetrabalho && etapa < 6) {
          spanTempo.style.color = '#d97706';
          spanTempo.style.fontWeight = 'bold';
        } else {
          spanTempo.style.color = '';
          spanTempo.style.fontWeight = '';
        }
      }
    }

    resetarCirculos();
    switch (etapa) {
      case 1:
        cEtapa1 && (cEtapa1.style.backgroundColor = 'green');
        break;
      case 2:
        cEtapa1 && (cEtapa1.style.backgroundColor = 'green');
        cEtapa2 && (cEtapa2.style.backgroundColor = 'green');
        break;
      case 3:
        cEtapa1 && (cEtapa1.style.backgroundColor = 'green');
        cEtapa2 && (cEtapa2.style.backgroundColor = 'green');
        cEtapa3 && (cEtapa3.style.backgroundColor = 'green');
        break;
      case 4:
        cEtapa1 && (cEtapa1.style.backgroundColor = 'green');
        cEtapa2 && (cEtapa2.style.backgroundColor = 'green');
        cEtapa3 && (cEtapa3.style.backgroundColor = 'green');
        cEtapa4 && (cEtapa4.style.backgroundColor = 'green');
        break;
      case 5:
        cEtapa1 && (cEtapa1.style.backgroundColor = 'green');
        cEtapa2 && (cEtapa2.style.backgroundColor = 'green');
        cEtapa3 && (cEtapa3.style.backgroundColor = 'green');
        cEtapa4 && (cEtapa4.style.backgroundColor = 'green');
        cEtapa5 && (cEtapa5.style.backgroundColor = 'green');
        break;
      case 6:
        cEtapa1 && (cEtapa1.style.backgroundColor = 'green');
        cEtapa2 && (cEtapa2.style.backgroundColor = 'green');
        cEtapa3 && (cEtapa3.style.backgroundColor = 'green');
        cEtapa4 && (cEtapa4.style.backgroundColor = 'green');
        cEtapa5 && (cEtapa5.style.backgroundColor = 'green');
        cEtapa6 && (cEtapa6.style.backgroundColor = 'green');
        break;
      default:
        break;
    }
  } catch (e) { console.warn('Erro ao atualizar display do código:', e); }
}

// Executa atualização periódica a cada 500ms
setInterval(updateDisplayedCodigo, 500);