# 🚀 SCHNELLSTART - REACT DASHBOARD

## Option 1: Mit Vite (Empfohlen)

```bash
# 1. Neues Projekt erstellen
npm create vite@latest kunden-dashboard -- --template react

# 2. In Projekt wechseln
cd kunden-dashboard

# 3. Abhängigkeiten installieren
npm install
npm install chart.js react-chartjs-2

# 4. Dateien kopieren
# Kopiere ALLE Dateien aus dem Ordner "react_components" nach:
# - Dashboard.jsx → src/components/Dashboard.jsx
# - Dashboard.css → src/components/Dashboard.css  
# - data.json → src/data/data.json
# - App.jsx → src/App.jsx (ÜBERSCHREIBEN!)
# - main.jsx → src/main.jsx (ÜBERSCHREIBEN!)

# 5. Erstelle fehlende Ordner
mkdir src\components
mkdir src\data

# 6. Starten
npm run dev
```

Öffne: **http://localhost:5173**

---

## Option 2: Copy & Paste in bestehendes Projekt

### 1. Installiere Dependencies

```bash
npm install chart.js react-chartjs-2
```

### 2. Kopiere diese 3 Dateien:

#### `src/components/Dashboard.jsx`
→ Kopiere kompletten Code aus `Dashboard.jsx`

#### `src/components/Dashboard.css`
→ Kopiere kompletten Code aus `Dashboard.css`

#### `src/data/data.json`
→ Kopiere kompletten Code aus `data.json`

### 3. Passe `App.jsx` an:

```jsx
import Dashboard from './components/Dashboard';
import data from './data/data.json';

function App() {
  return <Dashboard data={data} />;
}

export default App;
```

### 4. Starte deine App:

```bash
npm start
```

---

## Daten von Python laden

### Manuelle Methode

1. Python-Skript ausführen: 
   ```bash
   python tag6_projekt_analyse.py
   ```

2. Die JSON-Datei `react_data.json` wird in `./ergebnisse/` erstellt

3. Kopiere `react_data.json` → `src/data/data.json`

4. React neu laden (speichert automatisch)

### Automatische Methode (Fortgeschritten)

Erstelle ein Node.js Script `update-data.js`:

```javascript
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '../ergebnisse/react_data.json');
const dest = path.join(__dirname, 'src/data/data.json');

fs.copyFile(source, dest, (err) => {
  if (err) throw err;
  console.log('✅ Daten aktualisiert!');
});
```

In `package.json` hinzufügen:

```json
"scripts": {
  "update-data": "node update-data.js",
  "dev": "npm run update-data && vite"
}
```

Jetzt startet `npm run dev` mit aktuellen Daten!

---

## Projekt-Struktur

```
kunden-dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx    ← Hauptkomponente
│   │   └── Dashboard.css    ← Styling
│   ├── data/
│   │   └── data.json        ← Daten von Python
│   ├── App.jsx              ← App-Einstieg
│   └── main.jsx             ← React-Einstieg
├── package.json
├── vite.config.js
└── index.html
```

---

## Fertig! 🎉

Dein Dashboard läuft jetzt auf:
- **Lokal**: http://localhost:5173
- **Mit Filtern**: Dropdown-Menüs funktionieren
- **Mit Diagrammen**: Klicke auf "📊 Diagramm anzeigen"
- **Mit Suche**: Suche nach Kunden-IDs

---

## Nächste Schritte

### Build für Produktion
```bash
npm run build
```
→ Erstellt `dist/` Ordner

### Deployment
```bash
# Netlify
netlify deploy --prod

# Vercel
vercel --prod

# Oder einfach "dist" Ordner hochladen
```

---

Erstellt von **Sebastian** | PySpark + React Dashboard 2025

