@echo off
echo ========================================
echo   Dashboard Odonto - Setup Automatizado
echo ========================================
echo.

echo [1/5] Verificando dependencias...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado. Instale o Node.js 18+ primeiro.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: npm nao encontrado. Instale o npm primeiro.
    pause
    exit /b 1
)

echo [2/5] Instalando dependencias...
npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias do npm.
    pause
    exit /b 1
)

echo [3/5] Configurando variaveis de ambiente...
if not exist .env (
    echo REACT_APP_API_URL=http://localhost:8000/api > .env
    echo REACT_APP_ENCRYPTION_KEY=default-key-change-in-production >> .env
    echo Arquivo .env criado.
)

echo [4/5] Verificando configuracao da API...
echo Testando conexao com a API...
curl -s http://localhost:8000/api/dashboard/system-health >nul 2>nul
if %errorlevel% neq 0 (
    echo AVISO: Nao foi possivel conectar com a API.
    echo Certifique-se de que o backend Laravel esta rodando.
    echo Execute: php artisan serve (no diretorio do backend)
)

echo [5/5] Configurando TypeScript...
npx tsc --noEmit
if %errorlevel% neq 0 (
    echo AVISO: Erros de TypeScript encontrados. Verifique o codigo.
)

echo.
echo ========================================
echo    Setup do Frontend concluido!
echo ========================================
echo.
echo Proximos passos:
echo 1. Certifique-se de que o backend Laravel esta rodando
echo 2. Execute: npm start
echo 3. Acesse: http://localhost:3000
echo.
echo Configuracoes importantes:
echo - API URL: http://localhost:8000/api
echo - Porta do React: 3000
echo - Criptografia: Habilitada
echo.
pause
