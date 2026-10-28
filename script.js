const STORAGE_KEY = 'sicca-credit-system-state-v1';

const demoFinancials = {
  cash: 240,
  equivalents: 180,
  clients: 1040,
  inventory: 680,
  otherCurrentAssets: 300,
  fixedAssets: 1850,
  intangibleAssets: 420,
  accumulatedDepreciation: 500,
  suppliers: 1180,
  shortTermLoans: 430,
  longTermLoans: 1250,
  taxes: 180,
  provisions: 110,
  otherLiabilities: 310,
  shareCapital: 1450,
  reserves: 520,
  retainedEarnings: 300,
  netIncome: 680,
  revenue: 9840,
  cogs: 6150,
  grossProfit: 3690,
  personnelCosts: 1040,
  opex: 980,
  ebitda: 1730,
  depreciation: 480,
  ebit: 1250,
  financialResult: 280,
  taxesPaid: 140,
  totalAssets: 6400,
  totalEquity: 2200,
  totalDebt: 4200,
  netDebt: 3000,
  currentAssets: 0,
  currentLiabilities: 0,
  totalLiabilities: 0
};

demoFinancials.currentAssets = demoFinancials.cash + demoFinancials.equivalents + demoFinancials.clients + demoFinancials.inventory + demoFinancials.otherCurrentAssets;
demoFinancials.currentLiabilities = demoFinancials.suppliers + demoFinancials.shortTermLoans + demoFinancials.taxes + demoFinancials.provisions + demoFinancials.otherLiabilities;
demoFinancials.totalLiabilities = demoFinancials.currentLiabilities + demoFinancials.longTermLoans + demoFinancials.otherLiabilities;
demoFinancials.totalAssets = demoFinancials.currentAssets + demoFinancials.fixedAssets + demoFinancials.intangibleAssets - demoFinancials.accumulatedDepreciation;
demoFinancials.totalEquity = demoFinancials.shareCapital + demoFinancials.reserves + demoFinancials.retainedEarnings + demoFinancials.netIncome;
demoFinancials.totalDebt = demoFinancials.shortTermLoans + demoFinancials.longTermLoans;
demoFinancials.netDebt = demoFinancials.totalDebt - demoFinancials.cash;

const defaultAppState = {
  empresa: 'SONANGRO DISTRIBUIDORA, S.A.',
  nif: '5000187654',
  sector: 'comercio',
  grupo: 'GRUPO ATLÂNTICO ANGOLA',
  montante: '4500',
  moeda: 'AOA',
  prazo: '60',
  finalidade: 'fundo',
  financials: demoFinancials,
  lastSavedAt: null
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getPersistedState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return deepClone(defaultAppState);

  try {
    const parsed = JSON.parse(raw);
    return {
      ...deepClone(defaultAppState),
      ...parsed,
      financials: {
        ...deepClone(demoFinancials),
        ...(parsed.financials || {})
      }
    };
  } catch (error) {
    console.warn('State invalid. Loading default demo state.', error);
    return deepClone(defaultAppState);
  }
}

const state = {
  empresa: 'SONANGRO DISTRIBUIDORA, S.A.',
  analysed: false,
  score: 67,
  rating: 'BBB',
  pd: 3.2,
  lgd: 42,
  ead: 4500,
  dscr: 1.50,
  ecl: 60.5,
  charts: {},
  client: {},
  financials: deepClone(demoFinancials)
};

const persistedState = getPersistedState();
state.empresa = persistedState.empresa;
state.client = {
  empresa: persistedState.empresa,
  nif: persistedState.nif,
  sector: persistedState.sector,
  grupo: persistedState.grupo,
  montante: persistedState.montante,
  moeda: persistedState.moeda,
  prazo: persistedState.prazo,
  finalidade: persistedState.finalidade
};
state.financials = persistedState.financials;

function saveClientState() {
  const nextState = {
    empresa: document.getElementById('f-empresa')?.value || state.empresa,
    nif: document.getElementById('f-nif')?.value || '',
    sector: document.getElementById('f-sector')?.value || 'comercio',
    grupo: document.getElementById('f-grupo')?.value || '',
    montante: document.getElementById('f-montante')?.value || '0',
    moeda: document.getElementById('f-moeda')?.value || 'AOA',
    prazo: document.getElementById('f-prazo')?.value || '0',
    finalidade: document.getElementById('f-finalidade')?.value || 'fundo',
    financials: state.financials,
    lastSavedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  const statusEl = document.getElementById('save-status');
  if (statusEl) {
    statusEl.textContent = 'Dados guardados localmente';
    statusEl.style.color = '#10b981';
  }
  state.empresa = nextState.empresa;
  state.client = {
    empresa: nextState.empresa,
    nif: nextState.nif,
    sector: nextState.sector,
    grupo: nextState.grupo,
    montante: nextState.montante,
    moeda: nextState.moeda,
    prazo: nextState.prazo,
    finalidade: nextState.finalidade
  };
}

function loadDemoState() {
  const appState = deepClone(defaultAppState);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));

  Object.entries({
    'f-empresa': appState.empresa,
    'f-nif': appState.nif,
    'f-sector': appState.sector,
    'f-grupo': appState.grupo,
    'f-montante': appState.montante,
    'f-moeda': appState.moeda,
    'f-prazo': appState.prazo,
    'f-finalidade': appState.finalidade
  }).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.value = value;
  });

  state.financials = deepClone(appState.financials);
  state.empresa = appState.empresa;
  state.client = {
    empresa: appState.empresa,
    nif: appState.nif,
    sector: appState.sector,
    grupo: appState.grupo,
    montante: appState.montante,
    moeda: appState.moeda,
    prazo: appState.prazo,
    finalidade: appState.finalidade
  };

  if (document.getElementById('save-status')) {
    document.getElementById('save-status').textContent = 'Exemplo carregado';
    document.getElementById('save-status').style.color = '#f59e0b';
  }

  runAnalysis();
}

