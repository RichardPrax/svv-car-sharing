# 📖 Dokumentations-Index

Diese Dokumentation enthält alle technischen Details zum SVV Car-Sharing Projekt.

## 🚀 Für Einsteiger

-   **[GETTING_STARTED.md](../GETTING_STARTED.md)** - Schnellstart ohne Vorkenntnisse

## 🔧 Setup & Konfiguration

-   **[setup-script.md](./setup-script.md)** - Detaillierte Erklärung des dev-setup.sh Skripts
-   **[environment-config.md](./environment-config.md)** - Umgebungsvariablen & .env Dateien
-   **[database-setup.md](./database-setup.md)** - Prisma, Supabase & Datenbank-Management

## 🏗️ Architektur & Code

-   **[project-structure.md](./project-structure.md)** - Projektaufbau und Ordnerstruktur

## 🆘 Troubleshooting

-   **[common-issues.md](./common-issues.md)** - Häufige Probleme und Lösungen

## 📚 Weitere Dokumentation (geplant)

Die folgenden Dokumentationen können bei Bedarf erweitert werden:

-   **API-Dokumentation** - Backend-Endpunkte und Schnittstellen
-   **Component-Guide** - Frontend-Komponenten Übersicht
-   **Development-Workflow** - Erweiterte Entwicklungsabläufe
-   **Deployment-Guide** - Produktions-Deployment
-   **Debugging-Guide** - Erweiterte Debug-Techniken

---

## 📋 Schnelle Befehlsreferenz

### Setup & Start

```bash
./dev-setup.sh local        # Komplettes lokales Setup
./dev-setup.sh status       # Status aller Services
./dev-setup.sh cleanup      # Aufräumen (behält Daten)
./dev-setup.sh reset        # ⚠️ Alles löschen und neu
```

### Entwicklung

```bash
npm run dev:local           # Entwicklungsserver starten
npm run db:studio           # Datenbank-Interface
npm run supabase:status     # Supabase Status
```

### Datenbank

```bash
npm run db:push             # Schema zur DB pushen
npm run db:seed             # Testdaten einfügen
npm run db:migrate          # Migration erstellen
```

---

💡 **Navigation**: Nutze die Links oben um zur spezifischen Dokumentation zu springen.

