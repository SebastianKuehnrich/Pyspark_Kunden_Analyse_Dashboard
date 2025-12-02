@echo off
REM ============================================
REM Dashboard Desktop App Starter
REM ============================================

echo Starte Dashboard...

REM Prüfe ob npm dev server bereits läuft
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Server laeuft bereits...
    timeout /t 2 /nobreak >nul
    start "" "http://localhost:5173"
    exit
)

REM Starte npm dev server im Hintergrund
start /B cmd /c "npm run dev > nul 2>&1"

REM Warte bis Server bereit ist (max 30 Sekunden)
echo Warte auf Server...
for /L %%i in (1,1,30) do (
    timeout /t 1 /nobreak >nul
    curl -s http://localhost:5173 >nul 2>&1
    if not errorlevel 1 (
        echo Server bereit!
        goto :open_browser
    )
)

:open_browser
REM Öffne Dashboard im Standard-Browser (App-Modus wenn Chrome)
start "" "http://localhost:5173"

exit

