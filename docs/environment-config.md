# 🌍 Environment & Konfiguration

## 📁 Environment-Dateien

| Datei             | Zweck              | Versioniert | Wann                     |
| ----------------- | ------------------ | ----------- | ------------------------ |
| `.env.example`    | Vorlage            | ✅ Ja       | Referenz                 |
| `.env.local`      | Lokale Entwicklung | ❌ Nein     | `npm run dev:local`      |
| `.env.production` | Produktion         | ❌ Nein     | `npm run dev:production` |

## ⚙️ Wichtige Variablen

### Supabase

```bash
NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"        # Lokal
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."                   # Öffentlicher Key
SUPABASE_SERVICE_ROLE_KEY="eyJ..."                       # ⚠️ Nur Server!
```

### Datenbank

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
DIRECT_URL="postgresql://postgres:postgres@localhost:54322/postgres"
```

### Auth

```bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="local-development-secret-key"
```

## 🔧 Setup

**Automatisch:**

```bash
./dev-setup.sh local    # Erstellt .env.local automatisch
```

**Manuell:**

```bash
cp .env.example .env.local    # Kopieren
# Dann Werte anpassen
```

## 🛠️ Validation

```bash
npm run validate-env:local        # .env.local prüfen
npm run validate-env:production   # .env.production prüfen
```

## 🚨 Häufige Probleme

**"Missing environment variables"**

```bash
ls -la .env*               # Existiert .env.local?
npm run dev:local          # Richtigen Command verwenden
```

**"Client variables not available"**
→ Prüfe `NEXT_PUBLIC_` Prefix und starte Server neu

**"Database connection failed"**

```bash
npm run supabase:status    # Läuft Supabase?
```

## 🔐 Security

-   ✅ `.env.local` und `.env.production` sind in .gitignore
-   ✅ Nie Secrets in committed Dateien
-   ✅ Service Role Keys nur serverseitig verwenden

---

_Das Setup-Script erstellt `.env.local` automatisch mit den richtigen Werten!_

