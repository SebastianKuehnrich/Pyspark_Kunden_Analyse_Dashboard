# 📊 Frontend - Kunden-Analyse Dashboard

**React + Vite + Chart.js** - Interaktives Dashboard

## 🚀 Lokale Installation

```bash
npm install
npm run dev
```

→ Frontend läuft auf: `http://localhost:5173`

---

## ☁️ Railway Deployment

1. **New Project** auf Railway
2. **Deploy from GitHub** → Frontend Repository
3. **Environment Variables** setzen:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
4. Railway erkennt automatisch `nixpacks.toml`

---

## 🔧 Features

- ✅ **Echtzeit-Dashboard** mit interaktiven Charts
- ✅ **CSV-Upload** für neue Datenanalyse
- ✅ **CSV-Download** aller Reports
- ✅ **Filterbare Tabellen** und Suchfunktion
- ✅ **Responsive Design**

---

## 🔗 Backend verbinden

Die Backend-URL wird automatisch über Environment Variable gesetzt:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

**Lokal**: Nutzt `http://localhost:5000`  
**Production**: Nutzt `VITE_API_URL` aus Railway

---

**Erstellt von Sebastian | React Dashboard**
# 🔧 Backend - Kunden-Analyse Dashboard

**Flask + PySpark** - API für CSV-Upload und Datenanalyse

## 🚀 Lokale Installation

```bash
pip install -r backend_requirements.txt
python backend_server.py
```

→ Backend läuft auf: `http://localhost:5000`

---

## 📡 API Endpoints

### `POST /api/upload-csv`
- CSV hochladen und PySpark-Analyse starten
- Returns: Analysierte Dashboard-Daten

### `GET /api/data`
- Aktuelle Dashboard-Daten abrufen

### `GET /api/status`
- Server-Status prüfen

---

## ☁️ Railway Deployment

1. **New Project** auf Railway
2. **Deploy from GitHub** → Backend Repository
3. Railway erkennt automatisch `nixpacks.toml`
4. **Environment Variables**:
   ```
   FLASK_ENV=production
   PYTHONUNBUFFERED=1
   ```

---

## 📊 PySpark Analyse

Das Backend nutzt PySpark für:
- Kunden-Segmentierung (VIP, Premium, Standard)
- Aktivitätsanalyse (Aktiv, Inaktiv, Verloren)
- DACH-Länderanalyse
- Top inaktive VIP-Kunden

---

**Erstellt von Sebastian | Big-Data Analyst**

