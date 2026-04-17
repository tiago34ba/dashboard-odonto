# Estudo de Viabilidade - Migracao Odonto Flux Delivery para Laravel 13 + React (API-First)

Data: 2026-04-10  
Escopo: Replicar e modernizar o ecossistema atual (Odonto + Flux Delivery legado) em arquitetura API-First com Laravel 13 no backend e React.js no frontend, com duas exigencias centrais:
1. Edicao facil do cardapio digital
2. Inclusao de modulo PDV integrado ao cardapio digital

---

## 1. Resumo Executivo

Conclusao: A migracao e viavel tecnicamente e recomendada estrategicamente.

Nivel de viabilidade:
- Viabilidade tecnica: Alta
- Viabilidade operacional: Media-Alta
- Viabilidade de prazo: Media (depende de migracao incremental)
- Viabilidade financeira: Alta no medio prazo (reducao de custo de manutencao do legado)

Motivos principais:
- O backend Odonto ja esta em Laravel moderno e possui base SaaS reutilizavel (auth, perfis, financeiro, APIs).
- O Flux Delivery possui sinais de arquitetura legada e codigo protegido (ionCube), o que reforca abordagem de reengenharia por dominio, nao copia de codigo.
- A exigencia de "cardapio facil de editar" pode ser tratada com modelagem orientada a CMS e workflow editorial simples.
- O modulo PDV pode reutilizar parte da base financeira existente do Odonto (formas de pagamento, fluxo de caixa, contas).

---

## 2. Estado Atual (Base de Analise)

### 2.1 Projeto Odonto (Laravel)
Evidencias observadas:
- API extensa e modular em routes/api.php
- Modulos de financeiro, formas de pagamento e fluxo de caixa ja existentes
- Estrutura SaaS e autenticacao com Sanctum

Impacto positivo:
- Forte reaproveitamento de fundamentos de backend
- Menor risco para modulo PDV e conciliacao financeira

### 2.2 Projeto Flux Delivery (Legado)
Evidencias observadas:
- Estrutura MVC custom com controllers como Pedido, Carrinho, Categoria, Item, Pagamento
- Loader com ionCube (codigo principal fechado)

Impacto tecnico:
- Migracao deve ser orientada a processo e regras de negocio observaveis
- Nao e viavel depender de manutencao futura do legado protegido como base estrategica

---

## 3. Arquitetura Alvo Recomendada

## 3.1 Principios
- API-First: frontend desacoplado, contratos versionados
- Modular Monolith inicial (Laravel) com fronteiras por contexto
- Evolucao para servicos somente se houver gargalo real
- Multi-tenant pronto para evolucao SaaS

## 3.2 Stack Recomendada
Backend:
- Laravel 13
- PHP 8.3+
- Laravel Sanctum (auth API)
- Redis (cache, fila)
- MySQL 8

Frontend:
- React.js + Vite
- TanStack Query para dados server-state
- React Hook Form + Zod para formularios robustos
- Biblioteca de UI com componentes internos padronizados

Observacao:
- Se Laravel 13 ainda nao estiver estavel no inicio da execucao, iniciar em Laravel 12 LTS com trilha de upgrade planejada para 13 sem retrabalho arquitetural.

---

## 4. Desenho Funcional - Cardapio Digital Facil de Editar

Objetivo: permitir que time nao tecnico edite cardapio em minutos, sem deploy.

## 4.1 Requisitos de Edicao Simples
- CRUD visual de categorias, itens e adicionais
- Ordenacao por drag-and-drop
- Publicar/Despublicar item com um clique
- Duplicar item e variacoes rapidamente
- Precos por canal (balcao, delivery, app)
- Agenda de disponibilidade (dias/horarios)
- Upload de imagem com compressao automatica
- Historico de alteracoes com rollback simples

## 4.2 Modelo de Dados (alto nivel)
- menu_catalogs (cardapio por loja/unidade)
- menu_categories
- menu_items
- menu_item_variants
- menu_item_options (adicionais)
- menu_item_prices (preco por contexto)
- menu_availability_rules
- menu_publication_logs

## 4.3 Fluxo Editorial
- Rascunho -> Revisao -> Publicado
- Publicacao imediata ou agendada
- Registro de autor e data para auditoria

Resultado esperado:
- Reducao drastica de dependencia do time tecnico
- Menor tempo de atualizacao comercial

---

## 5. Desenho Funcional - Modulo PDV Integrado ao Cardapio

Objetivo: transformar o cardapio digital em origem unica de produto para venda presencial e delivery.

