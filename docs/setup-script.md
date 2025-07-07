# 🔧 Setup-Script Dokumentation (dev-setup.sh)

Das `dev-setup.sh` Skript ist das Herzstück für die lokale Entwicklung. Es automatisiert alle notwendigen Schritte.

## 📋 Übersicht

Das Skript kann sowohl **interaktiv** (mit Menü) als auch über **Kommandozeile** verwendet werden.

### Interaktive Nutzung

```bash
./dev-setup.sh
```

Zeigt ein Menü mit folgenden Optionen:

1. **Setup Local Development Environment** - Lokale Entwicklung einrichten
2. **Setup Production Environment** - Produktionsumgebung einrichten
3. **Show Status** - Status aller Services anzeigen
4. **Cleanup** - Aufräumen (behält Daten)
5. **🔥 Complete Reset** - Alles löschen und neu starten
6. **Exit** - Skript beenden

### Kommandozeilen-Nutzung

```bash
./dev-setup.sh <command>
```

Verfügbare Commands:

-   `local` - Lokale Entwicklung
-   `production` - Produktionsumgebung
-   `status` - Status anzeigen
-   `cleanup` - Aufräumen
-   `reset` - Komplettes Reset

## 🎯 Detaillierte Kommando-Erklärung

### `./dev-setup.sh local`

**Was passiert:**

1. **Requirements Check**: Prüft ob Node.js, npm, Docker verfügbar sind
2. **Supabase Start**: Startet lokale Supabase-Instanz mit Docker
3. **Environment Setup**: Stellt sicher, dass `.env.local` korrekt konfiguriert ist
4. **Database Setup**:
    - Generiert Prisma Client
    - Pusht Schema zur Datenbank
    - Fügt Testdaten ein (Seed)
5. **Status Report**: Zeigt URLs und nächste Schritte

**Services die gestartet werden:**

-   PostgreSQL Datenbank (Port 54322)
-   Supabase API (Port 54321)
-   Supabase Studio (Port 54323)
-   Inbucket Mail Server (Port 54324)

**Ausgabe-URLs:**

-   Supabase Studio: `http://localhost:54323`
-   API Endpoint: `http://localhost:54321`
-   Mail Interface: `http://localhost:54324`

### `./dev-setup.sh production`

**Was passiert:**

1. Requirements Check
2. Environment Validation für `.env.production`
3. Database Setup mit Produktionsdatenbank
4. Build-Vorbereitung

**⚠️ Vorsicht:** Arbeitet mit der echten Produktionsdatenbank!

### `./dev-setup.sh status`

**Zeigt an:**

-   Aktuelle Umgebungsvariablen
-   Status der Supabase-Services
-   Verfügbare URLs
-   Docker Container Status
-   Netzwerk-Ports

### `./dev-setup.sh cleanup`

**Aufräumen ohne Datenverlust:**

-   Stoppt Supabase Services
-   Löscht Next.js Cache (`.next` Ordner)
-   Löscht Node.js Cache (`node_modules/.cache`)
-   **Behält:** Alle Datenbank-Daten und Docker Volumes

### `./dev-setup.sh reset`

**⚠️ GEFÄHRLICH - Löscht ALLE lokalen Daten:**

**Sicherheitsabfrage:** Du musst `YES` tippen (nicht nur `y`)

**Was wird gelöscht:**

-   Alle Supabase Docker Container
-   Alle Docker Volumes mit Datenbank-Daten
-   Alle Caches (Next.js, Node.js, Prisma)
-   Alle generierten Dateien

**Nach dem Reset:**

-   Lokale Datenbank ist komplett leer
-   Alle Testdaten sind weg
-   Supabase muss neu gestartet werden

## 🔍 Interne Funktionen

### `check_requirements()`

```bash
# Prüft Verfügbarkeit von:
- node (mit Version check)
- npm
- Docker (läuft es?)
- Supabase CLI (global oder npx)
```

### `run_supabase()`

```bash
# Intelligente Supabase-Ausführung:
# 1. Versucht globale Installation
# 2. Falls nicht verfügbar, nutzt npx
# 3. Behandelt Fehler graceful
```

### `setup_local()`

```bash
# Lokales Setup in folgender Reihenfolge:
1. check_requirements()
2. Supabase starten
3. .env.local validation
4. Prisma Client generieren
5. Database schema pushen
6. Seed data einfügen
7. Status ausgeben
```

### `reset_all()`

```bash
# Nuclear Option - Alles löschen:
1. Sicherheitsabfrage (muss "YES" sein)
2. Supabase stoppen
3. Spezifische Docker Volumes löschen
4. Generelle Docker cleanup
5. Alle Caches löschen
6. Prisma generierte Dateien löschen
```

## 🛠️ Konfiguration & Anpassung

### Environment Detection

Das Skript erkennt automatisch:

-   Ob Supabase global oder als npx verfügbar ist
-   Welche `.env` Datei verwendet werden soll
-   Ob Docker läuft
-   Welche Ports belegt sind

### Fehlerbehandlung

-   **Graceful Failures**: Skript bricht nicht bei kleineren Fehlern ab
-   **Detaillierte Logs**: Farbige Ausgaben für bessere Lesbarkeit
-   **Rollback**: Bei schweren Fehlern werden teilweise Änderungen rückgängig gemacht

### Farbige Ausgabe

```bash
RED='\033[0;31m'     # Fehler
GREEN='\033[0;32m'   # Erfolg
YELLOW='\033[1;33m'  # Warnungen
BLUE='\033[0;34m'    # Info
```

## 🔧 Anpassung für dein Projekt

### Neue Commands hinzufügen

1. **Funktion erstellen:**

```bash
my_custom_setup() {
    print_header "My Custom Setup"
    # Dein Code hier
    print_status "Setup complete!"
}
```

2. **Zu Menü hinzufügen:**

```bash
# In show_menu() function
echo "7) My Custom Setup"

# In case statement
7)
    my_custom_setup
    ;;
```

3. **Command-line support:**

```bash
# In command-line case statement
"mycustom")
    my_custom_setup
    ;;
```

### Environment-spezifische Anpassungen

```bash
# Neue Environment hinzufügen
setup_staging() {
    print_header "Setting up staging environment..."
    export ENV_FILE=".env.staging"
    # Staging-spezifische Logik
}
```

## 🚨 Troubleshooting

### Häufige Probleme

**Skript ist nicht ausführbar:**

```bash
chmod +x dev-setup.sh
```

**Docker-Probleme:**

```bash
# Docker Status prüfen
docker info

# Docker neu starten (Linux)
sudo systemctl restart docker

# Docker Desktop neu starten (macOS/Windows)
```

**Port-Konflikte:**

```bash
# Ports prüfen
lsof -i :54321  # Supabase API
lsof -i :54322  # PostgreSQL
lsof -i :54323  # Supabase Studio

# Prozess killen
kill -9 <PID>
```

**Supabase CLI Probleme:**

```bash
# Global installation prüfen
which supabase

# Projekt-lokale Version prüfen
npx supabase --version

# Neu installieren
npm install supabase@latest
```

### Debug-Modus

```bash
# Verbose output aktivieren
set -x
./dev-setup.sh local
set +x

# Oder mit bash debug
bash -x ./dev-setup.sh local
```

## 📚 Weiterführende Links

-   [Supabase CLI Dokumentation](https://supabase.com/docs/guides/cli)
-   [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
-   [Bash Scripting Guide](https://tldp.org/LDP/abs/html/)

