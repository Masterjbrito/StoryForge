# StoryForge - Especificacao Funcional

**Versao:** 1.2.0
**Data:** 2026-02-10
**Classificacao:** Confidencial - Uso Interno
**Autor:** Arquitectura de Sistema
**Fonte de Verdade UI:** Figma (imutavel)
**Plataforma Alvo:** Banca Portuguesa (Enterprise)

---

## Controlo de Versoes

| Versao | Data       | Tipo  | Descricao                                          |
|--------|------------|-------|-----------------------------------------------------|
| 1.2.0  | 2026-02-10 | MINOR | Politica obrigatoria de atualizacao documental + screenshots dos 8 ecras |
| 1.1.0  | 2026-02-10 | MINOR | Especificacao operacional dos 9 agentes + prompt pack Foundry |
| 1.0.0  | 2026-02-10 | MAJOR | Versao inicial - documentacao de todos os ecras     |

### Politica de Versionamento

- **MAJOR (X.0.0):** Novo ecra adicionado, alteracao estrutural do fluxo, novo modulo funcional
- **MINOR (1.X.0):** Nova funcionalidade dentro de ecra existente, novo campo, nova accao de utilizador
- **PATCH (1.0.X):** Correccao de descricao, clarificacao de regra, actualizacao de referencia

### Politica Operacional de Documentacao (Obrigatoria)

Regra operacional do projeto:

1. Qualquer alteracao funcional, tecnica ou de integracao deve atualizar este documento na mesma iteracao.
2. Nenhum ficheiro documental existente deve ser apagado sem snapshot previo em `docs/history/<timestamp>/`.
3. O estado atual deve manter-se em:
   - `docs/FUNCTIONAL_SPECIFICATION.md`
   - `docs/FUNCTIONAL_SPECIFICATION.html`
   - `docs/FUNCTIONAL_SPECIFICATION.pdf`
4. O historico deve ser acumulativo e indexado em `docs/history/HISTORY_INDEX.md`.
5. Sempre que relevante, devem ser incluidos screenshots atualizados dos ecras para facilitar interpretacao.

---

## 1. Visao Geral da Plataforma

### 1.1 Proposito

StoryForge e uma plataforma enterprise para criacao estruturada de artefactos de requisitos (Epics, Features, User Stories, Tasks, Test Cases) com foco no sector bancario portugues. Utiliza agentes de IA como copiloto para gerar, validar e exportar artefactos prontos para publicacao em Jira Cloud e Azure DevOps.

### 1.2 O que StoryForge NAO faz

- NAO gere sprints
- NAO gere execucao de trabalho
- NAO replica Jira ou Azure DevOps
- NAO e uma ferramenta de gestao de projecto

### 1.3 Arquitectura de Ecras

```
StoryForge
|
+-- Layout Global
|   +-- Sidebar (navegacao principal)
|   +-- Topbar (accoes globais, notificacoes, perfil)
|
+-- Ecras Principais
|   +-- Dashboard (visao geral)
|   +-- Novo Projeto (wizard 6 etapas)
|   +-- Project Builder (IA Assistant - questionario)
|   +-- Project View (visualizacao hierarquica)
|
+-- Recursos
|   +-- Templates (biblioteca de templates)
|   +-- Biblioteca (componentes reutilizaveis)
|
+-- Administracao
|   +-- Integracoes (Jira, Azure DevOps)
|   +-- Auditoria & Logs (compliance)
```

### 1.4 Modelo de Agentes

Todos os processos de IA sao executados por agentes desacoplados. O sistema e vendor-agnostic (Foundry como default, substituivel por Claude sub-agents, OpenAI agents, LangGraph ou orquestrador proprio).

Agentes conceptuais mapeados:

| Agente                        | Ecra(s) onde actua                    |
|-------------------------------|---------------------------------------|
| Context Ingestor Agent        | Novo Projeto (Steps 1-6)             |
| Questionnaire / Discovery Agent | Project Builder (conversacao)      |
| Requirements Generator Agent | Project Builder (painel direito)      |
| Acceptance Criteria Agent    | Project Builder, Project View         |
| Test Design Agent            | Project Builder, Project View         |
| Quality Gate / Linter Agent  | Project Builder (indicadores)         |
| Versioning & Diff Agent      | Project View (historico)              |
| Export Agent                 | Dashboard, Project View, Integracoes  |
| Audit & Logging Agent        | Auditoria & Logs (transversal)        |

---

## 2. Componentes de Layout

### 2.1 Sidebar

**Ficheiro:** `src/app/components/layout/sidebar.tsx`

**Estrutura de Navegacao:**

| Seccao        | Item              | View Target      | Icone            |
|---------------|-------------------|-------------------|------------------|
| Principal     | Dashboard         | `dashboard`       | LayoutDashboard  |
| Recursos      | Templates         | `templates`       | FileStack        |
| Recursos      | Biblioteca        | `library`         | Library          |
| Administracao | Integracoes       | `integrations`    | Link2            |
| Administracao | Auditoria & Logs  | `audit`           | FileSearch       |

**Funcionalidades:**
- Navegacao entre ecras via click
- Indicador visual do ecra activo (fundo escuro)
- Indicador PSD2 Compliant no rodape
- Largura fixa: 264px
- Branding StoryForge no topo

**Notas:**
- Os ecras `new-project`, `project-builder` e `project-view` NAO aparecem na sidebar - sao acedidos por accoes contextuais
- O estado `currentView` e gerido no `App.tsx` via `useState`

### 2.2 Topbar

**Ficheiro:** `src/app/components/layout/topbar.tsx`

**Funcionalidades:**

| Elemento               | Accao                                              |
|------------------------|-----------------------------------------------------|
| Workspace Badge        | Exibe organizacao activa ("Ageas Portugal")         |
| Pesquisa Global        | Campo de pesquisa para projectos e artefactos       |
| Botao "Novo Projeto"   | Navega para ecra `new-project`                      |
| Notificacoes (sino)    | Dropdown com lista de notificacoes                  |
| Perfil do Utilizador   | Dropdown com opcoes de conta                        |

**Sistema de Notificacoes:**
- Tipos: `success`, `warning`, `info`
- Badge numerica com contagem de nao-lidas
- Accoes: Marcar como lida, Eliminar individual, Marcar todas como lidas, Limpar todas
- Cada notificacao inclui: titulo, mensagem, timestamp relativo, projecto associado (opcional)
- Indicador visual de nao-lida (ponto azul)

**Menu de Utilizador:**
- Conta Verificada (estado)
- Configuracoes de Seguranca
- Configuracoes de Conta
- Sair

---

## 3. Ecra: Dashboard

