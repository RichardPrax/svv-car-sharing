# SVV Team-Manager - Getting Started

**Willkommen!** Diese Anleitung führt dich Schritt für Schritt durch die Einrichtung.

## 📋 Was du brauchst

-   **Node.js** (Version 18+) - [Download](https://nodejs.org/)
-   **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
-   **Git** und einen **Code-Editor** (z.B. VS Code)

## ⚡ 5-Minuten Setup

### 1. Projekt herunterladen

```bash
git clone <repository-url>
cd svv-car-sharing
npm install
```

### 2. Docker Desktop starten

-   Öffne Docker Desktop und warte bis es bereit ist (grünes Symbol)

### 3. Alles automatisch einrichten

```bash
./dev-setup.sh local
npm run dev:local
```

**Das war's!** 🎉 App läuft unter `http://localhost:3000`

## 🔧 Was passiert beim Setup?

Das Setup-Script macht automatisch:

1. **Lokale Datenbank starten**
2. **Datenbank-Schema einrichten**
3. **Spielplan importieren**
4. **Testdaten erstellen**

### 🔑 Testbenutzer

Das Setup erstellt automatisch 7 vollständige Testbenutzer:

-   **Emails**: `max.mustermann@test.com`, `anna.schmidt@test.com`, etc.
-   **Passwort für alle**: `test1234`
-   **Funktionen**: Login, Profil, Fahrten erstellen/teilnehmen

## 📱 Die App verwenden

Nach dem Setup:

-   **Hauptseite**: `http://localhost:3000` - Startseite mit Kacheln zur Navigation
-   **Login**: Mit den Testbenutzern anmelden
-   **Admin**: `http://localhost:54323` - Supabase Studio (Datenbank)

## 🛠️ Entwicklung

### Code bearbeiten

```bash
code .  # VS Code öffnen

# Wichtige Ordner:
# src/pages/       → Webseiten
# src/components/  → UI-Bausteine
# src/lib/         → Backend-Logic
# prisma/          → Datenbank-Schema
```

### Wichtige Befehle

```bash
# Entwicklung
npm run dev:local          # Dev-Server starten
npm run db:studio          # Datenbank GUI öffnen

# Status & Wartung
./dev-setup.sh status      # Alles läuft?
./dev-setup.sh cleanup     # Aufräumen (behält Daten)
./dev-setup.sh reset       # ⚠️ ALLES neu (löscht Daten!)
```

## 🆘 Probleme?

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

**Viel Spaß!** 🚀 Bei Fragen → README.md für Quick-Infos.

