# Kunden-Analyse Dashboard - Online Version mit CSV-Upload

## 🌐 Hybrid-Lösung: Lokal + Online

Das Dashboard funktioniert jetzt in **2 Modi**:

### **Modus 1: Lokal (wie bisher)**
- Doppelklick auf `Dashboard_Desktop.bat`
- Nutzt vorhandene `data.json`
- Kein Backend nötig

### **Modus 2: Online mit CSV-Upload** ⭐ NEU!
- Doppelklick auf `Start_Online_Version.bat`
- Flask-Backend läuft im Hintergrund
- CSV-Dateien können hochgeladen werden
- PySpark analysiert automatisch die neuen Daten
- Dashboard aktualisiert sich live

---

## 🚀 Schnellstart Online-Version

### 1. Backend-Dependencies installieren
```bash
pip install -r backend_requirements.txt
```

Oder automatisch:
```bash
Start_Online_Version.bat
```
(Installiert automatisch beim ersten Start)

### 2. Starten
**Doppelklick auf:** `Start_Online_Version.bat`

Das startet automatisch:
- ✅ Flask Backend (Port 5000)
- ✅ React Frontend (Port 5173)
- ✅ Öffnet Browser

---

## 📤 CSV-Upload Funktion

### Im Dashboard:
1. Scrolle zum **"CSV-Daten hochladen"** Bereich
2. Klicke auf **"CSV hochladen"**
3. Wähle deine E-Commerce CSV-Datei
4. Warte 30-60 Sekunden (Fortschrittsbalken läuft)
5. Dashboard aktualisiert sich automatisch!

### CSV-Format:
```csv
transaction_id,customer_id,product_category,product_price,quantity,date,payment_method,country,total
1,12345,Electronics,299.99,2,2023-12-01,Credit Card,Germany,599.98
...
```

**Erforderliche Spalten:**
- `transaction_id`
- `customer_id`
- `product_category`
- `product_price`
- `quantity`
- `date`
- `payment_method`
- `country`
- `total`

---

## 🔧 Technische Details

### Backend (Flask)
- **Endpunkt:** `POST /api/upload-csv`
- **Funktion:** Nimmt CSV, führt PySpark aus, gibt neue `data.json` zurück
- **Timeout:** 5 Minuten max
- **Port:** 5000

### Frontend (React)
- Neue Komponente: `CSVUpload.jsx`
- Upload mit Fortschrittsbalken
- Automatische Dashboard-Aktualisierung
- **Port:** 5173

---

## 📦 Für Railway/Production Deploy

### 1. Backend-Server starten
```bash
python backend_server.py
```

### 2. Frontend Build
```bash
npm run build
```

### 3. Railway Config
Erstelle `railway.toml`:
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "python backend_server.py"
```

### Environment Variables auf Railway:
```
FLASK_ENV=production
PORT=5000
```

---

## 🔀 Vergleich: Lokal vs Online

| Feature | Lokal | Online |
|---------|-------|--------|
| **CSV Upload** | ❌ Nein | ✅ Ja |
| **Backend** | ❌ Nicht nötig | ✅ Flask |
| **Echtzeit-Analyse** | ❌ Manuell | ✅ Automatisch |
| **Internetverbindung** | ❌ Nicht nötig | ✅ Für Deploy |
| **Für Kunden** | ✅ Einfach | ✅ Professioneller |

---

## 🎯 Empfehlung für verschiedene Szenarien

### **Szenario 1: Demo für Kunden**
→ **Online-Version** mit CSV-Upload
- Kunden können eigene Daten hochladen
- Sieht professionell aus
- Echtzeit-Analyse

### **Szenario 2: Tägliche Nutzung intern**
→ **Lokale Version** mit `update_dashboard.bat`
- Schneller
- Kein Server nötig
- Automatisiert mit GUI

### **Szenario 3: Production Deployment**
→ **Railway** mit Online-Version
- Immer verfügbar
- Mehrbenutzerfähig
- Cloud-basiert

---

## 🐛 Troubleshooting

### Backend startet nicht
```bash
# Prüfe Python-Version
python --version  # Sollte 3.8+

# Installiere Dependencies neu
pip install -r backend_requirements.txt
```

### Port bereits belegt
```bash
# Finde Prozess
netstat -ano | findstr :5000

# Beende Prozess
taskkill /PID <PID> /F
```

### CSV-Upload schlägt fehl
- Prüfe CSV-Format (alle Spalten vorhanden?)
- Max. Dateigröße: 500 MB empfohlen
- Encoding: UTF-8

---

## 📞 Support

- GitHub: https://github.com/SebastianKuehnrich/Pyspark_Kunden_Analyse_Dashboard
- Erstellt von: Sebastian Kühnrich

