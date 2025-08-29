# E2E Test ID Strategie

Diese Dokumentation beschreibt die HTML-ID Konventionen für End-to-End Tests mit kontextbewusster Strategie.

## ID-Format

Wir verwenden eine **kontextbewusste** ID-Strategie:

- **Datum-spezifische IDs** für Elemente die zwischen verschiedenen MatchDays unterscheiden müssen
- **Vereinfachte IDs** für Elemente innerhalb einer spezifischen MatchDay-Detailseite

### Datum-basierte IDs (für Listen und Überblick)
```
md-{YYYY-MM-DD}-{action}
```

### Vereinfachte IDs (für Detailseiten)
```
md-{element}
```

## Verfügbare Test-IDs

| Komponente | ID Pattern | Beispiel | Beschreibung |
|------------|------------|----------|--------------|
| **MatchDay Übersicht** | | | |
| MatchDay Card | `md-{YYYY-MM-DD}` | `md-2025-08-30` | Hauptcontainer einer MatchDay Karte |
| Participate Button | `md-{YYYY-MM-DD}-participate` | `md-2025-08-30-participate` | "Dabei" Button für Spielteilnahme |
| Decline Button | `md-{YYYY-MM-DD}-decline` | `md-2025-08-30-decline` | "Nicht dabei" Button für Spielabsage |
| **MatchDay Detail** | | | |
| Tab Teilnahme | `md-tab-participation` | `md-tab-participation` | Tab für Teilnahme-Übersicht |
| Tab Fahrten | `md-tab-rides` | `md-tab-rides` | Tab für Fahrten-Übersicht |
| Tab Mitbringen | `md-tab-bring-items` | `md-tab-bring-items` | Tab für Mitbring-Items |
| Content Teilnahme | `md-content-participation` | `md-content-participation` | Inhalt des Teilnahme-Tabs |
| Content Fahrten | `md-content-rides` | `md-content-rides` | Inhalt des Fahrten-Tabs |
| Content Mitbringen | `md-content-bring-items` | `md-content-bring-items` | Inhalt des Mitbring-Tabs |
| Fahrt erstellen Button | `md-create-ride` | `md-create-ride` | Button zum Erstellen einer neuen Fahrt |
| Mitbringen hinzufügen | `md-add-bring-item` | `md-add-bring-item` | Button zum Hinzufügen eines Mitbring-Items |
| **Teilnahme-Übersicht** | | | |
| Teilnahme Container | `md-participation-summary` | `md-participation-summary` | Hauptcontainer der Teilnahme-Übersicht |
| Loading State | `md-participation-loading` | `md-participation-loading` | Ladeindikator für Teilnahme-Daten |
| Empty State | `md-participation-empty` | `md-participation-empty` | Anzeige wenn keine Spieler registriert |
| Gruppe "Dabei" | `md-group-joining` | `md-group-joining` | Gruppe der zusagenden Spieler |
| Gruppe "Absage" | `md-group-declining` | `md-group-declining` | Gruppe der absagenden Spieler |
| Gruppe "Offen" | `md-group-open` | `md-group-open` | Gruppe der noch nicht entschiedenen Spieler |
| User in Gruppe | `md-user-{type}-{index}` | `md-user-joining-0` | Einzelner User in Teilnahme-Gruppe |
| **Mitbringen (Detail)** | | | |
| Mitbringen Container | `md-bring-items` | `md-bring-items` | Hauptcontainer für Mitbring-Items |
| Items Liste | `md-bring-items-list` | `md-bring-items-list` | Liste aller Mitbring-Items |
| Einzelnes Item | `md-bring-item-{index}` | `md-bring-item-0` | Einzelnes Mitbring-Item |
| Item beitreten | `md-bring-item-{index}-join` | `md-bring-item-0-join` | Button um sich einem Item anzuschließen |
| Item verlassen | `md-bring-item-{index}-leave` | `md-bring-item-0-leave` | Button um Item zu verlassen |
| Item löschen | `md-bring-item-{index}-delete` | `md-bring-item-0-delete` | Button zum Löschen eines Items |
| Create Modal | `md-create-bring-item-modal` | `md-create-bring-item-modal` | Modal zum Erstellen neuer Items |
| **Fahrten (Detail)** | | | |
| Fahrten Liste | `md-rides-list` | `md-rides-list` | Container für alle Fahrten |
| Einzelne Fahrt | `md-ride-{index}` | `md-ride-0` | Einzelne Fahrt-Karte |
| Fahrt beitreten | `md-ride-{index}-join` | `md-ride-0-join` | Button um Fahrt beizutreten |
| Fahrt verlassen | `md-ride-{index}-leave` | `md-ride-0-leave` | Button um Fahrt zu verlassen |
| Fahrt bearbeiten | `md-ride-{index}-edit` | `md-ride-0-edit` | Button zum Bearbeiten einer Fahrt |
| Fahrt löschen | `md-ride-{index}-delete` | `md-ride-0-delete` | Button zum Löschen einer Fahrt |
| Edit Modal | `md-edit-ride-{index}-modal` | `md-edit-ride-0-modal` | Modal zum Bearbeiten von Fahrten |
| **Formulare** | | | |
| Fahrt erstellen Form | `create-ride-form` | `create-ride-form` | Formular zum Erstellen einer Fahrt |
| Abfahrtszeit | `create-ride-departure-time` | `create-ride-departure-time` | Eingabefeld für Abfahrtszeit |
| Abfahrtsort | `create-ride-departure-location` | `create-ride-departure-location` | Eingabefeld für Abfahrtsort |
| Verfügbare Plätze | `create-ride-available-seats` | `create-ride-available-seats` | Eingabefeld für Sitzplätze |
| Notizen | `create-ride-notes` | `create-ride-notes` | Textfeld für zusätzliche Informationen |
| Form absenden | `create-ride-submit` | `create-ride-submit` | Button zum Speichern der Fahrt |
| Form abbrechen | `create-ride-cancel` | `create-ride-cancel` | Button zum Abbrechen |
| Mitbringen erstellen Form | `create-bring-item-form` | `create-bring-item-form` | Formular zum Erstellen eines Items |
| Item Name | `create-bring-item-name` | `create-bring-item-name` | Eingabefeld für Item-Name |
| Item Menge | `create-bring-item-quantity` | `create-bring-item-quantity` | Eingabefeld für Anzahl |
| Item Notizen | `create-bring-item-notes` | `create-bring-item-notes` | Textfeld für Notizen |
| Item absenden | `create-bring-item-submit` | `create-bring-item-submit` | Button zum Speichern des Items |
| Item abbrechen | `create-bring-item-cancel` | `create-bring-item-cancel` | Button zum Abbrechen |
| **Modals** | | | |
| Absage-Grund Modal | `md-decline-reason-modal` | `md-decline-reason-modal` | Modal für Absage-Begründung |
| Absage-Grund Form | `md-decline-reason-form` | `md-decline-reason-form` | Formular für Absage-Grund |
| Absage-Grund Text | `md-decline-reason-textarea` | `md-decline-reason-textarea` | Textfeld für Absage-Begründung |
| Absage bestätigen | `md-decline-reason-submit` | `md-decline-reason-submit` | Button zum Bestätigen der Absage |
| Absage abbrechen | `md-decline-reason-cancel` | `md-decline-reason-cancel` | Button zum Abbrechen der Absage |
| Teilnahme Info Modal | `md-join-info-modal` | `md-join-info-modal` | Modal für Teilnahme-Informationen |
| Teilnahme Info Form | `md-join-info-form` | `md-join-info-form` | Formular für Teilnahme-Details |
| Position eingeben | `md-join-info-position` | `md-join-info-position` | Eingabefeld für Spielposition |
| Teilnahme bestätigen | `md-join-info-submit` | `md-join-info-submit` | Button zum Bestätigen der Teilnahme |
| Teilnahme abbrechen | `md-join-info-cancel` | `md-join-info-cancel` | Button zum Abbrechen der Teilnahme |

