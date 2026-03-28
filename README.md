# Dashboard Odonto (Frontend) + Odonto (Backend)

Guia oficial de instalacao do projeto odontologico completo, com frontend React e backend Laravel.

## Visao Geral

- Frontend: `dashboard-odonto` (React + TypeScript)
- Backend: `odonto` (Laravel 12 + PHP 8.2+)
- Comunicacao local: frontend em `http://localhost:3000` e backend em `http://127.0.0.1:8000`

O frontend possui proxy para `/api` em `src/setupProxy.js`, apontando para `http://127.0.0.1:8000`.

## Pre-requisitos

- Node.js 18+ e npm
- PHP 8.2+
- Composer 2+
- MySQL 8+ (ou banco configurado no backend)
- Git

## 1. Clonar os repositorios

Se voce ainda nao tem os dois projetos localmente:

```bash
git clone https://github.com/tiago34ba/dashboard-odonto.git
git clone https://github.com/tiago34ba/odonto.git
```

## 2. Configurar e subir o Backend (Laravel)

### Windows (PowerShell)

```powershell
cd ..\odonto
composer install

# Se nao existir .env, crie com base no .env.example (quando houver)
if (!(Test-Path .env) -and (Test-Path .env.example)) { Copy-Item .env.example .env }

php artisan key:generate
```

Edite o arquivo `.env` do backend e configure o banco, por exemplo:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=odonto_db
DB_USERNAME=root
DB_PASSWORD=sua_senha
```

Depois rode:

```powershell
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

### Linux/macOS

```bash
cd ../odonto
composer install

if [ ! -f .env ] && [ -f .env.example ]; then cp .env.example .env; fi

php artisan key:generate
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

## 3. Configurar e subir o Frontend (React)

### Windows (PowerShell)

```powershell
cd ..\dashboard-odonto
npm install

# Cria .env.local com base no template
Copy-Item env.example .env.local -Force

npm start
```

### Linux/macOS

```bash
cd ../dashboard-odonto
npm install
cp env.example .env.local
npm start
```

## 4. Ajustar variaveis do Frontend

No arquivo `.env.local` do frontend, ajuste principalmente:

```env
REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api
REACT_APP_API_TIMEOUT=10000
REACT_APP_ENABLE_DEBUG=true
```

Observacao:
- Se a aplicacao usar chamadas para `/api`, o proxy do CRA ja redireciona para `127.0.0.1:8000`.

## 5. Verificacao rapida

1. Backend no ar em `http://127.0.0.1:8000`
2. Frontend no ar em `http://localhost:3000`
3. Acessar o dashboard e validar carregamento de dados

## Scripts uteis do Frontend

No diretorio `dashboard-odonto`:

```bash
npm start      # modo desenvolvimento
npm test       # testes
npm run build  # build de producao
```

## Problemas comuns

- Erro de CORS: confirme backend em `127.0.0.1:8000` e chamadas via `/api` ou `REACT_APP_API_BASE_URL` correto.
- Falha de conexao com banco: revise credenciais no `.env` do backend e se o banco existe.
- Dependencias quebradas: rode `composer install` (backend) e `npm install` (frontend) novamente.

## Documentacao complementar

- Padrao de relatorios: `RELATORIO_AGENDAMENTOS_PADRAO_ALTO_NIVEL.md`
- Regras de negocio financeiro: `CONTAS_PAGAR_REGRAS_NEGOCIO.md`
- Organizacao do sistema: `ORGANIZACAO_SISTEMA.md`
