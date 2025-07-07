# 🚗 SVV Car-Sharing - Getting Started

**Willkommen!** Diese Anleitung führt dich Schritt für Schritt durch die Einrichtung des SVV Car-Sharing Projekts.

## 📋 Was du brauchst (Voraussetzungen)

-   **Node.js** (Version 18 oder höher) - [Download hier](https://nodejs.org/)
-   **Docker Desktop** (für lokale Datenbank) - [Download hier](https://www.docker.com/products/docker-desktop/)
-   **Git** (für Versionskontrolle)
-   Einen **Code-Editor** (z.B. VS Code)

## ⚡ Schnellstart (5 Minuten Setup)

### 1. Projekt herunterladen

```bash
git clone <repository-url>
cd svv-car-sharing
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Docker Desktop starten

-   Öffne Docker Desktop und warte bis es komplett gestartet ist
-   Du siehst ein grünes Symbol wenn Docker bereit ist

### 4. Alles automatisch einrichten

```bash
./dev-setup.sh local
```

**Das war's!** 🎉 Die Anwendung läuft jetzt unter `http://localhost:3000`

---

## 🔧 Was passiert beim Setup?

Das Setup-Skript macht automatisch folgendes:

1. **Lokale Datenbank starten** (Supabase mit PostgreSQL)
2. **Datenbank-Schema einrichten** (Tabellen für Nutzer, Fahrten, etc.)
3. **Testdaten einfügen** (Beispiel-Spieltage und Nutzer)
4. **Entwicklungsserver starten** (Next.js auf Port 3000)

## 📱 Die Anwendung verwenden

Nach dem Setup kannst du:

-   **Hauptseite**: `http://localhost:3000` - Übersicht der Spieltage
-   **Admin-Panel**: `http://localhost:54323` - Datenbank verwalten (Supabase Studio)
-   **API-Dokumentation**: `http://localhost:3000/api` - Backend-Endpunkte

## 🚀 Entwicklung starten

### Code bearbeiten

```bash
# Code-Editor öffnen (z.B. VS Code)
code .

# Wichtige Ordner:
# - src/pages/          → Webseiten
# - src/components/     → Wiederverwendbare UI-Komponenten
# - src/lib/           → Backend-Logik
# - prisma/schema.prisma → Datenbank-Schema
```

### Änderungen testen

-   **Automatisch**: Speichere eine Datei → Browser lädt automatisch neu
-   **Manuell**: Gehe zu `http://localhost:3000` und teste deine Änderungen

### Datenbank anschauen

```bash
# Datenbank-Interface öffnen
npm run db:studio
# Öffnet: http://localhost:5555
```

## 🛠️ Wichtige Befehle

### Entwicklung

```bash
npm run dev:local          # Entwicklungsserver starten
npm run db:studio          # Datenbank-Interface öffnen
./dev-setup.sh status      # Aktueller Status aller Services
```

### Wenn etwas kaputt ist

```bash
./dev-setup.sh cleanup     # Leichtes Aufräumen (behält Daten)
./dev-setup.sh reset       # ⚠️ ALLES LÖSCHEN und neu starten
./dev-setup.sh local       # Frisch einrichten
```

### Services stoppen

```bash
npm run supabase:stop      # Datenbank stoppen
# Entwicklungsserver: Strg+C im Terminal
```

## 📁 Projektstruktur (für Einsteiger)

```
svv-car-sharing/
├── 📄 GETTING_STARTED.md     ← Du bist hier!
├── 🎯 src/                   ← Hauptcode der Anwendung
│   ├── pages/               ← Webseiten (index.js = Startseite)
│   ├── components/          ← UI-Bausteine (Buttons, Listen, etc.)
│   └── lib/                 ← Backend-Logik und Hilfsfunktionen
├── 🗄️ prisma/               ← Datenbank-Schema und Migrationen
├── ⚙️ .env.local            ← Lokale Konfiguration (wird automatisch erstellt)
├── 🚀 dev-setup.sh          ← Setup-Automatisierung
└── 📦 package.json          ← Projekt-Dependencies
```

## 🎯 Typische Arbeitsabläufe

### Neue Funktion entwickeln

1. **Feature-Branch erstellen**: `git checkout -b feature/meine-neue-funktion`
2. **Code schreiben** in `src/`
3. **Testen** unter `http://localhost:3000`
4. **Committen**: `git commit -m "Neue Funktion hinzugefügt"`
5. **Push**: `git push origin feature/meine-neue-funktion`

### Datenbank-Schema ändern

1. **Schema bearbeiten**: `prisma/schema.prisma`
2. **Änderungen anwenden**: `npm run db:push`
3. **Testen**: `npm run db:studio`

### Nach längerem Pause

```bash
# Prüfen ob alles noch läuft
./dev-setup.sh status

# Falls nicht, neu starten
./dev-setup.sh local
```

## 🆘 Hilfe & Problemlösung

### Häufige Probleme

**"Port 3000 ist bereits belegt"**

-   Ein anderer Service läuft auf Port 3000
-   Lösung: `lsof -ti:3000 | xargs kill` oder anderes Service stoppen

**"Docker-Fehler"**

-   Docker Desktop ist nicht gestartet
-   Lösung: Docker Desktop öffnen und warten bis es bereit ist

**"Datenbank-Verbindungsfehler"**

-   Supabase läuft nicht
-   Lösung: `npm run supabase:start`

**"Das Setup-Skript funktioniert nicht"**

-   Möglicherweise sind Berechtigungen falsch
-   Lösung: `chmod +x dev-setup.sh`

### Weitere Hilfe

-   **Detaillierte Docs**: Siehe `docs/` Ordner für technische Details
-   **Alle Befehle**: `COMMANDS.md` - Komplette Befehlsreferenz
-   **Setup-Details**: `docs/setup-script.md` - dev-setup.sh Erklärung
-   **Environment-Config**: `docs/environment-config.md` - .env Dateien
-   **Datenbank-Setup**: `docs/database-setup.md` - Supabase & Prisma

## 🎉 Erfolgreich eingerichtet?

Wenn alles funktioniert siehst du:

-   ✅ Die Webseite unter `http://localhost:3000`
-   ✅ Eine Liste von Spieltagen
-   ✅ Login/Register Funktionen
-   ✅ Keine Fehlermeldungen in der Konsole

**Viel Spaß beim Entwickeln!** 🚀

---

💡 **Tipp**: Bookmark diese Datei - sie ist dein Startpunkt für alles!

