# 🗄️ Datenbank Setup

## 📋 Stack

-   **Supabase**: PostgreSQL + Auth + APIs
-   **Prisma**: ORM für Datenbankzugriff
-   **Docker**: Lokale Entwicklungsumgebung

## 🚀 Setup

**Automatisch (empfohlen):**

```bash
./dev-setup.sh local    # Macht alles automatisch
```

**Manuell:**

```bash
npm run supabase:start     # Datenbank starten
npm run db:push            # Schema deployen
npm run db:seed            # Testdaten laden
```

## 🔧 Wichtige Commands

```bash
# Status & GUI
npm run supabase:status    # Ist alles am Laufen?
npm run db:studio          # Datenbank GUI öffnen

# Schema-Änderungen
npm run db:push            # Schema zur DB pushen
npm run db:generate        # Prisma Client neu generieren

# Daten
npm run db:seed            # Testdaten neu laden
npm run db:local:reset     # ⚠️ Datenbank zurücksetzen
```

## 📊 Schema-Übersicht

```
UserProfile (Benutzer)
├── id (UUID)
├── email, name, phone
└── created_at

MatchDay (Spieltage)
├── id, date, opponent
├── location, time
└── UserProfile[] (Teilnehmer)

Ride (Fahrgemeinschaften)
├── id, match_day_id
├── driver_id → UserProfile
├── departure_time, from_location
├── available_seats
└── passengers → UserProfile[]
```

## 🆘 Häufige Probleme

**"Database connection failed"**

```bash
./dev-setup.sh status     # Läuft Supabase?
npm run supabase:start    # Falls nicht
```

**"Prisma Client not found"**

```bash
npm run db:generate       # Client neu generieren
```

**"Schema out of sync"**

```bash
npm run db:push           # Schema pushen
```

---

_Das Setup-Script macht normalerweise alles automatisch!_

