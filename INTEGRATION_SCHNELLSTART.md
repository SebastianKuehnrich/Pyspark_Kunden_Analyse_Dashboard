# 🚀 SCHNELLSTART: PySpark → React Integration

## ✅ Was ich für dich eingerichtet habe:

1. **generate_dashboard_data.py** - Dein PySpark-Code integriert
2. **run_pyspark.bat** - Führt nur das PySpark-Script aus
3. **update_dashboard.bat** - Generiert Daten + startet Dashboard automatisch

---

## 📋 SO FUNKTIONIERT ES:

### **Variante 1: Alles auf einmal (EMPFOHLEN)**

Doppelklick auf:
```
update_dashboard.bat
```

Das macht:
- ✅ PySpark lädt die Daten aus: `C:/Users/sebas/PycharmProjects/BigData/daten/ecommerce_5m.csv`
- ✅ Generiert `data.json` mit allen KPIs und Reports
- ✅ Startet automatisch das React-Dashboard auf http://localhost:5173

---

### **Variante 2: Schritt für Schritt**

**Schritt 1: Daten generieren**
```
Doppelklick auf: run_pyspark.bat
```
oder im Terminal:
```
python generate_dashboard_data.py
```

**Schritt 2: Dashboard starten**
```
npm run dev
```

---

## 🔄 DER DATENFLUSS:

```
📂 C:/Users/sebas/PycharmProjects/BigData/daten/ecommerce_5m.csv
    ↓
⚙️  generate_dashboard_data.py (PySpark verarbeitet die Daten)
    ↓
📄 data.json (wird im React-Ordner gespeichert)
    ↓
⚛️  React Dashboard (lädt data.json automatisch)
    ↓
🌐 Browser: http://localhost:5173
```

---

## 📊 WAS WIRD GENERIERT:

Die `data.json` enthält:
- **KPIs**: Kunden gesamt, Inaktive VIPs, Verlorener Umsatz
- **Report 1**: Umsatz nach Segment (VIP, Premium, Standard, Gering)
- **Report 2**: Aktivität (Aktiv, Inaktiv, Verloren)
- **Report 3**: DACH vs International
- **Report 4**: Top 10 inaktive VIP-Kunden

---

## 🛠️ WENN DU DIE DATEN ÄNDERN WILLST:

Öffne `generate_dashboard_data.py` und ändere Zeile 45:
```python
DATA_PATH = "C:/Users/sebas/PycharmProjects/BigData/daten/ecommerce_5m.csv"
```

Oder passe die Segmentierungs-Schwellenwerte an (Zeilen 144-157).

---

## ❓ TROUBLESHOOTING:

**Problem: "Daten nicht gefunden"**
- Prüfe ob die CSV-Datei existiert: `C:/Users/sebas/PycharmProjects/BigData/daten/ecommerce_5m.csv`
- Passe den Pfad in `generate_dashboard_data.py` an

**Problem: "PySpark nicht installiert"**
```
pip install pyspark
```

**Problem: "React zeigt alte Daten"**
- Drücke F5 im Browser (Seite neu laden)
- Oder: Lösche `data.json` und führe `run_pyspark.bat` erneut aus

---

## 🎯 NÄCHSTE SCHRITTE:

1. ✅ Führe `update_dashboard.bat` aus
2. ✅ Warte bis PySpark fertig ist (ca. 1-2 Minuten bei 5M Zeilen)
3. ✅ Das React-Dashboard öffnet sich automatisch
4. ✅ Genieße dein Dashboard! 🎉

---

**Tipp**: Wenn du die Daten regelmäßig aktualisieren willst, führe einfach `run_pyspark.bat` aus, während das Dashboard läuft. Dann drücke F5 im Browser.

