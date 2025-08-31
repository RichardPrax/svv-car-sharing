# SVV Team-Manager

Eine moderne Web-App zur Koordination und Absprache des SVV Weimar Volleyball-Teams.

## 🚀 Sofort loslegen

### Voraussetzungen

-   **Node.js** (Version 18+) - [Download](https://nodejs.org/)
-   **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
-   **Git** und einen **Code-Editor** (z.B. VS Code)

### 5-Minuten Setup

1. **Projekt herunterladen**
```bash
git clone <repository-url>
cd svv-car-sharing
npm install
```

2. **Docker Desktop starten** - Öffne Docker Desktop und warte bis es bereit ist (grünes Symbol)

3. **Alles automatisch einrichten**
```bash
./dev-setup.sh local
npm run dev:local
```

**Fertig!** 🎉 App läuft unter `http://localhost:3000`

## 🎯 Worum geht's?

Diese App hilft dabei:

-   **Spieltage zu verwalten** - Automatischer Import aus CSV-Dateien
-   **Fahrgemeinschaften zu organisieren** - Wer fährt mit wem?
-   **Plätze zu koordinieren** - Freie Plätze und Mitfahrgelegenheiten
-   **Benutzer zu verwalten** - Einfache Anmeldung und Profile

Bald verfügbar:

-   **Trainingsverwaltung** - Zu-/Absagen von Spielern für das Training
-   **Abstimmung Spieltage** - Wer erfüllt welche Aufgabe? Wer bringt was mit?
-   **Strafenverwaltung** - Führen und Pflegen eines Strafenkataloges inklusive der Strafen (möglicherweise direkt begleichbar über PayPal)

## 🔧 Was passiert beim Setup?

Das Setup-Script macht automatisch:

1. **Lokale Datenbank starten**
2. **Datenbank-Schema einrichten**
3. **Spielplan importieren**
4. **Testdaten erstellen**

### 🔑 Testnutzer

Das Setup erstellt automatisch 7 vollständige Testnutzer:

-   **Emails**: `max.mustermann@test.com`, `anna.schmidt@test.com`, etc.
-   **Passwort für alle**: `test1234`
-   **Funktionen**: Login, Profil, Fahrten erstellen/teilnehmen

## 📱 Die App verwenden

Nach dem Setup:

-   **Hauptseite**: `http://localhost:3000` - Startseite mit Kacheln zur Navigation
-   **Login**: Mit den Testbenutzern anmelden
-   **Admin**: `http://localhost:54323` - Supabase Studio (Datenbank)

## 🛠️ Tech Stack

-   **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
-   **Backend**: Next.js API Routes
-   **Database**: PostgreSQL mit Prisma ORM
-   **Auth & Hosting**: Supabase
-   **Development**: Docker (lokale DB), ESLint

## ⚡ Entwicklung & Befehle
# Wichtige Ordner:
# src/pages/       → Webseiten
# src/components/  → UI-Bausteine
# src/lib/         → Backend-Logic
# prisma/          → Datenbank-Schema
```

### Wichtige Befehle

```bash
# Entwicklung
npm run dev:local           # Lokaler Dev-Server
./dev-setup.sh status       # Status aller Services
npm run db:studio           # Datenbank GUI öffnen

# Wartung
./dev-setup.sh cleanup      # Aufräumen (behält Daten)
./dev-setup.sh reset        # ⚠️ Komplett neu starten (löscht Daten!)
```

## 📁 Projekt-Übersicht

```
src/
├── components/    # UI-Komponenten (Auth, Rides, Matches)
├── pages/         # Next.js Seiten und API Routes
├── hooks/         # Custom React Hooks
└── lib/           # Utilities und Backend-Logic

prisma/            # Datenbank Schema
```

## 🆘 Problemlösung

**"Port bereits belegt"**
```bash
lsof -ti:3000 | xargs kill
```

**"Docker-Fehler"**  
→ Docker Desktop starten und warten

**"Setup funktioniert nicht"**
```bash
chmod +x dev-setup.sh
./dev-setup.sh reset  # Neustart
```

---

**Viel Spaß beim Entwickeln!** 🚀