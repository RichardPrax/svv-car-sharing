# E2E Test ID Strategie

Diese Dokumentation beschreibt die HTML-ID Konventionen für End-to-End Tests.

## ID-Format

Alle Test-IDs folgen dem Schema: `{component}-{identifier}-{action}`

## Verfügbare Test-IDs

| Komponente | ID Pattern | Beispiel | Beschreibung |
|------------|------------|----------|--------------|
| **MatchDay Übersicht** | | | |
| MatchDay Card | `md-{YYYY-MM-DD}` | `md-2025-08-30` | Hauptcontainer einer MatchDay Karte |
| Participate Button | `md-{YYYY-MM-DD}-participate` | `md-2025-08-30-participate` | "Dabei" Button für Spielteilnahme |
| Decline Button | `md-{YYYY-MM-DD}-decline` | `md-2025-08-30-decline` | "Nicht dabei" Button für Spielabsage |
| **MatchDay Detail** | | | |
| Detail Container | `md-{YYYY-MM-DD}-detail` | `md-2025-08-30-detail` | Hauptcontainer der Detail-Seite |
| Zurück Button | `md-{YYYY-MM-DD}-back` | `md-2025-08-30-back` | Zurück zur Übersicht Button |
| Tab Teilnahme | `md-{YYYY-MM-DD}-tab-participation` | `md-2025-08-30-tab-participation` | Tab für Teilnahme-Übersicht |
| Tab Fahrten | `md-{YYYY-MM-DD}-tab-rides` | `md-2025-08-30-tab-rides` | Tab für Fahrten-Übersicht |
| Tab Mitbringen | `md-{YYYY-MM-DD}-tab-bring-items` | `md-2025-08-30-tab-bring-items` | Tab für Mitbring-Items |
| Content Teilnahme | `md-{YYYY-MM-DD}-content-participation` | `md-2025-08-30-content-participation` | Inhalt des Teilnahme-Tabs |
| Content Fahrten | `md-{YYYY-MM-DD}-content-rides` | `md-2025-08-30-content-rides` | Inhalt des Fahrten-Tabs |
| Content Mitbringen | `md-{YYYY-MM-DD}-content-bring-items` | `md-2025-08-30-content-bring-items` | Inhalt des Mitbring-Tabs |
| Fahrt erstellen Button | `md-{YYYY-MM-DD}-create-ride` | `md-2025-08-30-create-ride` | Button zum Erstellen einer neuen Fahrt |

## Verwendung in Tests

```javascript
// MatchDay Navigation
await page.click('[data-testid="md-2025-08-30"]');                    // Zur Detail-Seite navigieren
await page.click('[data-testid="md-2025-08-30-back"]');               // Zurück zur Übersicht

// Tab Navigation
await page.click('[data-testid="md-2025-08-30-tab-participation"]');  // Teilnahme-Tab öffnen
await page.click('[data-testid="md-2025-08-30-tab-rides"]');          // Fahrten-Tab öffnen
await page.click('[data-testid="md-2025-08-30-tab-bring-items"]');    // Mitbringen-Tab öffnen

// Teilnahme
await page.click('[data-testid="md-2025-08-30-participate"]');        // Teilnahme zusagen
await page.click('[data-testid="md-2025-08-30-decline"]');            // Teilnahme absagen

// Fahrten
await page.click('[data-testid="md-2025-08-30-create-ride"]');        // Neue Fahrt erstellen

// Content-Bereiche prüfen
await page.waitForSelector('[data-testid="md-2025-08-30-content-participation"]');
await page.waitForSelector('[data-testid="md-2025-08-30-content-rides"]');

// Playwright specific (empfohlen)
await page.getByTestId('md-2025-08-30').click();
await page.getByTestId('md-2025-08-30-participate').click();
```

## Hinweise

- Datumsformat ist immer `YYYY-MM-DD` (ISO-Format)
- Alle Test-IDs verwenden `data-testid` Attribute (nicht `id`)
- IDs sind eindeutig pro Datum
- Buttons sind nur bei zukünftigen Matches und für Spieler sichtbar
- Tabs verwenden `data-testid` Attribute für bessere Testbarkeit
- Für Playwright wird `page.getByTestId()` empfohlen (einfacher als Selektoren)
