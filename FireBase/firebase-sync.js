if (window.__firebaseSyncInitialized) {
  console.log('firebase-sync: already initialized, skipping');
} else {
  (async () => {
    try {
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js');
      const dbModule = await import('https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js');
      const { getDatabase, ref, onValue, set, update, get, remove, runTransaction } = dbModule;

const firebaseConfig = {
  apiKey: "AIzaSyBd173EgkgAWWVNgN4j2_U-fU1ZLKQrgIM",
  authDomain: "teste-ee3b5.firebaseapp.com",
  databaseURL: "https://teste-ee3b5-default-rtdb.firebaseio.com",
  projectId: "teste-ee3b5",
  storageBucket: "teste-ee3b5.firebasestorage.app",
  messagingSenderId: "84095674556",
  appId: "1:84095674556:web:eadf7db8ab4ee9521448b9"
};

      const app = initializeApp(firebaseConfig);
      const db = getDatabase(app);

      function dbRef(path) { return ref(db, path); }

      if (!window.DEFAULT_ETAPAS) {
        window.DEFAULT_ETAPAS = 6;
      }
      
      // Tempos ajustados conforme tabela (Etapa 5 agora é 35s = 20s + 15s)
      if (!window.SECS_PER_STAGE) {
        window.SECS_PER_STAGE = [0, 35, 48, 40, 15, 35, 12];
      }

      if (!window.RETRABALHO_MULTIPLIER) {
        window.RETRABALHO_MULTIPLIER = 1.0;
      }

      function codigosObjToArray(obj) {
        if (!obj) return [];
        return Object.keys(obj).map(k => ({ codigo: k, ...obj[k] }));
      }

      // Função atualizada: calcula tempo baseado na SOMA das etapas restantes
      function computeTempoSeconds(etapasTotal, etapaAtual, hasRetrabalho) {
        const total = (typeof etapasTotal === 'number') ? etapasTotal : parseInt(etapasTotal, 10) || (window.DEFAULT_ETAPAS || 6);
        const etapa = (typeof etapaAtual === 'number') ? etapaAtual : parseInt(etapaAtual, 10) || 0;

        const secsArray = Array.isArray(window.SECS_PER_STAGE) ? window.SECS_PER_STAGE : null;
        if (secsArray && secsArray.length > 0) {
          // Soma todas as etapas RESTANTES (da próxima até a última)
          let totalTime = 0;
          for (let i = etapa + 1; i <= 6; i++) {
            totalTime += Number(secsArray[i] || 0);
          }
          
          // Aplica multiplicador de retrabalho se necessário
          if (hasRetrabalho && etapa < 6) {
            totalTime = Math.floor(totalTime * (window.RETRABALHO_MULTIPLIER || 1.0));
          }
          
          return totalTime;
        }

        // Fallback
        const remainingStages = Math.max(0, total - etapa);
        let baseTime = remainingStages * 60;
        
        if (hasRetrabalho && etapa < 6) {
          baseTime = Math.floor(baseTime * (window.RETRABALHO_MULTIPLIER || 1.0));
        }
        
        return baseTime;
      }

      try {
        onValue(dbRef('codigos'), (snap) => {
          try {
            const val = snap.val() || {};
            const arr = codigosObjToArray(val);
            window.codigos = arr;
            window.codigosMap = val;
            try { localStorage.setItem('codigos', JSON.stringify(arr)); } catch (e) { console.warn('Falha ao gravar localStorage codigos:', e); }
            try { window.dispatchEvent(new CustomEvent('firebaseSync:codigos', { detail: { arr, map: val } })); } catch (e) {}
          } catch (e) { console.warn('Erro no listener codigos:', e); }
        });
      } catch (e) { console.warn('Erro ao registrar listener codigos:', e); }

      try {
        onValue(dbRef('coisas1'), (snap) => {
          try {
            const val = snap.val() || {};
            window.coisas1 = val;
            try { window.coisas = val; } catch (e) {}
            try { localStorage.setItem('coisas1', JSON.stringify(val)); } catch (e) { console.warn('Falha ao gravar localStorage coisas1:', e); }
            try { localStorage.setItem('coisas', JSON.stringify(val)); } catch (e) { /* ignore */ }
            try { window.dispatchEvent(new CustomEvent('firebaseSync:coisas1', { detail: { map: val } })); } catch (e) {}
            try { window.dispatchEvent(new CustomEvent('firebaseSync:coisas', { detail: { map: val } })); } catch (e) {}
          } catch (e) { console.warn('Erro no listener coisas1:', e); }
        });
      } catch (e) { console.warn('Erro ao registrar listener coisas1:', e); }

      try {
        onValue(dbRef('tempos'), (snap) => {
          try {
            const val = snap.val() || {};
            window.tempos = Object.keys(val).map(k => ({ codigo: k, tempo: val[k] }));
            window.temposMap = val;
            try { window.dispatchEvent(new CustomEvent('firebaseSync:tempos', { detail: { map: val } })); } catch (e) {}
          } catch (e) { console.warn('Erro no listener tempos:', e); }
        });
      } catch (e) { console.warn('Erro ao registrar listener tempos:', e); }

      if (!window.addCodigo) {
        window.addCodigo = async function (codigoObj) {
          if (!codigoObj) throw new Error('codigoObj é obrigatório');

          const contadorRef = dbRef('contadorGlobal');
          const snapAtual = await get(contadorRef);
          const valorAtual = snapAtual.exists() ? snapAtual.val() : 0;
          const limite = 6;
          
          if (valorAtual >= limite) {
            throw new Error(`Limite de ${limite} códigos atingido!`);
          }
          
          let codigoNum = await runTransaction(contadorRef, (currentValue) => {
            return (currentValue || 0) + 1;
          }).then(result => result.snapshot.val());

          const codigoStr = codigoNum.toString().padStart(4, '0');
          const etapaInicial = (codigoObj && codigoObj.etapa !== undefined) ? codigoObj.etapa : 0;
          const etapasTotal = (codigoObj.etapasTotal || window.DEFAULT_ETAPAS || 6);
          
          const payload = {
            nome: codigoObj.nome || null,
            etapa: etapaInicial,
            etapasTotal: etapasTotal,
            retrabalho: false,
            tempo: computeTempoSeconds(etapasTotal, etapaInicial, false),
            createdAt: codigoObj.createdAt || Date.now(),
            lastUpdatedAt: Date.now()
          };

          await set(dbRef(`codigos/${codigoStr}`), payload);
          await set(dbRef(`coisas1/${codigoStr}`), payload.etapa);
          await set(dbRef(`tempos/${codigoStr}`), payload.tempo);

          return codigoStr;
        };
      }

      if (!window.updateCodigoEtapa) {
        window.updateCodigoEtapa = async function (codigo, etapa) {
          if (!codigo) throw new Error('codigo é obrigatório');
          const snap = await get(dbRef(`codigos/${codigo}`));
          const current = snap.exists() ? snap.val() : {};
          const etapasTotal = (current && current.etapasTotal) ? current.etapasTotal : (window.DEFAULT_ETAPAS || 6);
          const hasRetrabalho = (current && current.retrabalho) ? current.retrabalho : false;

          // Calcula tempo baseado na etapa
          const novoTempo = computeTempoSeconds(etapasTotal, etapa, hasRetrabalho);

          await update(dbRef(`codigos/${codigo}`), { etapa, tempo: novoTempo, lastUpdatedAt: Date.now() });
          await set(dbRef(`coisas1/${codigo}`), etapa);
          await set(dbRef(`tempos/${codigo}`), novoTempo);
          
          console.log(`Etapa atualizada para ${etapa}. Tempo restante: ${novoTempo}s (Retrabalho: ${hasRetrabalho})`);
        };
      }

      if (!window.updateCodigoRetrabalho) {
        window.updateCodigoRetrabalho = async function (codigo, hasRetrabalho) {
          if (!codigo) throw new Error('codigo é obrigatório');
          
          const snap = await get(dbRef(`codigos/${codigo}`));
          if (!snap.exists()) {
            console.warn('Código não existe:', codigo);
            return;
          }
          
          const current = snap.val();
          const etapasTotal = current.etapasTotal || (window.DEFAULT_ETAPAS || 6);
          const etapaAtual = (current && current.etapa !== undefined && current.etapa !== null) ? current.etapa : 0;
          
          // Recalcula tempo baseado na etapa
          const novoTempo = computeTempoSeconds(etapasTotal, etapaAtual, hasRetrabalho);
          
          await update(dbRef(`codigos/${codigo}`), { 
            retrabalho: hasRetrabalho,
            tempo: novoTempo,
            lastUpdatedAt: Date.now() 
          });
          
          await set(dbRef(`tempos/${codigo}`), novoTempo);
          
          console.log(`Retrabalho ${hasRetrabalho ? 'ATIVADO' : 'DESATIVADO'} para código ${codigo}. Tempo: ${novoTempo}s`);
        };
      }

      if (!window.updateTempo) {
        window.updateTempo = async function (codigo, tempoSeconds) {
          if (!codigo) throw new Error('codigo é obrigatório');
          const t = (typeof tempoSeconds === 'number') ? tempoSeconds : parseInt(tempoSeconds, 10) || 0;
          await set(dbRef(`tempos/${codigo}`), t);
          try { await update(dbRef(`codigos/${codigo}`), { tempo: t, lastUpdatedAt: Date.now() }); } catch (e) { }
        };
      }

      if (!window.resetCodigos) {
        window.resetCodigos = async function () {
          await set(dbRef('codigos'), null);
          await set(dbRef('coisas1'), {});
          await set(dbRef('tempos'), null);
          await set(dbRef('contadorGlobal'), 0);
        };
      }

      if (!window.setContadorGlobal) {
        window.setContadorGlobal = async function (value) {
          const v = (typeof value === 'number') ? value : parseInt(value, 10) || 0;
          await set(dbRef('contadorGlobal'), v);
        };
      }

      if (!window.getContadorGlobal) {
        window.getContadorGlobal = async function () {
          const snap = await get(dbRef('contadorGlobal'));
          return snap.exists() ? snap.val() : null;
        };
      }

      if (!window.getCodigosOnce) {
        window.getCodigosOnce = async function () {
          const snap = await get(dbRef('codigos'));
          const val = snap.val() || {};
          return codigosObjToArray(val);
        };
      }

      if (!window.removeCodigo) {
        window.removeCodigo = async function (codigo) {
          if (!codigo) throw new Error('codigo é obrigatório');
          await remove(dbRef(`codigos/${codigo}`));
          await remove(dbRef(`coisas1/${codigo}`));
          await remove(dbRef(`tempos/${codigo}`));
        };
      }

      window.__firebaseSyncInitialized = true;
      console.log('✅ firebase-sync initialized: 6 etapas, tempos em SEGUNDOS baseados em etapas RESTANTES');
      console.log('📊 Tempos por etapa: [0s, 35s, 48s, 40s, 15s, 35s, 12s]');

    } catch (e) {
      console.warn('firebase-sync internal error:', e);
    }
  })();
}