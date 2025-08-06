# 🔧 Setup-Script Dokumentation

Das `dev-setup.sh` Skript automatisiert das komplette Setup.

## 📋 Nutzung

**Interaktiv (mit Menü):**

```bash
./dev-setup.sh
```

**Direkt:**

```bash
./dev-setup.sh local        # Lokales Setup
./dev-setup.sh status       # Status prüfen
./dev-setup.sh cleanup      # Aufräumen
./dev-setup.sh reset        # ⚠️ Komplett neu
```

## 🎯 Was macht `local`?

1. **Prüfungen**: Node.js, Docker, Supabase CLI
2. **Supabase starten**: Docker Container mit PostgreSQL
3. **Environment**: `.env.local` erstellen/prüfen
4. **Datenbank**: Schema deployen + Testdaten laden
5. **Benutzer**: 7 Testbenutzer mit Auth erstellen
6. **Spielplan**: CSV-Import der Matchdays
7. **Testdaten**: Realistische Fahrgemeinschaften

**Ergebnis:** Komplett funktionsfähige App mit Testdaten!

## ⚙️ Script-Funktionen

### Status-Check

```bash
./dev-setup.sh status
```

Zeigt:

-   Node.js/Docker Status
-   Supabase Status
-   Environment-Dateien
-   Datenbank-Verbindung

### Cleanup vs Reset

```bash
./dev-setup.sh cleanup     # Soft: Behält Daten
./dev-setup.sh reset       # Hard: Löscht ALLES
```

### Debug-Mode

```bash
DEBUG=true ./dev-setup.sh local    # Verbose Output
```

## 🔍 Interne Details

**Das Script ist robust:**

-   Überprüft alle Dependencies
-   Fängt Fehler ab und gibt Hilfestellung
-   Kann mehrfach ausgeführt werden
-   Erkennt bereits laufende Services

**Automatisierte Supabase-Keys:**

-   Wartet bis Supabase vollständig gestartet ist
-   Extrahiert Keys automatisch
-   Erstellt `.env.local` mit korrekten Werten

---

_Das Script ist so gebaut, dass `./dev-setup.sh local` immer funktioniert!_