function applyPersistedFormValues() {
  Object.entries({
    'f-empresa': persistedState.empresa,
    'f-nif': persistedState.nif,
    'f-sector': persistedState.sector,
    'f-grupo': persistedState.grupo,
    'f-montante': persistedState.montante,
    'f-moeda': persistedState.moeda,
    'f-prazo': persistedState.prazo,
    'f-finalidade': persistedState.finalidade
  }).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.value = value;
  });
}

function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return 'N/D';
  return Number(value).toFixed(decimals);
}

function safeRatio(numerator, denominator) {
  const num = Number(numerator) || 0;
  const den = Number(denominator) || 0;
  if (!den) return null;
  return num / den;
}

function formatRatio(value, suffix = 'x') {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return 'N/D';
  return `${Number(value).toFixed(2)}${suffix}`;
}

function buildComputedRatios() {
  const f = state.financials;
  const currentAssets = Number(f.currentAssets || (f.cash + f.equivalents + f.clients + f.inventory + f.otherCurrentAssets));
  const currentLiabilities = Number(f.currentLiabilities || (f.suppliers + f.shortTermLoans + f.taxes + f.provisions + f.otherLiabilities));
  const quickAssets = currentAssets - Number(f.inventory || 0);
  const totalAssets = Number(f.totalAssets || (currentAssets + f.fixedAssets + f.intangibleAssets - f.accumulatedDepreciation));
  const equity = Number(f.totalEquity || (f.shareCapital + f.reserves + f.retainedEarnings + f.netIncome));
  const totalDebt = Number(f.totalDebt || (f.shortTermLoans + f.longTermLoans));
  const grossProfit = Number(f.grossProfit || (f.revenue - f.cogs));
  const ebitda = Number(f.ebitda || 0);
  const netIncome = Number(f.netIncome || 0);
  const debtToEBITDA = safeRatio(totalDebt, ebitda || 1);
  const currentRatio = safeRatio(currentAssets, currentLiabilities);
  const quickRatio = safeRatio(quickAssets, currentLiabilities);
  const cashRatio = safeRatio(Number(f.cash || 0), currentLiabilities);
  const nfm = Number(f.clients || 0) + Number(f.inventory || 0) - Number(f.suppliers || 0);
  const financialAutonomy = safeRatio(equity, totalAssets);
  const leverage = safeRatio(totalDebt, equity || 1);
  const grossMargin = safeRatio(grossProfit, Number(f.revenue || 1));
  const ebitdaMargin = safeRatio(ebitda, Number(f.revenue || 1));
  const ebitMargin = safeRatio(Number(f.ebit || 0), Number(f.revenue || 1));
  const roa = safeRatio(netIncome, totalAssets || 1);
  const roe = safeRatio(netIncome, equity || 1);
  const dscr = safeRatio(ebitda, Number(f.shortTermLoans || 0) + Number(f.longTermLoans || 0) + Number(f.financialResult || 0) || 1);

  return {
    liquidez: [
      { name: 'Liquidez Corrente', formula: 'AC / PC', value: currentRatio, benchmark: '> 1,60x', status: currentRatio >= 1.6 ? 'good' : currentRatio >= 1.2 ? 'warn' : 'bad' },
      { name: 'Liquidez Reduzida', formula: '(AC - Exist.) / PC', value: quickRatio, benchmark: '> 1,00x', status: quickRatio >= 1 ? 'good' : quickRatio >= 0.8 ? 'warn' : 'bad' },
      { name: 'Liquidez Imediata', formula: 'Caixa / PC', value: cashRatio, benchmark: '> 0,20x', status: cashRatio >= 0.2 ? 'good' : cashRatio >= 0.1 ? 'warn' : 'bad' },
      { name: 'NFM (AOA M)', formula: 'Clientes + Stocks - Fornec.', value: nfm / 1000, benchmark: 'N/A', status: 'info' },
      { name: 'Ciclo de Caixa (dias)', formula: 'PMR + PMS - PMP', value: 85.6, benchmark: '< 90 d', status: 85.6 < 90 ? 'good' : 'warn' }
    ],
    endividamento: [
      { name: 'Autonomia Financeira', formula: 'CP / AT', value: financialAutonomy, benchmark: '> 35%', status: financialAutonomy >= 0.35 ? 'good' : 'warn' },
      { name: 'Debt Ratio', formula: 'PT / AT', value: safeRatio(totalDebt, totalAssets || 1), benchmark: '< 65%', status: safeRatio(totalDebt, totalAssets || 1) <= 0.65 ? 'good' : 'warn' },
      { name: 'Leverage (Dív/EBITDA)', formula: '(Dív.Liq.) / EBITDA', value: debtToEBITDA, benchmark: '< 3,5x', status: debtToEBITDA < 3.5 ? 'good' : 'warn' },
      { name: 'Debt/Equity', formula: 'PT / CP', value: safeRatio(totalDebt, equity || 1), benchmark: '< 2,0x', status: safeRatio(totalDebt, equity || 1) < 2 ? 'good' : 'warn' },
      { name: 'Interest Coverage (ICR)', formula: 'EBIT / Juros', value: safeRatio(Number(f.ebit || 0), Number(f.financialResult || 1)), benchmark: '> 2,0x', status: safeRatio(Number(f.ebit || 0), Number(f.financialResult || 1)) > 2 ? 'good' : 'warn' }
    ],
    rentabilidade: [
      { name: 'Margem Bruta', formula: 'MB / Vendas', value: grossMargin, benchmark: '> 35%', status: grossMargin >= 0.35 ? 'good' : 'warn' },
      { name: 'Margem EBITDA', formula: 'EBITDA / Vendas', value: ebitdaMargin, benchmark: '> 21%', status: ebitdaMargin >= 0.21 ? 'good' : 'warn' },
      { name: 'Margem EBIT', formula: 'EBIT / Vendas', value: ebitMargin, benchmark: '> 10%', status: ebitMargin >= 0.10 ? 'good' : 'warn' },
      { name: 'ROA', formula: 'RL / AT', value: roa, benchmark: '> 8%', status: roa >= 0.08 ? 'good' : 'warn' },
      { name: 'ROE', formula: 'RL / CP', value: roe, benchmark: '> 15%', status: roe >= 0.15 ? 'good' : 'warn' }
    ],
    eficiencia: [
      { name: 'PMR (dias)', formula: '(Clientes / Vendas) × 365', value: 86.8, benchmark: '< 90 d', status: 86.8 < 90 ? 'good' : 'warn' },
      { name: 'PMP (dias)', formula: '(Fornec. / CMVMC) × 365', value: 109.2, benchmark: '30–90 d', status: 'info' },
      { name: 'PMS (dias)', formula: '(Stocks / CMVMC) × 365', value: 108.0, benchmark: '< 90 d', status: 'warn' },
      { name: 'Ciclo Operacional', formula: 'PMR + PMS', value: 194.8, benchmark: '< 150 d', status: 'bad' },
      { name: 'LTV Garantias', formula: 'Empréstimo / Val.Garantias', value: 0.72, benchmark: '< 70%', status: 0.72 <= 0.7 ? 'good' : 'warn' }
    ]
  };
}

