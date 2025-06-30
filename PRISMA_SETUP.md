# Prisma Integration Setup Guide

Du hast erfolgreich Prisma in dein SVV Car Sharing Projekt integriert! Hier ist eine Anleitung, wie du das Setup abschließt und die Migration durchführst.

## 🚀 Was wurde bereits eingerichtet:

1. **Prisma installiert** - `@prisma/client` und `prisma`
2. **Schema erstellt** - `prisma/schema.prisma` mit deinen Entitäten
3. **Repository-Pattern** - Typsichere Datenbankzugriffe
4. **Migration-Script** - Zum Übertragen bestehender Daten
5. **Aktualisierte Entitäten** - Mit Backwards-Kompatibilität

## 📋 Nächste Schritte:

### 1. Database URL konfigurieren

Öffne deine `.env` Datei und ersetze `[YOUR-PASSWORD]` mit deinem echten Supabase-Datenbankpasswort:

```env
DATABASE_URL="postgresql://postgres:DEIN_ECHTES_PASSWORT@db.fwvmhqkuvncrooyuvher.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:DEIN_ECHTES_PASSWORT@db.fwvmhqkuvncrooyuvher.supabase.co:5432/postgres"
```

**So findest du das Passwort:**

1. Gehe zu deinem Supabase-Dashboard
2. Settings → Database
3. Connection string (dort findest du das Passwort)

### 2. Prisma Client generieren

```bash
npm run db:generate
```

### 3. Datenbankschema mit Prisma synchronisieren

```bash
npm run db:push
```

### 4. (Optional) Bestehende Daten migrieren

Falls du bereits Daten in deinen Supabase-Tabellen hast:

```bash
npm run db:seed
```

## 🔧 Neue Repository-Services nutzen

Anstatt direkt mit Supabase zu arbeiten, kannst du jetzt die typsicheren Repository-Services verwenden:

```typescript
import { rideRepository, userProfileRepository, matchDayRepository } from "@/lib/repositories";

// Beispiel: Alle Fahrten für einen Spieltag abrufen
const rides = await rideRepository.findByMatchDay(matchDayId);

// Beispiel: Benutzer zu einer Fahrt hinzufügen
await rideRepository.addPassenger(rideId, userId);

// Beispiel: Alle kommenden Spieltage
const upcomingMatches = await matchDayRepository.findUpcoming();
```

## 📚 Beispiel Hook

Ein neuer Hook `useRidesWithPrisma` zeigt, wie du die Repository-Services in React verwendest:

```typescript
import { useRidesWithPrisma } from "@/hooks/rides/useRidesWithPrisma";

function MyComponent() {
    const { rides, loading, error, addPassenger } = useRidesWithPrisma(matchDayId);

    // ... deine Komponenten-Logik
}
```

## 🔄 Migration bestehender Hooks

Deine bestehenden Hooks können schrittweise auf die neuen Repository-Services umgestellt werden. Die alten Entitäten-Interfaces haben Backwards-Kompatibilität, sodass bestehender Code weiterhin funktioniert.

## 🛠 Nützliche Befehle

```bash
# Prisma Studio (GUI für Datenbank)
npm run db:studio

# Schema-Änderungen anwenden
npm run db:push

# Neue Migration erstellen
npm run db:migrate

# Prisma Client neu generieren
npm run db:generate
```

## 🎯 Vorteile der neuen Struktur

-   **Typsicherheit**: Vollständig typisierte Datenbankzugriffe
-   **Bessere DX**: IntelliSense und Auto-Completion
-   **Performant**: Optimierte Queries mit Relationen
-   **Wartbar**: Klare Trennung zwischen Datenzugriff und Business-Logik
-   **Testbar**: Repository-Pattern macht Tests einfacher

## 🚨 Wichtige Hinweise

1. **Backup**: Erstelle ein Backup deiner Supabase-Daten bevor du das Migration-Script ausführst
2. **Environment**: Die DATABASE_URL muss korrekt gesetzt sein, bevor du Prisma-Befehle ausführst
3. **Schema-Änderungen**: Verwende `prisma db push` für Entwicklung oder `prisma migrate` für Produktion

## 📖 Weitere Ressourcen

-   [Prisma Documentation](https://www.prisma.io/docs)
-   [Prisma with Supabase](https://supabase.com/docs/guides/integrations/prisma)
-   [Next.js with Prisma](https://www.prisma.io/nextjs)

Viel Erfolg mit deinem neuen, verbesserten Setup! 🎉
