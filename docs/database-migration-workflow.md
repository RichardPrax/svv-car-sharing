# 🔄 Datenbank Migration Workflow

## 📋 Übersicht

Diese Dokumentation erklärt, wie Sie Datenbankänderungen sicher von der lokalen Entwicklung in die Produktionsumgebung übertragen.

## 🏗️ Grundlegendes Konzept

### Entwicklungsworkflow

1. **Lokal entwickeln** → Schema-Änderungen in `schema.prisma`
2. **Migration erstellen** → Prisma erstellt SQL-Migrationsdateien
3. **Testen** → Lokal testen der Änderungen
4. **Deployment** → Migration in Produktion anwenden

### Umgebungen

-   **Lokal**: Supabase Docker Container (`.env.local`)
-   **Produktion**: Supabase Cloud (`.env.production`)

## 🛠️ Schritt-für-Schritt Anleitung

### 1. Lokale Schema-Änderungen

#### Schema bearbeiten

```bash
# Öffnen Sie prisma/schema.prisma und nehmen Sie Ihre Änderungen vor
# Beispiel: Neues Feld hinzufügen
```

#### Migration erstellen

```bash
# Mit lokaler Umgebung verbinden und Migration erstellen
npm run db:local:migrate

# Prisma fragt nach einem Namen für die Migration
# Verwenden Sie beschreibende Namen wie:
# - "add_user_phone_field"
# - "update_match_day_status"
# - "create_training_sessions_table"
```

### 2. Lokale Tests

#### Migration anwenden und testen

```bash
# Datenbank Status überprüfen
npm run supabase:status

# Schema pushen (falls nötig)
npm run db:local:push

# Testdaten neu laden
npm run db:local:seed

# Datenbank Studio öffnen um Änderungen zu überprüfen
npm run db:local:studio
```

#### Anwendung testen

```bash
# Entwicklungsserver starten
npm run dev:local

# Testen Sie alle betroffenen Features gründlich
```

### 3. Migration Files verstehen

#### Generierte Dateien

```
prisma/migrations/
├── migration_lock.toml
└── 20250905120000_add_user_phone_field/
    └── migration.sql
```

#### Migration SQL überprüfen

```sql
-- Beispiel migration.sql
-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN "phone" TEXT;
```

**⚠️ WICHTIG**: Überprüfen Sie immer die generierte SQL-Datei!

### 4. Production Deployment

#### Vorbereitung

```bash
# Status der Production DB überprüfen
npm run db:production:status

# Sollte zeigen: "Database is up to date"
```

#### Migration in Production anwenden

```bash
# ⚠️ ACHTUNG: Erst nach gründlichem lokalen Test!
npm run db:production:deploy

# Überprüfen dass alles erfolgreich war
npm run db:production:status
```

#### Vercel Deployment

```bash
# Nach erfolgreicher DB-Migration
git add .
git commit -m "feat: add user phone field migration"
git push origin main

# Vercel deployed automatisch und führt `prisma generate` aus
```

## 🎯 Verfügbare Commands

### Lokale Entwicklung

```bash
# Schema-Entwicklung
npm run db:local:generate      # Prisma Client generieren
npm run db:local:push         # Schema direkt pushen (ohne Migration)
npm run db:local:migrate      # Migration erstellen und anwenden
npm run db:local:studio       # Database GUI
npm run db:local:reset        # ⚠️ Alles zurücksetzen
npm run db:local:seed         # Testdaten laden

# Umgebung
npm run supabase:start        # Lokale DB starten
npm run supabase:stop         # Lokale DB stoppen
npm run supabase:status       # Status überprüfen
```

### Production

```bash
# Migration Management
npm run db:production:status  # Migration Status
npm run db:production:deploy  # Migrationen anwenden
npm run db:production:generate # Client generieren
npm run db:production:studio  # Production DB GUI (⚠️ Vorsicht!)

# Nur für Notfälle
npm run db:production:push    # ⚠️ Schema direkt pushen (gefährlich!)
```

## ⚠️ Wichtige Regeln

### DO's ✅

-   **Immer lokal testen** bevor Sie in Production deployen
-   **Beschreibende Migration-Namen** verwenden
-   **Migration SQL überprüfen** vor dem Deployment
-   **Backups machen** vor größeren Schema-Änderungen
-   **Schrittweise Änderungen** - kleine, atomare Migrationen

### DON'Ts ❌

