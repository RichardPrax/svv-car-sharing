# Rollensystem Dokumentation

## Übersicht

Das SVV Car-Sharing App verfügt über ein rollenbasiertes Berechtigungssystem, das verschiedene Zugriffsebenen für Benutzer ermöglicht.

## Verfügbare Rollen

```typescript
enum UserRole {
    USER           // Standard-Benutzer
    ADMIN          // Administrator (volle Berechtigung)
    TRAINER        // Trainer (Admin-Zugriff)
    PENALTY_MASTER // Strafenmeister (zukünftig)
    PLAYER         // Spieler (zukünftig)
}
```

## Aktuell implementierte Berechtigungen

-   **USER**: Grundfunktionen (Training, Spieltage, etc.)
-   **ADMIN/TRAINER**: Zusätzlich Nutzerverwaltung und Admin-Features

## Verwendung in Komponenten

### 1. Rollen-Checks in Komponenten

```typescript
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";

function MyComponent() {
    const { hasAdminAccess, userProfile } = useRoleGuard();

    if (hasAdminAccess()) {
        return <AdminFeature />;
    }
    return <StandardFeature />;
}
```

### 2. Seiten-Protection

```typescript
// pages/admin/users.tsx
import { AdminGuard } from "@/components/admin";

export default function AdminUsersPage() {
    return (
        <AdminGuard>
            <UsersList />
        </AdminGuard>
    );
}
```

### 3. Navigation basierend auf Rollen

```typescript
// Automatisch in Sidebar und Homepage integriert
const { hasAdminAccess } = useRoleGuard();
// Admin-Navigation wird automatisch angezeigt
```

## Architektur

### Auth Context

-   **Einmaliger API-Call** beim Login lädt UserProfile mit Rolle
-   **Context-basierte Verteilung** verhindert unnötige API-Aufrufe
-   **Optimized Auth Hook** für Performance

### Utility Functions

```typescript
// src/entities/UserProfile.ts
export function hasAdminAccess(user: UserProfile): boolean {
    return isAdmin(user) || isTrainer(user);
}

export function isAdmin(user: UserProfile): boolean {
    return user?.role === UserRole.ADMIN;
}
```

## Erweiterung des Systems

### Neue Rolle hinzufügen

1. **Database Schema erweitern**

```prisma
// prisma/schema.prisma
enum UserRole {
  USER
  ADMIN
  TRAINER
  PENALTY_MASTER
  PLAYER
  NEW_ROLE        // <-- Neue Rolle hinzufügen
}
```

2. **Migration ausführen**

```bash
npx prisma migrate dev --name add-new-role
```

3. **Utility Functions erweitern**

```typescript
// src/entities/UserProfile.ts
export function isNewRole(user: UserProfile): boolean {
    return user?.role === UserRole.NEW_ROLE;
}

// Berechtigungen definieren
export function hasSpecialAccess(user: UserProfile): boolean {
    return isAdmin(user) || isNewRole(user);
}
```

4. **Hook erweitern**

```typescript
// src/hooks/auth/useRoleGuard.tsx
export function useRoleGuard() {
    // ...
    const hasSpecialAccess = (): boolean => {
        return hasSpecialAccess(userProfile);
    };

    return {
        // ...
        hasSpecialAccess,
    };
}
```

5. **Komponenten anpassen**

```typescript
const { hasSpecialAccess } = useRoleGuard();

if (hasSpecialAccess()) {
    // Neue Features anzeigen
}
```

### Neue Admin-Features hinzufügen

1. **Route erstellen**: `/pages/admin/new-feature.tsx`
2. **Komponente mit AdminGuard schützen**
3. **Navigation in Sidebar erweitern**
4. **Homepage-Kategorie hinzufügen**

## Test-Benutzer

Für Development stehen folgende Test-Accounts zur Verfügung:

```javascript
// Erstellt durch create-auth-users.js
ADMIN:   max.mustermann@test.com   (password: test1234)
TRAINER: anna.schmidt@test.com     (password: test1234)
USER:    tom.mueller@test.com      (password: test1234)
// ... weitere User
```

## Sicherheitshinweise

-   **Frontend-Checks** sind nur für UX - nie für Sicherheit verlassen
-   **Backend-APIs** müssen Rollen serverseitig validieren
-   **Admin-APIs** sollten immer Berechtigungen prüfen

## Dateien-Übersicht

```
src/
├── entities/UserProfile.ts          # Rollen-Definitionen & Utility Functions
├── hooks/auth/
│   ├── useOptimizedAuth.tsx         # Auth Context mit UserProfile
│   └── useRoleGuard.tsx             # Rollen-basierte Hooks
├── components/admin/
│   ├── AdminGuard.tsx               # Seiten-Protection
│   └── UsersList.tsx                # Admin-Features
└── pages/admin/                     # Admin-Seiten
```
