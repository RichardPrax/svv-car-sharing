# SVV Car Sharing - Lokale Entwicklung

## 🚀 Setup für lokale Entwicklung

### Voraussetzungen

-   Docker Desktop (muss installiert und gestartet sein)
-   Node.js (Version 18+)
-   npm oder yarn

### 1. Installation

```bash
npm install
```

### 2. Lokale Supabase-Umgebung starten

```bash
npm run supabase:start
```

Dieser Befehl startet alle notwendigen Docker-Container:

-   PostgreSQL Datenbank (Port 54322)
-   Supabase Studio (Port 54323)
-   Supabase API (Port 54321)
-   Inbucket Mail Server (Port 54324)

### 3. Datenbank initialisieren

```bash
# Prisma Schema zur Datenbank pushen
npm run db:push

# Testdaten erstellen
npm run db:seed
```

### 4. Anwendung starten

```bash
npm run dev
```

Die Anwendung ist dann unter [http://localhost:3000](http://localhost:3000) erreichbar.

## 🛠️ Nützliche Befehle

### Supabase

-   `npm run supabase:start` - Lokale Supabase starten
-   `npm run supabase:stop` - Lokale Supabase stoppen
-   `npm run supabase:status` - Status anzeigen
-   `npm run supabase:reset` - Supabase-Datenbank zurücksetzen

### Datenbank (Prisma)

-   `npm run db:push` - Schema zur Datenbank pushen
-   `npm run db:migrate` - Neue Migration erstellen
-   `npm run db:studio` - Prisma Studio öffnen
-   `npm run db:seed` - Testdaten erstellen

### Lokale Entwicklung (mit explizit lokaler DB)

-   `npm run db:local:push` - Schema zur lokalen DB pushen
-   `npm run db:local:migrate` - Migration zur lokalen DB
-   `npm run db:local:studio` - Prisma Studio für lokale DB
-   `npm run db:local:reset` - Lokale DB zurücksetzen

## 📋 Umgebungsvariablen

### Lokale Entwicklung (`.env.local`)

```env
# Lokale Supabase URLs
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Lokale Datenbank
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
DIRECT_URL="postgresql://postgres:postgres@localhost:54322/postgres"
```

### Produktion (`.env.production`)

Die Produktionswerte werden bei der Bereitstellung gesetzt.

## 🔧 Troubleshooting

### Docker-Probleme

-   Stelle sicher, dass Docker Desktop läuft
-   Prüfe, ob die Ports 54321-54324 frei sind

### Datenbank-Verbindungsprobleme

-   Vergewissere dich, dass Supabase läuft: `npm run supabase:status`
-   Setze die Umgebungsvariablen zurück, falls sie auf System-Ebene gesetzt sind

### Prisma-Probleme

-   Generiere den Client neu: `npx prisma generate`
-   Pushe das Schema: `npm run db:push`

### PrismaClient Browser-Fehler

Falls der Fehler "PrismaClient is unable to run in this browser environment" auftritt:

-   **Ursache**: Prisma Client darf nur in API-Routen (Server-side) verwendet werden, nicht in React-Komponenten (Client-side)
-   **Lösung**: Stelle sicher, dass alle Datenbankoperationen über API-Routen (`/pages/api/`) laufen
-   **Überprüfung**: Suche nach direkten Imports von `@prisma/client` oder Repository-Klassen in React-Komponenten oder Hooks

## 🌐 URLs der lokalen Services

-   **Anwendung**: http://localhost:3000
-   **Supabase Studio**: http://localhost:54323
-   **Supabase API**: http://localhost:54321
-   **Prisma Studio**: http://localhost:5555 (wenn gestartet)
-   **Mail-Server (Inbucket)**: http://localhost:54324