## Verwendung in Tests

```javascript
// MatchDay Navigation (Übersicht -> Detail)
await page.click('[data-testid="md-2025-08-30"]');

// Teilnahme (Übersicht)
await page.click('[data-testid="md-2025-08-30-participate"]');
await page.click('[data-testid="md-2025-08-30-decline"]');

// Tab Navigation (Detail)
await page.click('[data-testid="md-tab-participation"]');
await page.click('[data-testid="md-tab-rides"]');
await page.click('[data-testid="md-tab-bring-items"]');

// Content-Bereiche prüfen (Detail)
await page.waitForSelector('[data-testid="md-content-participation"]');
await page.waitForSelector('[data-testid="md-content-rides"]');
await page.waitForSelector('[data-testid="md-content-bring-items"]');

// Fahrten (Detail)
await page.click('[data-testid="md-create-ride"]');
await page.click('[data-testid="md-ride-0-join"]');
await page.click('[data-testid="md-ride-0-edit"]');

// Mitbringen (Detail)
await page.click('[data-testid="md-add-bring-item"]');
await page.click('[data-testid="md-bring-item-0-join"]');
await page.click('[data-testid="md-bring-item-1-delete"]');

// Formulare ausfüllen
await page.fill('[data-testid="create-ride-departure-time"]', '14:00');
await page.fill('[data-testid="create-ride-departure-location"]', 'Bahnhof');
await page.click('[data-testid="create-ride-submit"]');

// Playwright specific (empfohlen)
await page.getByTestId('md-2025-08-30').click();
await page.getByTestId('md-tab-rides').click();
await page.getByTestId('md-create-ride').click();
```

