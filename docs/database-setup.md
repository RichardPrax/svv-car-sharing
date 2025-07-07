# 🗄️ Datenbank Setup & Management

Vollständige Dokumentation für Supabase, Prisma und Datenbank-Management.

## 📋 Übersicht

Das Projekt verwendet:

-   **Supabase** als Backend-as-a-Service (PostgreSQL + API + Auth)
-   **Prisma** als ORM (Object-Relational Mapping)
-   **Docker** für lokale Entwicklung

## 🏗️ Architektur

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │───▶│   Prisma ORM    │───▶│   PostgreSQL    │
│   (Frontend)    │    │   (src/lib/)    │    │   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                ▲                        ▲
                                │                        │
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Prisma Schema  │    │  Supabase APIs  │
                       │ (prisma/schema) │    │   (Auth, RLS)   │
                       └─────────────────┘    └─────────────────┘
```

## 🚀 Setup Prozess

### Automatisches Setup

```bash
# Alles automatisch (empfohlen)
./dev-setup.sh local
```

**Was passiert intern:**

1. Supabase Docker Container starten
2. PostgreSQL Datenbank initialisieren
3. Prisma Client generieren
4. Database Schema deployen
5. Testdaten einfügen (Seed)

### Manuelles Setup

```bash
# 1. Supabase starten
npm run supabase:start

# 2. Prisma Client generieren
npm run db:generate

# 3. Schema zur Datenbank pushen
npm run db:push