**Ficheiro:** `src/app/components/pages/dashboard.tsx`
**Rota interna:** `dashboard`
**Agentes envolvidos:** Export Agent (accoes), Audit & Logging Agent (actividade recente)

### 3.1 Proposito

Visao geral consolidada de todos os projectos publicados, metricas de qualidade, compliance e actividade recente. Ponto de entrada principal da plataforma.

### 3.2 Seccoes e Funcionalidades

#### 3.2.1 KPIs Principais (Grid 4 colunas)

| KPI                   | Valor Fonte                        | Indicador         |
|-----------------------|------------------------------------|--------------------|
| Projectos Publicados  | Contagem de projectos              | Tendencia (+N)     |
| Artefactos Criados    | Soma de EP+FT+US+TSK+TC           | Tendencia (+N)     |
| Qualidade Media       | Media de `qualityScore` dos proj.  | Percentagem        |
| Compliance            | Projectos conformes                | Percentagem 100%   |

#### 3.2.2 Estatisticas Secundarias (Grid 3 colunas)

| Card                     | Conteudo                                              |
|--------------------------|--------------------------------------------------------|
| Top Compliance Tags      | Barras de progresso por tag (PSD2, GDPR, etc.)        |
| Distribuicao por Tipo    | Barras por tipo (Mobile, Web, Core, API, Backoffice)  |
| Actividade Recente       | Lista cronologica de ultimas accoes                   |

#### 3.2.3 Tabela de Projectos Publicados

**Filtros disponiveis:**
- Pesquisa por nome ou codigo (texto livre)
- Tipo de Projecto (select: Mobile Banking, Web Banking, Core Banking, APIs/Open Banking, Backoffice)
- Plataforma (select: Jira Cloud, Azure DevOps)
- Departamento (select: dinamico baseado nos projectos)

**Colunas da tabela:**

| Coluna           | Conteudo                                              |
|------------------|--------------------------------------------------------|
| Projecto         | Nome + Codigo interno (font-mono)                     |
| Departamento     | Texto                                                  |
| Tipo             | Badge                                                  |
| Plataforma       | Texto                                                  |
| Artefactos       | Badges com contagem (EP, FT, US)                      |
| Qualidade        | Barra de progresso + percentagem colorida              |
| Compliance       | Badges verdes (max 2 visiveis + "+N")                 |
| Ultima Exportacao| Data formatada PT-PT + nome do ultimo editor          |
| Status           | Badge "Publicado" ou "Rascunho"                       |
| Accoes           | Menu dropdown (3 pontos)                               |

**Accoes por projecto (dropdown):**
- Ver Estrutura Completa (navega para `project-view`)
- Historico de Versoes
- Abrir em [Plataforma] (link externo)
- Exportar Novamente
- Duplicar Projecto

**Paginacao:** Presente mas estatica (sem logica backend implementada)

**Accao global:** Exportar CSV (botao no cabecalho da tabela)

### 3.3 Dados Mock

6 projectos de demonstracao com dados realistas de banca portuguesa:
- MBWAY-2024 (Digital Payments)
- HBEMP-2024 (Corporate Banking)
- MOBPART-2024 (Retail Banking)
- MBATM-2024 (Channels & Payments)
- OPENAPI-2024 (Open Banking)
- BACKOPS-2024 (Operations)

---

## 4. Ecra: Novo Projeto

**Ficheiro:** `src/app/components/pages/new-project.tsx`
**Rota interna:** `new-project`
**Agentes envolvidos:** Context Ingestor Agent (todas as etapas)

### 4.1 Proposito

Wizard de 6 etapas para configuracao completa de um novo projecto. Recolhe toda a informacao necessaria antes de iniciar a sessao com o IA Assistant.

### 4.2 Navegacao do Wizard

- Botao "Voltar ao Dashboard" (topo)
- Stepper visual com 6 etapas (icones + estado: pendente/actual/completo)
- Botoes "Anterior" e "Proximo" no rodape
- Ultimo passo: "Iniciar IA Assistant" (navega para `project-builder`)

### 4.3 Etapas Detalhadas

#### Etapa 1: Identidade do Projeto

| Campo                | Tipo             | Obrigatorio | Notas                              |
|----------------------|------------------|-------------|-------------------------------------|
| Nome do Projecto     | Input texto      | Sim         | Ex: "Sistema de Pagamentos MB Way" |
| Codigo Interno       | Input texto      | Sim         | Auto-uppercase. Ex: "MBWAY-2024"   |
| Departamento / Area  | Input texto      | Sim         | Area responsavel dentro do banco    |
| Tipo de Projecto     | Multi-select     | Sim         | Mobile, Web, Backoffice, APIs       |
| Canal                | Single-select    | Sim         | Particulares, Empresas, Corporate, Interno |
| Plataforma Alvo      | Single-select    | Sim         | Jira Cloud, Azure DevOps, Ambos     |

#### Etapa 2: Contexto Bancario

| Campo                | Tipo             | Obrigatorio | IA Assist |
|----------------------|------------------|-------------|-----------|
| Objectivo de Negocio | Textarea         | Sim         | Sim       |
| Produto Bancario     | Multi-select     | Sim         | Nao       |
| Jornada Principal    | Textarea         | Nao         | Sim       |

**Produtos Bancarios:** Contas, Cartoes, Pagamentos, Credito, Investimentos, Onboarding

**Botao "Melhorar com IA":** Presente nos campos Textarea - acciona agente para melhorar texto com contexto bancario, compliance e estrutura profissional.

#### Etapa 3: Compliance & Seguranca

| Item                  | Descricao                          |
|-----------------------|-------------------------------------|
| PSD2                  | Payment Services Directive 2        |
| SCA                   | Strong Customer Authentication      |
| GDPR                  | Proteccao de dados pessoais         |
| Banco de Portugal     | Regulamentacao nacional             |
| SIBS / MB Way         | Integracao rede nacional            |
| AML / KYC             | Anti-lavagem e conhecimento cliente |

Multi-select com checkboxes visuais. Cada item tem label + descricao.

#### Etapa 4: Sistemas & Integracoes

| Campo                | Tipo             | IA Assist |
|----------------------|------------------|-----------|
| Core Banking         | Input texto      | Nao       |
| Sistemas Internos    | Textarea         | Sim       |
| APIs Externas        | Textarea         | Sim       |

#### Etapa 5: Input Documental

| Elemento             | Tipo                              | IA Assist |
|----------------------|-----------------------------------|-----------|
| Upload de Ficheiros  | Drag & Drop (PDF, imagens, docs)  | Nao       |
| Links Externos       | Textarea (font-mono)              | Sim       |
| Notas Adicionais     | Textarea                          | Sim       |

#### Etapa 6: Configuracao IA

