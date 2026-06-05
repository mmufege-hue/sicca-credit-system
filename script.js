// ── STATE ──────────────────────────────────────────────────────────
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
  charts: {}
};

// ── NAV ───────────────────────────────────────────────────────────
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
  state.analysed = true;
  document.getElementById('d-empresa-name').textContent = emp;
  document.getElementById('d-limite').textContent = 'AOA ' + Math.round(montante * 0.84) + ' Mio';
  document.getElementById('d-prazo-text').textContent = prazo + ' meses · ' + getFinalidade();
  document.getElementById('demo-alert').style.display = 'block';
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

function buildRatioTables() {
  ['liquidez','endividamento','rentabilidade','eficiencia'].forEach(k => {
    const el = document.getElementById('tbl-' + k);
    if (!el) return;
    el.innerHTML = ratios[k].map(r =>
      `<tr><td>${r.name}</td><td style="color:var(--text3);font-size:10px;font-family:monospace">${r.formula}</td><td style="font-weight:600">${r.val}</td><td style="color:var(--text3)">${r.bench}</td><td>${statusBadge(r.status)}</td></tr>`
    ).join('');
  });
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
        <div style="height:3px;background:rgba(255,255,255,.1);border-radius:2px;margin-top:4px"><div style="height:100%;width:${pct}%;background:${i.status==='good'?'var(--green2)':i.status==='warn'?'var(--amber2)':'var(--red2)'};border-radius:2px"></div></div>
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
// Auto-run demo
setTimeout(() => {
  runAnalysis();
  buildCharts();
  buildFXChart();
}, 500);
