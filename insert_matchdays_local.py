import pandas as pd
import psycopg2
from datetime import datetime
import os
from dotenv import load_dotenv

# .env.local laden für lokale Entwicklung
load_dotenv('.env.local')

DATABASE_URL = os.getenv("DATABASE_URL")  # Nutzt die lokale DATABASE_URL

print("📋 Verbinde mit lokaler PostgreSQL-Datenbank...")
print(f"🔗 Verbindung zu: {DATABASE_URL}")

try:
    # connect to local database
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    print("✅ Lokale PostgreSQL-Verbindung erfolgreich")
    
    # test request
    cursor.execute("SELECT COUNT(*) FROM match_days;")
    count = cursor.fetchone()[0]
    print(f"📊 Aktuelle Anzahl Spieltage in lokaler DB: {count}")
    
    # Frage ob vorhandene Daten gelöscht werden sollen
    if count > 0:
        response = input(f"⚠️  Es sind bereits {count} Spieltage in der lokalen DB. Alle löschen und neu importieren? (j/n): ")
        if response.lower() in ['j', 'ja', 'y', 'yes']:
            cursor.execute("DELETE FROM match_days;")
            print("🗑️  Alle vorhandenen Spieltage gelöscht")
        else:
            print("ℹ️  Import wird zu vorhandenen Daten hinzugefügt")
    
except Exception as e:
    print(f"❌ Verbindung zur lokalen DB fehlgeschlagen: {e}")
    print("💡 Stelle sicher, dass Supabase lokal läuft: supabase start")
    exit(1)

# read csv file
try:
    df = pd.read_csv("spielplan.csv", sep=";", encoding="latin1")
    print(f"📄 CSV-Datei gelesen: {len(df)} Zeilen")
except FileNotFoundError:
    print("❌ spielplan.csv nicht gefunden!")
    print("💡 Stelle sicher, dass die Datei im gleichen Verzeichnis liegt")
    exit(1)

# 🧠 Eigene Teamkennung (zur Erkennung von Heimspielen)
eigenes_team = "SVV Weimar e.V. I"

# 🗃 Spieltage sammeln
match_days = {}

for _, row in df.iterrows():
    heimteam = row["Mannschaft 1"]
    gegner = row["Mannschaft 2"]
    ort = str(row["Austragungsort"])
    datum = datetime.strptime(row["Datum"], "%d.%m.%Y").date()
    zeit = datetime.strptime(row["Uhrzeit"], "%H:%M:%S").time()

    key = (datum, zeit, ort)

    if heimteam == eigenes_team:
        # Heimspiel → mehrere Gegner möglich
        if key not in match_days:
            match_days[key] = {
                "date": datum,
                "time": zeit,
                "location": ort,
                "opponents": [gegner]
            }
        else:
            match_days[key]["opponents"].append(gegner)
    else:
        # Auswärtsspiel → einzeln speichern
        match_days[key] = {
            "date": datum,
            "time": zeit,
            "location": ort,
            "opponents": [heimteam]
        }

print(f"🎯 {len(match_days)} eindeutige Spieltage gefunden")

# 🚀 insert match days into local database
inserted_count = 0
error_count = 0

for data in match_days.values():
    try:
        cursor.execute("""
            INSERT INTO match_days (id, date, time, location, opponent)
            VALUES (gen_random_uuid(), %s, %s, %s, %s)
        """, (
            data["date"],
            data["time"].strftime("%H:%M:%S"),
            data["location"],
            " / ".join(data["opponents"])
        ))
        
        print(f"✅ Eingefügt: {data['date']} - {data['location']} - {' / '.join(data['opponents'])}")
        inserted_count += 1
        
    except Exception as e:
        print(f"❌ Fehler beim Einfügen von {data}: {e}")
        error_count += 1

# Änderungen speichern
conn.commit()
cursor.close()
conn.close()

print("\n" + "="*50)
print(f"🎉 Import abgeschlossen!")
print(f"✅ Erfolgreich eingefügt: {inserted_count}")
if error_count > 0:
    print(f"❌ Fehler: {error_count}")
print(f"💾 Alle Änderungen in lokaler Datenbank gespeichert")
print("="*50)
