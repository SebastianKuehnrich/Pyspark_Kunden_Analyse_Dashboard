# 🔗 Integration: PySpark → React Dashboard

## Übersicht

Dein Dashboard besteht aus zwei Teilen:
1. **Backend (PySpark)**: Datenverarbeitung und Analyse
2. **Frontend (React)**: Visualisierung der Daten

Die Verbindung erfolgt über die `data.json` Datei.

## 📋 Workflow

```
PySpark Script → data.json → React Dashboard
```

### 1. PySpark-Daten generieren

```bash
python generate_dashboard_data.py
```

Dieses Script:
- Lädt deine Rohdaten (CSV/Parquet)
- Führt die PySpark-Analyse durch
- Generiert `data.json` mit allen Dashboard-Daten

### 2. React-Dashboard starten

```bash
npm run dev
```

Das React-Frontend lädt automatisch die `data.json` und zeigt die Daten an.

## 🛠️ Anpassung an deine Daten

### Schritt 1: Passe `generate_dashboard_data.py` an

Ersetze die Beispiel-Kommentare mit deinem echten Code:

```python
# Deine Daten laden
df_kunden = spark.read.csv("pfad/zu/deinen/kunden.csv", header=True, inferSchema=True)
df_bestellungen = spark.read.csv("pfad/zu/deinen/bestellungen.csv", header=True, inferSchema=True)

# Deine JOINs und Transformationen
df_main = df_kunden.join(df_bestellungen, "customer_id", "left")

# Segmentierung erstellen (falls noch nicht vorhanden)
df_main = df_main.withColumn("umsatz_segment", 
    when(col("gesamt_umsatz") >= 100000, "VIP")
    .when(col("gesamt_umsatz") >= 50000, "Premium")
    .when(col("gesamt_umsatz") >= 10000, "Standard")
    .otherwise("Gering"))
```

### Schritt 2: Berechne die KPIs

```python
kunden_gesamt = df_main.select("customer_id").distinct().count()
inaktive_vips = df_main.filter((col("umsatz_segment") == "VIP") & (col("aktivitaet_segment") == "Inaktiv")).count()
verlorener_umsatz = df_main.filter((col("umsatz_segment") == "VIP") & (col("aktivitaet_segment") == "Inaktiv")).agg(_sum("gesamt_umsatz")).collect()[0][0]

dashboard_data = {
    "maxDate": max_date,
    "kundenGesamt": kunden_gesamt,
    "inaktiveVips": inaktive_vips,
    "verlorenerUmsatz": float(verlorener_umsatz),
    "reportUmsatz": create_umsatz_report(df_main),
    "reportAktivitaet": create_aktivitaet_report(df_main),
    "reportDach": create_dach_report(df_main),
    "topInaktiveVips": create_top_inaktive_vips(df_main)
}
```

## 📊 Benötigte Spalten in deinen Daten

Dein PySpark DataFrame sollte folgende Spalten haben:

- `customer_id`: Kunden-ID
- `gesamt_umsatz`: Gesamtumsatz pro Kunde
- `umsatz_segment`: VIP, Premium, Standard, Gering
- `aktivitaet_segment`: Aktiv, Inaktiv, Verloren
- `ist_dach_kunde`: "Ja" oder "Nein" (oder "DACH" / "International")
- `anzahl_bestellungen`: Anzahl Bestellungen
- `letzte_bestellung`: Datum der letzten Bestellung
- `tage_inaktiv`: Tage seit letzter Bestellung

## 🔄 Automatisierung

### Option 1: Manuell
```bash
# 1. Daten generieren
python generate_dashboard_data.py

# 2. Dashboard starten
npm run dev
```

### Option 2: Script erstellen

Erstelle eine `update_dashboard.bat`:
```batch
@echo off
echo Generiere Dashboard-Daten...
python generate_dashboard_data.py
echo.
echo Starte React-Dashboard...
npm run dev
```

## ✅ Checkliste

- [ ] PySpark-Script angepasst mit echten Datenpfaden
- [ ] Spalten in DataFrame korrekt benannt
- [ ] `data.json` wird korrekt generiert
- [ ] React-Dashboard lädt die Daten
- [ ] Diagramme werden korrekt angezeigt

## 🆘 Troubleshooting

**Problem**: `data.json` ist leer
- Prüfe, ob deine Daten korrekt geladen werden
- Prüfe die Spaltennamen
- Füge `print(df_main.show(5))` hinzu zum Debuggen

**Problem**: React zeigt Fehler
- Prüfe das JSON-Format in `data.json`
- Stelle sicher, dass alle erforderlichen Felder vorhanden sind
- Öffne die Browser-Console (F12) für Details

**Problem**: Zahlen sind zu groß/klein
- Prüfe die Datentypen (float vs. int)
- Verwende `.cast("double")` für Umsatzspalten