| Campo                    | Opcoes                                                |
|--------------------------|-------------------------------------------------------|
| Modo de Operacao         | Standard, Rigor Bancario (recomendado), Auditoria-Ready |
| Profundidade de Analise  | Normal, Alta, Maxima                                   |

Nota informativa no final: "O IA Assistant ira guia-lo atraves de 6 categorias de perguntas..."

### 4.4 Fluxo de Saida

Ao clicar "Iniciar IA Assistant" na Etapa 6:
1. `formData` e passado via `onCreate(data)` ao `App.tsx`
2. `projectData` e armazenado no estado
3. Navegacao para `project-builder`

---

## 5. Ecra: Project Builder (IA Assistant)

**Ficheiro:** `src/app/components/pages/project-builder.tsx`
**Rota interna:** `project-builder`
**Agentes envolvidos:** Questionnaire/Discovery Agent, Requirements Generator Agent, Acceptance Criteria Agent, Test Design Agent, Quality Gate/Linter Agent

### 5.1 Proposito

Interface conversacional com o IA Assistant para construcao estruturada de requisitos. O agente faz perguntas organizadas em 6 categorias e gera artefactos automaticamente a partir das respostas.

### 5.2 Layout de 3 Colunas

```
+------------------+-------------------------+------------------+
| Categorias (280px)|  Conversacao (flex-1)   | Artefactos (384px)|
|                   |                         |                  |
| - Progresso       | - Mensagens             | - Contadores     |
| - 6 categorias    | - Input                 | - Lista recentes |
| - Dica inteligente| - Sugestoes             | - Qualidade      |
+------------------+-------------------------+------------------+
```

### 5.3 Cabecalho

| Elemento                | Funcao                                      |
|-------------------------|----------------------------------------------|
| Botao "Voltar"          | Regressa ao Dashboard                        |
| Titulo                  | "IA Assistant - Estrutura de Requisitos"     |
| Subtitulo               | Nome do projecto                             |
| Badge Modo              | Modo activo (ex: "Rigor Bancario")           |
| Botao "Preview"         | Abre modal com preview da estrutura          |
| Botao "Finalizar"       | Activo so quando todas as perguntas respondidas |
| Barra de Progresso      | Percentagem geral + contagem de perguntas    |

### 5.4 Coluna Esquerda: Categorias de Analise

6 categorias com progresso individual:

| Categoria                    | Total Perguntas | Icone |
|------------------------------|-----------------|-------|
| Personas e Utilizadores      | 6               | --    |
| Jornadas de Utilizador       | 5               | --    |
| Regras de Negocio            | 5               | --    |
| Excepcoes e Casos Limite     | 4               | --    |
| Compliance e Seguranca       | 4               | --    |
| Testes e Validacao           | 4               | --    |
| **TOTAL**                    | **28**          |       |

Cada categoria exibe:
- Icone + titulo
- Estado: `pending` / `in-progress` / `completed`
- Contagem: "X/Y perguntas"
- Barra de progresso individual

**Dica Inteligente** (rodape): Texto informativo sobre como responder.

### 5.5 Coluna Central: Conversacao

**Mensagens do Assistente:**
- Avatar: icone Sparkles em fundo escuro
- Card branco com borda
- Timestamp em formato PT-PT (HH:MM)
- Badges de artefactos gerados (ex: "+2 User Stories", "+1 Feature")

**Mensagens do Utilizador:**
- Card escuro (fundo slate-900, texto branco)
- Avatar: iniciais do utilizador
- Timestamp

**Area de Input:**
- Sugestoes contextuais (botoes clicaveis que preenchem o textarea)
- Textarea com placeholder "Digite a sua resposta detalhada..."
- Botao de envio (icone Send)
- Atalhos: Enter para enviar, Shift+Enter para nova linha

**Fluxo de Conversacao:**
1. Mensagem de boas-vindas
2. Introducao da categoria actual
3. Pergunta N de M
4. Utilizador responde
5. IA confirma artefactos gerados
6. Proxima pergunta (ou proxima categoria se completa)
7. Ao completar todas: mensagem de conclusao

### 5.6 Coluna Direita: Artefactos Capturados

**Contadores (Grid 2x2):**

| Card     | Cor     | Valor Mock |
|----------|---------|------------|
| Epics    | Azul    | 3          |
| Features | Roxo    | 8          |
| User Stories | Verde | 24       |
| Test Cases | Laranja | 45       |

**Lista de Artefactos Recentes:**
- Cada artefacto mostra: ID, titulo, nivel de confianca (%), fonte
- Accoes: "Ver" (abre modal detalhado) e "Editar" (alerta placeholder)

**Indicadores de Qualidade:**

| Indicador              | Valor Mock |
|------------------------|------------|
| Cobertura de Requisitos | 85%       |
| Compliance PSD2        | 100%       |
| Test Coverage          | 72%        |

**Alerta de Compliance:** Card amarelo com aviso sobre cenarios em falta (ex: testes SCA).

### 5.7 Modal de Preview

Exibe resumo da estrutura gerada:
- Epics (lista)
- Features (lista)
- User Stories (lista com "+N more...")
- Test Cases (descricao resumida)
- Botoes: "Finalizar e Exportar" ou "Continuar a Editar"

### 5.8 Modal de Detalhe de Artefacto

Exibe detalhes completos de um artefacto:
- ID + Titulo + Icone tipo
- Descricao (formato User Story: Como/Eu quero/Para que)
- Criterios de Aceitacao (lista com checks)
- Story Points, Prioridade, Confianca IA
- Fonte (de onde foi inferido)
- Tags
- Botoes: "Editar Artefacto" ou "Fechar"

---

## 6. Ecra: Project View

**Ficheiro:** `src/app/components/pages/project-view.tsx`
**Rota interna:** `project-view`
**Agentes envolvidos:** Versioning & Diff Agent, Export Agent

### 6.1 Proposito

Visualizacao completa e hierarquica de um projecto publicado. Permite navegar pela estrutura Epic > Feature > User Story > Tasks + Test Cases.

### 6.2 Cabecalho do Projecto

| Elemento              | Conteudo                                           |
|-----------------------|----------------------------------------------------|
| Icone                 | Building2 em fundo escuro                          |
| Nome                  | Nome completo do projecto                          |
| Codigo                | Badge mono (ex: MBWAY-2024)                        |
| Versao                | Badge verde (ex: v2.1.0)                           |
| Departamento          | Texto                                              |
| Tipo                  | Badge secundario                                   |
| Descricao             | Texto descritivo do projecto                       |
| Metadados             | Data criacao, data exportacao, autor, score qualidade |

