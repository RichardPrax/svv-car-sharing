import pandas as pd
import psycopg2
from datetime import datetime
import os
from dotenv import load_dotenv

# .env laden
load_dotenv()

DATABASE_URL = os.getenv("DIRECT_URL")

print("📋 Verbinde mit PostgreSQL...")

try:
    # connect to database
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    print("✅ PostgreSQL-Verbindung erfolgreich")
    
    # test request
    cursor.execute("SELECT COUNT(*) FROM match_days;")
    count = cursor.fetchone()[0]
    print(f"📊 Aktuelle Anzahl Spieltage: {count}")
    
except Exception as e:
    print(f"❌ Verbindung fehlgeschlagen: {e}")
    exit(1)

# read csv file
df = pd.read_csv("spielplan.csv", sep=";", encoding="latin1")

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

# 🚀 insert match days into database
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
        
    except Exception as e:
        print(f"❌ Fehler beim Einfügen von {data}: {e}")

# Änderungen speichern
conn.commit()
cursor.close()
conn.close()

print("🎉 Alle Spieltage erfolgreich eingefügt!")
