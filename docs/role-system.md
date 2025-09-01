# Rollensystem Dokumentation

## Überblick

Das SVV Car Sharing System verwendet ein rollenbasiertes Berechtigungssystem, das sowohl Frontend-UX als auch Backend-Sicherheit gewährleistet. Die Rollen sind hierarchisch organisiert und ermöglichen eine granulare Kontrolle über Systemfunktionen.

## Verfügbare Rollen

```typescript
enum UserRole {
    USER           = "USER"           // Standard-Benutzer
    ADMIN          = "ADMIN"          // Administrator (volle Berechtigung)  
    TRAINER        = "TRAINER"        // Trainer (erweiterte Berechtigung)
    PENALTY_MASTER = "PENALTY_MASTER" // Strafenmeister (geplant)
    PLAYER         = "PLAYER"         // Spieler (geplant)
}
```

### Rollen-Details

| Rolle | Beschreibung | Berechtigungen | Status |
|-------|-------------|----------------|--------|
| **USER** | Standard-Mitglied | • Fahrt-Teilnahme<br>• Spiel-Teilnahme<br>• Eigene Daten einsehen | ✅ Aktiv |
| **ADMIN** | Administrator | • Alle USER-Rechte<br>• Nutzerverwaltung<br>• System-Administration<br>• Alle Admin-Features | ✅ Aktiv |
| **TRAINER** | Trainer/Coach | • Alle USER-Rechte<br>• Nutzerverwaltung<br>• Admin-Panel-Zugriff | ✅ Aktiv |
| **PENALTY_MASTER** | Strafenmeister | • Alle USER-Rechte<br>• Strafen verwalten | 🔄 Geplant |
| **PLAYER** | Aktiver Spieler | • Alle USER-Rechte<br>• Erweiterte Spiel-Features | 🔄 Geplant |

## Berechtigungs-Hierarchie

```typescript
// Aktuelle Berechtigungsgruppen
hasAdminAccess(user) = isAdmin(user) || isTrainer(user)
hasPlayerAccess(user) = isPlayer(user) || isUser(user) || isAdmin(user)
```

### Zugriffs-Matrix

| Feature | USER | PLAYER | TRAINER | PENALTY_MASTER | ADMIN |
|---------|------|--------|---------|----------------|-------|
| Fahrt erstellen/beitreten | ✅ | ✅ | ✅ | ✅ | ✅ |
| Spiel-Teilnahme | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin-Panel | ❌ | ❌ | ✅ | ❌ | ✅ |
| Nutzerverwaltung | ❌ | ❌ | ✅ | ❌ | ✅ |
| Strafen verwalten | ❌ | ❌ | 🔄 | 🔄 | ✅ |
| System-Konfiguration | ❌ | ❌ | ❌ | ❌ | ✅ |

## Implementierung

### Frontend-Implementierung

#### 1. Rollen-Guards verwenden

```typescript
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";

function MyComponent() {
    const { 
        hasAdminAccess, 
        hasRole, 
        userProfile,
        currentRole 
    } = useRoleGuard();

    // Einfache Admin-Prüfung
    if (hasAdminAccess()) {
        return <AdminFeature />;
    }

    // Spezifische Rollen-Prüfung
    if (hasRole(UserRole.TRAINER)) {
        return <TrainerFeature />;
    }

    return <StandardFeature />;
}
```

#### 2. Seiten-Protection mit AdminGuard

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

#### 3. Bedingte Navigation

```typescript
// Automatisch in Layout-Komponenten integriert
const { canAccessAdminPanel } = useRoleGuard();

{canAccessAdminPanel() && (
    <AdminNavigationItem />
)}
```

### Backend-Implementierung

#### 1. API-Routen schützen

```typescript
// src/pages/api/admin/users.ts
async function adminUsersHandler(req: AuthenticatedRequest, res: NextApiResponse) {
    const { user } = req;
    
    // UserProfile laden und Berechtigung prüfen
    const userProfile = await userProfileRepository.findById(user.id);
    
    // Strikte Backend-Validierung
    if (!userProfile || (userProfile.role !== "ADMIN" && userProfile.role !== "TRAINER")) {
        return res.status(403).json({ 
            error: "Insufficient permissions. Admin access required." 
        });
    }
    
    // Feature-Code hier...
}
```

#### 2. Granulare Berechtigungen

```typescript
// Beispiel: Nur eigene Daten oder Admin kann alles
const isOwnData = user.id === requestedUserId;
const isAdmin = userProfile.role === "ADMIN";

if (!isOwnData && !isAdmin) {
    return res.status(403).json({ error: "Access denied" });
}
```

### Utility Functions

```typescript
// src/entities/UserProfile.ts

// Basis-Rollen-Checks
export function isAdmin(user: UserProfile | null | undefined): boolean {
    return user?.role === UserRole.ADMIN;
}

export function isTrainer(user: UserProfile | null | undefined): boolean {
    return user?.role === UserRole.TRAINER;
}

export function isPenaltyMaster(user: UserProfile | null | undefined): boolean {
    return user?.role === UserRole.PENALTY_MASTER;
}

// Berechtigungs-Gruppen
export function hasAdminAccess(user: UserProfile | null | undefined): boolean {
    return isAdmin(user) || isTrainer(user);
}
```

## System erweitern

### Neue Rolle hinzufügen

#### 1. Schema erweitern
```prisma
// prisma/schema.prisma
enum UserRole {
  USER
  ADMIN
  TRAINER
  PENALTY_MASTER
  PLAYER
  NEW_ROLE        // <-- Neue Rolle
}
```

#### 2. Migration ausführen
```bash
npx prisma migrate dev --name add-new-role
```

#### 3. Utility Functions erweitern
```typescript
// src/entities/UserProfile.ts
export function isNewRole(user: UserProfile | null | undefined): boolean {
    return user?.role === UserRole.NEW_ROLE;
}

export function hasSpecialAccess(user: UserProfile | null | undefined): boolean {
    return isAdmin(user) || isNewRole(user);
}
```

#### 4. Frontend-Hooks erweitern
```typescript
// src/hooks/auth/useRoleGuard.tsx
export function useRoleGuard() {
    // ... existing code ...

    const hasSpecialAccess = (): boolean => {
        return hasSpecialAccess(userProfile);
    };

    return {
        // ... existing returns ...
        hasSpecialAccess,
    };
}
```

#### 5. Display-Namen hinzufügen
```typescript
// src/components/admin/UsersList.tsx
const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
        case UserRole.ADMIN: return "Administrator";
        case UserRole.TRAINER: return "Trainer";
        case UserRole.PENALTY_MASTER: return "Strafenmeister";
        case UserRole.PLAYER: return "Spieler";
        case UserRole.NEW_ROLE: return "Neue Rolle";  // <--
        default: return "Benutzer";
    }
};
```

### Neue Admin-Features hinzufügen

1. **Route erstellen**: `/pages/admin/new-feature.tsx`
2. **AdminGuard verwenden** für Zugriffskontrolle
3. **Navigation erweitern** in Sidebar-Komponente
4. **Backend-API** mit Berechtigungsprüfung erstellen