**Accoes:**
- Botao "Exportar"
- Botao "Abrir em [Plataforma]" (link externo)
- Menu dropdown: Historico de Versoes, Duplicar Projecto, Exportar Novamente

### 6.3 Barra de Estatisticas (Grid 6 colunas)

| Metrica       | Icone        | Cor    |
|---------------|--------------|--------|
| Epics         | Layers       | Azul   |
| Features      | Boxes        | Roxo   |
| User Stories  | FileText     | Verde  |
| Tasks         | CheckSquare  | Laranja|
| Test Cases    | FlaskConical | Indigo |
| Story Points  | Tag          | Rosa   |

### 6.4 Tabs de Conteudo

| Tab                    | Conteudo                                            |
|------------------------|-----------------------------------------------------|
| Estrutura Completa     | Arvore hierarquica expandivel                       |
| Visao Geral            | Lista de objectivos do projecto                     |
| Compliance             | Tags de compliance com icones                       |
| Historico Exportacoes  | Placeholder para historico de exportacoes            |

**Botao "Mostrar/Ocultar Detalhes":** Toggle global para expandir/colapsar detalhes em todos os niveis.

### 6.5 Hierarquia da Estrutura Completa

```
Epic (EP-XXX)
  |-- Valor de Negocio
  |-- Criterios de Aceitacao
  |
  +-- Feature (FT-XXX)
       |-- Descricao
       |-- Regras de Negocio
       |
       +-- User Story (US-XXX)
            |-- Como / Eu quero / Para que
            |-- Criterios de Aceitacao
            |-- Story Points, Prioridade, Labels
            |
            +-- Tasks (TSK-XXX)
            |    |-- Titulo + Descricao
            |    |-- Notas Tecnicas
            |    |-- Estimativa, Assignee, Status
            |
            +-- Test Cases (TC-XXX)
                 |-- Tipo (Functional, Security, Performance, Compliance)
                 |-- Prioridade (Critical, High, Medium)
                 |-- Pre-condicoes
                 |-- Passos (numerados)
                 |-- Resultado Esperado
                 |-- Dados de Teste
```

Cada nivel tem:
- Botao expand/collapse (chevron)
- Badge de ID (cor por tipo)
- Badge de prioridade (vermelho=High/Critical, amarelo=Medium, verde=Low)
- Badge de status

### 6.6 Dados Detalhados por Projecto

O ficheiro contem dados mock completos para 7 projectos (IDs: 999, 1-6), com o projecto ID=1 (MBWAY-2024) a conter a hierarquia mais completa:
- 3 Epics
- 2 Features (no EP-001)
- 3 User Stories (no FT-001)
- 11 Tasks detalhadas
- 8 Test Cases completos (com pre-condicoes, passos, resultado esperado, dados de teste)

---

## 7. Ecra: Templates

**Ficheiro:** `src/app/components/pages/templates.tsx`
**Rota interna:** `templates`
**Agentes envolvidos:** Context Ingestor Agent (ao usar template)

### 7.1 Proposito

Catalogo de templates pre-configurados para acelerar a criacao de projectos bancarios. Cada template contem estrutura base de Epics, Features, User Stories, Tasks e Test Cases.

### 7.2 KPIs (Grid 4 colunas)

| KPI                   | Valor                                |
|-----------------------|---------------------------------------|
| Templates Disponiveis | Contagem total                       |
| Destacados            | Contagem de featured                 |
| Vezes Utilizados      | Soma de usage de todos os templates  |
| Rating Medio          | Media de ratings                     |

### 7.3 Tabs de Navegacao

| Tab         | Logica de Ordenacao                         |
|-------------|----------------------------------------------|
| Todos       | Lista completa filtrada                      |
| Destacados  | Apenas templates com `featured: true`        |
| Mais Usados | Ordenado por `usage` (descendente)           |
| Recentes    | Ordenado por `lastUpdated` (descendente)     |

### 7.4 Filtros

- Pesquisa por nome ou descricao (texto livre)
- Categoria (select: Mobile Banking, Pagamentos, Web Banking, APIs/Open Banking, Onboarding, Cartoes, Backoffice, Core Banking)

### 7.5 Card de Template

Cada card exibe:
- Nome + icone estrela (se featured)
- Descricao (max 2 linhas)
- Categoria (badge), Rating (estrela + numero), Uso (Nx usado)
- Grid de estatisticas: Epics, Features, US, Tasks, Tests
- Tags de compliance
- Tags de funcionalidade
- Autor + Data de ultima actualizacao
- Botoes: "Preview" e "Usar Template"

**Accoes (menu dropdown):**
- Preview Completo
- Usar Template (navega para `project-builder`)
- Exportar Template (alerta com formatos: JSON, Jira XML, Azure DevOps, Excel)

### 7.6 Templates Mock (8 templates)

| Template                          | Categoria          | Stats                    | Rating |
|-----------------------------------|--------------------|--------------------------|--------|
| Mobile Banking Particulares PT    | Mobile Banking     | 8EP, 22FT, 87US         | 4.9    |
| MB Way - Sistema Completo         | Pagamentos         | 5EP, 12FT, 45US         | 5.0    |
| Homebanking Web Empresas          | Web Banking        | 10EP, 28FT, 102US       | 4.7    |
| API Open Banking PSD2             | APIs / Open Banking| 4EP, 11FT, 38US         | 4.8    |
| Onboarding Digital Completo       | Onboarding         | 6EP, 15FT, 52US         | 4.6    |
| Cartoes - Gestao e Operacoes      | Cartoes            | 7EP, 18FT, 64US         | 4.9    |
| Backoffice Operacoes Bancarias    | Backoffice         | 9EP, 24FT, 89US         | 4.5    |
| Multibanco ATM - Terminal         | Core Banking       | 5EP, 13FT, 41US         | 5.0    |

---

## 8. Ecra: Biblioteca Reutilizavel

**Ficheiro:** `src/app/components/pages/library.tsx`
**Rota interna:** `library`
**Agentes envolvidos:** Context Ingestor Agent, Requirements Generator Agent (importacao automatica)

### 8.1 Proposito

Repositorio central de componentes bancarios reutilizaveis - personas, regras de negocio, acceptance criteria e test cases validados - que podem ser importados automaticamente pelo IA Assistant ao criar novos projectos.

### 8.2 Card Explicativo

Card azul no topo com explicacao do que e a Biblioteca e como funciona:
- Acelera Criacao (reutilizacao de componentes validados)
- Garante Compliance (regras pre-aprovadas)
- Padroniza Qualidade (mesmos criterios entre projectos)
- Melhora Continuamente (versionamento)

Fluxo descrito: (1) IA sugere componentes -> (2) Utilizador aceita/adapta -> (3) Estrutura final inclui componentes validados