## Kontextbewusste Strategie

### Warum zwei verschiedene Ansätze?

1. **Übersicht (Datum-basiert):** 
   - Mehrere MatchDays sind gleichzeitig sichtbar
   - Eindeutige Identifikation zwischen verschiedenen Tagen erforderlich
   - Format: `md-{YYYY-MM-DD}-{action}`

2. **Detail (Vereinfacht):**
   - Nur ein MatchDay ist gleichzeitig sichtbar
   - Redundante Datumsinformation wird vermieden
   - Format: `md-{element}`

### Vorteile

- **Einfachere Tests:** Weniger komplexe Selektoren in Detail-Ansichten
- **Bessere Lesbarkeit:** Logische und intuitive ID-Namen
- **Wartungsfreundlich:** Reduzierte Komplexität bei Änderungen

## Hinweise

- Datumsformat ist immer `YYYY-MM-DD` (ISO-Format)
- Alle Test-IDs verwenden `data-testid` Attribute (nicht `id`)
- IDs sind eindeutig pro Kontext (Übersicht vs. Detail)
- Für Playwright wird `page.getByTestId()` empfohlen
- Index-basierte IDs beginnen bei 0
- Modal- und Form-IDs sind kontextspezifisch benannt

### 1. MatchDay Cards (Übersicht)
**Datei:** `src/components/matches/MatchDayCard.tsx`

```html
<!-- MatchDay Card -->
<div data-testid="md-2024-01-15">

<!-- Teilnahme-Buttons -->
<button data-testid="md-2024-01-15-participate">
<button data-testid="md-2024-01-15-decline">
```

### 2. MatchDay Detail Page (Spezifische Seite)
**Datei:** `src/pages/matches/[matchId].tsx`

```html
<!-- Tab Navigation -->
<button data-testid="md-tab-participation">
<button data-testid="md-tab-rides">  
<button data-testid="md-tab-bring-items">

<!-- Content Areas -->
<div data-testid="md-content-participation">
<div data-testid="md-content-rides">
<div data-testid="md-content-bring-items">

<!-- Action Buttons -->
<button data-testid="md-create-ride">
<button data-testid="md-add-bring-item">
```

### 3. Participation Summary (Detail)
**Datei:** `src/components/matches/ParticipationSummary.tsx`

```html
<!-- Main Container -->
<div data-testid="md-participation-summary">

<!-- Loading/Empty States -->
<div data-testid="md-participation-loading">
<div data-testid="md-participation-empty">

<!-- Groups -->
<div data-testid="md-group-joining">
<div data-testid="md-group-declining">  
<div data-testid="md-group-open">

<!-- Individual Users -->
<div data-testid="md-user-joining-0">
<div data-testid="md-user-declining-1">
<div data-testid="md-user-open-2">
```

### 4. Bring Items (Detail)
**Datei:** `src/components/matches/BringItems.tsx`

```html
<!-- Main Container -->
<div data-testid="md-bring-items">

<!-- Add Button -->
<button data-testid="md-add-bring-item">

<!-- Items List -->
<div data-testid="md-bring-items-list">

<!-- Individual Items -->
<div data-testid="md-bring-item-0">
<div data-testid="md-bring-item-1">

<!-- Item Actions -->
<button data-testid="md-bring-item-0-join">
<button data-testid="md-bring-item-0-leave">
<button data-testid="md-bring-item-0-delete">

<!-- Create Modal -->
<div data-testid="md-create-bring-item-modal">
```

