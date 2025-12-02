# Kunden-Analyse Dashboard - Desktop App

## 🚀 Schnellstart

1. **Doppelklick auf:** `Dashboard_Desktop.bat`
2. Dashboard öffnet sich automatisch als Desktop-App
3. Fertig!

## 📦 Erstinstallation

### Voraussetzungen
- Windows 10/11
- Node.js (wird automatisch geprüft)
- Git (für Updates)

### Installation

**Option 1: Automatische Installation**
1. Rechtsklick auf `INSTALL.ps1`
2. "Mit PowerShell ausführen"
3. Folge den Anweisungen

**Option 2: Manuelle Installation**
```cmd
npm install
```

Eine Desktop-Verknüpfung wird automatisch erstellt.

## 🎯 Verwendung

### Dashboard starten
- **Desktop-Verknüpfung:** Doppelklick auf "Kunden Dashboard"
- **Oder direkt:** Doppelklick auf `Dashboard_Desktop.bat`

### Daten aktualisieren
- **Mit GUI:** Doppelklick auf `Dashboard_Updater.vbs`
  - Schritt 1: Daten generieren
  - Schritt 2: Zu GitHub pushen (optional)
  - Schritt 3: Dashboard starten

### Als Installationspaket verschicken

Für die Weitergabe an Kunden:

**Dateien zum Verschicken:**
```
📦 Kunden_Dashboard_Paket/
├── 📄 INSTALL.ps1          (Installation)
├── 📄 Dashboard_Desktop.bat (Desktop-Starter)
├── 📄 package.json
├── 📄 vite.config.js
├── 📂 src/                  (React-Quellcode)
├── 📄 index.html
├── 📄 data.json             (Dashboard-Daten)
└── 📄 BENUTZER_ANLEITUNG.md (diese Datei)
```

**Installations-Schritte für Endnutzer:**
1. Ordner entpacken
2. `INSTALL.ps1` ausführen (Rechtsklick → "Mit PowerShell ausführen")
3. Desktop-Verknüpfung nutzen

## 🌐 Browser-Modi

### Chrome App-Modus (Standard)
- Sieht aus wie ein eigenständiges Programm
- Keine Browser-Leiste
- Keine Tabs sichtbar

### Standard-Browser (Fallback)
Falls Chrome nicht installiert ist, öffnet sich der Standard-Browser.

## ⚙️ Erweitert

### Server manuell starten
```cmd
npm run dev
```
Dashboard läuft dann auf: http://localhost:5173

### Production Build erstellen
```cmd
npm run build
```
Erstellt optimierte Dateien in `/dist`

## 🔧 Fehlerbehebung

### "Node.js nicht gefunden"
→ Node.js installieren: https://nodejs.org

### "Port 5173 bereits belegt"
→ Anderen npm-Prozess beenden:
```cmd
taskkill /F /IM node.exe
```

### Dashboard lädt nicht
→ Browser-Cache leeren (Strg + F5)

## 📞 Support

Bei Fragen oder Problemen:
- GitHub: https://github.com/SebastianKuehnrich/Pyspark_Kunden_Analyse_Dashboard
- Erstellt von: Sebastian Kühnrich

