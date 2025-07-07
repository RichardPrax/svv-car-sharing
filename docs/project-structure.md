# 🏗️ Projektstruktur & Architektur

Detaillierte Übersicht über Ordnerstruktur, Architektur und Code-Organisation des SVV Car-Sharing Projekts.

## 📁 Haupt-Projektstruktur

```
svv-car-sharing/
├── 📖 docs/                        ← Dokumentation
├── 🔧 prisma/                      ← Datenbank-Schema & Migrationen
├── 🌐 public/                      ← Statische Assets (Bilder, Icons)
├── 📝 scripts/                     ← Utility-Skripte
├── 🎯 src/                         ← Hauptanwendung
├── 🐳 supabase/                    ← Supabase-Konfiguration
├── ⚙️  .env.*                      ← Environment-Konfiguration
├── 🚀 dev-setup.sh                 ← Setup-Automatisierung
├── 📋 GETTING_STARTED.md           ← Einsteiger-Guide
├── 📄 README.md                    ← Projekt-Übersicht
└── 📦 package.json                 ← Dependencies & Scripts
```

## 🎯 src/ Verzeichnis (Hauptanwendung)

```
src/
├── 🧩 components/                  ← React-Komponenten
│   ├── auth/                      ← Authentifizierung
│   ├── forms/                     ← Formulare & Inputs
│   ├── matches/                   ← Spieltag-Komponenten
│   └── rides/                     ← Fahrgemeinschaft-Komponenten
├── 🏛️ entities/                    ← TypeScript-Datenmodelle
├── 🪝 hooks/                       ← React-Hooks
│   ├── auth/                      ← Auth-spezifische Hooks
│   ├── matches/                   ← Spieltag-Hooks
│   └── rides/                     ← Fahrgemeinschaft-Hooks
├── 📚 lib/                         ← Core-Libraries & Utilities
│   ├── repositories/              ← Datenbank-Zugriffschicht
│   ├── env.ts                     ← Environment-Validierung
│   ├── prisma.ts                  ← Prisma-Client Setup
│   └── supabaseClient.ts          ← Supabase-Client Setup
├── 📄 pages/                       ← Next.js Seiten & API-Routes
│   ├── api/                       ← Backend-API Endpunkte
│   ├── match/                     ← Spieltag-Seiten
│   ├── _app.tsx                   ← App-Wrapper
│   ├── index.tsx                  ← Startseite
│   ├── login.tsx                  ← Login-Seite
│   └── register.tsx               ← Registrierung
├── 🎨 styles/                      ← CSS & Styling
└── 🛠️ utils/                       ← Hilfsfunktionen
```

## 🧩 Komponenten-Architektur

### Komponenten-Hierarchie

```
App (_app.tsx)
├── Page Components (pages/*.tsx)
│   ├── Layout Components
│   ├── Feature Components
│   │   ├── Match Components
│   │   │   ├── MatchDayList
│   │   │   ├── MatchDayCard
│   │   │   └── NextMatchCard
│   │   ├── Ride Components
│   │   │   ├── RidesList
│   │   │   ├── RideCard
│   │   │   ├── RideDetails
│   │   │   └── RideActions
│   │   └── Auth Components
│   │       ├── LoginForm
│   │       ├── RegisterForm
│   │       └── AuthContainer
│   └── Form Components
│       ├── Input
│       ├── Button
│       ├── Select
│       └── Textarea
```

### Komponenten-Typen

#### 1. **Page Components** (`src/pages/`)

-   **Zweck**: Top-Level Seiten, Route-Handler
-   **Beispiele**: `index.tsx`, `login.tsx`, `match/[id].tsx`
-   **Charakteristika**:
    -   Daten-Fetching (getServerSideProps, getStaticProps)
    -   SEO & Meta-Tags
    -   Layout-Orchestrierung

#### 2. **Feature Components** (`src/components/*/`)

-   **Zweck**: Geschäftslogik-spezifische Komponenten
-   **Beispiele**: `MatchDayList`, `RideCard`, `LoginForm`
-   **Charakteristika**:
    -   Business-Logic
    -   State-Management
    -   Hook-Usage

#### 3. **Form Components** (`src/components/forms/`)

-   **Zweck**: Wiederverwendbare UI-Elemente
-   **Beispiele**: `Button`, `Input`, `Select`
-   **Charakteristika**:
    -   Generisch & wiederverwendbar
    -   Props-basiert konfigurierbar
    -   Konsistentes Design

## 🏛️ Datenmodell & Entities

### Entity-Struktur

```
src/entities/
├── MatchDay.ts                     ← Spieltag-Datenmodell
├── Ride.ts                         ← Fahrgemeinschaft-Datenmodell
└── UserProfile.ts                  ← Benutzer-Datenmodell
```

### Entity-Beispiel

```typescript
// src/entities/Ride.ts
export interface Ride {
    id: string;
    matchDayId: number;
    driverId: string;
    departureLocation: string;
    departureTime: Date;
    availableSeats: number;
    notes?: string;

    // Relations
    driver?: UserProfile;
    passengers?: RidePassenger[];
    matchDay?: MatchDay;
}
```

## 🪝 Hooks-Architektur

### Hook-Kategorien

#### 1. **Data-Fetching Hooks**

```typescript
// src/hooks/matches/useMatches.tsx
export const useMatches = () => {
    // API-Aufrufe, Caching, Error-Handling
};
```

