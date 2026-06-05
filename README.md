# SICCA — Sistema Inteligente de Crédito Corporativo Angola

Uma plataforma completa de análise e decisão de crédito bancário, desenvolvida para avaliar operações corporativas com conformidade total com regulamentos de Angola (BNA), IFRS 9 e Basileia III.

## 🎯 Funcionalidades Principais

### 1. **Instrução (Upload de Documentos)**
- Carregamento de documentos financeiros (XLSX, CSV, PDF, DOCX, TXT)
- Gestão de dados da empresa: NIF, sector, grupo económico, montante, moeda, prazo
- Automação de análise em um clique

### 2. **Dashboard Executivo**
- **Decision Banner**: Aprovação/Rejeição/Condicional com decisão clara
- **KPIs de Risco**: Score, Rating, PD, ECL, Delegação de Poderes
- **Visualizações Dinâmicas**:
  - Radar de risco (Liquidez, Rentabilidade, Endividamento, etc.)
  - Tendência financeira de 3 anos (Vendas, EBITDA, Margem)
  - Estrutura de capital (Doughnut Chart)
  - Semáforo de crédito com 6 indicadores
  - Heatmap de 12 indicadores financeiros

### 3. **Análise Financeira Automática**
- **20+ Rácios Calculados**:
  - Liquidez: Corrente, Reduzida, Imediata, NFM, Ciclo de Caixa
  - Endividamento: Autonomia, Debt Ratio, Leverage, Debt/Equity, ICR
  - Rentabilidade: Margens, ROA, ROE, DSCR
  - Eficiência: PMR, PMP, PMS, Ciclo Operacional, LTV
- **Benchmarks Sectoriais**: Comparação com padrões de Angola por sector
- **Waterfall de Demonstração de Resultados**: Visualização cascata de Vendas a Resultado Líquido

### 4. **Risco & Rating Interno**
- **Modelo de Scoring de 5 Pilares**:
  - Risco Financeiro (40%)
  - Risco de Negócio (20%)
  - Gestão (15%)
  - Garantias (15%)
  - Histórico Bancário (10%)
- **Rating BBB a D**: Escala Moody's/S&P adaptada a Angola
- **PD/LGD/EAD**: Componentes de risco de crédito
- **Compliance Checks**: PEP, Sanções, KYC, IFRS 9, Basileia III

### 5. **IFRS 9 — Expected Credit Loss (ECL)**
- **3 Stages de Classificação**:
  - Stage 1 (Performing): ECL 12 meses
  - Stage 2 (Under-performing): ECL Lifetime
  - Stage 3 (Non-performing): Imparidade 100%
- **Gatilhos SICR**: Deterioração Significativa do Risco de Crédito
- **Cenários Macroeconómicos**: Optimista, Base, Adverso (ponderação 25/50/25)
- **Sensibilidade**: Impacto de choque PIB/USD/AOA

### 6. **Garantias**
- **Pacote de Garantias**: Hipoteca, Penhor, Cessão, Aval Pessoal
- **Métricas de Cobertura**: LTV, Cobertura de Garantias, Clasificação
- **Detalhamento de Hipoteca**: Localização, Avaliação, Ónus, Seguro, Liquidez

### 7. **Análise Cambial USD/AOA**
- **Exposição Cambial**: % de receitas vs custos em USD
- **Sensibilidade ao Câmbio**: Impacto de apreciação/depreciação no EBITDA e DSCR
- **Instrumentos de Mitigação**: Forward, Natural Hedge, Pricing USD, Conta USD
- **Histórico e Projecções BNA**: Gráfico com dados reais e projecções

### 8. **Concentração de Risco**
- **Limite por Grupo (BNA)**: 25% dos Fundos Próprios
- **Concentração Sectorial**: Distribuição da carteira por sector
- **Matriz Regulatória**: Conformidade com Aviso BNA 02/2019
- **Barra de Concentração**: Visualização dos sectores principais

### 9. **Comité de Crédito — Delegação de Poderes**
- **Matriz de Delegação**: 4 Níveis de Aprovação:
  - Nível 1: Analista Sénior (AOA 500M)
  - Nível 2A: Comité Balcão (AOA 1.500M)
  - Nível 2B: Comité Divisional (AOA 3.000M)
  - Nível 3: Conselho de Administração (AOA 8.000M+)