function updateSaveStatus(message, tone = 'info') {
  const statusEl = document.getElementById('save-status');
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color = tone === 'good' ? '#10b981' : tone === 'warn' ? '#f59e0b' : '#8fa3c0';
}

function setInitialFormState() {
  const initState = getPersistedState();
  state.empresa = initState.empresa;
  state.client = {
    empresa: initState.empresa,
    nif: initState.nif,
    sector: initState.sector,
    grupo: initState.grupo,
    montante: initState.montante,
    moeda: initState.moeda,
    prazo: initState.prazo,
    finalidade: initState.finalidade
  };
  state.financials = initState.financials;
  applyPersistedFormValues();
}

function createTableRows(rows) {
  return rows.map(r => {
    const value = typeof r.value === 'number' ? (r.formula.includes('AOA M') ? `${(r.value).toFixed(2)} M` : r.value >= 1 && !r.name.includes('Margem') ? `${r.value.toFixed(2)}x` : r.value >= 0.1 ? `${(r.value * 100).toFixed(1)}%` : `${r.value.toFixed(2)}x`) : r.value;
    const benchmark = r.benchmark || 'N/A';
    const status = statusBadge(r.status || 'info');
    return `<tr><td>${r.name}</td><td style="color:var(--text3);font-size:10px;font-family:monospace">${r.formula}</td><td style="font-weight:600">${value}</td><td style="color:var(--text3)">${benchmark}</td><td>${status}</td></tr>`;
  }).join('');
}

function buildRatioTables() {
  const computed = buildComputedRatios();
  ['liquidez', 'endividamento', 'rentabilidade', 'eficiencia'].forEach(key => {
    const el = document.getElementById('tbl-' + key);
    if (!el) return;

    const rows = computed[key].map(r => {
      const value = typeof r.value === 'number' ? (
        key === 'liquidez' && r.name === 'NFM (AOA M)' ? `${(r.value).toFixed(2)} M` :
        r.name.includes('Margem') || r.name.includes('ROA') || r.name.includes('ROE') || r.name.includes('Autonomia') || r.name.includes('Debt Ratio') ? `${(r.value * 100).toFixed(1)}%` :
        r.name.includes('Leverage') || r.name.includes('Debt/Equity') || r.name.includes('Interest') || r.name.includes('Liquidez') || r.name.includes('Ciclo') || r.name.includes('LTV') || r.name.includes('DSCR') ? `${r.value.toFixed(2)}x` : `${r.value.toFixed(1)}`
      ) : r.value;

      return `<tr><td>${r.name}</td><td style="color:var(--text3);font-size:10px;font-family:monospace">${r.formula}</td><td style="font-weight:600">${value}</td><td style="color:var(--text3)">${r.benchmark}</td><td>${statusBadge(r.status)}</td></tr>`;
    });

    el.innerHTML = rows.join('');
  });
}