## 5.1 Capacidades Minimas do PDV
- Abertura e fechamento de caixa
- Venda rapida por busca e atalhos
- Leitura de itens do mesmo catalogo do cardapio digital
- Descontos e acrescimos com permissao
- Multiplas formas de pagamento (dinheiro, cartao, pix)
- Sangria e suprimento de caixa
- Emissao de comprovante (impressora termica opcional)
- Cancelamento com trilha de auditoria

## 5.2 Integracao Cardapio <-> PDV
- Single Source of Truth de produto/preco
- Tabelas de preco por contexto de venda
- Regras de indisponibilidade refletidas no PDV em tempo real
- Estoque simplificado opcional (fase 2)

## 5.3 Estrutura de Dominio (alto nivel)
- pdv_sessions
- pdv_orders
- pdv_order_items
- pdv_payments
- cash_movements
- fiscal_documents (opcional por fase)

---

## 6. Estrategia de Migracao

Recomendacao: Strangler Pattern (migracao incremental), sem big-bang.

Fases:
1. Fase Fundacao (2-3 semanas)
- Definir contratos de API
- Preparar IAM, tenants e observabilidade
- Criar base de catalogo e cardapio

2. Fase Cardapio Digital (3-5 semanas)
- Backoffice de edicao simples
- Publicacao e auditoria
- Exposicao de API publica de cardapio

3. Fase PDV Core (4-6 semanas)
- Caixa, venda, pagamento, cancelamento
- Integracao com financeiro existente
- Relatorios operacionais iniciais

4. Fase Migracao Assistida (2-4 semanas)
- Operacao paralela controlada
- Migracao de dados validada
- Go-live por onda (unidades piloto)

Total estimado MVP robusto: 11-18 semanas

---

## 7. Reaproveitamento vs Reconstrucao

Alta taxa de reaproveitamento (Odonto backend):
- Auth, permissao, perfis
- Estruturas financeiras base
- Convencoes API e seguranca

Reconstrucao recomendada (Flux legado):
- Dominio de cardapio/carrinho/pedido com design moderno
- Interface administrativa de cardapio
- Camada PDV integrada ao novo dominio

Estimativa de reaproveitamento macro:
- Backend fundacional: 60% a 70%
- Dominio comercial delivery+pdv: 20% a 35% (reengenharia principal)
- Frontend administrativo: 35% a 50% (dependendo do que ja existe reutilizavel)

---

## 8. Riscos e Mitigacoes

Risco: divergencia de regra entre delivery e PDV
- Mitigacao: catalogo unico + testes de contrato + suite de regressao por fluxo

Risco: indisponibilidade durante transicao
- Mitigacao: deploy blue/green e operacao paralela por unidade

Risco: complexidade de precificacao
- Mitigacao: preco por contexto com matriz simples na fase 1

Risco: escopo crescer para fiscal completo cedo demais
- Mitigacao: fiscal como trilha faseada e opcional no MVP

Risco: dependencia de conhecimento tacito do legado
- Mitigacao: discovery funcional com usuarios-chave e mapeamento de jornadas reais

---

## 9. Viabilidade Financeira (Macro)

Custo inicial: Medio
- Maior concentracao em produto (cardapio editor + PDV)

Retorno esperado:
- Reducao de custo de manutencao do legado
- Menor lead time para alteracoes de cardapio
- Aumento de conversao operacional por unificar canais
- Base pronta para escalar SaaS por segmento e unidade

Payback estimado: 6 a 12 meses apos estabilizacao operacional (depende de volume transacional e reducao de retrabalho manual).

---

## 10. Recomendacao Final

Prosseguir com migracao incremental para Laravel 13 + React API-First, com prioridade de negocio em:
1. Editor de cardapio digital com UX de baixa friccao
2. PDV integrado ao mesmo catalogo
3. Integracao financeira nativa desde o inicio

A estrategia reduz risco tecnico, protege operacao e cria uma plataforma mais escalavel que o legado atual.

---

## 11. Backlog Inicial Sugerido (Primeiras 3 Sprints)

Sprint 1:
- Definicao de bounded contexts: Catalogo, Pedido, PDV, Financeiro
- API contracts v1 (OpenAPI)
- Estrutura base de menu_categories/menu_items/menu_prices

Sprint 2:
- Backoffice de cardapio (CRUD + ordenar + publicar)
- Auditoria de alteracao e rollback simples
- Cache invalido inteligente apos publicacao

Sprint 3:
- PDV: abertura de caixa, venda, pagamento, fechamento
- Relatorio diario de caixa
- Integracao com formas de pagamento e fluxo de caixa

---

## 12. Criterios de Sucesso (KPIs)

- Tempo medio para editar item no cardapio < 2 minutos
- Tempo de publicacao de alteracao < 30 segundos
- Divergencia de preco entre canais = 0
- Fechamento de caixa sem ajuste manual > 95%
- Disponibilidade API > 99.5%

---

Fim do estudo.
