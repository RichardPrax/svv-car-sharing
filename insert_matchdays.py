import pandas as pd
from supabase import create_client, Client
from datetime import datetime
import os
from dotenv import load_dotenv

# .env laden
load_dotenv()

# Supabase-Konfiguration aus .env
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 📄 CSV einlesen
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
                "date": datum.isoformat(),
                "time": zeit.strftime("%H:%M:%S"),
                "location": ort,
                "opponents": [gegner]
            }
        else:
            match_days[key]["opponents"].append(gegner)
    else:
        # Auswärtsspiel → einzeln speichern
        match_days[key] = {
            "date": datum.isoformat(),
            "time": zeit.strftime("%H:%M:%S"),
            "location": ort,
            "opponents": [heimteam]
        }

# 🚀 Spieltage in Supabase einfügen
for data in match_days.values():
    response = supabase.table("match_days").insert({
    "date": data["date"],
    "time": data["time"],
    "location": data["location"],
    "opponent": " / ".join(data["opponents"])
    }).execute()

    # result.data enthält die zurückgegebene Zeile oder Fehler
    if response.data:
        print("✅ Eingefügt:", data)
    else:
        print("❌ Fehler beim Einfügen:", response)