// ── NAV ──────────────────────────────────────────────────────────
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('s-' + id).classList.add('active');
  const tabs = document.querySelectorAll('.nav-tab');
  const map = {upload:0,dashboard:1,financeiro:2,risco:3,ifrs9:4,garantias:5,cambial:6,concentracao:7,comite:8,memorando:9};
  if (map[id] !== undefined) tabs[map[id]].classList.add('active');
}

// ── DATE ──────────────────────────────────────────────────────────
const now = new Date();
const dateStr = now.toLocaleDateString('pt-AO', {day:'2-digit',month:'long',year:'numeric'});
const els = ['d-date','m-date','m-date2'];
els.forEach(id => { const el = document.getElementById(id); if(el) el.textContent = dateStr; });

// ── FILE HANDLING ─────────────────────────────────────────────────
function triggerUpload() { document.getElementById('fileInput').click(); }
function dragOver(e) { e.preventDefault(); document.getElementById('uploadZone').classList.add('dragover'); }
function dropFile(e) {
  e.preventDefault();
  document.getElementById('uploadZone').classList.remove('dragover');
  showFiles(e.dataTransfer.files);
}
function handleFiles(e) { showFiles(e.target.files); }
function showFiles(files) {
  const list = document.getElementById('fileList');
  let html = '';
  for (const f of files) {
    const icon = f.name.endsWith('.xlsx') || f.name.endsWith('.csv') ? '📊' :
                 f.name.endsWith('.pdf') ? '📄' : f.name.endsWith('.docx') ? '📝' : '📎';
    html += `<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;margin-bottom:6px">
      <span>${icon}</span>
      <div style="flex:1">
        <div style="font-size:12px;color:var(--text)">${f.name}</div>
        <div style="font-size:10px;color:var(--text3)">${(f.size/1024).toFixed(1)} KB · ${detectType(f.name)}</div>
      </div>
      <span style="font-size:10px;color:var(--green2)">✓ Pronto</span>
    </div>`;
    if (f.name.toLowerCase().endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = function(fileText) {
        const text = fileText.target.result;
        const rows = text.split(/\r?\n/).map(line => line.split(';').map(cell => cell.trim()));
        if (rows.length >= 2) {
          const numbers = rows.slice(1).flatMap(row => row.filter(cell => !isNaN(parseFloat(cell.replace(',', '.')))).map(cell => parseFloat(cell.replace(',', '.'))));
          if (numbers.length) {
            state.financials.revenue = numbers[0] || state.financials.revenue;
            state.financials.cogs = numbers[1] || state.financials.cogs;
            state.financials.netIncome = numbers[2] || state.financials.netIncome;
            updateSaveStatus('CSV importado e dados atualizados', 'good');
          }
        }
      };
      reader.readAsText(f);
    }
  }
  list.innerHTML = html;
}
function detectType(name) {
  if (/balanc/i.test(name)) return 'Balanço Patrimonial';
  if (/result/i.test(name)) return 'Demonstração de Resultados';
  if (/cash|fluxo|caixa/i.test(name)) return 'Mapa de Fluxos de Caixa';
  if (/certid/i.test(name)) return 'Certidão Comercial';
  if (/contrat/i.test(name)) return 'Contrato';
  return 'Documento Financeiro';
}

// ── ANALYSIS ──────────────────────────────────────────────────────
function runAnalysis() {
  const emp = document.getElementById('f-empresa').value;
  const sector = document.getElementById('f-sector').value;
  const montante = document.getElementById('f-montante').value;
  const prazo = document.getElementById('f-prazo').value;
  state.empresa = emp;
  state.client = {
    empresa: emp,
    nif: document.getElementById('f-nif').value,
    sector,
    grupo: document.getElementById('f-grupo').value,
    montante,
    moeda: document.getElementById('f-moeda').value,
    prazo,
    finalidade: document.getElementById('f-finalidade').value
  };
  state.analysed = true;
  document.getElementById('d-empresa-name').textContent = emp;
  document.getElementById('d-limite').textContent = 'AOA ' + Math.round(montante * 0.84) + ' Mio';
  document.getElementById('d-prazo-text').textContent = prazo + ' meses · ' + getFinalidade();
  document.getElementById('demo-alert').style.display = 'block';

  saveClientState();
  buildRatioTables();
  buildScoreBreakdown();
  buildComplianceChecks();
  buildVotingSimulation();
  buildConditions();
  buildMemoConditions();
  buildWaterfall();
  buildHeatmap();
  buildConcBar();
  setTimeout(() => {
    buildCharts();
    buildFXChart();
  }, 300);
}

function getFinalidade() {
  const sel = document.getElementById('f-finalidade');
  return sel.options[sel.selectedIndex].text;
}