### 8.3 KPIs (Grid 4 colunas)

| Metrica              | Contagem |
|----------------------|----------|
| Personas             | 10       |
| Regras de Negocio    | 12       |
| Acceptance Criteria  | 3        |
| Test Cases Base      | 3        |

### 8.4 Tab: Personas

**Dialogo de Adicao:** `AddPersonaDialog` (componente separado)

Cada Persona inclui:
- Nome + Badge "Usado em N projectos"
- Descricao
- Objectivos (lista)
- Pain Points (lista)
- Perfil Tecnico
- Frequencia de Uso
- Tags

**Personas Mock (10):**

| Persona                           | Tags                           | Usado Em |
|-----------------------------------|--------------------------------|----------|
| Cliente Particular Digital        | Mobile, Digital-First, Retail  | 12       |
| Cliente Empresarial PME           | Corporate, Multi-user          | 8        |
| Backoffice Operator               | Internal, Operations           | 5        |
| Cliente Senior                    | Accessibility, Senior          | 3        |
| Cliente Premium Private Banking   | Premium, Wealth                | 6        |
| Developer Third-Party Provider    | Developer, API                 | 4        |
| Compliance Officer                | Compliance, Audit              | 7        |
| Cliente Jovem Universitario       | Youth, Student, Mobile         | 5        |
| Tesoureiro Corporate              | Treasury, Corporate            | 3        |
| Branch Manager                    | Branch, Sales, Internal        | 4        |

**Accoes por persona:**
- Ver Completo
- Duplicar
- Usar em Projecto

### 8.5 Tab: Regras de Negocio

**Dialogo de Adicao:** `AddBusinessRuleDialog`

Cada regra inclui:
- Categoria + Nome + Badge de uso
- Regra (texto)
- Validacao (codigo/pseudo-codigo)
- Excepcoes (texto)
- Tags de compliance

**Regras Mock (12):** Cobrem Transferencias, Autenticacao, Cartoes, Onboarding, Compliance, Pagamentos, Credito, AML, Privacidade, Investimentos, API.

**Accoes por regra:**
- Copiar Regra
- Adicionar a Feature

### 8.6 Tab: Acceptance Criteria

**Dialogo de Adicao:** `AddAcceptanceCriteriaDialog`

Cada set inclui:
- Categoria + Feature + Badge de uso
- Lista de criterios com checkmarks

**Sets Mock (3):** Login Biometrico, Transferencia SEPA, Pagamento MB Way Comerciante

**Accoes por set:**
- Copiar Criterios
- Adicionar a US

### 8.7 Tab: Test Cases Base

**Dialogo de Adicao:** `AddTestCaseDialog`

Cada test case inclui:
- Tipo (Security, Compliance, Performance)
- Prioridade (Critical, High, Medium)
- Nome
- Passos (lista numerada)
- Resultado Esperado

**Test Cases Mock (3):** Anti-spoofing biometrico, Conformidade PSD2, Teste de carga 1000 utilizadores

**Accoes por test case:**
- Copiar Test Case
- Adicionar a US

---

## 9. Ecra: Integracoes

**Ficheiro:** `src/app/components/pages/integrations.tsx`
**Rota interna:** `integrations`
**Agentes envolvidos:** Export Agent

### 9.1 Proposito

Gestao de conectores com plataformas de gestao de projectos (Jira Cloud, Azure DevOps, Jira Data Center). Configuracao de tokens, monitorizacao de sincronizacoes e estatisticas de exportacao.

### 9.2 KPIs (Grid 3 colunas)

| Metrica               | Valor |
|------------------------|-------|
| Integracoes Activas    | 2     |
| Projectos Sincronizados| 20   |
| Exportacoes (Total)    | 79    |

### 9.3 Card de Integracao (por plataforma)

**Estado: Conectado**

Informacao exibida:
- Nome + Badge de estado (Conectado/Desconectado)
- Descricao
- Projectos sincronizados (contagem)
- Ultima sincronizacao (relativo + absoluto)
- Frequencia de sincronizacao
- Estatisticas: Total exportacoes, Ultima semana, Tempo medio
- Funcionalidades disponiveis (lista com checks)
- URL da instancia
- Versao da API
- Estado do token

**Accoes (conectado):**
- Configurar
- Sincronizar Agora
- Desconectar

**Estado: Desconectado**

- Funcionalidades disponiveis (lista sem check activo)
- Card informativo azul: "Como conectar" com instrucoes sobre PAT

**Accoes (desconectado):**
- Conectar

### 9.4 Integracoes Mock

| Plataforma       | Estado       | Projectos | Exportacoes | Tempo Medio |
|------------------|--------------|-----------|-------------|-------------|
| Jira Cloud       | Conectado    | 12        | 47          | 12s         |
| Azure DevOps     | Conectado    | 8         | 32          | 15s         |
| Jira Data Center | Desconectado | 0         | -           | -           |

### 9.5 Card de Ajuda

Card no rodape com link para documentacao tecnica sobre configuracao de tokens, permissoes e troubleshooting.

---

## 10. Ecra: Auditoria & Logs

**Ficheiro:** `src/app/components/pages/audit.tsx`
**Rota interna:** `audit`
**Agentes envolvidos:** Audit & Logging Agent

### 10.1 Proposito

Rastreabilidade completa de todas as accoes executadas na plataforma. Retencao de 10 anos conforme requisitos do Banco de Portugal. Interface para pesquisa, filtragem e exportacao de logs.

### 10.2 KPIs (Grid 4 colunas)

| Metrica             | Valor                        |
|---------------------|-------------------------------|
| Total de Accoes     | Contagem total de logs        |
| Accoes Hoje         | Filtro por data actual        |
| Utilizadores Activos| Contagem de utilizadores unicos|
| Taxa de Sucesso     | Percentagem de status=success |

### 10.3 Tabela de Historico de Accoes

**Filtros disponiveis:**
- Pesquisa (texto livre: accoes, utilizadores, projectos, detalhes)
- Tipo de Accao (select: Exportacoes, Criacoes, Edicoes, Templates, Integracoes, IA Assistant, Compliance, Biblioteca)
- Utilizador (select: dinamico)
- Botao "Limpar" (visivel quando filtros activos)

**Colunas da tabela:**

| Coluna      | Conteudo                                          |
|-------------|---------------------------------------------------|
| Accao       | Icone colorido por tipo + nome da accao           |
| Utilizador  | Avatar (iniciais) + nome                          |
| Projecto    | Codigo badge + nome (ou "-" se global)            |
| Data/Hora   | Timestamp formatado PT-PT                         |
| Detalhes    | Descricao textual da accao                        |
| Duracao     | Badge mono (ex: "12s")                            |
| Status      | Badge "Sucesso" (verde) ou "Erro" (vermelho)     |

