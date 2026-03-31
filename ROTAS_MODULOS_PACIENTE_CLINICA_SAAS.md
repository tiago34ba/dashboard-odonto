# Rotas por Modulo - Paciente, Clinica e SaaS

Documento de referencia das rotas atualmente ativas no sistema.

Data: 2026-03-31

## 1) Modulo Paciente (Portal do Paciente)

### Frontend (dashboard-odonto)
- `/portal`
- `/portal/login`
- `/portal/registro`
- `/portal/agendar`
- `/portal/meus-agendamentos`

Fonte: `src/App.tsx`

### API (odonto)
Prefixo base: `/api/portal`

Publicas:
- `POST /register`
- `POST /login`
- `GET /dentistas`
- `GET /procedimentos`
- `GET /horarios-disponiveis`

Autenticadas (`auth:sanctum` + `patient.guard`):
- `POST /agendar`
- `GET /meus-agendamentos`
- `PATCH /agendamentos/{id}/cancelar`
- `GET /perfil`

### Fluxo de Agendamento do Paciente

```
[Paciente]
    |
    1. GET /api/portal/dentistas
       → Lista dentistas disponíveis para seleção
    |
    2. GET /api/portal/procedimentos
       → Lista procedimentos disponíveis
    |
    3. GET /api/portal/horarios-disponiveis
       Params: dentista_id, data, procedure_id (opcional)
       → Retorna horários livres do dentista na data
    |
    4. POST /api/portal/agendar
       Body: { dentista_id, procedure_id, data_hora, observacoes }
       → Cria o agendamento na tabela schedulings
       → Visível internamente em /api/schedulings para:
          - secretaria.odonto
          - admin
          - dentista
          - auxiliar de dentista
    |
    5. GET /api/portal/meus-agendamentos
       → Lista todos os agendamentos do paciente autenticado
    |
    6. PATCH /api/portal/agendamentos/{id}/cancelar
       → Cancela agendamento (somente o próprio paciente)
```

### Frontend - Páginas do Portal de Agendamento
| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/portal/login` | `PortalLoginPage` | Login do paciente |
| `/portal/registro` | `PortalRegistroPage` | Cadastro novo paciente |
| `/portal/agendar` | `PortalAgendarPage` | Wizard de agendamento (dentista → procedimento → horário → confirmar) |
| `/portal/meus-agendamentos` | `PortalMeusAgendamentosPage` | Histórico e cancelamento |

### Regras de negócio do agendamento
- Agendamento com antecedência mínima configurada no backend.
- Bloqueio de horários passados e domingos.
- Conflito de agenda calculado pela duração real do procedimento.
- Status possíveis: `agendado`, `confirmado`, `finalizado`, `cancelado`.
- Cancelamento permitido apenas pelo próprio paciente autenticado.
- Agendamento criado no portal aparece automaticamente na agenda interna da clínica.

Fonte: `odonto/routes/api.php`, `odonto/app/Http/Controllers/PortalPacienteController.php`

---

## 2) Modulo Clinica (Operacao Interna)

### Frontend (dashboard-odonto)
Principais rotas de operacao da clinica:
- `/dashboard/pessoas/pacientes/PatientsPage`
- `/dashboard/pessoas/usuarios`
- `/dashboard/pessoas/funcionarios`
- `/dashboard/agendamentos`
- `/dashboard/cadastros/procedimentos`
- `/dashboard/cadastros/convenios`
- `/dashboard/cadastros/grupos-anamnese`
- `/dashboard/cadastros/formas-pgto`
- `/dashboard/financeiro`
- `/dashboard/financeiro/contas-pagar`
- `/dashboard/financeiro/contas-receber`
- `/dashboard/consultas`
- `/dashboard/odontogramas`
- `/dashboard/tratamentos`
- `/dashboard/orcamentos`

Fonte: `src/App.tsx`

### API (odonto)
Principais grupos de endpoints internos (protegidos por `auth:sanctum` + `api.permission`):
- `/api/pessoas/pacientes/*`
- `/api/pessoas/usuarios/*`
- `/api/pessoas/funcionarios/*`
- `/api/schedulings/*`
- `/api/procedures/*`
- `/api/treatment-plans/*`
- `/api/groups-anamnese/*`
- `/api/financeiro/*`
- `/api/pacientes/{pacienteId}/odontograma/*`
- `/api/reports/*`

Fonte: `odonto/routes/api.php`

---

## 3) Modulo SaaS (Admin Portal)

### Frontend (dashboard-odonto)
- `/admin/login`
- `/admin`

Fonte: `src/App.tsx`

### API (odonto)
Mensalidade e controle SaaS (protegido):
- `GET /api/saas/mensalidades`
- `POST /api/saas/mensalidades/sync`
- `GET /api/saas/inadimplencias`
- `GET /api/saas/clientes/clinicas`

Solicitacoes SaaS:
- `POST /api/saas/solicitacoes` (publico)
- `GET /api/saas/solicitacoes` (protegido)
- `PATCH /api/saas/solicitacoes/{id}/aprovar` (protegido)
- `PATCH /api/saas/solicitacoes/{id}/rejeitar` (protegido)
- `PATCH /api/saas/solicitacoes/{id}/confirmar-pagamento` (protegido)

Fonte: `odonto/routes/api.php`

---

## Observacao de seguranca
- Rotas internas da clinica e do SaaS dependem de autenticacao e middleware de permissao.
- Rotas do portal de paciente possuem separacao entre publico e autenticado.
