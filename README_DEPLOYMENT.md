# 🚀 Railway Deployment Anleitung

## 📋 Übersicht

Dieses Dashboard wird auf **Railway** deployed. Die PySpark-Datenverarbeitung läuft **lokal** auf deinem PC, und du pushst die generierte `data.json` zu GitHub. Railway hostet dann das React-Frontend.

---

## 🔄 Workflow

```
1. Lokal: PySpark generiert data.json
   ↓
2. Git: Push zu GitHub
   ↓
3. Railway: Deployed automatisch
   ↓
4. Online: Dashboard zeigt aktuelle Daten
```

---

## ⚙️ SCHRITT 1: GitHub Repository vorbereiten

### 1.1 Repository initialisieren (falls noch nicht geschehen)

```bash
git init
git remote add origin https://github.com/SebastianKuehnrich/Pyspark_Kunden_Analyse_Dashboard.git
```

### 1.2 Erste Daten generieren

```bash
# Führe das PySpark-Script aus
update_dashboard.bat
```

### 1.3 Zu GitHub pushen

```bash
git add .
git commit -m "Initial commit: Dashboard mit aktuellen Daten"
git branch -M main
git push -u origin main
```

---

## 🚂 SCHRITT 2: Railway Deployment einrichten

### 2.1 Railway Account erstellen
1. Gehe zu: https://railway.app/
2. Melde dich mit deinem GitHub-Account an
3. ✅ Kostenlos für kleine Projekte!

### 2.2 Neues Projekt erstellen
1. Klicke auf **"New Project"**
2. Wähle **"Deploy from GitHub repo"**
3. Wähle: `SebastianKuehnrich/Pyspark_Kunden_Analyse_Dashboard`
4. Railway erkennt automatisch Vite/React

### 2.3 Build-Einstellungen (automatisch erkannt)
Railway nutzt die `nixpacks.toml` Konfiguration:
- ✅ Build Command: `npm run build`
- ✅ Start Command: `npm run preview`
- ✅ Port: Automatisch (Railway setzt $PORT)

### 2.4 Deployment starten
- Klicke auf **"Deploy"**
- Warte ca. 2-3 Minuten
- Railway gibt dir eine URL: z.B. `https://dein-projekt.up.railway.app`

---

## 🔄 SCHRITT 3: Daten aktualisieren (regelmäßig)

### Lokaler Workflow:

```bash
# 1. Neue Daten generieren mit PySpark
run_pyspark.bat

# 2. Änderungen zu Git hinzufügen
git add data.json
git commit -m "Update: Neue Dashboard-Daten vom $(date +%Y-%m-%d)"
git push

# 3. Railway deployed automatisch!
```

**Railway detected automatisch den Push** und deployed die neue Version in ~1-2 Minuten.

---

## 📁 Dateistruktur für Deployment

```
Kunden_Dashboard/
├── src/
│   ├── App.jsx               ✅ Wird deployed
│   ├── Dashboard.jsx         ✅ Wird deployed
│   ├── Dashboard.css         ✅ Wird deployed
│   └── main.jsx              ✅ Wird deployed
├── data.json                 ✅ Wird deployed (wichtig!)
├── index.html                ✅ Wird deployed
├── package.json              ✅ Wird deployed
├── vite.config.js            ✅ Wird deployed
├── nixpacks.toml             ✅ Railway Konfiguration
├── .gitignore                ✅ Wird deployed
├── generate_dashboard_data.py ✅ Im Repo (läuft aber nur lokal)
├── update_dashboard.bat      ✅ Im Repo (läuft aber nur lokal)
└── README.md                 ✅ Wird deployed
```

**Wichtig**: Die Python-Scripts sind im Repo, werden aber **nicht** auf Railway ausgeführt!

---

## ⚡ Quick Commands

### Erste Deployment:
```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

### Daten aktualisieren:
```bash
run_pyspark.bat
git add data.json
git commit -m "Update data"
git push
```

### Lokalen Test vor Push:
```bash
npm run build
npm run preview
# Öffne: http://localhost:5173
```

---

## 🔧 Troubleshooting

### Problem: "Build failed on Railway"
**Lösung**: Prüfe die Railway Logs:
```bash
# In Railway Dashboard → Deployments → Logs
```

Häufige Fehler:
- Node.js Version: Railway nutzt automatisch Node 20 (siehe nixpacks.toml)
- Fehlende Dependencies: `npm install` lokal ausführen und package-lock.json pushen

### Problem: "Dashboard zeigt keine Daten"
**Lösung**: 
1. Prüfe ob `data.json` in GitHub ist
2. Prüfe Railway Logs ob Build erfolgreich war
3. Browser-Cache leeren (Strg + F5)

### Problem: "Railway zeigt alten Stand"
**Lösung**: 
```bash
git push
# Railway deployed automatisch, warte 1-2 Minuten
```

### Problem: "Port Error"
**Lösung**: Railway setzt `$PORT` automatisch. Die `vite.config.js` ist bereits konfiguriert.

---

## 🌐 Nach dem Deployment

Deine App läuft auf: `https://[dein-projekt-name].up.railway.app`

**Custom Domain einrichten** (optional):
1. In Railway: Settings → Domains
2. Füge deine Domain hinzu (z.B. `dashboard.deinedomain.de`)
3. Setze DNS-Records wie angezeigt

---

## 💡 Tipps

### Automatisches Deployment
- Jeder `git push` triggert automatisch ein neues Deployment
- Railway cached Node Modules → schnellere Builds
- Nur geänderte Dateien werden neu deployed

### Kosten sparen
- Railway Free Tier: 500 Stunden/Monat kostenlos
- Danach: ~$5/Monat für kleine Apps
- Tipp: Nutze "Sleep after inactivity" in Railway Settings

### Performance
- `data.json` sollte < 1 MB sein (aktuell ✅)
- Vite optimiert automatisch das Bundle
- Chart.js lädt nur notwendige Components

---

## 📊 Monitoring

In Railway Dashboard siehst du:
- ✅ Deployment Status
- ✅ Build Logs
- ✅ Resource Usage (CPU/RAM)
- ✅ Request Logs
- ✅ Uptime

---

## ✅ Checkliste für erstes Deployment

- [ ] GitHub Repo erstellt und verbunden
- [ ] `data.json` generiert mit `run_pyspark.bat`
- [ ] Alle Dateien zu GitHub gepusht
- [ ] Railway Account erstellt
- [ ] Projekt auf Railway erstellt
- [ ] Deployment erfolgreich
- [ ] URL funktioniert
- [ ] Dashboard zeigt Daten korrekt an

---

## 🆘 Support

Bei Problemen:
1. Prüfe Railway Logs
2. Prüfe GitHub Repository (ist `data.json` da?)
3. Teste lokal mit `npm run build && npm run preview`

**Viel Erfolg mit deinem Deployment! 🚀**

