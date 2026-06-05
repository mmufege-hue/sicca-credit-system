## 🚀 SICCA — Quick Start Guide

### ⚡ 5 Passos para Começar

#### 1. **Abra o Sistema**
```bash
# Opção A: Abrir ficheiro directamente
open index.html

# Opção B: Servidor HTTP local
python3 -m http.server 8000
# Aceda a: http://localhost:8000
```

#### 2. **Dados Demo Carregados**
Ao abrir, verá já preenchidos:
- **Empresa**: Sonangro Distribuidora, S.A.
- **Montante**: AOA 4.500 Mio
- **Prazo**: 60 meses
- **Sector**: Comércio / Distribuição

#### 3. **Clique "INICIAR ANÁLISE AUTOMÁTICA COMPLETA"**
Isto dispara:
- ✅ Cálculo de 20+ rácios financeiros
- ✅ Geração de rating (BBB)
- ✅ Cálculo de ECL IFRS 9
- ✅ População de todos os gráficos
- ✅ Preenchimento de tabelas

#### 4. **Navegue pelas 10 Abas**
```
📁 Instrução        → Modificar dados
📊 Dashboard        → KPIs + gráficos
📈 Análise Financeira → Rácios detalhados
⚠️ Risco & Rating    → Score e PD/LGD/EAD
🏛 IFRS 9 / ECL      → Stages e sensibilidade
🔒 Garantias        → Pacote de garantias
💱 Análise Cambial   → USD/AOA sensibilidade
🗂 Concentração     → Limites de grupo/sector
🏦 Comité           → Matriz de delegação
📋 Memorando        → Documento completo
```

#### 5. **Exportar Resultados**
- 🖨️ **Imprimir** → Salvar como PDF (Ctrl+P)
- 📊 **Exportar Excel** → Download CSV

---

### 🎮 Exemplos de Uso

#### **Cenário 1: Testar com Empresa Diferente**
1. Mude nome empresa em "Dados da Empresa"
2. Mude montante (ex: AOA 1.000 Mio)
3. Clique "INICIAR ANÁLISE"
4. Veja como mudam o limite aprovado e KPIs

#### **Cenário 2: Simular Votação do Comité**
1. Vá à aba 🏦 **Comité**
2. Clique em um dos botões:
   - ✅ Aprovar
   - ⚠️ Condicional (padrão)
   - 🔴 Rejeitar
3. Veja os votos dos 5 membros do CA

#### **Cenário 3: Analisar Risco Cambial**
1. Vá à aba 💱 **Análise Cambial**
2. Veja a tabela de sensibilidade (Apreciação/Base/Depreciação 15%/30%)
3. Note como DSCR cai para 0,70x em stress cambial

---

### 📊 Estrutura de Dados

#### **Dados de Entrada** (`form-input`)
```
id="f-empresa"      → Nome da empresa
id="f-nif"         → NIF Angola
id="f-sector"      → Sector dropdown
id="f-grupo"       → Grupo económico
id="f-montante"    → AOA Mio (número)
id="f-moeda"       → Moeda dropdown
id="f-prazo"       → Meses (número)
id="f-finalidade"  → Tipo de crédito
```

#### **Cálculos Automáticos**
```javascript
state = {
  empresa: "...",
  analysed: true,
  score: 67,        // 0-100
  rating: "BBB",    // AAA-D
  pd: 3.2,          // % 12M
  lgd: 42,          // %
  ead: 4500,        // AOA Mio
  dscr: 1.50,       // ratio
  ecl: 60.5,        // AOA Mio
  charts: {}        // Chart.js instances
}
```

---

### 🎨 Cores & Indicadores

| Indicador | Cor | Significado |
|-----------|-----|------------|
| ✅ Tag Verde | `tag-green` | OK / Favorável |
| ⚠️ Tag Amber | `tag-amber` | Atenção / Moderado |
| 🔴 Tag Vermelho | `tag-red` | Alerta / Crítico |
| 🔵 Tag Azul | `tag-blue` | Info / Neutro |

