# Frontend Release Checklist

## 1) CI minima obrigatoria
- Pipeline executa `npm ci`.
- Pipeline executa `npm test -- --watchAll=false`.
- Pipeline executa `npm run build`.
- Merge para branch principal somente com pipeline verde.

## 2) Qualidade de release
- Confirmar variaveis obrigatorias:
  - `REACT_APP_API_URL`
  - `REACT_APP_API_BASE_URL`
  - `REACT_APP_ENVIRONMENT`
  - `REACT_APP_RELEASE`
- Confirmar variaveis de monitoracao (Sentry):
  - `REACT_APP_ENABLE_SENTRY`
  - `REACT_APP_SENTRY_DSN`
  - `REACT_APP_SENTRY_ENVIRONMENT`
  - `REACT_APP_SENTRY_TRACES_SAMPLE_RATE`
- Executar build em ambiente consistente (Node 20, lockfile atualizado).

## 3) Monitoracao em producao
- Validar inicializacao do Sentry no bootstrap da aplicacao.
- Confirmar captura de erros de runtime via ErrorBoundary.
- Confirmar captura de erros de API nos interceptors Axios.
- Validar release no painel Sentry usando `REACT_APP_RELEASE`.

## 4) Pos-deploy
- Executar smoke automatico da rota `/login`.
- Executar smoke automatico da rota `/`.
- Confirmar retorno HTTP 200 nas rotas criticas.

## 5) Go/No-Go
- GO: CI verde + smoke pos-deploy verde + monitoracao ativa.
- NO-GO: qualquer falha de teste, build, ou smoke pos-deploy.