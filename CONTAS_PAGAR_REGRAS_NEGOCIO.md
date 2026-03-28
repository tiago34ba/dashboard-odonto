# Regras de Negócio — Módulo Contas a Pagar
## Sistema de Gestão de Clínica Odontológica

**Versão:** 1.0  
**Data:** 2026-03-27  
**Status:** Oficial  
**Escopo:** Frontend (React/TypeScript) + Backend (Laravel/PHP) + Comunicação via API

---

## Sumário

1. [Objetivo e Escopo](#1-objetivo-e-escopo)
2. [Glossário](#2-glossário)
3. [Modelo de Dados](#3-modelo-de-dados)
4. [Ciclo de Vida e Máquina de Estados](#4-ciclo-de-vida-e-máquina-de-estados)
5. [Regras de Negócio (RN)](#5-regras-de-negócio-rn)
6. [Requisitos Funcionais (RF)](#6-requisitos-funcionais-rf)
7. [Requisitos Técnicos (RT)](#7-requisitos-técnicos-rt)
8. [Contrato de API](#8-contrato-de-api)
9. [Segurança (OWASP Top 10)](#9-segurança-owasp-top-10)
10. [Padrão Backend (Laravel)](#10-padrão-backend-laravel)
11. [Padrão Frontend (React/TypeScript)](#11-padrão-frontend-reacttypescript)
12. [Validações e Mensagens de Erro](#12-validações-e-mensagens-de-erro)
13. [Auditoria e Rastreabilidade](#13-auditoria-e-rastreabilidade)
14. [LGPD e Proteção de Dados](#14-lgpd-e-proteção-de-dados)
15. [Critérios de Aceite (DoD)](#15-critérios-de-aceite-dod)
16. [Checklist de Conformidade](#16-checklist-de-conformidade)

---

## 1. Objetivo e Escopo

### 1.1 Objetivo
O módulo **Contas a Pagar** gerencia o ciclo completo de obrigações financeiras da clínica odontológica com fornecedores e prestadores de serviço, desde o cadastro da conta até a quitação ou cancelamento, com integração automática ao Fluxo de Caixa.

### 1.2 Escopo Funcional
- Cadastro, edição e exclusão de contas a pagar
- Registro de pagamentos (total e parcial)
- Cancelamento de pagamentos
- Dashboard com totalizadores em tempo real (dados exclusivamente da API)
- Alertas automáticos de vencimento (vencidas, vence hoje, vence amanhã)
- Relatórios por período, fornecedor e categoria
- Integração automática com Fluxo de Caixa a cada pagamento registrado

### 1.3 Fora do Escopo
- Geração de boletos bancários (módulo externo de integração bancária)
- Emissão de cheques
- Parcelamento automático de compras (módulo de compras)
- Integração com ERP externo (versão futura)

---

## 2. Glossário

| Termo | Definição |
|---|---|
| **Conta a Pagar** | Obrigação financeira da clínica com fornecedor ou prestador de serviço |
| **Valor Original** | Valor total da conta no momento do cadastro |
| **Valor Pago** | Soma de todos os pagamentos já registrados |
| **Valor Pendente** | `valor_original - valor_pago`; nunca negativo |
| **Código (CP-XXXX)** | Identificador único sequencial gerado automaticamente pelo sistema |
| **Fornecedor** | Empresa ou pessoa vinculada à conta (tabela `suppliers`) |
| **Prioridade** | Urgência de pagamento: Baixa / Média / Alta / Crítica |
| **Status** | Estado atual da conta no ciclo de vida |
| **Fluxo de Caixa** | Registro de entrada/saída financeira vinculado a cada pagamento |
| **Baixa** | Ato de registrar um pagamento, total ou parcial |

---

## 3. Modelo de Dados

### 3.1 Tabela `contas_pagars` (Backend)

| Campo | Tipo | Obrigatório | Regra |
|---|---|---|---|
| `id` | BIGINT PK | Auto | Gerado pelo banco |
| `codigo` | VARCHAR(20) UNIQUE | Auto | Formato `CP-NNNN`, gerado ao criar |
| `descricao` | VARCHAR(255) | Sim | 3–255 caracteres; não nulo |
| `supplier_id` | BIGINT FK nullable | Não | FK para `suppliers.id`; ON DELETE SET NULL |
| `categoria` | VARCHAR(100) | Sim | Valor de enum controlado (ver seção 5.2) |
| `valor_original` | DECIMAL(10,2) | Sim | > 0; sem negativo |
| `valor_pago` | DECIMAL(10,2) | Auto | Inicia em 0; incrementado a cada pagamento |
| `valor_pendente` | DECIMAL(10,2) | Auto | `valor_original - valor_pago`; ≥ 0 |
| `data_vencimento` | DATE | Sim | ≥ data de cadastro |
| `data_pagamento` | DATE nullable | Auto | Preenchido no primeiro pagamento |
| `status` | ENUM | Auto | Pendente / Vencido / Pago / Parcial |
| `prioridade` | ENUM | Sim | Baixa / Média / Alta / Crítica |
| `forma_pagamento` | VARCHAR(100) nullable | Cond. | Obrigatório ao registrar pagamento |
| `observacoes` | TEXT nullable | Não | Máx. 1.000 caracteres |
| `created_at` | TIMESTAMP | Auto | Gerado pelo Eloquent |
| `updated_at` | TIMESTAMP | Auto | Atualizado pelo Eloquent |

### 3.2 Interface TypeScript (Frontend)

```typescript
export interface ContaPagar {
  id: number;
  codigo: string;
  descricao: string;
  supplier_id?: number;
  fornecedor?: string;           // supplier.name normalizado no frontend
  categoria: CategoriaContaPagar;
  valor_original: number;
  valor_pago: number;
  valor_pendente: number;
  data_vencimento: string;       // ISO 8601: YYYY-MM-DD
  data_pagamento?: string;       // ISO 8601: YYYY-MM-DD
  status: StatusContaPagar;
  prioridade: PrioridadeContaPagar;
  forma_pagamento?: string;
  observacoes?: string;
  created_at: string;
}

export type StatusContaPagar = 'Pendente' | 'Vencido' | 'Pago' | 'Parcial';

export type PrioridadeContaPagar =
  | 'Baixa'
  | 'Média'
  | 'Alta'
  | 'Crítica';

export type CategoriaContaPagar =
  | 'Equipamentos'
  | 'Materiais'
  | 'Medicamentos'
  | 'Serviços'
  | 'Aluguel'
  | 'Energia'
  | 'Telefone'
  | 'Internet'
  | 'Impostos'
  | 'Outros';
```

### 3.3 Payload de Criação (POST /financeiro/contas-pagar)

```typescript
export interface CreateContaPagarPayload {
  descricao: string;
  supplier_id?: number;
  categoria: CategoriaContaPagar;
  valor_original: number;
  data_vencimento: string;       // YYYY-MM-DD
  prioridade: PrioridadeContaPagar;
  observacoes?: string;
}
```

### 3.4 Payload de Pagamento (PATCH /financeiro/contas-pagar/:id/pagar)

```typescript
export interface PagamentoContaPayload {
  valor_pago: number;            // > 0 e ≤ valor_pendente
  data_pagamento: string;        // YYYY-MM-DD; ≤ hoje
  forma_pagamento: string;
  observacoes?: string;
}
```

---

## 4. Ciclo de Vida e Máquina de Estados

```
                    ┌─────────────┐
                    │   CRIAÇÃO   │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  PENDENTE   │◄──────────────────────┐
                    └──────┬──────┘                       │
                           │                              │
          ┌────────────────┼────────────────┐             │
          │                │                │             │
    vencimento         pagamento        pagamento         │
    passado            parcial          integral          │
          │                │                │             │
          ▼                ▼                ▼             │
   ┌──────────┐    ┌──────────────┐  ┌──────────┐        │
   │ VENCIDO  │    │   PARCIAL    │  │   PAGO   │        │
   └────┬─────┘    └──────┬───────┘  └──────────┘        │
        │                 │                               │
        │       pagamento integral                        │
        │                 │                               │
        └────────┬─────────┘                             │
                 │                                       │
           cancelamento                       cancelamento
           de pagamento                       de pagamento
                 │                                       │
                 └───────────────────────────────────────┘
```

### 4.1 Transições de Status

| De | Para | Evento | Condição |
|---|---|---|---|
| Pendente | Vencido | Job diário ou consulta | `data_vencimento < HOJE` |
| Pendente | Parcial | Registrar pagamento | `valor_pago < valor_original` |
| Pendente | Pago | Registrar pagamento | `valor_pago = valor_original` |
| Vencido | Parcial | Registrar pagamento | `valor_pago < valor_original` |
| Vencido | Pago | Registrar pagamento | `valor_pago = valor_original` |
| Parcial | Pago | Registrar pagamento | `nova soma ≥ valor_original` |
| Pago | Pendente | Cancelar pagamento | Apenas usuários com papel `financeiro_admin` |
| Parcial | Pendente | Cancelar pagamento | Reverte último lançamento no FluxoCaixa |

### 4.2 Regra de Vencimento Automático (RN-01)
O status **Vencido** é calculado dinamicamente: a query no backend compara `data_vencimento` com a data atual. Não existe job de migração de status em banco — o status em banco é `Pendente` e a leitura o classifica como `Vencido` quando `data_vencimento < HOJE` e `status IN ('Pendente')`.

> **ATENÇÃO**: O campo `status` no banco nunca deve ser gravado como `Vencido` pelo backend — isso é responsabilidade da camada de leitura, evitando inconsistências.

---

## 5. Regras de Negócio (RN)

### RN-01 — Código Único Automático
- O campo `codigo` é gerado automaticamente no formato `CP-NNNN` (sequencial, com zero-padding de 4 dígitos).
- Nunca é editável pelo usuário.
- Deve ser único na base de dados (constraint `UNIQUE`).

### RN-02 — Valor Original Imutável Após Pagamento
- Após o primeiro pagamento registrado (`valor_pago > 0`), o campo `valor_original` **não pode ser alterado**.
- Tentativa de edição do `valor_original` com `valor_pago > 0` retorna HTTP 422.

### RN-03 — Valor Pendente Calculado
- `valor_pendente = valor_original - valor_pago`.
- Nunca pode ser negativo (mínimo 0).
- É recalculado e gravado a cada operação de pagamento.

### RN-04 — Pagamento Não Pode Exceder Saldo Pendente
- `valor_pago_no_ato ≤ valor_pendente atual`.
- Backend valida: `'valor_pago' => 'max:' . $conta->valor_pendente`.
- Frontend exibe o saldo pendente no modal e rejeita valor superior antes do envio.

### RN-05 — Data de Pagamento
- `data_pagamento` não pode ser futura (≤ data atual do servidor).
- Deve ser ≥ `data_vencimento - 120 dias` (proteção contra retroatividade excessiva; configurável).

### RN-06 — Exclusão Restrita
- Contas com `valor_pago > 0` **não podem ser excluídas** (retorna HTTP 422 com mensagem explicativa).
- Contas com status `Pago` não são excluídas, apenas inativadas logicamente (soft delete, versão futura).
- Exclusão de contas `Pendente` sem nenhum pagamento é permitida para usuários com papel `financeiro_admin`.

### RN-07 — Integração com Fluxo de Caixa
- A cada pagamento registrado com sucesso, um registro é criado automaticamente na tabela `fluxo_caixas` com `tipo = 'Saída'`.
- O lançamento no FluxoCaixa é atômico: ocorre dentro de `DB::transaction()`.
- Se o lançamento no FluxoCaixa falhar, o pagamento é revertido (rollback).

### RN-08 — Cancelamento de Pagamento
- Apenas usuários com role `financeiro_admin` ou `admin` podem cancelar pagamentos.
- Ao cancelar um pagamento: o último lançamento no FluxoCaixa vinculado é removido, `valor_pago` e `valor_pendente` são recalculados, status retorna a `Pendente` ou `Parcial` conforme saldo.
- Cancelamento de pagamento de conta `Pago` reverte para `Pendente` ou `Parcial`.

### RN-09 — Prioridade Não Altera Status
- `prioridade` é atributo de gestão interna (para ordenação e visualização).
- Nunca altera automaticamente o `status`.

### RN-10 — Categorias Fixas
As categorias aceitas são um enum controlado. Não é permitido cadastrar categorias fora da lista:
`Equipamentos | Materiais | Medicamentos | Serviços | Aluguel | Energia | Telefone | Internet | Impostos | Outros`

### RN-11 — Dashboard com Dados Reais
- Todos os totalizadores do dashboard (vencidas, vence hoje, vence amanhã, pagas no mês, total do período, todas pendentes) são calculados exclusivamente pelo backend.
- O frontend **não deve** conter dados mockados, arrays fixos ou cálculos locais de totalizadores.
- Estado inicial: todos os cards começam com `R$ 0,00` enquanto a requisição está em andamento (`loading`).

### RN-12 — Paginação Obrigatória na Listagem
- A rota `GET /financeiro/contas-pagar` sempre retorna dados paginados (padrão: 15 itens/página).
- O frontend deve exibir controles de paginação quando `last_page > 1`.

### RN-13 — Acesso Autenticado
- Todas as rotas de Contas a Pagar exigem token JWT válido (Bearer Token via Laravel Sanctum).
- Requisições sem token ou com token expirado retornam HTTP 401.
- O frontend intercepta 401 e redireciona para `/login` sem expor detalhes do erro.

### RN-14 — Forma de Pagamento
As formas aceitas são:
`Dinheiro | Pix | Transferência | Boleto | Cartão de Débito | Cartão de Crédito | Cheque`

---

## 6. Requisitos Funcionais (RF)

### RF-01 — Listagem de Contas
- Listar contas com paginação (15/página por padrão).
- Filtrar por: `status`, `categoria`, `prioridade`, `supplier_id`, `data_inicio`, `data_fim`.
- Busca textual por: `descricao`, `codigo`, `fornecedor`.
- Ordenação padrão: `data_vencimento ASC`.
- Exibir badge colorido por status; exibir indicador visual para contas vencidas.

### RF-02 — Cadastro de Conta
- Formulário com campos: descrição, fornecedor (opcional), categoria, valor original, data de vencimento, prioridade, observações.
- Código gerado automaticamente (campo somente leitura no formulário).
- Confirmação visual após criação bem-sucedida.
- Atualizar lista e dashboard após criação.

### RF-03 — Edição de Conta
- Permite editar todos os campos exceto `codigo`.
- Bloquear edição de `valor_original` se já houver pagamentos (`valor_pago > 0`).
- Exibir aviso visual quando campo bloqueado.

### RF-04 — Exclusão de Conta
- Solicitar confirmação antes de excluir.
- Bloquear exclusão se `valor_pago > 0` com mensagem: *"Não é possível excluir contas com pagamentos registrados."*
- Atualizar lista após exclusão.

### RF-05 — Registro de Pagamento
- Modal dedicado com: valor a pagar (pré-preenchido com `valor_pendente`), data do pagamento (pré-preenchida com hoje), forma de pagamento, observações opcionais.
- Exibir saldo pendente atual e valor máximo permitido.
- Bloquear valor acima do saldo pendente.
- Confirmar e atualizar dashboard após pagamento.

### RF-06 — Dashboard de Totalizadores
- 5 cards:
  1. **Vencidas** — soma de `valor_pendente` de contas vencidas
  2. **Vence Hoje** — soma de `valor_pendente` com `data_vencimento = hoje`
  3. **Vence Amanhã** — soma de `valor_pendente` com `data_vencimento = amanhã`
  4. **Total do Mês** — soma de `valor_original` cadastradas no mês atual
  5. **Todas Pendentes** — soma de `valor_pendente` de todas as contas em aberto
- Clicar em cada card filtra a lista abaixo.
- Atualizar cards após qualquer operação de criação/edição/pagamento/exclusão.

### RF-07 — Alertas de Vencimento
- Contas vencidas: destacadas em vermelho com ícone de alerta.
- Contas com vencimento hoje: destacadas em laranja.
- Contas com vencimento em ≤ 3 dias: destacadas em amarelo.

### RF-08 — Relatório por Período
- Filtro por data início e fim.
- Exibir: lista de contas, totais por status, total geral.
- Exportável (implementação futura).

### RF-09 — Listagem por Fornecedor
- Filtrar contas por fornecedor específico.
- Exibir totais de `valor_original`, `valor_pago` e `valor_pendente` do fornecedor.

### RF-10 — Próximos Vencimentos no Dashboard
- Listar até 10 contas com vencimento mais próximo (pendentes).
- Exibir como cards clicáveis que filtram a lista principal.

---

## 7. Requisitos Técnicos (RT)

### RT-01 — Atomicidade de Pagamento
- Todo registro de pagamento deve ocorrer dentro de `DB::transaction()`.
- Inclui: atualização de `ContasPagar` + criação de `FluxoCaixa`.
- Em caso de erro em qualquer etapa, rollback completo.

### RT-02 — Integridade de Valores Monetários
- Backend: `DECIMAL(10,2)`.
- Frontend: usar `Number(value).toFixed(2)` antes de enviar; nunca strings não normalizadas.
- Formatação de exibição: `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.

### RT-03 — Paginação
- Backend: `paginate(15)` por padrão; aceitar `per_page` como parâmetro (máx. 100).
- Frontend: ler `data.last_page`, `data.current_page`, `data.total` da resposta paginada.

### RT-04 — Datas
- Tráfego sempre em formato ISO 8601 (`YYYY-MM-DD`) entre frontend e backend.
- Exibição para o usuário: `dd/MM/yyyy` (formatação no frontend).
- Backend: usar `Carbon` para todas as operações com datas.
- Frontend: nunca fazer operações de data com `new Date()` sem normalização de timezone.

### RT-05 — Requisições Paralelas Independentes
- Usar `Promise.allSettled()` para requisições paralelas independentes (ex.: carregamento de fornecedores + categorias).
- Nunca usar `Promise.all()` onde uma falha não deve impedir as demais.

### RT-06 — Tratamento de Erros HTTP
- 400: erro de validação de parâmetros (malformed request)
- 401: não autenticado → redirecionar para `/login`
- 403: sem permissão → exibir mensagem "Acesso negado"
- 404: conta não encontrada → exibir mensagem e atualizar lista
- 422: erro de regra de negócio → exibir mensagem traduzida ao usuário
- 500: erro interno → exibir mensagem genérica; registrar no console para debug

### RT-07 — Índices de Banco de Dados
```sql
-- Já definido na migration:
INDEX(status, data_vencimento)

-- Adicionar (performance):
INDEX(supplier_id)
INDEX(data_pagamento)
INDEX(created_at)
```

---

## 8. Contrato de API

Prefixo base: `/api/financeiro/contas-pagar`  
Autenticação: `Authorization: Bearer {token}` (obrigatório em todos os endpoints)  
Content-Type: `application/json`

### 8.1 Endpoints

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `GET` | `/` | Listar contas (paginado + filtros) | Sim |
| `POST` | `/` | Criar nova conta | Sim |
| `GET` | `/dashboard` | Totalizadores do dashboard | Sim |
| `GET` | `/vencidas` | Contas vencidas | Sim |
| `GET` | `/vencendo?dias=7` | Contas vencendo em N dias | Sim |
| `GET` | `/pagas` | Contas pagas (filtro por período) | Sim |
| `GET` | `/pendentes` | Contas pendentes | Sim |
| `GET` | `/por-fornecedor/:id` | Contas de um fornecedor | Sim |
| `GET` | `/relatorio-periodo` | Relatório por período | Sim |
| `GET` | `/:id` | Detalhes de uma conta | Sim |
| `PUT` | `/:id` | Atualizar conta | Sim |
| `DELETE` | `/:id` | Excluir conta | Sim |
| `PATCH` | `/:id/pagar` | Registrar pagamento | Sim |
| `PATCH` | `/:id/cancelar-pagamento` | Cancelar último pagamento | Sim |

### 8.2 Envelope de Resposta Padrão

**Sucesso:**
```json
{
  "success": true,
  "message": "Mensagem descritiva em português",
  "data": { ... }
}
```

**Erro:**
```json
{
  "success": false,
  "message": "Mensagem de erro em português",
  "errors": {
    "campo": ["Mensagem de validação"]
  }
}
```

**Listagem paginada:**
```json
{
  "success": true,
  "message": "Contas a pagar listadas com sucesso",
  "data": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 15,
    "total": 42,
    "data": [ ... ]
  }
}
```

### 8.3 Parâmetros de Listagem (GET /)

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `status` | string | Filtro por status: Pendente, Vencido, Pago, Parcial |
| `categoria` | string | Filtro por categoria |
| `prioridade` | string | Filtro por prioridade |
| `supplier_id` | integer | Filtro por fornecedor |
| `data_inicio` | date (YYYY-MM-DD) | Vencimento a partir de |
| `data_fim` | date (YYYY-MM-DD) | Vencimento até |
| `page` | integer | Página atual (padrão: 1) |
| `per_page` | integer | Itens por página (padrão: 15, máx: 100) |

### 8.4 Exemplo — Criar Conta (POST /)

**Request:**
```json
{
  "descricao": "Compra de materiais odontológicos",
  "supplier_id": 3,
  "categoria": "Materiais",
  "valor_original": 1200.50,
  "data_vencimento": "2026-04-15",
  "prioridade": "Alta",
  "observacoes": "Entrega prevista para 20/04/2026"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Conta a pagar criada com sucesso",
  "data": {
    "id": 47,
    "codigo": "CP-0047",
    "descricao": "Compra de materiais odontológicos",
    "supplier_id": 3,
    "categoria": "Materiais",
    "valor_original": "1200.50",
    "valor_pago": "0.00",
    "valor_pendente": "1200.50",
    "data_vencimento": "2026-04-15",
    "data_pagamento": null,
    "status": "Pendente",
    "prioridade": "Alta",
    "forma_pagamento": null,
    "observacoes": "Entrega prevista para 20/04/2026",
    "created_at": "2026-03-27T10:00:00.000000Z",
    "updated_at": "2026-03-27T10:00:00.000000Z",
    "supplier": {
      "id": 3,
      "name": "Dental Prime"
    }
  }
}
```

### 8.5 Exemplo — Registrar Pagamento (PATCH /:id/pagar)

**Request:**
```json
{
  "valor_pago": 1200.50,
  "data_pagamento": "2026-03-27",
  "forma_pagamento": "Pix",
  "observacoes": "Pagamento integral via Pix"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Pagamento registrado com sucesso",
  "data": {
    "id": 47,
    "codigo": "CP-0047",
    "valor_original": "1200.50",
    "valor_pago": "1200.50",
    "valor_pendente": "0.00",
    "status": "Pago",
    "data_pagamento": "2026-03-27",
    "forma_pagamento": "Pix"
  }
}
```

**Response 422 (valor excede pendente):**
```json
{
  "success": false,
  "message": "The valor pago field must not be greater than 1200.5.",
  "errors": {
    "valor_pago": ["The valor pago field must not be greater than 1200.5."]
  }
}
```

---

## 9. Segurança (OWASP Top 10)

### 9.1 A01 — Broken Access Control
- **Backend**: Todas as rotas dentro do grupo `middleware(['auth:sanctum'])`.
- **Regra de autorização**: Operações destrutivas (delete, cancelar pagamento) exigem verificação de role via `Gate::authorize()` ou Policy.
- **Frontend**: Esconder botões de ação (excluir, cancelar) para usuários sem permissão, baseado nos dados do contexto de autenticação.
- **Nunca confiar no frontend** para controle de acesso — o backend sempre valida.

```php
// Backend: exemplo de autorização por Policy
public function destroy(ContasPagar $contasPagar): JsonResponse
{
    $this->authorize('delete', $contasPagar); // ContasPagarPolicy
    // ...
}
```

### 9.2 A02 — Cryptographic Failures
- Toda comunicação via **HTTPS** (TLS 1.2+). Não permitir HTTP em produção.
- Tokens JWT/Sanctum transmitidos apenas via `Authorization: Bearer`, nunca em URLs ou cookies sem `HttpOnly`.
- Senhas nunca logadas ou retornadas em respostas de API.

### 9.3 A03 — Injection
- **Backend**: Usar **exclusivamente Eloquent ORM e Query Builder** com bindings parametrizados. Proibido concatenar strings em queries SQL.
- **Validação de entrada**: Todo campo validado via `$request->validate()` antes de qualquer operação.
- **Frontend**: Nunca usar `dangerouslySetInnerHTML` com dados da API. Renderizar valores monetários via `Intl.NumberFormat`, nunca via HTML cru.

```php
// CORRETO — parametrizado:
$query->where('status', $request->status);

// PROIBIDO — injeção em potencial:
$query->whereRaw("status = '{$request->status}'");
```

### 9.4 A04 — Insecure Design
- Validação em **duas camadas**: frontend (UX imediata) + backend (fonte da verdade).
- Nunca expor IDs sequenciais em URLs sem validar ownership (usar Eloquent Route Model Binding).
- Campos calculados (`valor_pendente`, `codigo`, `status`) nunca aceitos como input do usuário — calculados pelo servidor.

### 9.5 A05 — Security Misconfiguration
- **CORS**: configurado em `config/cors.php` com `allowed_origins` restrito ao domínio do frontend. Nunca `'*'` em produção.
- Headers de segurança: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin`.
- Erros 500 em produção **nunca expõem stack trace** ao cliente (configurar `APP_DEBUG=false`).

### 9.6 A06 — Vulnerable Components
- Manter `composer.json` e `package.json` atualizados.
- Executar `composer audit` e `npm audit` no CI/CD.

### 9.7 A07 — Authentication Failures
- Token Sanctum com expiração configurada (recomendado: 8 horas de inatividade).
- Frontend intercepta 401 via `axios.interceptors.response` e redireciona para login.
- Não armazenar token em `localStorage` se possível; preferir `HttpOnly Cookie` (configuração futura).

### 9.8 A08 — Integrity Failures
- Validar `valor_pago ≤ valor_pendente` no backend (nunca só no frontend).
- Operações financeiras dentro de transação de banco (`DB::transaction()`).

### 9.9 A09 — Logging & Monitoring Failures
- Registrar no log de auditoria: quem criou, editou, pagou ou excluiu cada conta (ver seção 13).
- Nunca logar tokens, senhas ou dados sensíveis de clientes.

### 9.10 A10 — Server-Side Request Forgery (SSRF)
- O módulo Contas a Pagar não faz requisições a URLs externas.
- Qualquer integração bancária futura deve ser feita via serviço isolado com whitelist de domínios.

---

## 10. Padrão Backend (Laravel)

### 10.1 Estrutura de Arquivos

```
app/
├── Http/
│   ├── Controllers/
│   │   └── ContasPagarController.php    ← Controller REST
│   ├── Requests/
│   │   ├── StoreContaPagarRequest.php   ← Validação de criação
│   │   ├── UpdateContaPagarRequest.php  ← Validação de edição
│   │   └── PagarContaRequest.php        ← Validação de pagamento
│   └── Resources/
│       └── ContaPagarResource.php       ← Transformação de saída
├── Models/
│   └── ContasPagar.php                  ← Model Eloquent
├── Policies/
│   └── ContasPagarPolicy.php            ← Autorização por role
├── Services/
│   └── ContasPagarService.php           ← Regras de negócio isoladas
└── Services/
    └── FluxoCaixaService.php            ← Abstração do FluxoCaixa
```

### 10.2 Form Requests (Validação)

```php
// StoreContaPagarRequest.php
public function rules(): array
{
    return [
        'descricao'      => 'required|string|min:3|max:255',
        'supplier_id'    => 'nullable|integer|exists:suppliers,id',
        'categoria'      => 'required|in:Equipamentos,Materiais,Medicamentos,Serviços,Aluguel,Energia,Telefone,Internet,Impostos,Outros',
        'valor_original' => 'required|numeric|min:0.01|max:9999999.99',
        'data_vencimento'=> 'required|date|after_or_equal:today',
        'prioridade'     => 'required|in:Baixa,Média,Alta,Crítica',
        'observacoes'    => 'nullable|string|max:1000',
    ];
}

public function messages(): array
{
    return [
        'descricao.required'       => 'A descrição é obrigatória.',
        'descricao.min'            => 'A descrição deve ter no mínimo 3 caracteres.',
        'categoria.in'             => 'Categoria inválida.',
        'valor_original.min'       => 'O valor deve ser maior que zero.',
        'data_vencimento.after_or_equal' => 'A data de vencimento não pode ser anterior a hoje.',
        'prioridade.in'            => 'Prioridade inválida.',
    ];
}
```

### 10.3 Service Layer

```php
// ContasPagarService.php
class ContasPagarService
{
    public function registrarPagamento(ContasPagar $conta, array $dados): ContasPagar
    {
        return DB::transaction(function () use ($conta, $dados) {
            $valorPago = $dados['valor_pago'];

            if ($valorPago > $conta->valor_pendente) {
                throw new \InvalidArgumentException(
                    'Valor do pagamento excede o saldo pendente.'
                );
            }

            $conta->valor_pago    += $valorPago;
            $conta->valor_pendente = max(0, $conta->valor_original - $conta->valor_pago);
            $conta->data_pagamento = $dados['data_pagamento'];
            $conta->forma_pagamento = $dados['forma_pagamento'];
            $conta->status = $conta->valor_pendente <= 0 ? 'Pago' : 'Parcial';

            if (!empty($dados['observacoes'])) {
                $conta->observacoes = $dados['observacoes'];
            }

            $conta->save();

            // Lançamento atômico no FluxoCaixa
            FluxoCaixa::create([
                'tipo'           => 'Saída',
                'descricao'      => 'Pagamento: ' . $conta->descricao,
                'categoria'      => $conta->categoria,
                'valor'          => $valorPago,
                'data_movimento' => $dados['data_pagamento'],
                'forma_pagamento'=> $dados['forma_pagamento'],
                'conta_pagar_id' => $conta->id,
                'supplier_id'    => $conta->supplier_id,
                'observacoes'    => $dados['observacoes'] ?? null,
                'created_by'     => auth()->id(),
            ]);

            return $conta->fresh(['supplier']);
        });
    }
}
```

### 10.4 Regras de Consulta no Model

```php
// ContasPagar.php — Scopes obrigatórios
public function scopePendentes($query)
{
    return $query->whereIn('status', ['Pendente', 'Parcial']);
}

public function scopeVencidas($query)
{
    return $query->where('data_vencimento', '<', now()->toDateString())
                 ->whereIn('status', ['Pendente', 'Parcial']);
}

public function scopeVencendoEm($query, int $dias)
{
    return $query->whereBetween('data_vencimento', [
        now()->toDateString(),
        now()->addDays($dias)->toDateString()
    ])->whereIn('status', ['Pendente']);
}

// Código automático sequencial
public static function gerarCodigo(): string
{
    $ultimo = self::max('id') ?? 0;
    return 'CP-' . str_pad($ultimo + 1, 4, '0', STR_PAD_LEFT);
}
```

---

## 11. Padrão Frontend (React/TypeScript)

### 11.1 Estrutura de Arquivos

```
src/pages/Modulos/Financeiro/
├── ContasPagar/
│   ├── ContasPagarPage.tsx          ← Página principal (orquestrador)
│   ├── ModalCriarContaPagar.tsx     ← Modal de criação
│   ├── ModalEditarContaPagar.tsx    ← Modal de edição
│   ├── ModalRegistrarPagamento.tsx  ← Modal de pagamento
│   └── types.ts                     ← Interfaces TypeScript
└── components/
    └── ContasPagar/
        ├── ContasPagarList.tsx      ← Lista paginada
        ├── ContasPagarDashboard.tsx ← Cards de totalizadores (API)
        └── ContasPagarList.css      ← Estilos da lista
```

### 11.2 Proibições no Frontend

1. **PROIBIDO** importar ou usar `contasPagarFakes.ts` em qualquer componente de produção.
2. **PROIBIDO** calcular totalizadores localmente — todos vêm de `/financeiro/contas-pagar/dashboard`.
3. **PROIBIDO** usar `any` para tipagem de dados da API — usar as interfaces definidas em `types.ts`.
4. **PROIBIDO** fazer chamadas de API fora de `useEffect`, `useCallback` ou handlers de evento.
5. **PROIBIDO** mutações de estado diretas — sempre usar setState/dispatch.

### 11.3 Padrão de Carregamento de Dados

```tsx
const [contas, setContas] = useState<ContaPagar[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchContas = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await api.get('/financeiro/contas-pagar', {
      params: { page: currentPage, per_page: 15, ...activeFilters },
    });
    const paginator = response.data?.data;
    setContas(normalizeContas(paginator?.data ?? []));
    setLastPage(paginator?.last_page ?? 1);
    setTotal(paginator?.total ?? 0);
  } catch (err: any) {
    const msg = err?.response?.data?.message ?? 'Erro ao carregar contas a pagar.';
    setError(translateApiError(msg));
  } finally {
    setLoading(false);
  }
}, [currentPage, activeFilters]);

useEffect(() => { fetchContas(); }, [fetchContas]);
```

### 11.4 Normalização de Resposta da API

```typescript
const normalizeContas = (raw: any[]): ContaPagar[] =>
  raw.map((c) => ({
    id:              Number(c.id),
    codigo:          String(c.codigo ?? ''),
    descricao:       String(c.descricao ?? ''),
    supplier_id:     c.supplier_id ? Number(c.supplier_id) : undefined,
    fornecedor:      c.supplier?.name ?? c.fornecedor ?? 'Sem fornecedor',
    categoria:       c.categoria ?? 'Outros',
    valor_original:  Number(c.valor_original ?? 0),
    valor_pago:      Number(c.valor_pago ?? 0),
    valor_pendente:  Number(c.valor_pendente ?? 0),
    data_vencimento: c.data_vencimento ?? '',
    data_pagamento:  c.data_pagamento ?? undefined,
    status:          c.status ?? 'Pendente',
    prioridade:      c.prioridade ?? 'Média',
    forma_pagamento: c.forma_pagamento ?? undefined,
    observacoes:     c.observacoes ?? undefined,
    created_at:      c.created_at ?? '',
  }));
```

### 11.5 Tradução de Erros da API

```typescript
const translateApiError = (message: string): string => {
  const map: Record<string, string> = {
    'the valor pago field must not be greater than':
      'O valor do pagamento excede o saldo pendente.',
    'não é possível excluir conta com pagamentos':
      'Não é possível excluir contas com pagamentos registrados.',
    'unauthenticated':
      'Sessão expirada. Por favor, faça login novamente.',
    'this action is unauthorized':
      'Você não tem permissão para realizar esta ação.',
  };

  const lower = message.toLowerCase();
  for (const [key, value] of Object.entries(map)) {
    if (lower.includes(key)) return value;
  }
  return message;
};
```

### 11.6 Formatação de Valores

```typescript
// Moeda BR
export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

// Data para exibição
export const formatDate = (isoDate: string): string => {
  if (!isoDate) return '—';
  const [year, month, day] = isoDate.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

// Data para envio à API
export const toApiDate = (brDate: string): string => {
  // Converte dd/MM/yyyy → YYYY-MM-DD
  const parts = brDate.split('/');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return brDate; // já está no formato correto
};
```

### 11.7 Feedback Visual por Status

```typescript
export const STATUS_CONFIG: Record<StatusContaPagar, { label: string; color: string; bg: string }> = {
  Pendente: { label: 'Pendente',  color: '#b45309', bg: '#fef3c7' },
  Vencido:  { label: 'Vencido',   color: '#dc2626', bg: '#fee2e2' },
  Pago:     { label: 'Pago',      color: '#16a34a', bg: '#dcfce7' },
  Parcial:  { label: 'Parcial',   color: '#7c3aed', bg: '#ede9fe' },
};

export const PRIORIDADE_CONFIG: Record<PrioridadeContaPagar, { color: string }> = {
  Baixa:    { color: '#6b7280' },
  Média:    { color: '#2563eb' },
  Alta:     { color: '#d97706' },
  Crítica:  { color: '#dc2626' },
};
```

---

## 12. Validações e Mensagens de Erro

### 12.1 Validações de Criação

| Campo | Regra | Mensagem ao Usuário |
|---|---|---|
| `descricao` | Obrigatório, 3–255 chars | "A descrição é obrigatória (mín. 3 caracteres)." |
| `categoria` | Enum fixo | "Selecione uma categoria válida." |
| `valor_original` | > 0, ≤ 9.999.999,99 | "Informe um valor maior que zero." |
| `data_vencimento` | Obrigatória, ≥ hoje | "A data de vencimento não pode ser anterior a hoje." |
| `prioridade` | Enum fixo | "Selecione uma prioridade." |
| `observacoes` | Opcional, ≤ 1.000 chars | "Observações: máximo 1.000 caracteres." |

### 12.2 Validações de Pagamento

| Campo | Regra | Mensagem ao Usuário |
|---|---|---|
| `valor_pago` | > 0, ≤ `valor_pendente` | "O valor não pode exceder o saldo pendente de R$ X,XX." |
| `data_pagamento` | ≤ hoje | "A data de pagamento não pode ser futura." |
| `forma_pagamento` | Obrigatório | "Selecione a forma de pagamento." |

### 12.3 Validações de Exclusão

| Condição | Mensagem |
|---|---|
| `valor_pago > 0` | "Não é possível excluir contas com pagamentos registrados." |
| Status = Pago | "Contas já pagas não podem ser excluídas." |

---

## 13. Auditoria e Rastreabilidade

### 13.1 Campos de Auditoria no FluxoCaixa

Todo lançamento no Fluxo de Caixa deve incluir:
- `created_by`: ID do usuário autenticado (`auth()->id()`)
- `conta_pagar_id`: ID da conta vinculada
- `data_movimento`: data efetiva do pagamento
- `tipo`: sempre `'Saída'` para pagamentos de contas

### 13.2 Log de Operações Sensíveis

Registrar no Laravel Log (`storage/logs/`) os eventos:

| Evento | Nível | Dados Registrados |
|---|---|---|
| Conta criada | INFO | user_id, conta_id, valor, data_vencimento |
| Pagamento registrado | INFO | user_id, conta_id, valor_pago, forma_pagamento |
| Conta excluída | WARNING | user_id, conta_id, descricao |
| Pagamento cancelado | WARNING | user_id, conta_id, valor_revertido |
| Tentativa sem permissão | ERROR | user_id, ação, conta_id |

```php
// Exemplo no controller
Log::info('ContasPagar: pagamento registrado', [
    'user_id'        => auth()->id(),
    'conta_id'       => $conta->id,
    'valor_pago'     => $request->valor_pago,
    'forma_pagamento'=> $request->forma_pagamento,
    'timestamp'      => now()->toIso8601String(),
]);
```

### 13.3 Rastreabilidade de Pagamentos Parciais
- Cada pagamento parcial gera um registro separado no `fluxo_caixas`.
- O histórico de pagamentos de uma conta pode ser consultado via `conta->fluxoCaixa()->get()`.

---

## 14. LGPD e Proteção de Dados

### 14.1 Dados Sensíveis no Módulo
O módulo Contas a Pagar **não processa dados de pacientes** diretamente. Os dados tratados são:
- Dados financeiros da clínica (valores, datas, categorias)
- Dados de fornecedores (razão social, nome — não são dados pessoais sensíveis de pessoa física em regra)

### 14.2 Boas Práticas Aplicadas
- Não armazenar CPF/CNPJ de pessoas físicas nas observações (campo livre).
- Exportações de relatórios financeiros devem ser restritas a usuários com role `financeiro_admin`.
- Logs de auditoria não devem conter dados pessoais dos fornecedores além do `supplier_id`.
- Dados de contas a pagar não devem ser exibidos em telas sem autenticação.

---

## 15. Critérios de Aceite (DoD)

### 15.1 Backend
- [ ] Todas as rotas retornam HTTP correto (200, 201, 204, 401, 403, 404, 422, 500)
- [ ] Criação de conta gera `codigo` único automaticamente
- [ ] Pagamento registrado atualiza `valor_pago`, `valor_pendente` e `status` corretamente
- [ ] Pagamento lança registro em `fluxo_caixas` dentro de transaction
- [ ] Exclusão de conta com `valor_pago > 0` retorna 422 com mensagem
- [ ] Todas as rotas exigem autenticação (Sanctum)
- [ ] Form Requests traduzidos (mensagens em português)
- [ ] `valor_pendente` nunca é negativo
- [ ] `data_vencimento < hoje` com status Pendente é classificado como Vencido na leitura

### 15.2 Frontend
- [ ] Nenhuma importação de `contasPagarFakes.ts` em componentes de produção
- [ ] Totalizadores do dashboard carregados exclusivamente de `/financeiro/contas-pagar/dashboard`
- [ ] Loading state (`...`) exibido enquanto dados são carregados
- [ ] Erro de API exibido em português ao usuário
- [ ] Valores monetários formatados como `R$ X.XXX,XX`
- [ ] Datas exibidas como `dd/MM/yyyy`; enviadas à API como `YYYY-MM-DD`
- [ ] Modal de pagamento bloqueia valor superior ao `valor_pendente`
- [ ] Confirmação exibida antes de excluir conta
- [ ] Lista atualizada após toda operação (criar/editar/pagar/excluir)
- [ ] TypeScript sem erros (`get_errors` limpo)
- [ ] Cards de totalizadores clicáveis e filtram a lista

### 15.3 API / Integração
- [ ] Token Bearer obrigatório em toda requisição
- [ ] 401 redireciona para `/login`
- [ ] `Promise.allSettled` para chamadas paralelas independentes
- [ ] CORS configurado para o domínio correto
- [ ] HTTPS em produção

---

## 16. Checklist de Conformidade

### Para cada novo desenvolvimento neste módulo, verificar:

**Segurança**
- [ ] Input validado no backend (nunca confiar só no frontend)
- [ ] Sem concatenação de strings em queries SQL
- [ ] Operações financeiras dentro de `DB::transaction()`
- [ ] Autorização verificada no controller ou Policy
- [ ] Nenhum dado sensível no log

**Qualidade de Código**
- [ ] Interfaces TypeScript definidas; sem `any` desnecessário
- [ ] Normalização de resposta da API antes de usar os dados
- [ ] Erro de API traduzido para português antes de exibir
- [ ] Sem dados mockados/fakes em componentes de produção
- [ ] `useCallback` para funções de fetch que são dependências de `useEffect`

**Experiência do Usuário**
- [ ] Loading state visível durante fetch
- [ ] Mensagens de erro claras e acionáveis
- [ ] Confirmação antes de ações destrutivas
- [ ] Atualização da lista após qualquer operação
- [ ] Estado vazio comunicado claramente (sem dados ≠ erro)

**Dados**
- [ ] `valor_pendente` recalculado pelo servidor; não aceito como input
- [ ] `codigo` gerado pelo servidor; campo somente leitura no formulário
- [ ] Datas ISO 8601 no tráfego API; `dd/MM/yyyy` na exibição
- [ ] `valor_pago` acumulado corretamente em pagamentos parciais múltiplos

---

*Documento versão 1.0 — Aprovado para implementação.*  
*Responsável: Equipe de Desenvolvimento — Sistema Odonto.*
