@echo off

REM Navegar para a pasta do Google Chrome
cd /d "%~1"


REM Abrir o Google Chrome com o parâmetro --remote-debugging-port=9222
node ./src/cmdCall.mjs %2