**Tipos de Accao e Cores:**

| Tipo         | Cor     | Icone    |
|--------------|---------|----------|
| export       | Azul    | Upload   |
| create       | Verde   | Plus     |
| edit         | Roxo    | FileText |
| template     | Laranja | FileSearch |
| integration  | Cinza   | Settings |
| ai           | Indigo  | Activity |
| compliance   | Verde   | Shield   |
| library      | Amarelo | FileText |

**Accao global:** Exportar CSV

**Rodape da tabela:** Contagem de registos + indicadores de compliance (Retencao 10 anos, Encriptacao AES-256, Compliance Banco de Portugal)

### 10.4 Card de Compliance

Card verde no rodape com garantias:
- Logs imutaveis (append-only)
- Encriptacao AES-256
- Retencao 10 anos
- Rastreabilidade IP
- Conformidade GDPR

### 10.5 Logs Mock (10 entradas)

Cobrem todos os tipos de accao com timestamps, IPs internos, duracoes e estados variados (sucesso + 1 erro).

---

## 11. Componentes de Dialogo

### 11.1 AddPersonaDialog

**Ficheiro:** `src/app/components/add-persona-dialog.tsx`

Formulario para adicionar nova persona a biblioteca. Campos: nome, descricao, objectivos, pain points, perfil tecnico, frequencia de uso, tags.

### 11.2 AddBusinessRuleDialog

**Ficheiro:** `src/app/components/add-business-rule-dialog.tsx`

Formulario para adicionar nova regra de negocio. Campos: categoria, nome, regra, validacao, excepcoes, compliance tags.

### 11.3 AddAcceptanceCriteriaDialog

**Ficheiro:** `src/app/components/add-acceptance-criteria-dialog.tsx`

Formulario para adicionar novo set de acceptance criteria. Campos: categoria, feature, lista de criterios.

### 11.4 AddTestCaseDialog

**Ficheiro:** `src/app/components/add-test-case-dialog.tsx`

Formulario para adicionar novo test case base. Campos: categoria, nome, tipo, prioridade, passos, resultado esperado.

---

## 12. Fluxos de Utilizador Completos

### 12.1 Fluxo: Criar Novo Projecto (end-to-end)

```
Dashboard
  |
  +--[Click "Novo Projecto" na Topbar]
  |
  v
Novo Projeto (wizard)
  |-- Etapa 1: Identidade
  |-- Etapa 2: Contexto Bancario (com IA assist)
  |-- Etapa 3: Compliance & Seguranca
  |-- Etapa 4: Sistemas & Integracoes (com IA assist)
  |-- Etapa 5: Input Documental (com IA assist)
  |-- Etapa 6: Configuracao IA
  |
  +--[Click "Iniciar IA Assistant"]
  |
  v
Project Builder (IA Assistant)
  |-- 6 categorias x N perguntas = 28 perguntas
  |-- Artefactos gerados em tempo real
  |-- Preview da estrutura
  |
  +--[Click "Finalizar e Exportar"]
  |
  v
Project View
  |-- Estrutura completa hierarquica
  |-- Exportar para Jira/Azure
  |-- Abrir na plataforma alvo
```

### 12.2 Fluxo: Usar Template

```
Templates
  |
  +--[Click "Usar Template"]
  |
  v
Project Builder
  |-- Template pre-carregado como contexto
  |-- IA Assistant adapta perguntas
  |
  v
[Segue fluxo normal de Project Builder]
```

### 12.3 Fluxo: Consultar Projecto Existente

```
Dashboard
  |
  +--[Click numa linha da tabela]
  |
  v
Project View
  |-- Navegar hierarquia
  |-- Expandir/colapsar niveis
  |-- Ver detalhes de cada artefacto
```

### 12.4 Fluxo: Configurar Integracao

```
Integracoes
  |
  +--[Click "Conectar" em plataforma desconectada]
  |
  v
[Configuracao de PAT]
  |
  +--[Token validado]
  |
  v
Integracao activa
  |-- Sincronizar Agora
  |-- Ver estatisticas
```

---

## 13. Mapeamento Ecra-a-Agente

| Ecra             | Accao do Utilizador                | Agente Acionado                    |
|------------------|------------------------------------|------------------------------------|
| Novo Projecto    | Preencher formulario               | Context Ingestor Agent             |
| Novo Projecto    | "Melhorar com IA"                  | Context Ingestor Agent (sub-task)  |
| Project Builder  | Responder pergunta                 | Questionnaire / Discovery Agent    |
| Project Builder  | (Automatico) Gerar artefactos      | Requirements Generator Agent       |
| Project Builder  | (Automatico) Gerar AC              | Acceptance Criteria Agent          |
| Project Builder  | (Automatico) Gerar Test Cases      | Test Design Agent                  |
| Project Builder  | (Automatico) Validar qualidade     | Quality Gate / Linter Agent        |
| Project View     | Exportar                           | Export Agent                       |
| Project View     | Ver historico de versoes           | Versioning & Diff Agent            |
| Dashboard        | Exportar novamente                 | Export Agent                       |
| Integracoes      | Sincronizar                        | Export Agent                       |
| Auditoria        | Qualquer accao na plataforma       | Audit & Logging Agent (transversal)|
| Biblioteca       | Importar componente em projecto    | Context Ingestor Agent             |

---

## 14. Estado Actual vs Implementacao Necessaria

### 14.1 O que existe (Frontend - UI/Figma)

- Todos os 8 ecras implementados com UI completa
- Componentes shadcn/ui + Radix UI
- Layout responsivo com Tailwind CSS
- Dados mock realistas para demonstracao
- Navegacao entre ecras via useState
- Dialogos de adicao para Biblioteca

### 14.2 O que falta (Backend / Logica / Agentes)

| Componente                    | Estado     | Notas                                        |
|-------------------------------|------------|-----------------------------------------------|
| API Backend (REST/GraphQL)    | Inexistente| Necessario para persistencia                  |
| Base de Dados                 | Inexistente| Schema por definir                            |
| Autenticacao / AuthN+AuthZ    | Inexistente| OAuth2 / SSO corporativo                      |
| Router (React Router)         | Inexistente| Usa useState em vez de rotas URL              |
| Agentes de IA                 | Mock only  | Respostas simuladas com setTimeout            |
| Integracao Jira Cloud         | Mock only  | API REST v3 por implementar                   |
| Integracao Azure DevOps       | Mock only  | API REST 7.0 por implementar                  |
| Upload de ficheiros           | Mock only  | Drag & drop UI existe, logica nao             |
| Pesquisa global               | Mock only  | Input existe, logica nao                      |
| Paginacao                     | Mock only  | UI existe, logica nao                         |
| Versionamento de projectos    | Inexistente| Por implementar                               |
| Testes automatizados          | Inexistente| Nenhum framework de testes configurado        |
| CI/CD                         | Inexistente| Pipeline por definir                          |

