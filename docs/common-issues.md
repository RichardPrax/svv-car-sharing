# 🚨 Häufige Probleme & Lösungen

## 🔧 Setup-Probleme

### "Permission denied: dev-setup.sh"

```bash
chmod +x dev-setup.sh
./dev-setup.sh local
```

### "Docker is not running"

→ Docker Desktop starten und warten bis grünes Symbol

### "Port already in use"

```bash
lsof -i :3000              # Wer belegt Port 3000?
kill -9 <PID>              # Prozess killen
# oder
./dev-setup.sh reset       # Alles neu starten
```

## 🗄️ Datenbank-Probleme

### "Database connection failed"

```bash
./dev-setup.sh status      # Läuft Supabase?
npm run supabase:start     # Falls nicht
```

### "Prisma Client not generated"

```bash
npm run db:generate        # Client neu generieren
```

### "Migration failed"

```bash
npm run db:push            # Schema ohne Migration pushen
# oder für kompletten Reset:
./dev-setup.sh reset
```

## 🌐 Environment-Probleme

### "Missing environment variables"

```bash
ls -la .env*               # Existiert .env.local?
npm run validate-env:local # Variablen prüfen
./dev-setup.sh local       # Neu erstellen
```

### "CORS errors"

→ Prüfe: URL ist `http://localhost:54321` (nicht https!)

## 💻 Dev-Probleme

### "Hot reload not working"

```bash
npm run clean              # Cache leeren
npm run dev:local          # Neu starten
```

### "Build/TypeScript errors"

```bash
npm run db:generate        # Prisma Types neu
# In VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

## 🐳 Docker-Probleme

### "Docker out of space"

```bash
docker system prune -f    # Docker aufräumen
```

### "Docker won't start"

→ Computer neu starten, dann Docker Desktop

## 🆘 Universal-Fix

**Wenn gar nichts hilft:**

```bash
./dev-setup.sh reset       # ⚠️ Löscht ALLE Daten!
./dev-setup.sh local       # Frisch aufsetzen
```

## 🔍 Debug-Hilfen

```bash
./dev-setup.sh status      # Vollständiger Status
npm run validate-env:local # Environment prüfen
npm run db:studio          # Datenbank GUI
```

---

💡 **90% aller Probleme löst:** `./dev-setup.sh reset` + `./dev-setup.sh local`

````

**Ursache:** Docker Desktop ist nicht gestartet

**Lösungen:**

1. **macOS/Windows**: Docker Desktop öffnen und warten bis grünes Symbol
2. **Linux**:
    ```bash
    sudo systemctl start docker
    # oder
    sudo service docker start
    ```

---

### Problem: "Port already in use"

**Symptome:**

```bash
Error: port 3000 is already allocated
Error: port 54321 is already allocated
````

**Ursache:** Ports sind von anderen Services belegt

**Lösungen:**

```bash
# Port-Belegung prüfen
lsof -i :3000
lsof -i :54321

# Prozess killen (ersetze <PID> mit tatsächlicher Process-ID)
kill -9 <PID>

# Oder alle Node-Prozesse killen (⚠️ Vorsicht!)
pkill -f node

# Docker-Container stoppen
docker stop $(docker ps -q)
```

---

## 🗄️ Datenbank-Probleme

### Problem: "Database connection failed"

**Symptome:**

```
Error: P1001: Can't reach database server at localhost:54322
```

**Ursache:** Supabase ist nicht gestartet oder läuft nicht richtig

**Lösungen:**

```bash
# 1. Status prüfen
npm run supabase:status

# 2. Supabase neu starten
npm run supabase:stop
npm run supabase:start

# 3. Kompletter Reset (⚠️ löscht Daten)
./dev-setup.sh reset
./dev-setup.sh local
```

---

### Problem: "Prisma Client not generated"

**Symptome:**

```
Error: @prisma/client did not initialize yet
```

**Ursache:** Prisma Client wurde nach Schema-Änderung nicht regeneriert

**Lösungen:**

```bash
# 1. Client neu generieren
npm run db:generate

# 2. Falls das nicht hilft
rm -rf node_modules/.prisma
npm run db:generate

# 3. Komplette Prisma-Neuerstellung
npm run db:push
```

