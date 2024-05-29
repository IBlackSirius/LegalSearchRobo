@echo off

REM Navegar para a pasta do Google Chrome
cd /d "%~1"

REM Encerrar todos os processos do chrome.exe
taskkill /F /IM "%~2"

REM Aguarde um curto período de tempo para garantir que os processos sejam encerrados corretamente
ping 127.0.0.1 -n 2 > nul

REM Abrir o Google Chrome com o parâmetro --remote-debugging-port=9222
start "" /D "%~1" %~2 --remote-debugging-port=9222
