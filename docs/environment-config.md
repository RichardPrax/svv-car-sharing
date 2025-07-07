# 🌍 Environment & Konfiguration

Komplette Dokumentation aller Umgebungsvariablen und Konfigurationsdateien.

## 📁 Environment-Dateien Übersicht

| Datei             | Zweck                 | Versionskontrolle      | Wann verwendet                  |
| ----------------- | --------------------- | ---------------------- | ------------------------------- |
| `.env.example`    | Vorlage/Dokumentation | ✅ Committed           | Referenz für neue Entwickler    |
| `.env`            | Fallback-Werte        | ❌ **Nicht** committed | Automatisch von Next.js geladen |
| `.env.local`      | Lokale Entwicklung    | ❌ **Nicht** committed | `npm run dev:local`             |
| `.env.production` | Produktion            | ❌ **Nicht** committed | `npm run dev:production`        |

## ⚙️ Umgebungsvariablen Details

### 🌐 Supabase Konfiguration

#### `NEXT_PUBLIC_SUPABASE_URL`

-   **Typ**: Client & Server
-   **Beschreibung**: URL der Supabase-Instanz
-   **Lokal**: `http://localhost:54321`
-   **Produktion**: `https://your-project.supabase.co`
-   **Wichtig**: `NEXT_PUBLIC_` macht es im Browser verfügbar

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`

-   **Typ**: Client & Server
-   **Beschreibung**: Öffentlicher API-Schlüssel für Supabase
-   **Lokal**: Automatisch generiert von lokaler Supabase
-   **Produktion**: Aus Supabase Dashboard kopieren
-   **Sicherheit**: Öffentlich sichtbar, aber sicher durch RLS-Policies

#### `SUPABASE_SERVICE_ROLE_KEY`

-   **Typ**: Nur Server
-   **Beschreibung**: Admin-Schlüssel für Backend-Operationen
-   **Verwendung**: Bypass von Row Level Security (RLS)
-   **Sicherheit**: ⚠️ NIEMALS im Frontend verwenden!

### 🗄️ Datenbank Konfiguration

#### `DATABASE_URL`

-   **Typ**: Nur Server
-   **Beschreibung**: Haupt-Datenbankverbindung mit Connection Pooling
-   **Format**: `postgresql://user:password@host:port/database?pgbouncer=true`
-   **Lokal**: `postgresql://postgres:postgres@localhost:54322/postgres`
-   **Verwendung**: Normale Anwendungsoperationen

#### `DIRECT_URL`

-   **Typ**: Nur Server
-   **Beschreibung**: Direkte Datenbankverbindung ohne Connection Pool
-   **Format**: `postgresql://user:password@host:port/database`
-   **Verwendung**: Migrationen, Schema-Updates
-   **Warum**: Einige Operationen benötigen direkte Verbindung

### 🔐 Authentifizierung

#### `NEXTAUTH_URL`

-   **Typ**: Server
-   **Beschreibung**: Base URL der Anwendung
-   **Lokal**: `http://localhost:3000`
-   **Produktion**: `https://your-domain.com`
-   **Verwendung**: OAuth Redirects, Session-Cookies

#### `NEXTAUTH_SECRET`

-   **Typ**: Server
-   **Beschreibung**: Geheimer Schlüssel für JWT-Tokens
-   **Lokal**: `local-development-secret-key`
-   **Produktion**: Starkes, zufälliges Passwort
-   **Generierung**: `openssl rand -base64 32`

### 🏗️ Anwendungsumgebung

#### `NODE_ENV`

-   **Typ**: System
-   **Beschreibung**: Umgebungsmodus
-   **Werte**: `development`, `production`, `test`
-   **Automatisch**: Von Next.js gesetzt
-   **Einfluss**: Logging, Caching, Error-Handling

## 🔄 Environment Loading Reihenfolge

Next.js lädt Environment-Dateien in folgender Reihenfolge:

1. **`.env`** (immer geladen)
2. **`.env.local`** (immer geladen, außer in test)
3. **`.env.development`** (nur wenn NODE_ENV=development)
4. **`.env.development.local`** (nur wenn NODE_ENV=development)
5. **`.env.production`** (nur wenn NODE_ENV=production)
6. **`.env.production.local`** (nur wenn NODE_ENV=production)

**⚠️ Wichtig**: Später geladene Dateien überschreiben frühere Werte!

## 🛠️ Setup pro Umgebung

### Lokale Entwicklung (`.env.local`)

```bash
# ===========================================
# LOCAL DEVELOPMENT ENVIRONMENT
# ===========================================
# This file is for local development with local Supabase

# Database - Local Supabase
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
DIRECT_URL="postgresql://postgres:postgres@localhost:54322/postgres"

# Supabase - Local Instance
NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="local-development-secret-key"

# Environment
NODE_ENV="development"
```

### Produktion (`.env.production`)

```bash
# ===========================================
# PRODUCTION ENVIRONMENT
# ===========================================
# This file is for production deployment

# Database - Production Supabase
DATABASE_URL="postgresql://postgres.xxx:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:password@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# Supabase - Production Instance
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Auth
NEXTAUTH_URL="https://your-production-domain.com"
NEXTAUTH_SECRET="strong-random-production-secret"

# Environment
NODE_ENV="production"
```