-   **Niemals `db:push` in Production** verwenden
-   **Keine destruktiven Änderungen** ohne Backup
-   **Keine Rollbacks** - Prisma unterstützt keine automatischen Rollbacks
-   **Keine direkten SQL-Änderungen** in Production ohne Migration

## 🚨 Troubleshooting

### Fehler P3005: "The database schema is not empty"

**Problem**: Die Production-Datenbank hat bereits ein Schema, aber Prisma kennt keine Migration-Historie.

**Ursache**: Oft passiert das wenn Sie vorher `db:push` verwendet haben oder die DB bereits existierte.

**Lösung - Database Baseline erstellen**:

```bash
# 1. Aktuelle Schema-Struktur als Baseline markieren
npx dotenv -e .env.production -- prisma migrate resolve --applied "20250630194309_init"

# 2. Alle weiteren Migrationen als angewendet markieren
npx dotenv -e .env.production -- prisma migrate resolve --applied "20250630194310_add_game_participation"
npx dotenv -e .env.production -- prisma migrate resolve --applied "20250813160954_add_user_roles"
npx dotenv -e .env.production -- prisma migrate resolve --applied "20250820162706_add_bring_items"
npx dotenv -e .env.production -- prisma migrate resolve --applied "20250821111658_removed_tentative"
npx dotenv -e .env.production -- prisma migrate resolve --applied "20250822190127_added_position_to_userprofiel"
npx dotenv -e .env.production -- prisma migrate resolve --applied "20250904203036_new_player_role"

# 3. Status überprüfen
npm run db:production:status

# 4. Jetzt sollte deploy funktionieren
npm run db:production:deploy
```

**Alternative - Schnelle Lösung**:

```bash
# Alle existierenden Migrationen als angewendet markieren
npx dotenv -e .env.production -- prisma migrate resolve --applied $(ls prisma/migrations | head -1)
npx dotenv -e .env.production -- prisma migrate resolve --applied $(ls prisma/migrations | sed -n '2p')
# ... für alle Migrationen

# Oder mit Script alle auf einmal:
for migration in $(ls prisma/migrations); do
  npx dotenv -e .env.production -- prisma migrate resolve --applied "$migration"
done

npm run db:production:deploy
```

### Migration schlägt fehl

```bash
# Status überprüfen
npm run db:production:status

# Details ansehen
npx dotenv -e .env.production -- prisma migrate status --schema=prisma/schema.prisma

# Bei Problemen: Reset der Migration (nur lokal!)
npm run db:local:reset
```

### Schema Out of Sync

```bash
# Lokal
npm run db:local:push
npm run db:local:generate

# Production (nur nach Migration)
npm run db:production:generate
```

### Prisma Client Errors

```bash
# Nach Schema-Änderungen immer Client neu generieren
npm run db:generate
# oder umgebungsspezifisch
npm run db:local:generate
npm run db:production:generate
```

## 📊 Typische Workflow-Beispiele

### Neues Feld hinzufügen

```bash
# 1. schema.prisma bearbeiten
# 2. Migration erstellen
npm run db:local:migrate

# 3. Lokal testen
npm run dev:local

# 4. In Production deployen
npm run db:production:deploy
git add . && git commit -m "feat: add new field" && git push
```

### Neue Tabelle erstellen

```bash
# 1. Neues Model in schema.prisma
# 2. Migration mit Dependencies beachten
npm run db:local:migrate

# 3. Seed-Daten anpassen (falls nötig)
# 4. Gründlich testen
npm run db:local:seed

# 5. Production Deployment
npm run db:production:deploy
```

### Rollback (manuell)

```bash
# ⚠️ Prisma hat keine automatischen Rollbacks
# Manuelle Schritte nötig:

# 1. Backup der Production DB
# 2. Neue Migration erstellen die Änderungen rückgängig macht
# 3. Diese Migration deployen
```

## 🔐 Sicherheit

### Environment Files

-   `.env.local` - Lokale Supabase DB
-   `.env.production` - Production Supabase DB
-   **Niemals** Production Credentials in lokalen Files!

### Migration Files

-   **Alle Migration Files** müssen in Git committed werden
-   **Niemals** Migration Files nach dem Deployment bearbeiten
-   Bei Fehlern: **Neue Migration** erstellen

---

**💡 Tipp**: Verwenden Sie immer `npm run setup:status` um den aktuellen Zustand aller Umgebungen zu überprüfen!