#### 2. **Form-Handling Hooks**

```typescript
// src/hooks/rides/useCreateRide.tsx
export const useCreateRide = () => {
    // Form-State, Validation, Submission
};
```

#### 3. **Auth-Hooks**

```typescript
// src/hooks/auth/useAuth.tsx
export const useAuth = () => {
    // Authentication-State, Login/Logout
};
```

## 📚 Lib-Architektur

### Repository-Pattern

```
src/lib/repositories/
├── index.ts                        ← Export-Barrel
├── matchDayRepository.ts           ← Spieltag-Datenzugriff
├── rideRepository.ts               ← Fahrgemeinschaft-Datenzugriff
└── userProfileRepository.ts        ← Benutzer-Datenzugriff
```

#### Repository-Beispiel

```typescript
// src/lib/repositories/rideRepository.ts
export class RideRepository {
    static async findByMatchDay(matchDayId: number): Promise<Ride[]> {
        return await prisma.ride.findMany({
            where: { matchDayId },
            include: {
                driver: true,
                passengers: { include: { passenger: true } },
            },
        });
    }
}
```

### Core-Services

```typescript
// src/lib/env.ts
export const envConfig = getEnvConfig();

// src/lib/prisma.ts
export const prisma = new PrismaClient();

// src/lib/supabaseClient.ts
export const supabase = createClient(url, key);
```

## 📄 Pages & API-Routes

### Page-Struktur

```
src/pages/
├── api/                           ← Backend-API
│   ├── health.ts                 ← Health-Check
│   ├── auth/                     ← Authentifizierung
│   ├── matches/                  ← Spieltag-APIs
│   ├── rides/                    ← Fahrgemeinschaft-APIs
│   └── user/                     ← Benutzer-APIs
├── match/                        ← Spieltag-Seiten
│   └── [id].tsx                  ← Dynamische Route
├── _app.tsx                      ← App-Konfiguration
├── _document.tsx                 ← HTML-Document Setup
├── index.tsx                     ← Startseite
├── login.tsx                     ← Login
└── register.tsx                  ← Registrierung
```

### API-Route-Beispiel

```typescript
// src/pages/api/matches/index.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const matches = await MatchDayRepository.findAll();
        res.json(matches);
    }
}
```

## 🗄️ Datenbank-Architektur

### Prisma-Schema-Struktur

```
prisma/
├── schema.prisma                  ← Hauptschema
├── migrations/                    ← Datenbankmigrationen
│   ├── migration_lock.toml       ← Migration-Lock
│   └── 20250630194309_init/      ← Initiale Migration
└── seed.js                       ← Testdaten-Script
```

### Datenbankrelationen

```sql
MatchDay (1) ──< (n) Ride (1) ──< (n) RidePassenger >── (1) UserProfile
                        │                                        │
                        └──────> (1) UserProfile (Driver) ──────┘
```

## 🔄 Datenfluss-Architektur

### 1. **Frontend → Backend Flow**

```
Component → Hook → Repository → Prisma → Database
    ↓         ↓         ↓          ↓         ↓
  UI Logic  State   Data Layer  ORM    PostgreSQL
```

### 2. **Authentication Flow**

```
User → AuthForm → useAuth → Supabase Auth → UserProfile
```

### 3. **Data-Fetching Flow**

```
Page → Hook → API Route → Repository → Prisma → Database
```

## 🎨 Styling-Architektur

### Styling-Ansatz

```
src/styles/
├── globals.css                    ← Globale Styles
└── (Component-level CSS-in-JS)    ← Tailwind/Styled-Components
```

### Design-System

-   **Framework**: Tailwind CSS
-   **Komponenten**: Styled mit Tailwind-Klassen
-   **Responsive**: Mobile-First Approach
-   **Theme**: Konsistente Farben & Typography

## ⚙️ Konfiguration & Environment

### Environment-Layers

```
.env (fallback) < .env.local < .env.production
```

### Build & Deploy Pipeline

```
Development:  src/ → Next.js Dev Server → localhost:3000
Production:   src/ → Next.js Build → Static/SSR → Vercel/Server
```

## 🔧 Development-Tools

### Code-Quality

```json
{
    "eslint": "Linting & Code-Style",
    "typescript": "Type-Safety",
    "prisma": "Database-Schema & Type-Generation"
}
```

### Development-Stack

-   **Framework**: Next.js 15 (React 19)
-   **Database**: PostgreSQL (via Supabase)
-   **ORM**: Prisma
-   **Auth**: Supabase Auth
-   **Styling**: Tailwind CSS
-   **Type-Safety**: TypeScript

## 📋 Best Practices

### 1. **Component-Organization**

-   Ein Komponente pro Datei
-   Index-Dateien für clean imports
-   Props-Interfaces definieren

### 2. **State-Management**

-   Lokaler State in Komponenten
-   Shared State über Hooks
-   Server-State über React Query (geplant)

### 3. **Error-Handling**

-   Try-catch in Repositories
-   Error-Boundaries in Components
-   Graceful Fallbacks

### 4. **Performance**

-   Lazy-Loading für große Komponenten
-   Memo für teure Berechnungen
-   Optimierte DB-Queries

---

💡 **Diese Architektur ermöglicht**: Skalierbarkeit, Wartbarkeit, und klare Trennung von Concerns.

