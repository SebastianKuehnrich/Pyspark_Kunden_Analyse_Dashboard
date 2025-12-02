# 🚀 RAILWAY DEPLOYMENT - SCHNELLSTART

## 📦 In 3 Schritten online gehen!

---

### ✅ SCHRITT 1: Zu GitHub pushen

```bash
# Öffne Git Bash / Terminal im Projekt-Ordner

# 1. Daten generieren (falls noch nicht geschehen)
update_dashboard.bat

# 2. Git initialisieren (falls noch nicht geschehen)
git init
git remote add origin https://github.com/SebastianKuehnrich/Pyspark_Kunden_Analyse_Dashboard.git

# 3. Alles hinzufügen und pushen
git add .
git commit -m "Initial commit: Dashboard bereit für Railway"
git branch -M main
git push -u origin main
```

---

### ✅ SCHRITT 2: Railway einrichten

1. **Gehe zu**: https://railway.app/
2. **Login** mit GitHub
3. Klicke **"New Project"**
4. Wähle **"Deploy from GitHub repo"**
5. Wähle: `SebastianKuehnrich/Pyspark_Kunden_Analyse_Dashboard`
6. Railway erkennt automatisch alles → Klicke **"Deploy"**
7. **Fertig!** 🎉

Nach 2-3 Minuten ist dein Dashboard online unter:
`https://[projekt-name].up.railway.app`

---

### ✅ SCHRITT 3: Daten aktualisieren

Wenn du neue Daten haben willst:

```bash
# 1. Lokal: Neue Daten generieren
run_pyspark.bat

# 2. Zu GitHub pushen
git add data.json
git commit -m "Update Daten"
git push

# 3. Railway deployed automatisch! (warte 1-2 Min)
```

---

## 🎯 Das war's!

Dein Dashboard ist jetzt **24/7 online** verfügbar! 🌍

### Deine Links:
- **GitHub**: https://github.com/SebastianKuehnrich/Pyspark_Kunden_Analyse_Dashboard
- **Railway**: https://railway.app/dashboard
- **Live-Dashboard**: Wird dir von Railway angezeigt

---

## 💡 Wichtige Infos

### Wie funktioniert es?
```
Lokal (PC):
  PySpark → data.json generieren
       ↓
GitHub:
  git push → Code + data.json hochladen
       ↓
Railway:
  Automatisch deployed → Dashboard online!
```

### Kosten
- ✅ **500 Stunden/Monat kostenlos**
- Danach: ~$5/Monat
- Kleine Apps wie diese: Meist komplett kostenlos!

### Was wird deployed?
- ✅ React Frontend (App.jsx, Dashboard.jsx)
- ✅ data.json (deine Dashboard-Daten)
- ✅ Vite Build System
- ❌ **NICHT**: PySpark (läuft nur lokal)

---

## 🔥 Pro-Tipps

1. **Custom Domain**: In Railway → Settings → Domains
2. **Auto-Deploy**: Jeder `git push` deployed automatisch
3. **Umgebungsvariablen**: Railway → Variables (falls du Secrets brauchst)

---

**Bei Fragen**: Siehe `README_DEPLOYMENT.md` für Details!

