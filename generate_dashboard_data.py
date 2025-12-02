# generate_dashboard_data.py
# PySpark Script zum Generieren der Dashboard-Daten für React

import os
import sys

# Python-Pfad setzen (wichtig für Windows)
python_exec = sys.executable
os.environ["PYSPARK_PYTHON"] = python_exec
os.environ["PYSPARK_DRIVER_PYTHON"] = python_exec

from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col, sum as _sum, count, avg, max as _max, min as _min,
    round as spark_round, desc, asc,
    datediff, lit, when,
    year, month, dayofweek
)
import json
from datetime import datetime

# ============================================================
# SPARK SESSION
# ============================================================

spark = SparkSession.builder \
    .appName("Kunden Dashboard - React Integration") \
    .master("local[*]") \
    .config("spark.driver.memory", "4g") \
    .getOrCreate()

spark.sparkContext.setLogLevel("WARN")

print("=" * 60)
print("   KUNDEN-ANALYSE DASHBOARD")
print("   React Integration")
print("=" * 60)

# ============================================================
# DATEN LADEN
# ============================================================

DATA_PATH = "C:/Users/sebas/PycharmProjects/BigData/daten/ecommerce_5m.csv"
print(f"\nLade Daten von: {DATA_PATH}")

try:
    df = spark.read.csv(DATA_PATH, header=True, inferSchema=True)
    print(f"✅ Daten geladen: {df.count():,} Bestellungen")
    print(f"Spalten: {df.columns}")
except Exception as e:
    print(f"❌ Fehler beim Laden der Daten: {e}")
    print("\nBitte prüfe den Pfad oder passe ihn an:")
    print("DATA_PATH = 'dein/pfad/zur/datei.csv'")
    spark.stop()
    sys.exit(1)

# ============================================================
# TABELLE 1: Kunden-Umsatz (Customer Value)
# ============================================================

print("\n[1/7] Berechne Kunden-Umsatz...")

kunden_umsatz = df.groupBy("customer_id").agg(
    count("*").alias("anzahl_bestellungen"),
    spark_round(_sum("total"), 2).alias("gesamt_umsatz"),
    spark_round(avg("total"), 2).alias("durchschnitt_bestellung")
)

# ============================================================
# TABELLE 2: Kunden-Aktivität (Letzte Bestellung)
# ============================================================

print("[2/7] Berechne Kunden-Aktivität...")

kunden_aktivitaet = df.groupBy("customer_id").agg(
    _max("date").alias("letzte_bestellung"),
    _min("date").alias("erste_bestellung")
)

# ============================================================
# TABELLE 3: Kunden-Demografie (Land)
# ============================================================

print("[3/7] Berechne Kunden-Demografie...")

kunden_demografie = df.groupBy("customer_id").agg(
    count(when(col("country") == "Germany", 1)).alias("bestellungen_de"),
    count(when(col("country") == "Austria", 1)).alias("bestellungen_at"),
    count(when(col("country") == "Switzerland", 1)).alias("bestellungen_ch")
)

# DACH-Kunde ja/nein
kunden_demografie = kunden_demografie.withColumn(
    "ist_dach_kunde",
    when(
        (col("bestellungen_de") > 0) |
        (col("bestellungen_at") > 0) |
        (col("bestellungen_ch") > 0),
        "Ja"
    ).otherwise("Nein")
)

# ============================================================
# MASTER-TABELLE: Alle Daten zusammen (JOINs)
# ============================================================

print("[4/7] Führe JOINs durch...")

# JOIN 1: Umsatz + Aktivität
master_step1 = kunden_umsatz.join(
    kunden_aktivitaet,
    "customer_id",
    "inner"
)

# JOIN 2: + Demografie
kunden_master = master_step1.join(
    kunden_demografie,
    "customer_id",
    "inner"
)

print(f"✅ Master-Tabelle erstellt: {kunden_master.count():,} Kunden")

# ============================================================
# KUNDEN-SEGMENTIERUNG
# ============================================================

print("[5/7] Segmentiere Kunden...")