---

## 15. Regras de Compliance Incorporadas

| Regulamento        | Como se manifesta na plataforma                              |
|--------------------|--------------------------------------------------------------|
| PSD2               | Etapa 3 do wizard, tags automaticos, test cases compliance   |
| SCA                | Regras de negocio, test cases de seguranca                   |
| GDPR               | Consentimento, retencao de dados, anonimizacao               |
| Banco de Portugal  | Logs 10 anos, audit trail, reports regulamentares            |
| SIBS               | Integracoes, regras MB Way, validacao IBAN                   |
| AML / KYC          | Onboarding digital, monitorizacao de transaccoes             |
| EMV                | Cartoes, terminais ATM                                       |
| PCI-DSS            | Seguranca de cartoes, tokenizacao                            |
| MiFID II           | Adequacao de produtos de investimento                        |

---

## 16. Manual Operacional por Ecra

Esta secao funciona como manual de utilizacao funcional da plataforma.  
Objetivo: permitir que equipas de Produto, BA, Delivery e Governance saibam **o que fazer em cada ecra**, em que ordem e com que resultado esperado.

### 16.1 Dashboard

![Dashboard](screenshots/dashboard.png)

**Quando usar:** Inicio de sessao e acompanhamento de estado global.

**Passos operacionais:**
1. Rever KPIs principais para validar volume, qualidade e compliance.
2. Aplicar filtros (tipo, plataforma, departamento) para localizar projeto alvo.
3. Selecionar projeto na tabela para abrir estrutura detalhada.
4. Usar menu de acoes para exportar novamente, duplicar ou abrir em plataforma externa.

**Resultado esperado:** identificacao rapida do estado dos projetos e acesso ao projeto correto para revisao/export.

### 16.2 Novo Projeto

![Novo Projeto](screenshots/new-project.png)

**Quando usar:** Criacao de novo projeto antes da sessao de IA.

**Passos operacionais:**
1. Preencher 6 etapas do wizard (identidade, contexto, compliance, integracoes, documentos, configuracao IA).
2. Validar que requisitos regulatorios aplicaveis estao selecionados.
3. Concluir em `Iniciar IA Assistant`.

**Resultado esperado:** contexto completo e estruturado, pronto para discovery e geracao automatica de artefactos.

### 16.3 Project Builder

![Project Builder](screenshots/project-builder.png)

**Quando usar:** Discovery guiada e geracao de artefactos.

**Passos operacionais:**
1. Responder perguntas por categoria, seguindo ordem apresentada.
2. Verificar artefactos gerados no painel direito.
3. Rever alertas de qualidade/compliance durante a sessao.
4. Abrir `Preview` e validar estrutura antes de finalizar.
5. Concluir em `Finalizar e Exportar`.

**Resultado esperado:** Epics, Features, User Stories, Tasks e Test Cases gerados com rastreabilidade.

### 16.4 Project View

![Project View](screenshots/project-view.png)

**Quando usar:** Revisao final de estrutura e exportacao.

**Passos operacionais:**
1. Navegar hierarquia completa (Epic > Feature > User Story > Tasks/Test Cases).
2. Validar prioridades, criterios e cobertura por nivel.
3. Consultar tabs de visao geral/compliance/historico.
4. Executar exportacao para Jira/Azure.

**Resultado esperado:** estrutura validada e publicada na plataforma destino.

### 16.5 Templates

![Templates](screenshots/templates.png)

**Quando usar:** Arranque rapido com estrutura pre-definida.

**Passos operacionais:**
1. Filtrar por categoria/uso/rating.
2. Abrir preview do template para verificar adequacao.
3. Aplicar em `Usar Template` para iniciar fluxo no Project Builder.

**Resultado esperado:** aceleracao de arranque mantendo padrao funcional e compliance.

### 16.6 Biblioteca

![Biblioteca](screenshots/library.png)

**Quando usar:** Reutilizacao de conhecimento validado.

**Passos operacionais:**
1. Consultar tabs de Personas, Regras de Negocio, Acceptance Criteria e Test Cases base.
2. Copiar/reutilizar componentes em novos projetos.
3. Adicionar novos componentes quando houver validacao interna.

**Resultado esperado:** consistencia transversal entre projetos e reducao de retrabalho.

### 16.7 Integracoes

![Integracoes](screenshots/integrations.png)

**Quando usar:** Configurar e monitorizar conectores externos.

**Passos operacionais:**
1. Confirmar estado de conexao por plataforma.
2. Configurar token/PAT onde necessario.
3. Executar `Sincronizar Agora` para validar conectividade.
4. Rever metricas de exportacao e tempo medio.

**Resultado esperado:** integracoes operacionais com capacidade de exportacao idempotente.

### 16.8 Auditoria & Logs

![Auditoria](screenshots/audit.png)

**Quando usar:** Rastreabilidade, auditoria e analise de incidentes.

**Passos operacionais:**
1. Filtrar por acao, utilizador, projeto e periodo.
2. Investigar entradas com status de erro/warning.
3. Exportar registos quando necessario para analise externa/compliance.

**Resultado esperado:** trilha auditavel completa e suporte a requisitos regulatorios.

---

## Anexo A: Stack Tecnologica

| Camada     | Tecnologia                                    |
|------------|-----------------------------------------------|
| Framework  | React 18.3.1 + TypeScript                     |
| Build      | Vite 6.3.5                                    |
| Styling    | Tailwind CSS 4.1.12                           |
| UI Library | shadcn/ui + Radix UI                          |
| Icons      | Lucide React 0.487.0                          |
| Forms      | React Hook Form 7.55.0                        |
| Animation  | Motion 12.23.24                               |
| DnD        | React DnD 16.0.1                              |
| Charts     | Recharts 2.15.2                               |
| Date       | Date-fns 3.6.0                                |

## Anexo B: Referencia de Ficheiros

| Ficheiro                                    | Responsabilidade                     |
|---------------------------------------------|--------------------------------------|
| `src/app/App.tsx`                           | Router principal, gestao de estado   |
| `src/app/components/layout/sidebar.tsx`     | Navegacao lateral                    |
| `src/app/components/layout/topbar.tsx`      | Barra superior, notificacoes         |
| `src/app/components/pages/dashboard.tsx`    | Dashboard principal                  |
| `src/app/components/pages/new-project.tsx`  | Wizard de novo projecto              |
| `src/app/components/pages/project-builder.tsx` | IA Assistant (questionario)       |
| `src/app/components/pages/project-view.tsx` | Visualizacao de projecto             |
| `src/app/components/pages/templates.tsx`    | Catalogo de templates                |
| `src/app/components/pages/library.tsx`      | Biblioteca reutilizavel              |
| `src/app/components/pages/integrations.tsx` | Gestao de integracoes                |
| `src/app/components/pages/audit.tsx`        | Auditoria e logs                     |