---

### Problem: "Migration failed"

**Symptome:**

```
Error: P3005: The database schema is not empty
Error: Migration failed to apply
```

**Ursache:** Schema-Konflikte oder incomplete Migrationen

**Lösungen:**

```bash
# 1. Lokale DB zurücksetzen (⚠️ löscht Daten)
npm run db:local:reset

# 2. Schema ohne Migration pushen
npm run db:push

# 3. Migration force reset
npx prisma migrate reset --force
```

---

## 🌐 Environment-Probleme

### Problem: "Missing required environment variables"

**Symptome:**

```
Error: Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL
```

**Ursache:** Environment-Variablen nicht korrekt geladen

**Lösungen:**

```bash
# 1. Prüfe ob .env.local existiert
ls -la .env*

# 2. Verwende korrekten Befehl
npm run dev:local  # statt npm run dev

# 3. Environment validieren
npm run validate-env:local

# 4. Falls .env.local fehlt, neu erstellen
./dev-setup.sh local
```

---

### Problem: "CORS errors in browser"

**Symptome:**

```
Access to fetch at 'http://localhost:54321' has been blocked by CORS policy
```

**Ursache:** Falsche Supabase URL oder CORS-Konfiguration

**Lösungen:**

```bash
# 1. Prüfe NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_URL
# Sollte sein: http://localhost:54321 (NICHT https!)

# 2. Browser-Cache leeren
# Chrome: Ctrl+Shift+R oder F12 → Network → "Disable cache"

# 3. Supabase neu starten
npm run supabase:stop
npm run supabase:start
```

---

## 💻 Entwicklungs-Probleme

### Problem: "Hot reload not working"

**Symptome:** Änderungen am Code werden nicht automatisch im Browser aktualisiert

**Ursache:** Next.js Development Server Probleme

**Lösungen:**

```bash
# 1. Development Server neu starten
# Strg+C, dann:
npm run dev:local

# 2. Cache leeren
npm run clean

# 3. node_modules neu installieren
rm -rf node_modules package-lock.json
npm install
```

---

### Problem: "Build errors / TypeScript errors"

**Symptome:**

```
Type error: Property 'xxx' does not exist on type 'yyy'
```

**Ursache:** TypeScript-Konfiguration oder fehlende Types

**Lösungen:**

```bash
# 1. TypeScript neu starten (in VS Code)
# Cmd+Shift+P → "TypeScript: Restart TS Server"

# 2. Prisma Types neu generieren
npm run db:generate

# 3. Dependencies updaten
npm install
```

---

### Problem: "API routes not working"

**Symptome:**

```
404 - This page could not be found
API endpoint returns 500 error
```

**Ursache:** API-Route-Pfade oder Server-Probleme

**Lösungen:**

```bash
# 1. Prüfe API-Route-Pfad
# pages/api/matches/index.ts → /api/matches

# 2. Server-Logs prüfen
# Schaue ins Terminal wo der dev-server läuft

# 3. Development server neu starten
npm run dev:local
```

---

## 🐳 Docker-Probleme

### Problem: "Docker out of space"

**Symptome:**

```
Error: no space left on device
```

**Ursache:** Docker-Container/Images nehmen zu viel Speicher

**Lösungen:**

```bash
# 1. Docker cleanup
docker system prune -f

# 2. Volumes cleanup
docker volume prune -f

# 3. Alle Container stoppen und entfernen
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
```

---

### Problem: "Docker Desktop won't start"

**Symptome:** Docker Desktop startet nicht oder ist langsam

**Lösungen:**

1. **Neustart**: Computer neu starten
2. **Ressourcen**: Mehr RAM/CPU für Docker reservieren
3. **Neuinstallation**: Docker Desktop neu installieren

---

## 📱 Browser-Probleme

### Problem: "White screen / App won't load"

**Symptome:** Browser zeigt leere weiße Seite

**Lösungen:**

```bash
# 1. Browser-Console öffnen (F12)
# Schaue nach JavaScript-Fehlern

# 2. Hard refresh
# Ctrl+Shift+R (Chrome/Firefox)

# 3. Browser-Cache komplett leeren
# Chrome: Settings → Privacy → Clear browsing data

# 4. Incognito/Private Mode testen
```

