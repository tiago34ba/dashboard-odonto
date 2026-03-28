# Padrao de Alto Nivel - Modulo Relatorio de Agendamentos

## 1. Objetivo
Definir um padrao unico para o modulo de Relatorio de Agendamentos do sistema de gestao odontologica, garantindo confiabilidade operacional, governanca de dados, rastreabilidade e suporte a decisao.

## 2. Regra Mestra
Todo relatorio de agendamentos deve refletir a verdade operacional da clinica no periodo consultado, com trilha de auditoria, padronizacao de status e consistencia entre agenda, atendimento e faturamento.

## 3. Escopo
Este padrao se aplica a:
- Tela de Relatorio de Agendamentos.
- APIs e consultas que alimentam o relatorio.
- Exportacoes (PDF/planilha).
- Logs de auditoria do modulo.

Nao se aplica a:
- Agendamento em si (criacao/edicao no modulo de agenda), exceto impactos em status e historico.

## 4. Padroes Obrigatorios

### 4.1 Fonte Unica de Verdade
- O relatorio deve usar dados transacionais oficiais do sistema (agendamentos e historico de status).
- Nao permitir consolidacao manual sem registro de origem.

### 4.2 Padronizacao de Status
Status minimos obrigatorios:
- agendado
- confirmado
- em_atendimento
- concluido
- cancelado
- falta

Regras:
- Toda mudanca de status deve ter data/hora, usuario e motivo (quando aplicavel).
- Registros concluidos devem possuir profissional e procedimento.

### 4.3 Filtros Minimos
Filtros obrigatorios:
- periodo (inicio/fim)
- profissional
- paciente
- procedimento/especialidade
- unidade
- status

Metadados obrigatorios da consulta:
- fuso horario aplicado
- criterio de data (data de criacao, data da consulta ou data de conclusao)

### 4.4 Indicadores Minimos
O modulo deve apresentar no minimo:
- total de agendamentos
- taxa de confirmacao
- taxa de comparecimento
- taxa de cancelamento
- taxa de faltas
- tempo medio entre criacao e atendimento
- ocupacao por profissional/faixa de horario

### 4.5 Consistencia de Dados
- Soma por status deve fechar com total geral do periodo.
- Cancelados e faltas nao entram como concluidos.
- Conflitos de agenda (mesmo recurso, mesmo horario) devem ser sinalizados como anomalia.

### 4.6 Governanca e Auditoria
- Toda exportacao deve registrar: usuario, data/hora, filtros e volume de dados.
- Alteracoes retroativas devem ser rastreaveis no historico.

### 4.7 Seguranca e LGPD
- Exibir apenas dados necessarios para a analise.
- Aplicar perfil de acesso por permissao.
- Aplicar mascaramento de dados sensiveis quando o perfil nao permitir detalhamento.

### 4.8 Usabilidade Executiva
- Exibir cards de resumo com comparativo ao periodo anterior.
- Permitir drill-down (do indicador para lista detalhada).
- Exportacao padronizada com metadados do filtro.

### 4.9 Confiabilidade Operacional
- Divergencia permitida entre base transacional e relatorio: 0%.
- Atualizacao alvo: ate 5 minutos ou indicacao de ultima sincronizacao.
- Ausencia de dados deve ser explicitamente informada.

---

## 5. Modelo Pronto para Uso (Padrao Interno)

### 5.1 Requisito Funcional
RF-RA-001: O sistema deve gerar relatorio de agendamentos por periodo e filtros, exibindo indicadores de produtividade e qualidade operacional.

RF-RA-002: O sistema deve permitir exportacao com trilha de auditoria.

RF-RA-003: O sistema deve permitir detalhamento por status, profissional e procedimento.

### 5.2 Regra de Negocio
RN-RA-001: Um agendamento concluido deve ter profissional e procedimento associados.

RN-RA-002: Agendamentos cancelados ou com falta nao devem compor metricas de concluidos.

RN-RA-003: Taxa de comparecimento = (concluidos + em_atendimento) / total_agendamentos * 100.

RN-RA-004: Taxa de confirmacao = confirmados / total_agendamentos * 100.

RN-RA-005: Taxa de cancelamento = cancelados / total_agendamentos * 100.

RN-RA-006: Taxa de falta = faltas / total_agendamentos * 100.

### 5.3 Regra Tecnica
RT-RA-001: Todas as consultas devem respeitar timezone padrao da unidade.

RT-RA-002: O backend deve retornar campos de auditoria minimos (created_at, updated_at, updated_by quando aplicavel).

RT-RA-003: O frontend deve exibir metadados da consulta (periodo, filtros, criterio de data).

RT-RA-004: Exportacao deve incluir cabecalho com filtros e timestamp.

RT-RA-005: Erros de inconsistencias devem ser registrados em log tecnico.

### 5.4 Criterio de Teste
CT-RA-001: Mesmo filtro e mesma permissao devem produzir o mesmo resultado.

CT-RA-002: Total geral deve ser igual a soma dos status.

CT-RA-003: Cancelado/falta nao pode ser contado como concluido.

CT-RA-004: Exportacao deve registrar evento de auditoria com usuario e filtros.

CT-RA-005: Divergencia entre consulta detalhada e resumo deve ser 0%.

### 5.5 Evidencia de Auditoria
EA-RA-001: Log de acesso ao relatorio (usuario, data/hora, filtros).

EA-RA-002: Log de exportacao (tipo, volume, periodo, usuario).

EA-RA-003: Historico de alteracao de status com usuario e timestamp.

EA-RA-004: Snapshot de fechamento diario para validacao historica.

---

## 6. Checklist de Implantacao
- [ ] Status padronizados implementados no banco, API e frontend.
- [ ] Filtros obrigatorios implementados e exibidos na UI.
- [ ] Indicadores minimos calculados e validados.
- [ ] Metadados de consulta exibidos no relatorio.
- [ ] Exportacao com trilha de auditoria habilitada.
- [ ] Regras de permissao/LGPD aplicadas.
- [ ] Testes de consistencia aprovados.
- [ ] Processo de monitoramento de divergencia ativo.

## 7. Definicoes de Pronto (Definition of Done)
Considerar o modulo aderente ao padrao quando:
1. Todos os itens da secao 4 estiverem atendidos.
2. Todos os testes da secao 5.4 estiverem aprovados.
3. Evidencias da secao 5.5 estiverem disponiveis para auditoria.
4. Checklist da secao 6 estiver 100% concluido.

## 8. Responsabilidades
- Produto/Negocio: validar regras e indicadores.
- Engenharia Backend: garantir dados e consistencia.
- Engenharia Frontend: garantir visualizacao, filtros e exportacoes.
- QA: validar criterios de teste e regressao.
- Gestao/Compliance: auditar trilhas e conformidade.

## 9. Versionamento
- Versao: 1.0
- Data: 2026-03-27
- Autor: Time de Engenharia
- Historico:
  - 1.0: criacao inicial do padrao de alto nivel do modulo.
