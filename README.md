# SVV Team-Manager

Eine moderne Web-App zur Koordination und Absprache des SVV Weimar Volleyball-Teams.

## 🚀 Sofort loslegen

```bash
git clone <repository-url>
cd svv-car-sharing
npm install
./dev-setup.sh local
npm run dev:local
```

**Fertig!** 🎉 App läuft unter `http://localhost:3000`

## � Worum geht's?

Diese App hilft dabei:

-   **Spieltage zu verwalten** - Automatischer Import aus CSV-Dateien
-   **Fahrgemeinschaften zu organisieren** - Wer fährt mit wem?
-   **Plätze zu koordinieren** - Freie Plätze und Mitfahrgelegenheiten
-   **Benutzer zu verwalten** - Einfache Anmeldung und Profile

Bald verfügbar:

-   **Trainingsverwaltung** - Zu-/Absagen von Spielern für das Training
-   **Abstimmung Spieltage** - Wer erfüllt welche Aufgabe? Wer bringt was mit?
-   **Strafenverwaltung** - Führen und Pflegen eines Strafenkataloges inklusive der Strafen (möglicherweise direkt begleichbar über PayPal)

## 🛠️ Tech Stack

-   **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
-   **Backend**: Next.js API Routes
-   **Database**: PostgreSQL mit Prisma ORM
-   **Auth & Hosting**: Supabase
-   **Development**: Docker (lokale DB), ESLint

## ⚡ Wichtige Befehle

```bash
# Entwicklung
npm run dev:local           # Lokaler Dev-Server
./dev-setup.sh status       # Status aller Services
npm run db:studio           # Datenbank GUI öffnen

# Wartung
./dev-setup.sh cleanup      # Aufräumen
./dev-setup.sh reset        # Komplett neu starten
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

## 🧑‍ Für Entwickler

Das Setup-Script macht alles automatisch:

-   Startet lokale Supabase-Datenbank
-   Richtet Schema und Testdaten ein
-   Erstellt Testbenutzer
-   Importiert Spielplan-Daten

---

_Fragen? Schau in `GETTING_STARTED.md` für eine ausführlichere Anleitung._