---

### Problem: "Authentication not working"

**Symptome:** Login/Register funktioniert nicht

**Lösungen:**

```bash
# 1. Supabase Auth-Status prüfen
npm run supabase:status

# 2. Environment-Variablen prüfen
npm run validate-env:local

# 3. Browser-Cookies löschen
# Chrome: F12 → Application → Storage → Clear site data
```

---

## ⚡ Performance-Probleme

### Problem: "App is very slow"

**Ursachen & Lösungen:**

1. **Development Mode**:

    - Normal in Development
    - Production-Build ist schneller: `npm run build`

2. **Große Bundle-Size**:

    ```bash
    # Bundle-Größe analysieren
    npm run build
    npx @next/bundle-analyzer
    ```

3. **Viele Console-Logs**:

    - Entferne `console.log()` aus dem Code

4. **Database-Queries**:
    - Prüfe langsame Queries in Prisma Studio

---

## 🔍 Debug-Techniken

### Logs anschauen

```bash
# Next.js Development Server
# Schaue ins Terminal wo npm run dev:local läuft

# Supabase Logs
docker logs supabase_db_svv-car-sharing
docker logs supabase_kong_svv-car-sharing

# Database Queries (Prisma)
export DEBUG=prisma:*
npm run dev:local
```

### Environment Debug

```bash
# Alle Environment-Variablen anzeigen
./dev-setup.sh status

# Spezifische Validation
npm run validate-env:local
npm run validate-env:production
```

### Database Debug

```bash
# Database-Verbindung testen
npm run db:studio

# Schema-Status prüfen
npx prisma db pull
npx prisma validate
```

---

## 🆘 Wenn gar nichts hilft

### Nuclear Option: Kompletter Reset

```bash
# ⚠️ ACHTUNG: Löscht ALLE lokalen Daten!

# 1. Kompletter Reset
./dev-setup.sh reset

# 2. Frisch aufsetzen
./dev-setup.sh local

# 3. Dependencies neu installieren
rm -rf node_modules package-lock.json
npm install
```

### Hilfe holen

1. **GitHub Issues**: Erstelle ein Issue im Repository
2. **Logs sammeln**:
    ```bash
    ./dev-setup.sh status > debug-info.txt
    npm run validate-env:local >> debug-info.txt
    ```
3. **Screenshots**: Mache Screenshots von Fehlermeldungen
4. **System-Info**:
    ```bash
    node --version
    npm --version
    docker --version
    ```

---

## 📋 Vorbeugende Maßnahmen

### Regelmäßige Wartung

```bash
# Wöchentlich
docker system prune -f

# Bei Schema-Änderungen
npm run db:generate

# Nach Git-Pull
npm install
./dev-setup.sh local
```

### Backup vor größeren Änderungen

```bash
# Datenbank-Backup
docker exec supabase_db_svv-car-sharing pg_dump -U postgres postgres > backup.sql

# Environment-Backup
cp .env.local .env.local.backup
```

---

💡 **Tipp**: Die meisten Probleme lösen sich mit `./dev-setup.sh reset` und `./dev-setup.sh local` - das ist der "Universal-Fix"!

---

## 🚀 Deployment-Probleme

### Problem: "Prisma Query Engine not found" auf Vercel

**Symptome:**

```bash
Error: Query engine binary for current platform "rhel-openssl-1.0.x" could not be found
Error: Prisma Client could not locate the Query Engine for runtime "rhel-openssl-1.0.x"
```

**Ursache:** Prisma Query Engine Binary ist nicht für Vercel's Runtime-Umgebung verfügbar

**Lösung:**

Dieses Problem wurde in unserem Projekt bereits behoben durch:

1. **Prisma Schema Update** (bereits erledigt):

    ```prisma
    generator client {
      provider = "prisma-client-js"
      binaryTargets = ["native", "rhel-openssl-1.0.x", "rhel-openssl-3.0.x"]
    }
    ```

2. **Vercel-Konfiguration** (`vercel.json` bereits erstellt):
    ```json
    {
    ```