- **Simulação de Votação**: Membros do CA e seus votos
- **Condições de Aprovação**: Lista de 10 condições propostas

### 10. **Memorando de Crédito**
- **Documento Oficial**: Pronto para submissão ao Comité
- **Secções Completas**:
  1. Identificação e Enquadramento
  2. Análise Económico-Financeira
  3. Risco de Crédito — Rating e Score
  4. IFRS 9 — Stages e ECL
  5. Garantias e Cobertura
  6. Análise Cambial e Concentração
  7. Principais Riscos Identificados
  8. Recomendação e Decisão
  9. Condições de Aprovação
- **Assinaturas**: Campos para Analista Sénior, CRO, Presidente CA
- **Exportação**: PDF (print) e Excel

## 📊 Dados Demo

A plataforma vem carregada com um exemplo completo:
- **Empresa**: SONANGRO DISTRIBUIDORA, S.A.
- **NIF**: 5000187654
- **Sector**: Comércio / Distribuição
- **Grupo**: Grupo Atlântico Angola
- **Montante Solicitado**: AOA 4.500 Mio
- **Prazo**: 60 meses
- **Decisão**: APROVADO COM CONDIÇÕES (AOA 3.800 Mio)

## 🔧 Tecnologia

- **Frontend**: HTML5 + CSS3 + JavaScript Vanilla
- **Charts**: Chart.js 4.4.1 (Radar, Line, Doughnut, etc.)
- **Responsividade**: Design Dark Mode otimizado para desktop
- **Conformidade**: IFRS 9, BNA, Basileia III

## 📋 Como Usar

1. **Aceda à página inicial** (`index.html`)
2. **Abra a aba "Instrução"** e preencha os dados da empresa
3. **Clique "INICIAR ANÁLISE AUTOMÁTICA COMPLETA"**
4. **Navegue pelas 10 abas** para consultar resultados:
   - Dashboard
   - Análise Financeira
   - Risco & Rating
   - IFRS 9 / ECL
   - Garantias
   - Análise Cambial
   - Concentração
   - Comité
   - Memorando

## 📥 Funcionalidades Extras

- **Impressão PDF**: Botão "Imprimir" para imprimir dashboard/memorando
- **Exportação Excel**: Exporta tabelas para análise adicional
- **Modificação de Dados**: Altere empresa, montante, prazo e re-execute análise
- **Simulação de Votação**: Teste diferentes cenários de votação no Comité

## 🎨 Design

- **Paleta de Cores**: Azul (#2563eb), Amber (#f59e0b), Verde (#10b981), Vermelho (#ef4444)
- **Modo Escuro**: Fundo preto (#0a0e1a) com texto claro
- **Ícones**: Emojis para fácil identificação (📊, ⚠️, 🔒, 💱, etc.)
- **Tipografia**: Segoe UI / System Font stack
- **Spacing**: Grid responsivo com gaps de 16px

## 📝 Documentos Inclusos

- `index.html`: Estrutura HTML completa com 10 secções
- `script.js`: Lógica JavaScript com 2.000+ linhas
- `README.md`: Este ficheiro

## 🚀 Próximos Passos

Possíveis melhorias:
- Backend com base de dados (MongoDB/PostgreSQL)
- Autenticação de utilizadores
- Integração com APIs de cotação cambial
- Machine Learning para previsão de PD
- Integração com sistemas BNA
- Relatórios agendados
- Workflow de aprovação automático

## ⚖️ Conformidade Regulatória

✅ **BNA Aviso 02/2019**: Limite por grupo (25% FP)
✅ **IFRS 9**: 3 Stages ECL com SICR
✅ **Basileia III**: RWA e capital adequacy
✅ **AML/KYC**: Compliance checks PEP/Sanções

---

**Desenvolvido para**: Banco Comercial Angola · SICCA v4.2
**Última atualização**: Junho 2024
SICCA - Intelligent Corporate Credit System for Angola - IFRS 9, Basileia III, BNA Compliance
