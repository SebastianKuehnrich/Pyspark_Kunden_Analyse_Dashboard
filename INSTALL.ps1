# ============================================
# Dashboard Installation
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Kunden-Analyse Dashboard" -ForegroundColor Cyan
Write-Host "  Installation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Prüfe Node.js
Write-Host "[1/4] Pruefe Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "FEHLER: Node.js ist nicht installiert!" -ForegroundColor Red
    Write-Host "Bitte installiere Node.js von: https://nodejs.org" -ForegroundColor Yellow
    pause
    exit 1
}
Write-Host "  Node.js gefunden: $nodeVersion" -ForegroundColor Green

# Installiere npm Pakete
Write-Host ""
Write-Host "[2/4] Installiere Abhaengigkeiten..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "FEHLER bei npm install!" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "  Abhaengigkeiten installiert!" -ForegroundColor Green

# Erstelle Desktop-Verknüpfung
Write-Host ""
Write-Host "[3/4] Erstelle Desktop-Verknuepfung..." -ForegroundColor Yellow
$WshShell = New-Object -ComObject WScript.Shell
$Desktop = [System.Environment]::GetFolderPath("Desktop")
$Shortcut = $WshShell.CreateShortcut("$Desktop\Kunden Dashboard.lnk")
$Shortcut.TargetPath = "$PSScriptRoot\Dashboard_Desktop.bat"
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.Description = "Kunden-Analyse Dashboard"
$Shortcut.Save()
Write-Host "  Verknuepfung erstellt auf Desktop!" -ForegroundColor Green

# Build für Production (optional)
Write-Host ""
Write-Host "[4/4] Erstelle Production Build (optional)..." -ForegroundColor Yellow
$build = Read-Host "Production Build erstellen? (j/n)"
if ($build -eq "j") {
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Production Build erstellt in /dist" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  INSTALLATION ABGESCHLOSSEN!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Starte das Dashboard mit:" -ForegroundColor Cyan
Write-Host "  - Doppelklick auf Desktop-Verknuepfung" -ForegroundColor White
Write-Host "  - Oder: Dashboard_Desktop.bat" -ForegroundColor White
Write-Host ""
pause

