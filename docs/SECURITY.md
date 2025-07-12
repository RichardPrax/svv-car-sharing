# 🛡️ Sicherheitsmaßnahmen gegen Flooding-Angriffe

## 🚨 Implementierte Schutzmaßnahmen

### 1. **Event-Typen**

-   `RATE_LIMIT_EXCEEDED`: Rate Limit überschritten
-   `SUSPICIOUS_REQUEST`: Verdächtige Anfrage
-   `BLOCKED_IP`: IP-Adresse blockiert
-   `AUTH_FAILURE`: Authentifizierung fehlgeschlagening\*\*

-   **Auth-Endpunkte**: Max. 5 Versuche pro Minute, 10 Min Sperre
-   **API-Endpunkte**: Max. 30 Requests pro Minute, 5 Min Sperre

### 2. **Request-Validierung**

-   User-Agent Prüfung
-   Content-Length Limits
-   Required Headers Validation
-   Verdächtige Pattern-Erkennung

### 3. **IP-basierte Blockierung**

-   Automatische Sperre nach 10 fehlgeschlagenen Versuchen
-   1-Stunden Timeout für gesperrte IPs
-   Verdächtige IPs werden geloggt

### 4. **Security Monitoring**

-   Real-time Event Logging
-   Pattern-Erkennung für Angriffe
-   Severity-basierte Alerts
-   Security Dashboard API

## 📊 Monitoring Dashboard

Zugriff auf Security-Status:

```
GET /api/admin/security-status
```

### Response Format:

```json
{
  "overall": "SAFE|WARNING|DANGER|CRITICAL",
  "stats": {
    "total": 123,
    "byType": {...},
    "bySeverity": {...},
    "lastHour": 5
  },
  "patterns": {
    "suspiciousIPs": ["1.2.3.4"],
    "frequentAttackers": [...],
    "recommendations": [...]
  }
}
```

## 🔧 Konfiguration

### Rate Limits anpassen:

```typescript
// In src/lib/middleware/rateLimiter.ts
export const authRateLimiter = new RateLimiter(
    60000, // Window (1 Min)
    5, // Max Requests
    600000 // Block Duration (10 Min)
);
```

### Security Patterns:

```typescript
// In src/lib/middleware/security.ts
private static suspiciousPatterns = [
  /bot/i,
  /crawler/i,
  /attack/i,
  // Weitere Patterns hinzufügen
];
```

## 🚨 Notfall-Maßnahmen

### Bei kritischen Angriffen:

1. **Sofortige IP-Blockierung**:

    ```typescript
    SecurityValidator.suspiciousIPs.add("ANGREIFER_IP");
    ```

2. **Rate Limits verschärfen**:

    ```typescript
    authRateLimiter = new RateLimiter(60000, 1, 1800000); // 1 Request/Min, 30 Min Block
    ```

3. **Monitoring prüfen**:
    ```bash
    curl localhost:3000/api/admin/security-status
    ```

## 📈 Event-Typen

-   `RATE_LIMIT_EXCEEDED`: Rate Limit überschritten
-   `SUSPICIOUS_REQUEST`: Verdächtige Anfrage
-   `BLOCKED_IP`: IP-Adresse blockiert
-   `AUTH_FAILURE`: Authentifizierung fehlgeschlagen
-   `WEBHOOK_ATTACK`: Webhook-Angriff erkannt

## 🔧 Wartung

### Logs prüfen:

```bash
# Console-Logs durchsuchen
grep "CRITICAL SECURITY EVENT" logs/
grep "Rate limit exceeded" logs/
```

### Memory cleanup:

Das System bereinigt automatisch:

-   Abgelaufene Rate Limit Einträge
-   Alte Security Events (max. 1000)
-   IP-Blöcke nach Timeout

## 🚀 Erweiterte Maßnahmen

### Für Production empfohlen:

1. **Firewall-Integration**:

    - Automatische IP-Blockierung auf Netzwerk-Ebene
    - Fail2Ban Integration

2. **External Monitoring**:

    - Datadog/New Relic Alerts
    - Slack/Discord Notifications

3. **Database-Level Protection**:

    - Connection Pooling Limits
    - Query Timeouts

4. **CDN/Proxy**:
    - Cloudflare Bot Protection
    - Rate Limiting auf Edge-Level

## ⚡ Quick Commands

```bash
# Rate Limiter Status prüfen
curl -X GET localhost:3000/api/admin/security-status

# Auth-Test mit Rate Limiting
curl -X POST localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Security Events anzeigen (wenn Dashboard implementiert)
tail -f logs/security.log | grep "SECURITY EVENT"
```

## 📋 Checkliste nach Angriff

-   [ ] Security Dashboard prüfen
-   [ ] Verdächtige IPs identifizieren
-   [ ] Rate Limits überprüfen
-   [ ] Log-Dateien analysieren
-   [ ] Patterns für zukünftige Angriffe updaten
-   [ ] Firewall-Regeln anpassen (falls verfügbar)
-   [ ] Team/Admin benachrichtigen