// ── RATIO TABLES ──────────────────────────────────────────────────
const ratios = {
  liquidez: [
    {name:'Liquidez Corrente',formula:'AC / PC',val:'1,45x',bench:'> 1,60x',status:'warn'},
    {name:'Liquidez Reduzida',formula:'(AC - Exist.) / PC',val:'0,97x',bench:'> 1,00x',status:'warn'},
    {name:'Liquidez Imediata',formula:'Caixa / PC',val:'0,11x',bench:'> 0,20x',status:'bad'},
    {name:'NFM (AOA M)',formula:'Clientes + Stocks - Fornec.',val:'2.320',bench:'N/A',status:'info'},
    {name:'Ciclo de Caixa (dias)',formula:'PMR + PMS - PMP',val:'85,6 d',bench:'< 90 d',status:'good'},
  ],
  endividamento: [
    {name:'Autonomia Financeira',formula:'CP / AT',val:'34,4%',bench:'> 35%',status:'warn'},
    {name:'Debt Ratio',formula:'PT / AT',val:'65,6%',bench:'< 65%',status:'warn'},
    {name:'Leverage (Dív/EBITDA)',formula:'(Dív.Liq.) / EBITDA',val:'2,27x',bench:'< 3,5x',status:'good'},
    {name:'Debt/Equity',formula:'PT / CP',val:'1,91x',bench:'< 2,0x',status:'good'},
    {name:'Interest Coverage (ICR)',formula:'EBIT / Juros',val:'3,91x',bench:'> 2,0x',status:'good'},
  ],
  rentabilidade: [
    {name:'Margem Bruta',formula:'MB / Vendas',val:'37,5%',bench:'> 35%',status:'good'},
    {name:'Margem EBITDA',formula:'EBITDA / Vendas',val:'17,6%',bench:'> 21%',status:'warn'},
    {name:'Margem EBIT',formula:'EBIT / Vendas',val:'12,7%',bench:'> 10%',status:'good'},
    {name:'ROA',formula:'RL / AT',val:'8,9%',bench:'> 8%',status:'good'},
    {name:'ROE',formula:'RL / CP',val:'22,5%',bench:'> 15%',status:'good'},
    {name:'DSCR',formula:'EBITDA / (Juros + Amort.)',val:'1,50x',bench:'> 1,25x',status:'good'},
  ],
  eficiencia: [
    {name:'PMR (dias)',formula:'(Clientes / Vendas) × 365',val:'86,8 d',bench:'< 90 d',status:'good'},
    {name:'PMP (dias)',formula:'(Fornec. / CMVMC) × 365',val:'109,2 d',bench:'30–90 d',status:'info'},
    {name:'PMS (dias)',formula:'(Stocks / CMVMC) × 365',val:'108,0 d',bench:'< 90 d',status:'warn'},
    {name:'Ciclo Operacional',formula:'PMR + PMS',val:'194,8 d',bench:'< 150 d',status:'bad'},
    {name:'LTV Garantias',formula:'Empréstimo / Val.Garantias',val:'72%',bench:'< 70%',status:'warn'},
  ]
};

function statusBadge(s) {
  const map = {good:'tag-green',warn:'tag-amber',bad:'tag-red',info:'tag-blue'};
  const lbl = {good:'✓ OK',warn:'⚠ Atenção',bad:'🔴 Alerta',info:'ℹ Info'};
  return `<span class="tag ${map[s]}">${lbl[s]}</span>`;
}

// ── WATERFALL ─────────────────────────────────────────────────────
function buildWaterfall() {
  const bars = [
    {label:'Vendas',val:9840,color:'#2563eb',h:100},
    {label:'CMVMC',val:-6150,color:'#ef4444',h:63},
    {label:'Mg.Bruta',val:3690,color:'#10b981',h:37},
    {label:'FSE',val:-980,color:'#f59e0b',h:10},
    {label:'Pessoal',val:-1040,color:'#f59e0b',h:11},
    {label:'EBITDA',val:1730,color:'#d4a017',h:18},
    {label:'D&A',val:-480,color:'#8b5cf6',h:5},
    {label:'EBIT',val:1250,color:'#14b8a6',h:13},
    {label:'Financ.',val:-280,color:'#f59e0b',h:3},
    {label:'IRC',val:-140,color:'#6b7280',h:1},
    {label:'Res.Liq.',val:860,color:'#10b981',h:9},
  ];
  const el = document.getElementById('waterfall-chart');
  if (!el) return;
  el.innerHTML = `<div class="waterfall-bar">${bars.map(b =>
    `<div class="w-bar">
      <div class="w-value">${b.val > 0 ? '' : ''}${(b.val/1000).toFixed(1)}B</div>
      <div class="w-bar-fill" style="height:${b.h}%;background:${b.color}"></div>
      <div class="w-label">${b.label}</div>
    </div>`
  ).join('')}</div>`;
}

