@echo off
REM Script para fazer build de produção do dashboard-odonto

cd /d "%~dp0"
node node_modules/react-scripts/bin/react-scripts.js build
