# 🏗️ Projektstruktur

## 📁 Haupt-Übersicht

```
svv-car-sharing/
├── src/                    # Haupt-App
├── prisma/                 # Datenbank-Schema
├── docs/                   # Diese Dokumentation
├── dev-setup.sh            # Setup-Script
└── package.json            # Dependencies
```

## 🎯 src/ (Das Wichtigste)

```
src/
├── pages/                  # Next.js Seiten
│   ├── index.tsx          # Startseite (Spieltage)
│   ├── login.tsx          # Login-Seite
│   └── api/               # Backend APIs
├── components/             # UI-Komponenten
│   ├── auth/              # Login/Register
│   ├── matches/           # Spieltag-Listen
│   ├── rides/             # Fahrgemeinschaften
│   └── forms/             # Formulare
├── hooks/                  # React-Hooks für Daten
├── lib/                    # Backend-Logic & DB
└── styles/                 # CSS-Styling
```

## 🗄️ Datenbank (prisma/)

```
prisma/
├── schema.prisma          # Datenbank-Schema
├── seed.js                # Testdaten-Script
└── migrations/            # Schema-Änderungen
```

## ⚙️ Konfiguration

```
.env.local                 # Lokale Environment-Variablen
package.json               # Scripts & Dependencies
next.config.ts             # Next.js Config
tsconfig.json              # TypeScript Config
```

## 🧩 Code-Organisation

**Frontend (Pages):**

-   `pages/index.tsx` → Spieltage-Übersicht
-   `pages/login.tsx` → Benutzer-Anmeldung
-   `pages/api/` → Backend-APIs

**Components:**

-   Wiederverwendbare UI-Bausteine
-   Pro Feature einen Ordner (auth, matches, rides)

**Hooks:**

-   Datenlogik von UI getrennt
-   Wiederverwendbar zwischen Komponenten

**Lib:**

-   Datenbankzugriff (Prisma)
-   Supabase-Integration
-   Utility-Funktionen

---

_Orientierung: Alles beginnt bei `src/pages/index.tsx` (Startseite)_

