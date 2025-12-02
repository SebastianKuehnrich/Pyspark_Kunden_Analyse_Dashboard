@echo off
REM ============================================
REM Dashboard Desktop App (Chrome App-Modus)
REM ============================================

title Dashboard Starter
cls

echo ========================================
echo   Kunden-Analyse Dashboard
echo   Desktop App Starter
echo ========================================
echo.

REM Prüfe ob Server bereits läuft
curl -s http://localhost:5173 >nul 2>&1
if not errorlevel 1 (
    echo Dashboard-Server laeuft bereits!
    echo Oeffne Dashboard...
    goto :open_app
)

echo Starte Dashboard-Server...
REM Starte npm dev im Hintergrund
start /MIN cmd /c "npm run dev"

REM Warte auf Server-Start
echo Warte auf Server...
:wait_loop
timeout /t 2 /nobreak >nul
curl -s http://localhost:5173 >nul 2>&1
if errorlevel 1 (
    goto :wait_loop
)

echo Server bereit!
timeout /t 1 /nobreak >nul

:open_app
REM Versuche Chrome im App-Modus zu öffnen (ohne Browser-UI)
where chrome >nul 2>&1
if not errorlevel 1 (
    start "" chrome --app=http://localhost:5173 --window-size=1400,900
    echo Dashboard geoeffnet im App-Modus!
) else (
    REM Fallback: Öffne im Standard-Browser
    start "" "http://localhost:5173"
    echo Dashboard geoeffnet im Browser!
)

echo.
echo Dashboard laeuft auf http://localhost:5173
echo.
echo WICHTIG: Schliesse dieses Fenster NICHT!
echo          Das Dashboard laeuft im Hintergrund.
echo.
pause