### 5. Rides (Detail)
**Datei:** `src/components/rides/RidesList.tsx`, `RideCard.tsx`

```html
<!-- Rides Container -->
<div data-testid="md-rides-list">

<!-- Individual Rides -->
<div data-testid="md-ride-0">
<div data-testid="md-ride-1">

<!-- Ride Actions -->
<button data-testid="md-ride-0-join">
<button data-testid="md-ride-0-leave">
<button data-testid="md-ride-0-edit">
<button data-testid="md-ride-0-delete">

<!-- Edit Modal -->
<div data-testid="md-edit-ride-0-modal">
```

### 6. Forms
**Dateien:** `src/components/forms/CreateRideForm.tsx`, `CreateBringItemForm.tsx`

```html
<!-- Create Ride Form -->
<form data-testid="create-ride-form">
<input data-testid="create-ride-departure-time">
<input data-testid="create-ride-departure-location">
<input data-testid="create-ride-available-seats">
<textarea data-testid="create-ride-notes">
<button data-testid="create-ride-submit">
<button data-testid="create-ride-cancel">

<!-- Create Bring Item Form -->
<form data-testid="create-bring-item-form">
<input data-testid="create-bring-item-name">
<input data-testid="create-bring-item-quantity">
<textarea data-testid="create-bring-item-notes">
<button data-testid="create-bring-item-submit">
<button data-testid="create-bring-item-cancel">
```

### 7. Modals
**Dateien:** `src/components/matches/DeclineReasonModal.tsx`, `JoinInfoModal.tsx`

```html
<!-- Decline Reason Modal -->
<div data-testid="md-decline-reason-modal">
<form data-testid="md-decline-reason-form">
<textarea data-testid="md-decline-reason-textarea">
<button data-testid="md-decline-reason-submit">
<button data-testid="md-decline-reason-cancel">

<!-- Join Info Modal -->  
<div data-testid="md-join-info-modal">
<form data-testid="md-join-info-form">
<input data-testid="md-join-info-position">
<button data-testid="md-join-info-submit">
<button data-testid="md-join-info-cancel">
```

## Verwendung in Tests

### Playwright Beispiele

```javascript
// MatchDay auswählen (Übersicht)
await page.click('[data-testid="md-2024-01-15"]');

// Teilnehmen (Übersicht)
await page.click('[data-testid="md-2024-01-15-participate"]');

// Tab Navigation (Detail)
await page.click('[data-testid="md-tab-rides"]');

// Ride erstellen (Detail)
await page.click('[data-testid="md-create-ride"]');

// Formular ausfüllen
await page.fill('[data-testid="create-ride-departure-time"]', '14:00');
await page.fill('[data-testid="create-ride-departure-location"]', 'Bahnhof');

// Ride beitreten (Detail)
await page.click('[data-testid="md-ride-0-join"]');
```

## Implementierung

### Hilfsfunktionen

**Datum Formatierung:**
```typescript
// src/utils/dateTime.ts
export function formatDateForId(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
}
```

### Komponenten Pattern

**Datum-basierte IDs (Übersicht):**
```typescript
const testId = `md-${formatDateForId(matchDate)}`;
```

**Vereinfachte IDs (Detail):**
```typescript
const testId = "md-tab-participation";
const testId = "md-ride-0";
```

## Wartung

- **Bei neuen Komponenten:** Folge der kontextbewussten Strategie
- **Bei Änderungen:** Aktualisiere diese Dokumentation
- **Test Updates:** Prüfe betroffene E2E Tests bei ID-Änderungen

## Zusammenfassung der Änderungen

Die ID-Strategie wurde von einer universell datum-basierten Ansatz zu einer kontextbewussten Strategie geändert:

- **Vorher:** Alle IDs hatten das Format `md-{YYYY-MM-DD}-{element}`
- **Nachher:** 
  - Übersicht: `md-{YYYY-MM-DD}` für Unterscheidung zwischen MatchDays
  - Detail: `md-{element}` da nur ein MatchDay sichtbar ist

Dies macht die Test-IDs einfacher und logischer, da redundante Datumsinformationen in kontextuellen Bereichen vermieden werden.
