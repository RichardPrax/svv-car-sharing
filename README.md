# SVV Weimar Volleyball Car-Sharing

Eine moderne Webanwendung zur Koordination von Fahrgemeinschaften für Spieltage des SVV Weimar Volleyball-Teams.

## 🚀 Schnellstart (Neu hier?)

**👋 Komplett neu beim Projekt?** → **[GETTING_STARTED.md](./GETTING_STARTED.md)**

**🔧 Bereits Entwickler?** → **[docs/README.md](./docs/README.md)**

### Super-Schnell-Setup

```bash
git clone <repository-url>
cd svv-car-sharing
npm install
./dev-setup.sh local  # Macht alles automatisch
```

Fertig! 🎉 App läuft unter `http://localhost:3000`

## 📖 Dokumentation

### Für Einsteiger

-   **[🚀 Getting Started Guide](./GETTING_STARTED.md)** - Komplette Anleitung ohne Vorkenntnisse

### Für Entwickler

-   **[📖 Dokumentations-Index](./docs/README.md)** - Alle technischen Details
-   **[🔧 Setup-Script Erklärung](./docs/setup-script.md)** - dev-setup.sh im Detail
-   **[🌍 Environment Konfiguration](./docs/environment-config.md)** - .env Dateien & Variablen
-   **[🗄️ Datenbank Setup](./docs/database-setup.md)** - Supabase, Prisma & PostgreSQL

## 📋 Quick Commands

```bash
# Setup & Start
./dev-setup.sh local        # Komplettes lokales Setup
./dev-setup.sh status       # Status aller Services
./dev-setup.sh cleanup      # Aufräumen (behält Daten)
./dev-setup.sh reset        # ⚠️ Alles löschen und neu

# Entwicklung
npm run dev:local           # Development Server
npm run db:studio           # Datenbank GUI
npm run supabase:status     # Supabase Status
```

## 🔧 Umgebungskonfiguration

### Entwicklungsumgebungen

Das Projekt unterstützt verschiedene Umgebungen mit sauberer Trennung:

-   **Lokal**: Verwendet lokale Supabase-Instanz
-   **Produktion**: Verwendet gehostete Supabase-Instanz

### Environment-Dateien

| Datei             | Beschreibung           | Versionskontrolle  |
| ----------------- | ---------------------- | ------------------ |
| `.env.example`    | Beispiel-Konfiguration | ✅ Committed       |
| `.env.local`      | Lokale Entwicklung     | ❌ Nicht committed |
| `.env.production` | Produktionsumgebung    | ❌ Nicht committed |
| `.env`            | Fallback-Konfiguration | ❌ Nicht committed |

### Verfügbare Scripts

#### Entwicklung

```bash
# Lokale Entwicklung (mit lokaler Supabase)
npm run dev:local

# Entwicklung mit Produktions-Datenbank
npm run dev:production

# Standard-Entwicklung (verwendet .env)
npm run dev
```

#### Build & Deployment

```bash
# Lokaler Build
npm run build:local

# Produktions-Build
npm run build:production

# Standard-Build
npm run build
```

#### Datenbank-Management

##### Lokale Datenbank

```bash
npm run db:local:generate    # Prisma Client generieren
npm run db:local:push        # Schema zu DB pushen
npm run db:local:migrate     # Migrationen ausführen
npm run db:local:studio      # Prisma Studio öffnen
npm run db:local:seed        # Datenbank mit Testdaten füllen
npm run db:local:reset       # Datenbank zurücksetzen
```

##### Produktions-Datenbank

```bash
npm run db:production:generate
npm run db:production:push
npm run db:production:migrate
npm run db:production:studio
npm run db:production:seed
```

#### Supabase-Management

```bash
npm run supabase:start       # Lokale Supabase starten
npm run supabase:stop        # Lokale Supabase stoppen
npm run supabase:status      # Status anzeigen
npm run supabase:reset       # Lokale DB zurücksetzen
```

#### Setup-Helfer

```bash
npm run supabase:local:full  # Vollständiges lokales Setup
npm run clean                # Cache leeren
```

## 📁 Projektstruktur

```
├── src/
│   ├── components/          # React-Komponenten
│   │   ├── auth/           # Authentifizierung
│   │   ├── forms/          # Formulare
│   │   ├── matches/        # Spieltag-Komponenten
│   │   └── rides/          # Fahrgemeinschaft-Komponenten
│   ├── entities/           # TypeScript-Entities
│   ├── hooks/              # React-Hooks
│   ├── lib/                # Utility-Bibliotheken
│   ├── pages/              # Next.js-Seiten
│   └── styles/             # CSS-Styles
├── prisma/                 # Prisma-Schema & Migrationen
├── supabase/               # Supabase-Konfiguration
└── public/                 # Statische Assets
```

## 🎯 Features

-   **Spieltag-Management**: Übersicht und Details von Spieltagen
-   **Fahrgemeinschaften**: Erstellen und Verwalten von Fahrten
-   **Authentifizierung**: Sichere Benutzeranmeldung
-   **Responsive Design**: Funktioniert auf Desktop und Mobile
-   **Lokale Entwicklung**: Vollständig offline entwickelbar

## 🔧 Entwicklung

### Spieltage hinzufügen

Das Hinzufügen von Spieltagen kann über das Python-Script `insert_matchdays.py` erfolgen:

**Voraussetzungen:**

-   Python mit installierten pip-Modulen
-   Spieltage als CSV-Datei (`spielplan.csv`) im Hauptverzeichnis
-   Konfigurierte Umgebungsvariablen für Supabase-Zugriff

```bash
python insert_matchdays.py
```

### Umgebung wechseln

```bash
# Setup-Script verwenden
./dev-setup.sh

# Oder spezifische Umgebung
./dev-setup.sh local      # Lokale Entwicklung
./dev-setup.sh production # Produktionsumgebung
./dev-setup.sh status     # Status anzeigen
./dev-setup.sh cleanup    # Aufräumen
```

## 📝 Deployment

### Produktion

1. **Umgebungsvariablen setzen**

    - `.env.production` mit Produktionswerten erstellen
    - Supabase-Projekt konfigurieren

2. **Build erstellen**

```bash
npm run build:production
```

3. **Server starten**

```bash
npm run start
```

## 🤝 Beitragen

1. Fork des Repositories erstellen
2. Feature-Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add some AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

## 📞 Support

Bei Fragen oder Problemen:

-   Issue im GitHub-Repository erstellen
-   Dokumentation in `docs/` Ordner konsultieren
-   **[GETTING_STARTED.md](./GETTING_STARTED.md)** für Einsteiger
-   **[COMMANDS.md](./COMMANDS.md)** für Befehlsreferenz