# 4. Testdaten einfügen
npm run db:seed
```

## 📊 Datenbank Schema

### Aktuelle Tabellen

#### `match_days` - Spieltage

```sql
CREATE TABLE match_days (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location TEXT NOT NULL,
    opponent TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `user_profiles` - Benutzerprofile

```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `rides` - Fahrgemeinschaften

```sql
CREATE TABLE rides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_day_id INTEGER REFERENCES match_days(id),
    driver_id UUID REFERENCES user_profiles(id),
    departure_location TEXT NOT NULL,
    departure_time TIMESTAMPTZ NOT NULL,
    available_seats INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `ride_passengers` - Mitfahrer

```sql
CREATE TABLE ride_passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ride_id UUID REFERENCES rides(id),
    passenger_id UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(ride_id, passenger_id)
);
```

### Schema-Datei Location

Das komplette Schema findest du in:

```
prisma/schema.prisma
```

## 🛠️ Datenbank Commands

### Entwicklung (Lokale DB)

```bash
# Schema Management
npm run db:local:generate    # Prisma Client neu generieren
npm run db:local:push        # Schema-Änderungen zur DB pushen
npm run db:local:studio      # Prisma Studio öffnen (GUI)

# Daten Management
npm run db:local:seed        # Testdaten einfügen
npm run db:local:reset       # ⚠️ DB komplett leeren und neu aufsetzen

# Migrations
npm run db:local:migrate     # Neue Migration erstellen und anwenden
```

### Produktion (Remote DB)

```bash
# Schema Management
npm run db:production:generate
npm run db:production:push
npm run db:production:studio

# Daten Management
npm run db:production:seed

# Migrations
npm run db:production:migrate
```

### Supabase Management

```bash
# Lokale Supabase
npm run supabase:start       # Container starten
npm run supabase:stop        # Container stoppen
npm run supabase:status      # Status anzeigen
npm run supabase:reset       # DB zurücksetzen (behält Container)

# Vollständiges lokales Setup
npm run supabase:local:full  # Start + Schema + Seed
```

## 🎯 Typische Workflows

### Schema-Änderung durchführen

1. **Schema bearbeiten**:

    ```bash
    # Datei öffnen
    code prisma/schema.prisma

    # Beispiel: Neue Spalte hinzufügen
    model User {
      id          String   @id @default(cuid())
      email       String   @unique
      name        String
      newField    String?  // <- Neue Spalte
      created_at  DateTime @default(now())
    }
    ```

2. **Schema zur DB pushen**:

    ```bash
    npm run db:push
    ```

3. **Client neu generieren**:

    ```bash
    npm run db:generate
    ```

4. **Testen**:
    ```bash
    npm run db:studio
    # Oder direkt in der App testen
    ```

### Migration erstellen (für Produktion)

```bash
# 1. Schema ändern (siehe oben)

# 2. Migration erstellen
npm run db:migrate
# Gibt einen Namen ein, z.B.: "add_user_phone_field"

# 3. Migration wird erstellt in:
# prisma/migrations/20231207_add_user_phone_field/migration.sql

# 4. Migration zur Produktion deployen
npm run db:production:migrate
```

### Daten zurücksetzen

```bash
# Nur Daten löschen (Schema bleibt)
npm run db:local:reset

# Oder komplett neu (inkl. Container)
./dev-setup.sh reset
./dev-setup.sh local
```

### Backup erstellen

```bash
# Lokale DB
docker exec supabase_db_svv-car-sharing pg_dump -U postgres postgres > backup.sql

# Backup wiederherstellen
cat backup.sql | docker exec -i supabase_db_svv-car-sharing psql -U postgres -d postgres
```

## 🌐 Supabase Services

### Lokale URLs

Nach `npm run supabase:start`:

| Service     | URL                                 | Beschreibung         |
| ----------- | ----------------------------------- | -------------------- |
| **API**     | `http://localhost:54321`            | REST & GraphQL API   |
| **Studio**  | `http://localhost:54323`            | Web-Interface für DB |
| **Auth**    | `http://localhost:54321/auth/v1`    | Authentifizierung    |
| **Storage** | `http://localhost:54321/storage/v1` | Datei-Upload         |
| **Mail**    | `http://localhost:54324`            | Test-E-Mail Server   |

### Docker Container

```bash
# Container anzeigen
docker ps --filter "label=com.supabase.cli.project=svv-car-sharing"

# Container-Namen:
# - supabase_kong_svv-car-sharing      (API Gateway)
# - supabase_auth_svv-car-sharing      (Auth Service)
# - supabase_rest_svv-car-sharing      (REST API)
# - supabase_storage_svv-car-sharing   (File Storage)
# - supabase_db_svv-car-sharing        (PostgreSQL)
```

### Logs anschauen

```bash
# Alle Supabase Logs
docker logs supabase_db_svv-car-sharing

# Live Logs verfolgen
docker logs -f supabase_db_svv-car-sharing

# API Logs
docker logs supabase_kong_svv-car-sharing
```

## 🔧 Prisma Details

### Client Generation

```bash
# Wann neu generieren?
# - Nach Schema-Änderungen
# - Nach npm install
# - Bei TypeScript-Fehlern

npm run db:generate
```

### Prisma Studio

```bash
# Database GUI starten
npm run db:studio

# Öffnet: http://localhost:5555
# Hier kannst du:
# - Daten ansehen und bearbeiten
# - Queries ausführen
# - Schema visualisieren
```

### Custom Queries

```typescript
// In src/lib/repositories/
import { prisma } from "../prisma";

// Beispiel: Komplexe Query
const ridesWithDetails = await prisma.ride.findMany({
    include: {
        driver: true,
        passengers: {
            include: {
                passenger: true,
            },
        },
        matchDay: true,
    },
});
```

## 🚨 Troubleshooting

### Häufige Probleme

#### "Database connection failed"

**Symptome:**

```
Error: P1001: Can't reach database server at localhost:54322
```

**Lösungen:**

```bash
# 1. Supabase Status prüfen
npm run supabase:status

# 2. Supabase neu starten
npm run supabase:stop
npm run supabase:start

# 3. Docker prüfen
docker ps
```

#### "Prisma Client not generated"

**Symptome:**

```
Error: @prisma/client did not initialize yet
```

**Lösungen:**

```bash
# 1. Client generieren
npm run db:generate

# 2. Falls das nicht hilft
rm -rf node_modules/.prisma
npm run db:generate

# 3. Komplett neu
npm run db:local:reset
```

#### "Migration failed"

**Symptome:**

```
Error: P3005: The database schema is not empty
```

**Lösungen:**

```bash
# 1. Schema-Drift prüfen
npx prisma db push --preview-feature

# 2. Reset und neu
npm run db:local:reset

# 3. Migration force
npx prisma migrate reset --force
```

#### "Port 54322 already in use"

**Symptome:**

```
Error: port 54322 is already allocated
```

**Lösungen:**

```bash
# 1. Prozess finden und killen
lsof -ti:54322 | xargs kill -9

# 2. Docker cleanup
docker container prune -f

# 3. Komplettes Reset
./dev-setup.sh reset
```

### Debug Commands

```bash
# Prisma Debug-Info
npx prisma doctor

# Database URL testen
npx prisma db execute --preview-feature --stdin <<< "SELECT version();"

# Schema Sync prüfen
npx prisma db pull
# (zeigt Unterschiede zwischen DB und Schema)

# Detaillierte Logs
DEBUG=prisma:* npm run dev:local
```

## 📈 Performance & Optimierung

### Connection Pooling

```bash
# Lokale Entwicklung (ohne Pooling)
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"

# Produktion (mit Pooling)
DATABASE_URL="postgresql://user:pass@host:6543/db?pgbouncer=true"
```

### Query Optimierung

```typescript
// ❌ N+1 Problem
const rides = await prisma.ride.findMany();
for (const ride of rides) {
    const driver = await prisma.user.findUnique({
        where: { id: ride.driverId },
    });
}

// ✅ Optimiert mit include
const rides = await prisma.ride.findMany({
    include: {
        driver: true,
        passengers: { include: { passenger: true } },
    },
});
```

### Indizes für bessere Performance

```sql
-- In Migrations hinzufügen
CREATE INDEX idx_rides_match_day ON rides(match_day_id);
CREATE INDEX idx_rides_driver ON rides(driver_id);
CREATE INDEX idx_match_days_date ON match_days(date);
```

## 🔄 Backup & Recovery

### Automatische Backups

```bash
# Backup-Script erstellen
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec supabase_db_svv-car-sharing pg_dump -U postgres postgres > "backup_${DATE}.sql"

# Cron-Job für tägliche Backups
0 2 * * * /path/to/backup-script.sh
```

### Wiederherstellung

```bash
# Backup wiederherstellen
cat backup_20231207_142530.sql | docker exec -i supabase_db_svv-car-sharing psql -U postgres -d postgres

# Oder mit psql direkt
docker exec -i supabase_db_svv-car-sharing psql -U postgres -d postgres < backup.sql
```

## 📚 Weiterführende Ressourcen

-   [Supabase Dokumentation](https://supabase.com/docs)
-   [Prisma Dokumentation](https://www.prisma.io/docs)
-   [PostgreSQL Dokumentation](https://www.postgresql.org/docs/)
-   [Docker für Entwickler](https://docs.docker.com/get-started/)