// ── SCORE BREAKDOWN ───────────────────────────────────────────────
function buildScoreBreakdown() {
  const el = document.getElementById('score-breakdown');
  if (!el) return;
  const pillars = [
    {name:'Risco Financeiro',peso:40,score:62,color:'var(--blue2)'},
    {name:'Risco de Negócio',peso:20,score:68,color:'var(--teal2)'},
    {name:'Gestão',peso:15,score:78,color:'var(--purple2)'},
    {name:'Garantias',peso:15,score:65,color:'var(--amber2)'},
    {name:'Hist. Bancário',peso:10,score:80,color:'var(--green2)'},
  ];
  el.innerHTML = pillars.map(p => `
    <div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:11px;color:var(--text2)">${p.name} <span style="color:var(--text3)">(${p.peso}%)</span></span>
        <span style="font-size:11px;font-weight:600;color:${p.color}">${p.score}/100</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${p.score}%;background:${p.color}"></div></div>
      <div style="font-size:9px;color:var(--text3);margin-top:2px">Contribuição ponderada: ${(p.score * p.peso / 100).toFixed(1)} pts</div>
    </div>
  `).join('');
}

// ── COMPLIANCE ────────────────────────────────────────────────────
function buildComplianceChecks() {
  const el = document.getElementById('compliance-checks');
  if (!el) return;
  const checks = [
    {label:'PEP (Politically Exposed Person)',status:true,note:'Sócios verificados — sem PEP identificado'},
    {label:'Sanções internacionais (OFAC/EU/ONU)',status:true,note:'Empresa e sócios sem restrições'},
    {label:'Beneficiário efectivo identificado',status:true,note:'João Baptista Silva — 45%'},
    {label:'KYC/AML completo',status:true,note:'Documentação completa e actualizada'},
    {label:'Limite individual BNA (25% FP)',status:true,note:'18,5% — dentro do limite'},
    {label:'Limite de grupo BNA (25% FP)',status:false,note:'31,8% — EXCEDE O LIMITE'},
    {label:'IFRS 9 Stage Classification',status:true,note:'Stage 1 — sem SICR'},
    {label:'Basileia III — Capital adequacy',status:true,note:'Capital disponível suficiente'},
  ];
  el.innerHTML = checks.map(c => `
    <div class="alert ${c.status ? 'alert-success' : 'alert-danger'}" style="margin-bottom:6px">
      <span class="alert-icon">${c.status ? '✅' : '🔴'}</span>
      <div><strong>${c.label}</strong><br><span style="font-size:10px">${c.note}</span></div>
    </div>
  `).join('');
}

// ── VOTING SIMULATION ─────────────────────────────────────────────
function buildVotingSimulation() {
  const el = document.getElementById('voting-simulation');
  if (!el) return;
  simulateVote('conditional');
}

function simulateVote(type) {
  const el = document.getElementById('voting-simulation');
  if (!el) return;
  const members = [
    {name:'Dr. António Mendes',role:'Presidente CA'},
    {name:'Dra. Maria Cardoso',role:'CRO — Chief Risk Officer'},
    {name:'Dr. Paulo Ferreira',role:'CFO — Director Financeiro'},
    {name:'Dra. Sofia Lima',role:'Director Comercial'},
    {name:'Dr. Carlos Neto',role:'Director Jurídico'},
  ];
  const votes = {
    approve: ['Aprovado','Aprovado','Aprovado','Aprovado','Aprovado'],
    conditional: ['Aprovado c/cond.','Aprovado c/cond.','Aprovado c/cond.','Aprovado c/cond.','Abstenção'],
    reject: ['Rejeitado','Rejeitado','Aprovado c/cond.','Aprovado c/cond.','Rejeitado']
  };
  const colors = {
    'Aprovado':'tag-green','Aprovado c/cond.':'tag-amber','Rejeitado':'tag-red','Abstenção':'tag-blue'
  };
  el.innerHTML = `<table>
    <thead><tr><th>Membro</th><th>Função</th><th>Voto</th></tr></thead>
    <tbody>${members.map((m,i) => {
      const v = votes[type][i];
      return `<tr><td>${m.name}</td><td style="color:var(--text3)">${m.role}</td><td><span class="tag ${colors[v]}">${v}</span></td></tr>`;
    }).join('')}</tbody>
  </table>`;
}

// ── CONDITIONS ────────────────────────────────────────────────────
const conditionsList = [
  'Redução do montante aprovado para AOA 3.800.000.000 (vs AOA 4.500.000.000 solicitados).',
  'Reforço da garantia com penhor sobre depósito caução de AOA 200.000.000 para reduzir LTV para 67,5%.',
  'Comunicação e aprovação do BNA nos termos do Aviso n.º 02/2019 por excesso de concentração de grupo (31,8% FP).',
  'Redução da exposição total ao Grupo Atlântico Angola para AOA 6.085M (25% FP) em prazo de 90 dias, mediante amortização ou transferência de outras exposições do grupo.',
  'Covenant: Leverage ≤ 3,5x Dív.Liq./EBITDA avaliado semestralmente. Breach = Evento de Incumprimento.',
  'Covenant: DSCR ≥ 1,25x avaliado semestralmente. Breach = Evento de Incumprimento.',
  'Covenant cambial: manutenção de reserva em USD ≥ USD 200.000 na conta USD do banco.',
  'Entrega de Demonstrações Financeiras auditadas até 30 de Abril de cada exercício.',
  'Reavaliação anual da hipoteca sobre imóvel Talatona e actualização do seguro.',
  'Aprovação prévia do banco para contração de nova dívida financeira acima de AOA 500.000.000.',
];

