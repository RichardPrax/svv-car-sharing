# SVV Team-Manager

Eine moderne Web-App zur Koordination und Absprache des SVV Weimar Volleyball-Teams.

## 🚀 Quick Start

### Schnelles Setup
```bash
git clone <repository-url>
cd svv-car-sharing
npm install
./dev-setup.sh local
npm run dev:local
```

**Fertig!** 🎉 App läuft unter `http://localhost:3000`

> **Detaillierte Setup-Anleitung**: [docs/setup-script.md](docs/setup-script.md)

## 🎯 Features

### Aktuelle Funktionen
-   **Spieltage verwalten** - Automatischer Import und Übersicht
-   **Fahrgemeinschaften** - Fahrten erstellen und beitreten
-   **Benutzer-Verwaltung** - Profile und Rollensystem
-   **Spiel-Teilnahme** - Zu-/Absagen für Spiele

### Geplante Features
-   **Trainingsverwaltung** - Training-Teilnahme koordinieren
-   **Mitbring-Organisation** - "Wer bringt was mit?"
-   **Strafenverwaltung** - Katalog mit PayPal-Integration

## � Dokumentation

| Thema | Beschreibung | Link |
|-------|-------------|------|
| **Setup & Installation** | Detaillierte Einrichtung | [setup-script.md](docs/setup-script.md) |
| **API Endpunkte** | Vollständige API-Referenz | [api-endpoints.md](docs/api-endpoints.md) |
| **Berechtigungen** | Rollen und Zugriffsrechte | [role-system.md](docs/role-system.md) |
| **Authentifizierung** | Auth-System und Middleware | [auth-middleware-system.md](docs/auth-middleware-system.md) |
| **Datenbank** | Schema und Setup | [database-setup.md](docs/database-setup.md) |
| **Projekt-Struktur** | Code-Organisation | [project-structure.md](docs/project-structure.md) |
| **Environment** | Konfiguration & Umgebungen | [environment-config.md](docs/environment-config.md) |
| **Testing** | E2E Test-IDs | [e2e-test-ids.md](docs/e2e-test-ids.md) |

## 🔧 Entwicklung

### Wichtige Befehle
```bash
# Development
npm run dev:local           # Lokaler Dev-Server
./dev-setup.sh status       # Status prüfen
npm run db:studio           # Datenbank GUI

# Wartung
./dev-setup.sh cleanup      # Services stoppen
./dev-setup.sh reset        # ⚠️ Alles zurücksetzen
```

### Testnutzer
- **Emails**: `max.mustermann@test.com`, `anna.schmidt@test.com`, etc.
- **Passwort**: `test1234` (für alle)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Auth**: Supabase
- **Development**: Docker

---

**Los geht's!** 🚀 Weitere Details in der [Dokumentation](docs/)