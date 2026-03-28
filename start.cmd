@echo off
REM Script para iniciar o servidor de desenvolvimento do dashboard-odonto
REM Este arquivo contorna o problema do PowerShell com node_modules\.bin

cd /d "%~dp0"
node node_modules/react-scripts/bin/react-scripts.js start