#### **Status de KPI**
- `.good` → Verde (#10b981)
- `.warn` → Amber (#f59e0b)
- `.bad` → Vermelho (#ef4444)
- `.info` → Azul (#60a5fa)
- `.purple` → Roxo (#8b5cf6)

---

### 📌 Botões Principais

| Botão | Localização | Acção |
|-------|-------------|------|
| ⚡ INICIAR ANÁLISE | Instrução | Executa `runAnalysis()` |
| 🖨️ Imprimir | Dashboard/Memorando | `window.print()` |
| 📊 Exportar Excel | Dashboard/Memorando | Download CSV |
| 📋 Memorando | Dashboard | Navega para aba 10 |
| ✅ Aprovar | Comité | `simulateVote('approve')` |
| ⚠️ Condicional | Comité | `simulateVote('conditional')` |
| 🔴 Rejeitar | Comité | `simulateVote('reject')` |

---

### 🔍 Elementos Dinâmicos

#### **Tabelas Geradas**
```javascript
buildRatioTables()        // Preenche 4 tabelas de rácios
buildComplianceChecks()   // 8 checks de compliance
buildVotingSimulation()   // Votação do comité
buildMemoConditions()     // 10 condições
```

#### **Gráficos Chart.js**
```javascript
buildCharts()    // Radar + Line + Doughnut
buildFXChart()   // USD/AOA histórico
buildWaterfall() // Cascata P&L
buildHeatmap()   // 12 indicadores
buildConcBar()   // Concentração sectorial
```

---

### 💾 Ficheiros

```
index.html          1.303 linhas
├── <head>           Meta, CSS (400 regras)
├── <topbar>         Navegação 10 abas
├── <section>s       10 secções com divs
├── <script>         Inline do script.js

script.js           522 linhas
├── state            Global state object
├── showSection()    Navegação
├── runAnalysis()    Dispara cálculos
├── build*()         Funções de geração
├── Chart.js init    4 gráficos
└── exportExcel()    Download CSV
```

---

### ⚙️ Funções Principais

```javascript
// Navegação
showSection(id)          // Mostra secção id, esconde outras

// Análise
runAnalysis()            // Dispara toda a análise
buildRatioTables()       // Popula 4 tabelas de rácios
buildScoreBreakdown()    // Score em 5 pilares

// Gráficos
buildCharts()            // Radar, Line, Doughnut
buildFXChart()           // USD/AOA
buildHeatmap()           // 12 indicadores
buildConcBar()           // Sectores

// Utilidades
dragOver(e)              // Drag & drop
dropFile(e)              // Ficheiro solto
simulateVote(type)       // Simula votação
exportExcel()            // Download CSV
```

---

### 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| Gráficos não aparecem | Abra dev tools (F12), verifique console |
| Chart.js não carregou | Verifique CDN em `<head>` |
| Estilos CSS estranhos | Limpe cache (Ctrl+Shift+R) |
| Dados não atualizam | Clique "INICIAR ANÁLISE" novamente |
| Print com formatação estranha | Use Ctrl+P e seleccione "Background graphics" |

---

### 📞 Suporte

Para dúvidas sobre:
- **Conformidade**: Ver abas 🏛 IFRS 9 e 🗂 Concentração
- **Metodologia**: Ler README.md e IMPLEMENTACAO.md
- **Cálculos**: Inspecionar `script.js` com DevTools
- **Design**: Consultar `<style>` em `index.html`

---

### 🎓 Leitura Recomendada

1. [README.md](README.md) — Visão geral completa
2. [IMPLEMENTACAO.md](IMPLEMENTACAO.md) — Detalhe técnico
3. Abas em ordem: Instrução → Dashboard → ... → Memorando

---

**Versão**: 4.2
**Última actualização**: Junho 2024
**Status**: ✅ Pronto para Produção
