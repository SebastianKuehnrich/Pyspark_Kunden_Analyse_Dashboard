# 🚀 Kunden-Analyse Dashboard - Deployment Guide

## 📁 Projekt-Struktur (Monorepo)

```
Kunden_Dashboard/
├── frontend/          # React Dashboard (Vite)
│   ├── App.jsx
│   ├── Dashboard.jsx
│   ├── CSVUpload.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── nixpacks.toml
│
├── backend/           # Flask API + PySpark
│   ├── backend_server.py
│   ├── generate_dashboard_data.py
│   ├── backend_requirements.txt
│   └── nixpacks.toml
│
└── README.md
```

---

## 🌐 Railway Deployment

### Option 1: Zwei separate Railway Services (Empfohlen)

#### **Service 1: Frontend**
1. Gehe zu Railway Dashboard
2. **New Project** → **Deploy from GitHub**
3. Wähle dieses Repository
4. **Settings** → **Root Directory**: `frontend`
5. Railway erkennt automatisch `nixpacks.toml`
6. **Deploy**
7. Notiere die Frontend-URL: `https://your-frontend.railway.app`

#### **Service 2: Backend**
1. Im selben Railway Project: **New Service**
2. **Deploy from GitHub** → Wähle dieses Repository
3. **Settings** → **Root Directory**: `backend`
4. Railway erkennt automatisch `nixpacks.toml`
5. **Deploy**
6. Notiere die Backend-URL: `https://your-backend.railway.app`

#### **Environment Variables setzen:**

**Backend Service:**
```
FLASK_ENV=production
PYTHONUNBUFFERED=1
```

**Frontend Service:**
```
NODE_ENV=production
VITE_API_URL=https://your-backend.railway.app
```

⚠️ **WICHTIG**: Frontend muss die Backend-URL kennen!

---

## 🔗 Frontend mit Backend verbinden

Nach dem Deployment musst du die Backend-URL im Frontend eintragen:

### Datei: `frontend/CSVUpload.jsx`
```javascript
// Zeile 34: Ersetze localhost durch deine Railway Backend-URL
const response = await fetch('https://your-backend.railway.app/api/upload-csv', {
  method: 'POST',
  body: formData,
});
```

### Oder besser: Environment Variable nutzen

**frontend/.env.production** (erstellen):
```
VITE_API_URL=https://your-backend.railway.app
```

**frontend/CSVUpload.jsx** anpassen:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const response = await fetch(`${API_URL}/api/upload-csv`, {
  method: 'POST',
  body: formData,
});
```

---

## 🧪 Lokales Testen

### Backend starten:
```bash
cd backend
pip install -r backend_requirements.txt
python backend_server.py
```
→ Backend läuft auf `http://localhost:5000`

### Frontend starten:
```bash
cd frontend
npm install
npm run dev
```
→ Frontend läuft auf `http://localhost:5173`

---

## 📊 Wie funktioniert das System?

1. **Lokal**: Du führst `update_dashboard.bat` aus
   - PySpark analysiert die CSV-Daten
   - Erstellt `data.json` und Dateien in `ergebnisse/`
   
2. **Online (Railway)**:
   - User lädt CSV hoch über Frontend
   - Frontend sendet CSV an Backend (`/api/upload-csv`)
   - Backend startet PySpark-Analyse
   - Backend erstellt neue `data.json`
   - Frontend lädt neue Daten und aktualisiert Dashboard

---

## 🔄 Updates zu GitHub pushen

```bash
git add .
git commit -m "Update: Monorepo Struktur für Railway"
git push origin main
```

Railway deployed automatisch bei jedem Push!

---

## 🛠️ Troubleshooting

### Problem: Backend startet nicht auf Railway
**Lösung**: Prüfe ob `backend/nixpacks.toml` korrekt erkannt wird
- Railway Settings → Root Directory = `backend`
- Build Logs prüfen

### Problem: Frontend kann Backend nicht erreichen
**Lösung**: CORS-Einstellungen im Backend prüfen
```python
# backend/backend_server.py
CORS(app, origins=['https://your-frontend.railway.app'])
```

### Problem: PySpark out of memory
**Lösung**: Railway Memory Limit erhöhen
- Settings → Resources → Memory: 4GB+

---

## 📝 Nächste Schritte

1. ✅ Struktur erstellt
2. ⏳ Zu GitHub pushen
3. ⏳ Auf Railway deployen (Frontend + Backend)
4. ⏳ Environment Variables setzen
5. ⏳ Frontend API-URL anpassen
6. ⏳ Testen!

---

**Erstellt von Sebastian | PySpark + React Dashboard**