function buildConditions() {
  const el = document.getElementById('conditions-list');
  if (!el) return;
  el.innerHTML = conditionsList.slice(0,5).map((c,i) =>
    `<div class="memo-condition" style="margin-bottom:6px">${i+1}. ${c}</div>`
  ).join('');
}

function buildMemoConditions() {
  const el = document.getElementById('memo-conditions');
  if (!el) return;
  el.innerHTML = conditionsList.map((c,i) =>
    `<div class="memo-condition">${i+1}. ${c}</div>`
  ).join('');
}

// ── HEATMAP ───────────────────────────────────────────────────────
function buildHeatmap() {
  const el = document.getElementById('heatmap');
  if (!el) return;
  const indicators = [
    {name:'Liq. Corrente',val:1.45,min:1,max:2,status:'warn'},
    {name:'EBITDA Mg.',val:0.176,min:0,max:0.3,status:'warn'},
    {name:'Leverage',val:2.27,min:0,max:4,status:'good',inv:true},
    {name:'DSCR',val:1.50,min:1,max:2,status:'good'},
    {name:'ROE',val:0.225,min:0,max:0.3,status:'good'},
    {name:'PMR (d)',val:86.8,min:0,max:120,status:'good',inv:true},
    {name:'PD',val:0.032,min:0,max:0.1,status:'good',inv:true},
    {name:'LTV',val:0.72,min:0,max:1,status:'warn',inv:true},
    {name:'Autom.Fin.',val:0.344,min:0,max:0.5,status:'warn'},
    {name:'ICR',val:3.91,min:0,max:5,status:'good'},
    {name:'Mg.Bruta',val:0.375,min:0,max:0.5,status:'good'},
    {name:'Ciclo Cx.',val:85.6,min:0,max:120,status:'good',inv:true},
  ];
  const colors = {good:'rgba(16,185,129,.4)',warn:'rgba(245,158,11,.4)',bad:'rgba(239,68,68,.4)'};
  el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">` +
    indicators.map(i => {
      const norm = (i.val - i.min) / (i.max - i.min);
      const pct = Math.round((i.inv ? 1 - norm : norm) * 100);
      return `<div style="background:${colors[i.status]};border-radius:6px;padding:8px;text-align:center;border:1px solid rgba(255,255,255,.1)">
        <div style="font-size:9px;color:var(--text3);margin-bottom:3px">${i.name}</div>
        <div style="font-size:12px;font-weight:700;color:var(--text)">${typeof i.val === 'number' && i.val < 1 && i.name.includes('Mg') ? (i.val*100).toFixed(1)+'%' : i.val}</div>
        <div style="height:3px;background:rgba(255,255,255,.1);border-radius:2px;margin-top:4px"><div style="height:100%;width:${pct}%;background:${i.status==='good'?'var(--green2)':i.status==='warn'?'var(--amber2)':'var(--red2)'}"></div></div>
      </div>`;
    }).join('') + '</div>';
}

// ── CONCENTRATION BAR ─────────────────────────────────────────────
function buildConcBar() {
  const el = document.getElementById('concBar');
  const leg = document.getElementById('concLegend');
  if (!el) return;
  const sectors = [
    {name:'Comércio',pct:28.2,color:'#2563eb'},
    {name:'Petróleo',pct:20.9,color:'#d97706'},
    {name:'Construção',pct:17.0,color:'#7c3aed'},
    {name:'Indústria',pct:13.9,color:'#059669'},
    {name:'Outros',pct:19.9,color:'#6b7280'},
  ];
  el.innerHTML = sectors.map(s =>
    `<div class="conc-seg" style="flex:${s.pct};background:${s.color}" title="${s.name}: ${s.pct}%">${s.pct > 8 ? s.pct.toFixed(1)+'%' : ''}</div>`
  ).join('');
  leg.innerHTML = sectors.map(s =>
    `<div class="radar-item"><div class="radar-dot" style="background:${s.color}"></div>${s.name} ${s.pct.toFixed(1)}%</div>`
  ).join('');
}

