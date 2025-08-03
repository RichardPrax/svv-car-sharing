# 📋 Alle Befehle - Schnell-Referenz

## 🚀 Setup & Management

### Haupt-Setup-Script

```bash
./dev-setup.sh                # Interaktives Menü
./dev-setup.sh local          # Lokale Entwicklung setup
./dev-setup.sh production     # Produktions-Setup
./dev-setup.sh status         # Status aller Services
./dev-setup.sh cleanup        # Aufräumen (behält Daten)
./dev-setup.sh reset          # ⚠️ ALLES löschen und neu
```

## 🎭 Testdaten & Authentication

### Testdaten erstellen

```bash
npm run auth:create-users     # Alle 7 Testnutzer (konsistent)
npm run create:test-data      # Fahrgemeinschafts-Testdaten
npm run import:spielplan      # Spielplan importieren (spielplan.csv)
```

### Testnutzer-Details

**Alle 7 Nutzer** (konsistent mit @test.com):

-   max.mustermann@test.com | test1234
-   anna.schmidt@test.com | test1234
-   tom.mueller@test.com | test1234
-   lisa.weber@test.com | test1234
-   ben.schneider@test.com | test1234
-   sara.fischer@test.com | test1234
-   noah.hoffmann@test.com | test1234

**Automatische Fahrgemeinschaften**:

-   **7 verschiedene Szenarien** zyklisch über alle Spieltage verteilt
-   Von "keine Fahrten" bis "komplett ausgebucht"
-   Realistische Abfahrtszeiten (1-4h vor Spielbeginn)
-   Verschiedene Abfahrtsorte und Auslastungsgrade
-   **Geschäftslogik**: Jeder Nutzer nur einmal pro Spieltag (entweder Fahrer oder Mitfahrer)
-   **Testet alle UI-Zustände**: Leere Listen, volle Fahrten, gemischte Szenarien

## 💻 Entwicklung

### Development Server

```bash
npm run dev:local             # Lokaler Server (mit .env.local)
npm run dev:production        # Server mit Prod-DB (mit .env.production)
npm run dev                   # Standard Server (mit .env)
```

### Build & Deploy

```bash
npm run build:local           # Build mit lokaler Config
npm run build:production      # Build mit Prod-Config
npm run build                 # Standard Build
npm run start                 # Produktions-Server starten
```

### Code Quality

```bash
npm run lint                  # ESLint ausführen
npm run clean                 # Caches löschen (.next, node_modules/.cache)
```

## 🗄️ Datenbank Management

### Lokale Datenbank (empfohlen für Entwicklung)

```bash
npm run db:local:generate     # Prisma Client generieren
npm run db:local:push         # Schema zur DB pushen
npm run db:local:migrate      # Migration erstellen und ausführen
npm run db:local:studio       # Prisma Studio GUI öffnen
npm run db:local:seed         # Testdaten einfügen
npm run db:local:reset        # ⚠️ Lokale DB komplett zurücksetzen
```

### Produktions-Datenbank (⚠️ Vorsicht!)

```bash
npm run db:production:generate
npm run db:production:push
npm run db:production:migrate
npm run db:production:studio
npm run db:production:seed
```

### Standard Datenbank-Commands (nutzt Standard .env)

```bash
npm run db:generate           # Prisma Client generieren
npm run db:push               # Schema pushen
npm run db:migrate            # Migration
npm run db:studio             # Studio öffnen
npm run db:seed               # Seed data
```

## 🐳 Supabase Management

### Lokale Supabase (Docker)

```bash
npm run supabase:start        # Lokale Supabase starten
npm run supabase:stop         # Lokale Supabase stoppen
npm run supabase:status       # Status anzeigen
npm run supabase:reset        # Lokale DB zurücksetzen
npm run supabase:local:full   # Komplett-Setup: Start + Schema + Seed
```

## 🔍 Validation & Testing

### Environment Validation

```bash
npm run validate-env          # Standard .env validieren
npm run validate-env:local    # .env.local validieren
npm run validate-env:production # .env.production validieren
npm run validate-env:status   # Status aller Environments
```

## 🎯 URLs nach dem Start

### Entwicklung (nach `npm run dev:local`)

