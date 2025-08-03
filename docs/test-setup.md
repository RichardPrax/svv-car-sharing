# 🎭 Test-Setup Dokumentation

## Übersicht

Das Test-Setup erstellt automatisch realistische Testdaten für die SVV Car Sharing Anwendung.

## 🚀 Schnellstart

```bash
# Komplettes Setup (empfohlen)
./dev-setup.sh local

# Oder manuell Schritt für Schritt:
npm run auth:create-users     # 7 Testnutzer erstellen
npm run import:spielplan      # Spielplan importieren
npm run create:test-data      # Fahrgemeinschafts-Testdaten
```

## 👥 Testnutzer

### Alle 7 Testnutzer (konsistent erstellt)

```bash
npm run auth:create-users
```

-   **max.mustermann@test.com** | test1234
-   **anna.schmidt@test.com** | test1234
-   **tom.mueller@test.com** | test1234
-   **lisa.weber@test.com** | test1234
-   **ben.schneider@test.com** | test1234
-   **sara.fischer@test.com** | test1234
-   **noah.hoffmann@test.com** | test1234

### Fahrtestdaten erstellen

```bash
npm run create:test-data
```

-   Erstellt Fahrgemeinschaften für alle Spieltage
-   Nutzt die bestehenden 7 Nutzer als Fahrer und Mitfahrer

## 🚗 Automatische Fahrgemeinschaften

Das `create:test-data` Skript erstellt für jeden importierten Spieltag verschiedene realistische Szenarien:

### Test-Szenarien (zyklisch für alle Spieltage)

1. **Kein Interesse** - Keine Fahrgemeinschaften

    - Niemand bietet eine Fahrt an
    - Testet leere Spieltage

2. **Wenig Interesse** - Nur leere Fahrten

    - 2 Fahrer bieten Fahrten an
    - Keine Mitfahrer
    - Testet ungenutzte Kapazitäten

3. **Hohe Nachfrage** - Nur volle Fahrten

    - 2 komplett ausgebuchte Fahrten
    - Alle Plätze belegt
    - Testet Kapazitätsgrenzen

4. **Gemischt** - Teilweise gefüllt

    - 3 Fahrten mit ~50% Auslastung
    - Realistische Mischung
    - Testet normale Nutzung

5. **Viele Angebote** - Verschiedene Füllgrade

    - 4 Fahrten mit ~30% Auslastung
    - Überangebot an Fahrten
    - Testet Marktübersättigung

6. **Ein Fahrer allein**

    - 1 Fahrt ohne Mitfahrer
    - Testet Einzelfahrten

7. **Optimale Auslastung**
    - 2 Fahrten mit ~80% Auslastung
    - Noch Plätze verfügbar
    - Testet gute Nutzung

### Fahrt-Eigenschaften

-   **Anzahl**: 0-4 Fahrten pro Spieltag (je nach Szenario)
-   **Abfahrtszeit**: 1-4 Stunden vor Spielbeginn (auf 15min gerundet)
-   **Abfahrtsorte**: Realistische Orte wie "Hauptbahnhof", "Stadtzentrum", "Vereinsheim"
-   **Verfügbare Plätze**: 1-4 Sitzplätze
-   **Fahrer**: Zufällig aus allen verfügbaren Nutzern

### Mitfahrer-Zuordnung (mit Geschäftslogik)

-   **Ein Nutzer pro Spieltag**: Jeder kann nur entweder Fahrer ODER Mitfahrer sein
-   **Ein Fahrer pro Spieltag**: Niemand kann mehrere Fahrten gleichzeitig anbieten
-   **Keine Doppelbelegung**: Fahrer können nicht in anderen Autos mitfahren
-   **Eindeutige Zuordnung**: Jeder Nutzer ist maximal einem Auto pro Spieltag zugeordnet
-   **Realistische Verteilung**: Manche Nutzer fahren möglicherweise gar nicht mit

## 📊 Beispiel-Ausgabe

Nach einem erfolgreichen Setup werden 7 verschiedene Szenarien erstellt:

```
🎯 Match 1: FC Bayern on 2025-08-15
   Scenario: Kein Interesse - keine Fahrgemeinschaften
   ℹ️  No rides created for this match day

🎯 Match 2: Borussia Dortmund on 2025-08-22
   Scenario: Wenig Interesse - nur leere Fahrten
   ✅ Ride 1: Max Mustermann from Hauptbahnhof at 17:30 (3 seats)
      🪑 3 seat(s) available - no passengers

🎯 Match 3: Bayern München on 2025-08-29
   Scenario: Hohe Nachfrage - nur volle Fahrten
   ✅ Ride 1: Tom Mueller from Stadtzentrum at 18:15 (2 seats)
      👤 Passenger: Lisa Weber
      👤 Passenger: Ben Schneider

📊 Test data summary:
  👥 Total users: 7
  ⚽ Total match days: 15
  🚗 Total rides: 28 (varies by scenario)
  👤 Total passengers: 19 (varies by scenario)

📧 All 7 test users have the password: test1234
📧 Email format: firstname.lastname@test.com
```

## 🎯 Realistische Testdaten

### Abfahrtsorte

-   Hauptbahnhof
-   Stadtzentrum
-   Parkplatz am Sportplatz
-   Vereinsheim
-   Busbahnhof
-   Marktplatz
-   Rathaus
-   Sporthalle
-   Vereinsgelände
-   Ortsmitte

### Zeiten

-   Abfahrt automatisch 1-4 Stunden vor Spielbeginn
-   Zeiten auf 15-Minuten-Intervalle gerundet
-   Berücksichtigt Wochentag und Uhrzeit des Spiels

## 🔄 Workflow für Entwicklung

```bash
# Neues Setup
./dev-setup.sh local

# Nach Schema-Änderungen
npm run db:push
npm run create:test-data
```

## 🐛 Troubleshooting

### Fehler bei User-Erstellung

-   Prüfe Supabase-Verbindung: `npm run supabase:status`
-   Prüfe Umgebungsvariablen in `.env.local`

### Fahrten werden nicht erstellt

-   Erst Spielplan importieren: `npm run import:spielplan`
-   Dann Testdaten: `npm run create:test-data`

### Doppelte Nutzer

-   Supabase komplett zurücksetzen: `./dev-setup.sh reset`
-   Neu aufsetzen: `./dev-setup.sh local`

---

💡 **Tipp**: Bei jedem neuen `./dev-setup.sh local` werden automatisch alle Testdaten erstellt!

