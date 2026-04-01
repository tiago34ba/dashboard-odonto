# Estudo de Viabilidade Multi-Segmento

Data: 2026-04-01
Escopo: Avaliar a adaptacao do sistema atual (frontend + backend) para atender tres segmentos:
- Clinicas gerais
- Saloes de beleza
- Clinicas veterinarias

## 1. Resumo Executivo

A adaptacao e viavel para os tres segmentos, com melhor custo-beneficio iniciando por clinicas gerais.

Indice de reaproveitamento estimado:
- Clinicas gerais: 80% a 85% (viabilidade alta)
- Clinicas veterinarias: 65% a 75% (viabilidade media-alta)
- Saloes de beleza: 55% a 65% (viabilidade media)

Recomendacao de ordem de expansao:
1. Clinicas gerais
2. Clinicas veterinarias
3. Saloes de beleza

## 2. Base Tecnica Ja Reaproveitavel

Os seguintes blocos da plataforma podem ser mantidos com baixo impacto:
- Autenticacao, perfis e controles de acesso
- Agenda e fluxo de confirmacao/cancelamento
- Financeiro (contas, caixa, repasses/comissoes)
- Portal administrativo SaaS e cobranca
- Estrutura de seguranca e conformidade

## 3. Pontos de Acoplamento ao Dominio Odontologico

Foram identificados acoplamentos que precisam ser parametrizados para escalar para novos nichos:
- Terminologia fixa (ex.: paciente, dentista, procedimento)
- Menus e navegacao com nomenclatura odontologica
- Modulos especializados (odontograma e fluxos clinicos especificos)
- Relatorios e indicadores focados em odontologia

## 4. Analise por Segmento

### 4.1 Clinicas Gerais

Nivel de esforco: baixo a medio.

Adequacoes principais:
- Trocar nomenclaturas de dominio para termos neutros/configuraveis
- Tornar menus e labels dinamicos por segmento
- Isolar modulos odontologicos como opcionais (feature flags)

Conclusao:
- Melhor ponto de entrada para expansao comercial
- Menor risco tecnico

### 4.2 Clinicas Veterinarias

Nivel de esforco: medio.

Adequacoes principais:
- Introduzir modelo Tutor + Pet
- Prontuario veterinario (vacinas, especie, peso, alergias, historico)
- Ajustar atendimento e protocolos por especie/porte

Conclusao:
- Boa sinergia com fluxos clinicos existentes
- Exige extensoes de dados relevantes, mas controladas

### 4.3 Saloes de Beleza

Nivel de esforco: medio a alto.

Adequacoes principais:
- Substituir convencoes clinicas por servicos e pacotes
- Agenda orientada por duracao de servico e profissional
- Relatorios focados em ocupacao, recorrencia e ticket medio

Conclusao:
- Viavel, porem com maior distancia de modelo operacional
- Recomenda-se entrar apos consolidar os dois segmentos anteriores

## 5. Arquitetura Recomendada para Multi-Segmento

### 5.1 Segmento como configuracao central

Criar uma chave de segmentacao por tenant (ex.: segment_type) para direcionar:
- Menus
- Rotulos
- Modulos habilitados
- Regras de negocio
- Relatorios

### 5.2 Dicionario de Dominio

Centralizar rotulos e termos em um dicionario por segmento, evitando strings fixas em componentes e endpoints.

### 5.3 Feature Flags por modulo

Ativar/desativar modulos por segmento para reduzir complexidade:
- Ex.: odontograma apenas para odontologia
- Ex.: prontuario veterinario apenas para veterinaria

### 5.4 Contratos de API estaveis

Padronizar respostas de API para manter frontend reutilizavel e minimizar forks por nicho.

## 6. Plano de Implementacao (Roadmap)

### Fase 1 - Core Multi-Segmento (2 a 3 semanas)
- Parametrizacao de menus e rotulos
- Introducao de feature flags
- Ajuste de entidades base para neutralidade de dominio
- Compatibilidade retroativa com tenants odontologicos

### Fase 2 - Verticalizacao por Nicho (3 a 5 semanas)
- Pacote Clinicas Gerais
- Pacote Veterinaria (Tutor + Pet + prontuario vet)
- Ajustes de relatios por nicho

### Fase 3 - Comercializacao Escalada (2 a 3 semanas)
- Templates de onboarding por segmento
- Dashboards especializados
- Suite de regressao por perfil/segmento

## 7. Estimativa Macro de Prazo

- MVP multi-segmento com 1 novo nicho: 6 a 8 semanas
- Plataforma madura para 3 nichos: 10 a 14 semanas

## 8. Principais Riscos e Mitigacoes

Risco: regressao no fluxo odontologico atual.
Mitigacao: camada de compatibilidade + testes de regressao por modulo.

Risco: proliferacao de condicionais no frontend.
Mitigacao: dicionario central + componentes orientados a configuracao.

Risco: aumento de custo de suporte com multiplos nichos.
Mitigacao: templates padrao por segmento e matriz de capacidade operacional.

## 9. Recomendacao Final

A expansao e tecnicamente viavel e estrategicamente recomendada.

Sequencia sugerida para maximizar retorno e reduzir risco:
1. Clinicas gerais
2. Clinicas veterinarias
3. Saloes de beleza

Com esta ordem, o sistema evolui com menor retrabalho e melhora o time-to-market para novos segmentos.

## 10. Proximos Passos Objetivos

1. Definir segment_type por tenant no backend
2. Implementar dicionario de dominio por segmento
3. Parametrizar menu lateral e rotas por perfil/segmento
4. Isolar modulos odontologicos com feature flags
5. Criar backlog do pacote Clinica Geral (primeiro go-live)
6. Planejar modelo de dados Tutor + Pet para fase veterinaria