# Letztes Datum für Inaktivität
max_date = df.agg(_max("date")).collect()[0][0]
print(f"   Letztes Datum im Datensatz: {max_date}")

# Dynamische Schwellenwerte berechnen (basierend auf Quantilen)
# VIP = Top 10%, Premium = 10-30%, Standard = 30-70%, Gering = Bottom 30%
quantiles = kunden_master.approxQuantile("gesamt_umsatz", [0.3, 0.7, 0.9], 0.01)
schwelle_gering = quantiles[0]      # 30% Quantil
schwelle_standard = quantiles[1]    # 70% Quantil
schwelle_premium = quantiles[2]     # 90% Quantil

print(f"   Schwellenwerte:")
print(f"   - VIP (Top 10%):      >= {schwelle_premium:,.2f} EUR")
print(f"   - Premium (10-30%):   >= {schwelle_standard:,.2f} EUR")
print(f"   - Standard (30-70%):  >= {schwelle_gering:,.2f} EUR")
print(f"   - Gering (Bottom 30%): <  {schwelle_gering:,.2f} EUR")

# Segmente hinzufügen
kunden_segmentiert = kunden_master \
    .withColumn(
        "tage_inaktiv",
        datediff(lit(max_date), col("letzte_bestellung"))
    ) \
    .withColumn(
        "umsatz_segment",
        when(col("gesamt_umsatz") >= schwelle_premium, "VIP")
        .when(col("gesamt_umsatz") >= schwelle_standard, "Premium")
        .when(col("gesamt_umsatz") >= schwelle_gering, "Standard")
        .otherwise("Gering")
    ) \
    .withColumn(
        "aktivitaet_segment",
        when(col("tage_inaktiv") <= 30, "Aktiv")
        .when(col("tage_inaktiv") <= 90, "Inaktiv")
        .otherwise("Verloren")
    )

# ============================================================
# REPORTS ERSTELLEN
# ============================================================

print("[6/7] Erstelle Reports...")

# REPORT 1: Umsatz nach Segment
report_umsatz = kunden_segmentiert.groupBy("umsatz_segment").agg(
    count("*").alias("anzahl_kunden"),
    spark_round(_sum("gesamt_umsatz"), 2).alias("segment_umsatz"),
    spark_round(avg("gesamt_umsatz"), 2).alias("avg_umsatz")
).orderBy(desc("segment_umsatz"))

# REPORT 2: Aktivität nach Segment
report_aktivitaet = kunden_segmentiert.groupBy("aktivitaet_segment").agg(
    count("*").alias("anzahl_kunden"),
    spark_round(_sum("gesamt_umsatz"), 2).alias("segment_umsatz")
).orderBy(desc("segment_umsatz"))

# REPORT 3: DACH vs International
report_dach = kunden_segmentiert.groupBy("ist_dach_kunde").agg(
    count("*").alias("anzahl_kunden"),
    spark_round(_sum("gesamt_umsatz"), 2).alias("gesamt_umsatz"),
    spark_round(avg("gesamt_umsatz"), 2).alias("avg_umsatz")
)

# REPORT 4: Inaktive VIP-Kunden (>30 Tage)
vip_threshold = kunden_segmentiert.approxQuantile("gesamt_umsatz", [0.9], 0.0)[0]
vip_kunden = kunden_segmentiert.filter(col("gesamt_umsatz") >= vip_threshold)
inaktive_vips = vip_kunden.filter(col("tage_inaktiv") > 30)

top_inaktive_vips = inaktive_vips.select(
    "customer_id",
    "gesamt_umsatz",
    "anzahl_bestellungen",
    "letzte_bestellung",
    "tage_inaktiv"
).orderBy(desc("gesamt_umsatz")).limit(10)

# ============================================================
# JSON FÜR REACT GENERIEREN
# ============================================================

print("[7/7] Generiere data.json für React-Dashboard...")

# KPIs berechnen
kunden_gesamt = kunden_master.count()
anzahl_inaktive_vips = inaktive_vips.count()

if anzahl_inaktive_vips > 0:
    verlorener_umsatz = float(inaktive_vips.agg(_sum("gesamt_umsatz")).collect()[0][0])