### Fallback (`.env`)

```bash
# ===========================================
# FALLBACK ENVIRONMENT VARIABLES
# ===========================================
# These are used when no specific .env.local or .env.production is found
# For local development, these should be empty or point to local services

# NOTE: Do not define NEXT_PUBLIC_ variables here as empty values
# because they will prevent .env.local from overriding them!

# Only define server-side fallbacks if needed
# DATABASE_URL=
# DIRECT_URL=
# SUPABASE_SERVICE_ROLE_KEY=
```

## 🔍 Environment Validation

### Automatische Validierung

Das Projekt hat eine eingebaute Validierung in `src/lib/env.ts`:

```typescript
// Required client-side environment variables
const requiredClientEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const;

// Required server-side environment variables
const requiredServerEnvVars = ["DATABASE_URL"] as const;
```

### Manuelle Validierung

```bash
# Environment für lokale Entwicklung prüfen
npm run validate-env:local

# Environment für Produktion prüfen
npm run validate-env:production

# Status aller Environments anzeigen
npm run validate-env:status
```

## 🚨 Häufige Probleme & Lösungen

### Problem: "Missing required environment variables"

**Ursache**: Environment-Variablen werden nicht geladen

**Lösungen:**

1. **Datei existiert?**

    ```bash
    ls -la .env*
    ```

2. **Correct dotenv loading?**

    ```bash
    # Für lokale Entwicklung
    npm run dev:local  # statt npm run dev
    ```

3. **Leere Werte in .env?**
    ```bash
    # Entferne leere NEXT_PUBLIC_ Variablen aus .env
    ```

### Problem: "Client-side variables not available"

**Ursache**: `NEXT_PUBLIC_` Variablen fehlen oder sind falsch benannt

**Lösung:**

```bash
# Prüfe Naming
grep "NEXT_PUBLIC" .env.local

# Restart development server
npm run dev:local
```

### Problem: "Database connection failed"

**Ursache**: `DATABASE_URL` oder `DIRECT_URL` falsch

**Lösungen:**

1. **Supabase läuft?**

    ```bash
    npm run supabase:status
    ```

2. **URLs korrekt?**

    ```bash
    npm run validate-env:local
    ```

3. **Port conflicts?**
    ```bash
    lsof -i :54322  # PostgreSQL Port
    ```

### Problem: "CORS errors in browser"

**Ursache**: `NEXT_PUBLIC_SUPABASE_URL` stimmt nicht mit tatsächlicher URL überein

**Lösung:**

```bash
# Lokale Entwicklung: sollte localhost sein
NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"

# NICHT https, NICHT IP-Adresse
```

## 🔧 Environment Management

### Neue Environment-Variable hinzufügen

1. **Zu Validation hinzufügen** (`src/lib/env.ts`):

    ```typescript
    const requiredClientEnvVars = [
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_MY_NEW_VAR", // <- Hier hinzufügen
    ] as const;
    ```

2. **Zu allen .env Dateien hinzufügen**:

    ```bash
    # .env.local
    NEXT_PUBLIC_MY_NEW_VAR="local-value"

    # .env.production
    NEXT_PUBLIC_MY_NEW_VAR="production-value"

    # .env.example (für Dokumentation)
    NEXT_PUBLIC_MY_NEW_VAR="example-value"
    ```

3. **TypeScript typing** (optional):
    ```typescript
    // In env.ts
    export const envConfig = {
        myNewVar: process.env.NEXT_PUBLIC_MY_NEW_VAR!,
        // ...
    };
    ```

### Environment zwischen Umgebungen switchen

```bash
# Setup Scripts verwenden (empfohlen)
./dev-setup.sh local      # Lädt .env.local
./dev-setup.sh production # Lädt .env.production

# Oder manuell mit dotenv-cli
npm run dev:local         # Explizit .env.local
npm run dev:production    # Explizit .env.production
```

## 📚 Best Practices

### ✅ Do's

-   **Client variables**: Immer `NEXT_PUBLIC_` Prefix verwenden
-   **Secrets**: Niemals in committed files speichern
-   **Documentation**: Alle Variablen in `.env.example` dokumentieren
-   **Validation**: Immer required Variablen validieren
-   **Naming**: Konsistente, aussagekräftige Namen verwenden

### ❌ Don'ts

-   **Leere Werte**: Nicht `NEXT_PUBLIC_VAR=` in .env setzen (blockiert Override)
-   **Secrets in Frontend**: Niemals Service Role Keys in Client Code
-   **Hardcoding**: Keine URLs oder Schlüssel direkt im Code
-   **Mixed Environments**: Lokale und Prod-Werte nicht mischen

### 🔐 Security Checklist

-   [ ] `.env.local` und `.env.production` sind in `.gitignore`
-   [ ] Keine Secrets in committed Dateien
-   [ ] Service Role Keys nur server-side verwendet
-   [ ] Starke Secrets für Produktion generiert
-   [ ] CORS richtig konfiguriert
-   [ ] Environment Validation aktiv

