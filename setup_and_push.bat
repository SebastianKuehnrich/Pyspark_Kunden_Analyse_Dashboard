@echo off
chcp 65001 >nul
cd /d "C:\Users\sebas\(aa)Programmieren\WebstormProjects\Kunden_Dashboard"

echo ========================================
echo  Git Setup und Push zu GitHub
echo ========================================
echo.
echo Repository: https://github.com/SebastianKuehnrich/Pyspark_Kunden_Analyse_Dashboard.git
echo.

echo [1/7] Pruefe Git Status...
git status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Git noch nicht initialisiert. Initialisiere jetzt...
    git init
    echo Git initialisiert!
)
echo.

echo [2/7] Pruefe Remote...
git remote -v | findstr "origin" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Fuege Remote hinzu...
    git remote add origin https://github.com/SebastianKuehnrich/Pyspark_Kunden_Analyse_Dashboard.git
    echo Remote hinzugefuegt!
) else (
    echo Remote bereits vorhanden.
)
echo.

echo [3/7] Pruefe data.json...
if not exist "data.json" (
    echo.
    echo WARNUNG: data.json nicht gefunden!
    echo Bitte erst PySpark ausfuehren!
    echo.
    pause
    exit /b 1
) else (
    echo data.json gefunden!
)
echo.

echo [4/7] Zeige zu pushende Dateien...
git status --short
echo.

echo [5/7] Fuege Dateien hinzu...
git add .
echo Dateien hinzugefuegt!
echo.

echo [6/7] Erstelle Commit...
git commit -m "Initial deployment: React Dashboard with PySpark data"
if %ERRORLEVEL% NEQ 0 (
    echo Keine Aenderungen oder bereits committed.
)
echo.

echo [7/7] Push zu GitHub...
git branch -M main
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  ERFOLGREICH ZU GITHUB GEPUSHT!
    echo ========================================
    echo.
    echo Naechster Schritt:
    echo 1. Gehe zu https://railway.app/
    echo 2. Klicke "New Project"
    echo 3. Waehle "Deploy from GitHub repo"
    echo 4. Waehle: Pyspark_Kunden_Analyse_Dashboard
    echo 5. Klicke "Deploy"
    echo.
    echo Railway deployed automatisch in 2-3 Minuten!
    echo.
) else (
    echo.
    echo ========================================
    echo  FEHLER BEIM PUSH
    echo ========================================
    echo.
    echo Moegliche Loesungen:
    echo 1. Pruefe GitHub Login: git config --global user.name
    echo 2. Pruefe Berechtigungen auf GitHub
    echo 3. Falls schon gepusht: git pull origin main
    echo.
)

pause