-   **Hauptapp**: http://localhost:3000
-   **Prisma Studio**: http://localhost:5555 (nach `npm run db:studio`)

### Lokale Supabase (nach `npm run supabase:start`)

-   **Supabase Studio**: http://localhost:54323
-   **API Endpoint**: http://localhost:54321
-   **Mail Interface**: http://localhost:54324
-   **PostgreSQL**: localhost:54322 (für DB-Tools)

## 🔧 Setup-Scripts Referenz

### Automatisches Lokales Setup

```bash
# Alles in einem Befehl
./dev-setup.sh local

# Macht folgendes:
# 1. Requirements check (Node, Docker, etc.)
# 2. Supabase starten (Docker containers)
# 3. Prisma Client generieren
# 4. Schema zur DB pushen
# 5. Testdaten einfügen
# 6. Status anzeigen
```

### Reset & Neustart

```bash
# Komplett-Reset (löscht ALLE Daten!)
./dev-setup.sh reset

# Danach neu aufsetzen
./dev-setup.sh local
```

## 🚨 Troubleshooting Commands

### Status-Checks

```bash
./dev-setup.sh status         # Kompletter Status-Report
npm run supabase:status       # Nur Supabase Status
docker ps                     # Alle Docker Container
lsof -i :3000                 # Port 3000 Status
lsof -i :54321                # Supabase API Port Status
```

### Service-Neustarts

```bash
# Next.js neu starten
# Strg+C im Terminal, dann:
npm run dev:local

# Supabase neu starten
npm run supabase:stop
npm run supabase:start

# Komplett neu (mit Daten-Reset)
./dev-setup.sh reset
./dev-setup.sh local
```

### Cache-Clearing

```bash
npm run clean                 # Next.js Cache
rm -rf node_modules/.cache    # Node Cache
rm -rf node_modules/.prisma   # Prisma Cache
npm run db:generate           # Prisma Client neu generieren
```

### Docker-Probleme

```bash
docker system prune -f        # Docker cleanup
docker volume prune -f        # Docker volumes cleanup
docker container prune -f     # Stopped containers cleanup
```

## 📁 Wichtige Dateien & Pfade

### Konfiguration

```bash
.env.local                    # Lokale Entwicklung
.env.production              # Produktion
.env.example                 # Vorlage/Dokumentation
prisma/schema.prisma         # Datenbank-Schema
dev-setup.sh                 # Haupt-Setup-Script
```

### Logs & Debug

```bash
.next/                       # Next.js Build & Cache
node_modules/.prisma/        # Generierte Prisma Files
supabase/logs/               # Supabase Logs (falls vorhanden)
```

### Dokumentation

```bash
GETTING_STARTED.md           # Einsteiger-Guide
docs/README.md               # Technische Dokumentation
docs/setup-script.md         # Setup-Script Details
docs/environment-config.md   # Environment-Variablen
docs/database-setup.md       # Datenbank-Management
```

## 🎯 Typische Workflows

### Erster Start (frisches Repository)

```bash
git clone <repo-url>
cd svv-car-sharing
npm install
./dev-setup.sh local
# ➜ App läuft auf http://localhost:3000
```

### Tägliche Entwicklung

```bash
# Morgens
./dev-setup.sh status        # Prüfen ob alles läuft
npm run dev:local             # Falls noch nicht gestartet

# Entwickeln...
npm run db:studio             # DB anschauen/bearbeiten

# Abends
# Strg+C (Server stoppen)
npm run supabase:stop         # Optional: Supabase stoppen
```

### Neue Features entwickeln

```bash
git checkout -b feature/mein-feature
# Code schreiben...
npm run dev:local             # Testen
git commit -m "Neues Feature"
git push origin feature/mein-feature
```

### Schema-Änderungen

```bash
# 1. Schema bearbeiten
code prisma/schema.prisma

# 2. Zur DB pushen
npm run db:push

# 3. Testen
npm run db:studio

# 4. Migration für Produktion erstellen
npm run db:migrate
```

### Nach längerer Pause

```bash
git pull origin main          # Neueste Änderungen
npm install                   # Dependencies updaten
./dev-setup.sh local          # Alles neu starten
```

---

💡 **Tipp**: Speichere diese Datei als Bookmark - sie enthält alle wichtigen Befehle!