---

## Anexo C: Prompt Pack Foundry (9 Agentes)

Este anexo define os prompts base recomendados para configuracao dos agentes no Foundry.  
Todos os prompts assumem que o Figma e a fonte de verdade para UI e nomenclatura.

### C.1 Context Ingestor Agent

**Objetivo:** Normalizar inputs do projeto e produzir contexto estruturado para os agentes seguintes.

**Prompt base (system):**

```text
You are the Context Ingestor Agent for StoryForge.
Rules:
1) Figma is the absolute source of truth for UI and naming. Never propose UI changes.
2) Normalize all project inputs into structured context.
3) Detect domain, compliance scope, missing critical information, and risk level.
4) Keep provider-agnostic outputs, no vendor lock-in assumptions.
Output format:
- summary
- detectedDomain
- suggestedCompliance[]
- suggestedPersonas[]
- suggestedBusinessRules[]
- riskLevel (low|medium|high)
Language: PT-PT for business content.
```

### C.2 Questionnaire / Discovery Agent

**Objetivo:** Conduzir discovery estruturada e fechar lacunas.

**Prompt base (system):**

```text
You are the Questionnaire/Discovery Agent for StoryForge.
Rules:
1) Ask one focused question at a time.
2) Prioritize missing information that impacts requirements quality or compliance.
3) Keep questions objective, enterprise-oriented, and banking-aware.
4) Do not invent UI or rename entities defined in Figma.
Output format:
- nextQuestion
- rationale
- category
- expectedImpact
Language: PT-PT.
```

### C.3 Requirements Generator Agent

**Objetivo:** Gerar Epics, Features e User Stories de forma rastreavel.

**Prompt base (system):**

```text
You are the Requirements Generator Agent for StoryForge.
Rules:
1) Generate Epics, Features, User Stories based only on validated context.
2) Maintain traceability from input evidence to each artifact.
3) Apply Portuguese banking context and required regulations (PSD2, SCA, GDPR where relevant).
4) Do not add sprint planning or execution management content.
Output format:
- epics[]
- features[]
- userStories[]
- traceabilityMap[]
- qualityScore
Language: PT-PT for functional text; English only for technical identifiers.
```

### C.4 Acceptance Criteria Agent

**Objetivo:** Produzir criterios Given/When/Then completos.

**Prompt base (system):**

```text
You are the Acceptance Criteria Agent for StoryForge.
Rules:
1) Generate acceptance criteria in Given/When/Then.
2) Cover happy path, validation failures, and negative scenarios.
3) Include compliance-sensitive behaviors where applicable.
4) Keep criteria testable and unambiguous.
Output format:
- artifactId
- acceptanceCriteria[] (GWT)
- coverageNotes
Language: PT-PT.
```

### C.5 Test Design Agent

**Objetivo:** Gerar test cases funcionais e nao-funcionais.

**Prompt base (system):**

```text
You are the Test Design Agent for StoryForge.
Rules:
1) Generate complete test cases with preconditions, steps, expected result, and test data.
2) Classify each test case type (functional, security, performance, accessibility, compliance).
3) Prioritize tests by business and regulatory risk.
4) Ensure each test maps to one or more acceptance criteria.
Output format:
- testCases[]
- coverageByArtifact
- uncoveredRisks[]
Language: PT-PT.
```

### C.6 Quality Gate / Linter Agent

**Objetivo:** Validar completude, consistencia e compliance antes de exportar.

**Prompt base (system):**

```text
You are the Quality Gate/Linter Agent for StoryForge.
Rules:
1) Validate completeness, consistency, traceability, and compliance.
2) Block export when critical errors exist.
3) Return clear remediation actions by severity.
4) Never change UI definitions from Figma.
Output format:
- overallScore
- categories {completeness, consistency, compliance, traceability}
- issues[] {severity, artifact, message, suggestion}
- exportDecision (allow|block)
Language: PT-PT.
```

### C.7 Versioning & Diff Agent

**Objetivo:** Gerir versoes e diffs funcionais.

**Prompt base (system):**

```text
You are the Versioning & Diff Agent for StoryForge.
Rules:
1) Compare previous and current artifact structures.
2) Classify change type: major, minor, patch.
3) Generate concise changelog focused on functional impact.
4) Preserve historical traceability of requirement evolution.
Output format:
- previousVersion
- nextVersion
- changeType
- changelog[]
- impactSummary
Language: PT-PT.
```

### C.8 Export Agent

**Objetivo:** Mapear artefactos internos para Jira/Azure com idempotencia.

**Prompt base (system):**

```text
You are the Export Agent for StoryForge.
Rules:
1) Map internal artifacts to target platform fields (Jira/Azure).
2) Ensure idempotent export (safe retries, no duplicates).
3) Preserve links and hierarchy (Epic > Feature > Story > Task/Test).
4) Report failures with actionable diagnostics.
Output format:
- platform
- itemsExported
- itemsFailed
- details[] {id, externalId, status}
- url
Language: PT-PT for messages; technical keys in English.
```

### C.9 Audit & Logging Agent

**Objetivo:** Garantir trilha auditavel para todas as accoes.

**Prompt base (system):**

```text
You are the Audit & Logging Agent for StoryForge.
Rules:
1) Register all critical actions with immutable audit semantics.
2) Include actor, timestamp, action type, project scope, and status.
3) Produce logs suitable for banking audit and regulatory inspection.
4) Never omit failed actions.
Output format:
- eventId
- actionType
- timestamp
- actor
- project
- status
- details
Language: PT-PT.
```

---

## Anexo D: Screenshots dos Ecras (Estado Atual)

Objetivo: facilitar leitura funcional e alinhamento entre equipas tecnica, produto e governance.

### D.1 Dashboard

![Dashboard](screenshots/dashboard.png)

### D.2 Novo Projeto

![Novo Projeto](screenshots/new-project.png)

### D.3 Project Builder

![Project Builder](screenshots/project-builder.png)

### D.4 Project View

![Project View](screenshots/project-view.png)

### D.5 Templates

![Templates](screenshots/templates.png)

### D.6 Biblioteca

![Biblioteca](screenshots/library.png)

### D.7 Integracoes

![Integracoes](screenshots/integrations.png)

### D.8 Auditoria & Logs

![Auditoria](screenshots/audit.png)
