# 📊 Kunden-Analyse Dashboard

**PySpark + React + Flask** - Vollständiges Analyse-Dashboard mit CSV-Upload

## 🏗️ Projekt-Struktur (Monorepo)

```
Kunden_Dashboard/
│
├── frontend/              # React Dashboard (Vite)
│   ├── App.jsx
│   ├── Dashboard.jsx
│   ├── CSVUpload.jsx
│   ├── package.json
│   └── nixpacks.toml     # Railway Config (Frontend)
│
├── backend/               # Flask API + PySpark
│   ├── backend_server.py
│   ├── generate_dashboard_data.py
│   ├── backend_requirements.txt
│   └── nixpacks.toml     # Railway Config (Backend)
│
└── README.md
```

---

## 🚀 Lokale Installation

### 1. Frontend starten
```bash
cd frontend
npm install
npm run dev
```
→ Frontend: `http://localhost:5173`

### 2. Backend starten
```bash
cd backend
pip install -r backend_requirements.txt
python backend_server.py
```
→ Backend: `http://localhost:5000`

---

## ☁️ Railway Deployment

### Zwei separate Services deployen:

#### **Service 1: Backend (Flask + PySpark)**
1. Railway Dashboard → **New Project**
2. **Deploy from GitHub** → Dieses Repository wählen
3. **Settings** → **Root Directory**: `backend`
4. **Deploy** → Railway erkennt automatisch `backend/nixpacks.toml`
5. Notiere die URL: `https://your-backend.railway.app`

#### **Service 2: Frontend (React)**
1. Im selben Project → **New Service**
2. **Deploy from GitHub** → Dieses Repository wählen
3. **Settings** → **Root Directory**: `frontend`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
5. **Deploy** → Railway erkennt automatisch `frontend/nixpacks.toml`

---

## 🔧 Funktionen

- ✅ **Lokal**: PySpark-Analyse über `update_dashboard.bat`
- ✅ **Online**: CSV-Upload über Web-Interface
- ✅ **Echtzeit**: Dashboard aktualisiert sich automatisch
- ✅ **Download**: Alle Reports als CSV exportierbar

---

## 📝 Erstellt von Sebastian
**Modul 3: Big-Data Analyst | PySpark + React**

