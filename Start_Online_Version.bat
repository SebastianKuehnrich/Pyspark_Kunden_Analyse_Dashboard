@echo off
cls
echo ========================================
echo   Kunden-Analyse Dashboard
echo   Online-Version mit CSV-Upload
echo ========================================
echo.

REM Prüfe ob Flask Backend Dependencies installiert sind
if not exist "venv\" (
    echo Erstelle virtuelle Python-Umgebung...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo Installiere Backend-Dependencies...
    pip install -r backend_requirements.txt
) else (
    call venv\Scripts\activate.bat
)

echo.
echo [1/2] Starte Flask Backend-Server...
start /MIN cmd /c "venv\Scripts\python.exe backend_server.py"

timeout /t 3 /nobreak >nul

echo [2/2] Starte React Frontend...
start /MIN cmd /c "npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   Dashboard Online!
echo ========================================
echo.
echo Backend API: http://localhost:5000
echo Frontend:    http://localhost:5173
echo.
echo Dashboard oeffnet sich automatisch...
echo.

REM Öffne Browser
start "" "http://localhost:5173"

echo.
echo WICHTIG: Schliesse dieses Fenster NICHT!
echo          Server laeuft im Hintergrund.
echo.
echo Zum Beenden: STRG+C druecken
echo.
pause

