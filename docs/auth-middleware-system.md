# Authentifizierungs-Middleware System

## Überblick
Zentralisiertes Auth-System mit Server-side Middleware und Client-side Caching zur Reduzierung von Supabase API-Aufrufen.

## Architektur Flow

```
Frontend Request → useAuthenticatedFetch → Add Bearer Token → API Route → withAuth Middleware → AuthCache → Supabase Validation
```

## Komponenten

### 1. Client-Side: `useAuthenticatedFetch`
- **Datei**: `src/hooks/auth/useAuthenticatedFetch.ts`
- **Zweck**: Automatisches Hinzufügen von Auth-Headers zu Requests
- **Usage**: `const { authenticatedFetch } = useAuthenticatedFetch()`

### 2. Server-Side: Auth Middleware
- **Datei**: `src/lib/middleware/authMiddleware.ts`
- **Zweck**: Zentrale Authentifizierung für API-Routes
- **Usage**: `await withAuth(req, res, async (req, res) => { ... })`

### 3. Caching: AuthCache
- **Datei**: `src/lib/middleware/authCache.ts`
- **Zweck**: 5-Minuten Cache für User-Validierung
- **Features**: Automatische Cleanup, Memory-optimiert

## Request Flow

1. **Frontend**: Hook verwendet `session.access_token`
2. **Transport**: Bearer Token im Authorization Header
3. **API Route**: `withAuth()` wrapper validiert Request
4. **Cache Check**: AuthCache prüft Token (5min TTL)
5. **Supabase**: Nur bei Cache-Miss oder expired Token
6. **Response**: User-Objekt oder 401 Error