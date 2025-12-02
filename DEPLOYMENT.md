# 🚀 DEPLOYMENT GUIDE

## Was wird zu GitHub gepusht?

### ✅ Funktionale Dateien (werden gepusht):
- `src/` - React Components (App.jsx, Dashboard.jsx, etc.)
- `data.json` - Dashboard-Daten (von PySpark generiert)
- `index.html` - HTML Entry Point
- `package.json` - Dependencies
- `vite.config.js` - Build-Konfiguration
- `nixpacks.toml` - Railway Config
- `README.md` - Projekt-Info
- `generate_dashboard_data.py` - PySpark Script (Info für andere)
- `.gitignore` - Git Konfiguration

### ❌ Lokale Dateien (werden NICHT gepusht):
- Alle Anleitungen (RAILWAY_SCHNELLSTART.md, INTEGRATION_ANLEITUNG.md, etc.)
- Alle Batch-Scripts (*.bat)
- node_modules/
- dist/, build/
- ergebnisse/
- .env Dateien

---

## 🔄 Workflow

### Erste Setup:

```bash
# 1. Daten generieren
python generate_dashboard_data.py

# 2. Git initialisieren (falls noch nicht)
git init
git remote add origin https://github.com/SebastianKuehnrich/Pyspark_Kunden_Analyse_Dashboard.git

# 3. Pushen
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

### Daten aktualisieren:

```bash
# 1. Neue Daten generieren
python generate_dashboard_data.py

# 2. Pushen (nutze das Script)
git_push.bat

# Oder manuell:
git add data.json
git commit -m "Update data"
git push
```

---

## 🚂 Railway Setup

1. Gehe zu: https://railway.app/
2. Login mit GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Wähle: `SebastianKuehnrich/Pyspark_Kunden_Analyse_Dashboard`
5. Railway deployed automatisch! ✅

**Nach jedem Git Push** deployed Railway automatisch neu.

---

## 📋 Checkliste

- [ ] `data.json` existiert (PySpark ausgeführt)
- [ ] Lokaler Build-Test: `npm run build`
- [ ] Git Repository verbunden
- [ ] Zu GitHub gepusht
- [ ] Railway Projekt erstellt
- [ ] Deployment erfolgreich
- [ ] URL funktioniert

---

**Support**: Bei Fragen siehe die lokalen Anleitungen oder Railway Logs.
@echo off
chcp 65001 >nul
echo ========================================
echo  Git Push zu GitHub (Clean Version)
echo ========================================
echo.

echo Repository: https://github.com/SebastianKuehnrich/Pyspark_Kunden_Analyse_Dashboard.git
echo.

echo [INFO] Folgende Dateien werden NICHT gepusht (nur lokal):
echo   - Alle Anleitungen (*.md Dateien außer README.md)
echo   - Alle Batch-Scripts (*.bat)
echo   - Ergebnisse-Ordner
echo.

echo [1/5] Git Status...
git status
echo.

set /p CONTINUE="Fortfahren? (j/n): "
if /i not "%CONTINUE%"=="j" (
    echo Abgebrochen.
    pause
    exit /b 0
)

echo.
echo [2/5] Prüfe ob data.json existiert...
if not exist "data.json" (
    echo.
    echo WARNUNG: data.json nicht gefunden!
    echo Bitte erst PySpark ausfuehren: run_pyspark.bat
    echo.
    set /p CONTINUE_ANYWAY="Trotzdem fortfahren? (j/n): "
    if /i not "%CONTINUE_ANYWAY%"=="j" (
        echo Abgebrochen.
        pause
        exit /b 0
    )
)

echo.
echo [3/5] Dateien hinzufuegen...
git add .
echo.

echo [4/5] Commit erstellen...
set /p COMMIT_MSG="Commit Message (Enter fuer Standard): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Update Dashboard - %date%

git commit -m "%COMMIT_MSG%"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Keine Aenderungen zum Committen.
    pause
    exit /b 0
)

echo.
echo [5/5] Push zu GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  Erfolgreich gepusht!
    echo ========================================
    echo.
    echo Railway deployed automatisch in 2-3 Minuten.
    echo Pruefe: https://railway.app/dashboard
    echo.
) else (
    echo.
    echo ========================================
    echo  Push fehlgeschlagen!
    echo ========================================
    echo.
    echo Falls erster Push, fuehre folgendes aus:
    echo.
    echo git remote add origin https://github.com/SebastianKuehnrich/Pyspark_Kunden_Analyse_Dashboard.git
    echo git branch -M main
    echo git push -u origin main
    echo.
)

pause