// ── CHARTS ────────────────────────────────────────────────────────
function buildCharts() {
  const dark = 'rgba(255,255,255,0.07)';
  const textColor = '#8fa3c0';

  // RADAR
  const radarCtx = document.getElementById('radarChart');
  if (radarCtx && !state.charts.radar) {
    state.charts.radar = new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: ['Liquidez','Rentabilidade','Endividamento','Cobertura','Garantias','Gestão'],
        datasets: [{
          label: 'Empresa',
          data: [58, 72, 68, 75, 65, 78],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245,158,11,.15)',
          borderWidth: 2,
          pointBackgroundColor: '#f59e0b',
          pointRadius: 4,
        },{
          label: 'Benchmark Sector',
          data: [70,68,70,70,70,70],
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37,99,235,.08)',
          borderWidth: 1.5,
          borderDash: [4,4],
          pointBackgroundColor: '#2563eb',
          pointRadius: 3,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {legend:{labels:{color:textColor,font:{size:10}}}},
        scales: {
          r: {
            min: 0, max: 100,
            grid: {color:dark},
            ticks: {color:textColor,backdropColor:'transparent',font:{size:9},stepSize:25},
            pointLabels: {color:textColor,font:{size:10}},
          }
        }
      }
    });
  }

  // TREND
  const trendCtx = document.getElementById('trendChart');
  if (trendCtx && !state.charts.trend) {
    state.charts.trend = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: ['2022','2023','2024'],
        datasets: [{
          label: 'Vendas (AOA M)',
          data: [6800,8120,9840],
          borderColor:'#2563eb',
          backgroundColor:'rgba(37,99,235,.1)',
          fill: true, tension: 0.4, yAxisID:'y',
        },{
          label: 'EBITDA (AOA M)',
          data: [1050,1740,1730],
          borderColor:'#d4a017',
          backgroundColor:'rgba(212,160,23,.1)',
          fill: true, tension: 0.4, yAxisID:'y',
        },{
          label: 'Mg EBITDA %',
          data: [15.4,21.4,17.6],
          borderColor:'#10b981',
          backgroundColor:'transparent',
          borderDash:[4,4], tension:0.4, yAxisID:'y2',
          pointRadius:4, pointBackgroundColor:'#10b981',
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {legend:{labels:{color:textColor,font:{size:10}}}},
        scales: {
          x: {grid:{color:dark},ticks:{color:textColor,font:{size:10}}},
          y: {grid:{color:dark},ticks:{color:textColor,font:{size:10}},position:'left'},
          y2: {grid:{drawOnChartArea:false},ticks:{color:'#10b981',font:{size:10}},position:'right'},
        }
      }
    });
  }

  // CAPITAL STRUCTURE
  const capCtx = document.getElementById('capitalChart');
  if (capCtx && !state.charts.cap) {
    state.charts.cap = new Chart(capCtx, {
      type: 'doughnut',
      data: {
        labels: ['Capital Próprio (34,4%)','Passivo LP (30,3%)','Passivo CP (35,4%)'],
        datasets: [{
          data: [3700,3260,3810],
          backgroundColor:['#10b981','#2563eb','#f59e0b'],
          borderColor:'#111827',
          borderWidth: 3,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend:{position:'bottom',labels:{color:textColor,font:{size:9},boxWidth:12,padding:8}}
        }
      }
    });
  }
}

// ── FX CHART ──────────────────────────────────────────────────────
function buildFXChart() {
  const ctx = document.getElementById('fxChart');
  if (!ctx || state.charts.fx) return;
  const dark = 'rgba(255,255,255,0.07)';
  const textColor = '#8fa3c0';
  state.charts.fx = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan 22','Jul 22','Jan 23','Jul 23','Jan 24','Jun 24','Dez 24 (proj.)','Jun 25 (proj.)'],
      datasets: [{
        label: 'USD/AOA Actual',
        data: [415,460,510,580,750,920,null,null],
        borderColor:'#f59e0b',borderWidth:2,fill:false,tension:0.4,
        pointBackgroundColor:'#f59e0b',pointRadius:4,
      },{
        label: 'Projecção Base (BNA)',
        data: [null,null,null,null,null,920,980,1050],
        borderColor:'#2563eb',borderWidth:1.5,borderDash:[6,3],fill:false,tension:0.4,
        pointBackgroundColor:'#2563eb',pointRadius:3,
      },{
        label: 'Cenário Adverso',
        data: [null,null,null,null,null,920,1100,1250],
        borderColor:'#ef4444',borderWidth:1,borderDash:[3,3],fill:false,tension:0.4,
        pointBackgroundColor:'#ef4444',pointRadius:3,
      }]
    },
    options: {
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{labels:{color:textColor,font:{size:10}}}},
      scales:{
        x:{grid:{color:dark},ticks:{color:textColor,font:{size:9}}},
        y:{grid:{color:dark},ticks:{color:textColor,font:{size:10}},title:{display:true,text:'AOA por USD',color:textColor,font:{size:10}}},
      }
    }
  });
}

// ── EXPORT ────────────────────────────────────────────────────────
function exportExcel() {
  const data = [
    ['SICCA — Relatório de Análise de Crédito'],
    [''],
    ['DADOS DA EMPRESA'],
    ['Empresa',state.empresa],
    ['Score de Crédito',state.score + '/100'],
    ['Rating',state.rating],
    [''],
    ['RÁCIOS FINANCEIROS'],
    ['Indicador','Valor','Benchmark','Status'],
    ['Liquidez Corrente','1,45x','> 1,60x','Atenção'],
    ['Leverage','2,27x','< 3,50x','OK'],
    ['DSCR','1,50x','> 1,25x','OK'],
    ['Margem EBITDA','17,6%','> 21%','Atenção'],
    [''],
    ['IFRS 9 — ECL'],
    ['Stage','1 — Performing'],
    ['ECL 12M','AOA 60,5 Mio'],
    ['ECL Ponderado','AOA 75 Mio'],
    [''],
    ['DECISÃO','APROVADO COM CONDIÇÕES'],
    ['Limite Aprovado','AOA 3.800 Mio'],
  ];
  let csv = data.map(r => r.join(';')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'SICCA_Analise_Credito.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ── INIT ──────────────────────────────────────────────────────────
setInitialFormState();
setTimeout(() => {
  runAnalysis();
  buildCharts();
  buildFXChart();
}, 500);