else:
    verlorener_umsatz = 0.0

# Reports zu Listen konvertieren
def row_to_dict(row):
    """Konvertiert Row-Objekt zu Dictionary und behandelt spezielle Typen"""
    d = row.asDict()
    # Konvertiere Decimal zu float
    for key, value in d.items():
        if value is not None and hasattr(value, '__float__'):
            d[key] = float(value)
        elif value is None:
            d[key] = 0
    return d

report_umsatz_list = [row_to_dict(row) for row in report_umsatz.collect()]
report_aktivitaet_list = [row_to_dict(row) for row in report_aktivitaet.collect()]
report_dach_list = [row_to_dict(row) for row in report_dach.collect()]
top_inaktive_vips_list = [row_to_dict(row) for row in top_inaktive_vips.collect()]

# Dashboard-Daten Struktur
dashboard_data = {
    "maxDate": str(max_date),
    "kundenGesamt": kunden_gesamt,
    "inaktiveVips": anzahl_inaktive_vips,
    "verlorenerUmsatz": round(verlorener_umsatz, 2),
    "reportUmsatz": report_umsatz_list,
    "reportAktivitaet": report_aktivitaet_list,
    "reportDach": report_dach_list,
    "topInaktiveVips": top_inaktive_vips_list
}

# JSON speichern
output_path = "data.json"
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(dashboard_data, f, indent=2, ensure_ascii=False, default=str)

print(f"\n✅ Dashboard-Daten erfolgreich generiert: {output_path}")

# ============================================================
# CSV EXPORT: Reports als CSV speichern
# ============================================================

print("\n" + "=" * 60)
print("   CSV EXPORT: Ergebnisse speichern")
print("=" * 60)

# Ordner für Ergebnisse erstellen
os.makedirs("./ergebnisse", exist_ok=True)

# Report 1: Umsatz nach Segment
report_umsatz.toPandas().to_csv(
    "./ergebnisse/report_umsatz_segment.csv",
    index=False
)
print("✅ Gespeichert: ./ergebnisse/report_umsatz_segment.csv")

# Report 2: Aktivität nach Segment
report_aktivitaet.toPandas().to_csv(
    "./ergebnisse/report_aktivitaet.csv",
    index=False
)
print("✅ Gespeichert: ./ergebnisse/report_aktivitaet.csv")

# Report 3: DACH vs International
report_dach.toPandas().to_csv(
    "./ergebnisse/report_dach.csv",
    index=False
)
print("✅ Gespeichert: ./ergebnisse/report_dach.csv")

# Report 4: Top Inaktive VIPs
top_inaktive_vips.toPandas().to_csv(
    "./ergebnisse/top_inaktive_vips.csv",
    index=False
)
print("✅ Gespeichert: ./ergebnisse/top_inaktive_vips.csv")

# Bonus: Kunden-Sample (erste 1000 segmentierte Kunden)
kunden_segmentiert.limit(1000).toPandas().to_csv(
    "./ergebnisse/kunden_sample.csv",
    index=False
)
print("✅ Gespeichert: ./ergebnisse/kunden_sample.csv (1000 Zeilen)")

print("\n📁 Alle CSV-Reports gespeichert in: ./ergebnisse/")

# ============================================================
# ZUSAMMENFASSUNG
# ============================================================

print("\n" + "=" * 60)
print("   ZUSAMMENFASSUNG")
print("=" * 60)
print(f"📊 Kunden gesamt:        {dashboard_data['kundenGesamt']:,}")
print(f"⚠️  Inaktive VIPs:        {dashboard_data['inaktiveVips']:,}")
print(f"💰 Verlorener Umsatz:    {dashboard_data['verlorenerUmsatz']:,.2f} EUR")
print(f"📅 Datenstand:           {dashboard_data['maxDate']}")
print("=" * 60)

print("\n🎉 Fertig! Starte jetzt dein React-Frontend mit:")
print("   npm run dev")
print("\n   oder nutze das Automatisierungs-Script:")
print("   update_dashboard.bat")

# Spark Session beenden
spark.stop()