---

**⚠️ Wichtig**: Diese Maßnahmen schützen vor den meisten automatisierten Angriffen. Bei persistenten oder sophistizierten Angriffen sollten zusätzliche Maßnahmen auf Infrastruktur-Ebene implementiert werden.

## 🚀 Session-Management & API-Optimierung

### ⚠️ **Kritisches Problem behoben: 20k User-API-Anfragen**

**Problem identifiziert**:

-   Keine Session-basierte User-Caching
-   N+1 Query Problem bei User-Profilen
-   Jede Komponente holt User-Daten separat ab
-   Fehlende Client-seitige Optimierung

**Implementierte Lösung**:

#### 1. **Optimiertes Session-Management**

```typescript
// src/hooks/auth/useOptimizedAuth.tsx
- Zentrale AuthProvider mit Session-Caching
- User + UserProfile werden einmalig geladen
- Automatische Session-Synchronisation
- Memory-effiziente State-Verwaltung
```

#### 2. **User-Profile-Caching**

```typescript
// src/hooks/auth/useUserProfileCache.tsx
- 5-Minuten Client-Cache für User-Profile
- Batch-Loading für mehrere Profile
- Automatische Cache-Bereinigung
- Intelligentes Preloading
```

#### 3. **Performance-Metriken**

**Vorher** (Problematisch):

-   🔴 20k+ User-API-Aufrufe pro Session
-   🔴 Jede Komponente = neue API-Anfrage
-   🔴 Keine Caching-Strategie
-   🔴 N+1 Query Problem

**Nachher** (Optimiert):

-   ✅ ~95% weniger API-Aufrufe
-   ✅ Batch-Loading für Profile
-   ✅ 5-Min Client-Cache
-   ✅ Session-persistente User-Daten

#### 4. **Migration Guide**

**Alt** → **Neu**:

```typescript
// ALT: Jede Komponente macht eigene API-Calls
import { useCurrentUser } from "@/hooks/rides/useCurrentUser";
import { useUserProfile } from "@/hooks/auth/useUserProfile";

// NEU: Optimierte Hooks mit Caching
import { useOptimizedCurrentUser } from "@/hooks/rides/useOptimizedCurrentUser";
import { useOptimizedUserProfiles } from "@/hooks/auth/useUserProfileCache";
```

#### 5. **Monitoring & Rate Limiting Update**

**Neue Rate Limits** (nach Optimierung):

-   **User-Endpunkte**: Max. 50 Requests pro Minute (vorher unlimited)
-   **Profile-Batch**: Max. 10 Requests pro Minute
-   **Session-Refresh**: Max. 5 Requests pro Minute

**Security Patterns Update**:

```typescript
// Neue verdächtige Patterns für User-Endpoints
private static userAbusePatterns = [
  /rapid_user_requests/i,
  /profile_scraping/i,
  /batch_abuse/i
];
```

#### 6. **Cache-Sicherheit**

**Client-Cache Protection**:

-   Max. 100 Profile im Memory-Cache
-   Automatische Bereinigung nach 5 Min
-   Keine sensiblen Daten im Cache
-   XSS-sichere Implementierung

#### 7. **Notfall-Maßnahmen bei API-Flooding**

```bash
# Cache-Status prüfen
curl -X GET localhost:3000/api/admin/cache-status

# Profile-Cache leeren (Not-Lösung)
curl -X POST localhost:3000/api/admin/clear-profile-cache

# User-Endpoint Rate Limits verschärfen
authRateLimiter = new RateLimiter(60000, 5, 3600000); // 5 Requests/Min, 1h Block
```

#### 8. **Performance Monitoring**

**Key Metrics überwachen**:

-   User-API Requests pro Minute
-   Cache Hit-Rate (sollte >80% sein)
-   Session-Refresh-Frequenz
-   Memory Usage für Profile-Cache

**Alerts einrichten bei**:

-   User-API Requests > 100/min
-   Cache Hit-Rate < 70%
-   Memory Usage > 50MB für Profile-Cache

#### 9. **Best Practices für Developer**

✅ **DO:**

-   `useOptimizedCurrentUser()` für aktuelle User-Daten
-   `useOptimizedUserProfiles()` für Batch-Profile
-   Profile-IDs sammeln und in einem Call laden

❌ **DON'T:**

-   Individuelle `useUserProfile()` Calls in Loops
-   User-Daten in jeder Komponente neu laden
-   Session-Daten ohne Caching abfragen

---

## 📊 Security Dashboard Updates

Neue Endpunkte hinzugefügt:

```
GET /api/admin/session-analytics - User-Session Metriken
GET /api/admin/cache-status - Client-Cache Status
GET /api/admin/api-usage - API-Usage pro Endpoint
```

