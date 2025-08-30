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
| **Fahrt Details** | | | |
| Fahrt Details Container | `md-ride-{index}-details` | `md-ride-0-details` | Container für Fahrt-Details |
| Fahrt Titel/Zeit | `md-ride-{index}-title` | `md-ride-0-title` | Abfahrtszeit der Fahrt |
| Abfahrtsort | `md-ride-{index}-location` | `md-ride-0-location` | Abfahrtsort der Fahrt |
| Fahrer | `md-ride-{index}-driver` | `md-ride-0-driver` | Name des Fahrers |
| Verfügbare Plätze | `md-ride-{index}-seats` | `md-ride-0-seats` | Anzeige verfügbarer/belegter Plätze |
| Zusätzliche Informationen | `md-ride-{index}-additional-info` | `md-ride-0-additional-info` | Zusätzliche Informationen zur Fahrt |
| **Mitfahrer** | | | |
| Mitfahrer Container | `md-ride-{index}-passengers` | `md-ride-0-passengers` | Container für Mitfahrer-Liste |
| Mitfahrer Label | `md-ride-{index}-passengers-label` | `md-ride-0-passengers-label` | Label "Mitfahrer (X)" |
| Mitfahrer Liste | `md-ride-{index}-passengers-list` | `md-ride-0-passengers-list` | Liste aller Mitfahrer |
| Einzelner Mitfahrer | `md-ride-{index}-passenger-{passengerIndex}` | `md-ride-0-passenger-0` | Einzelner Mitfahrer in der Liste |
| **Formulare** | | | |
| Fahrt erstellen Form | `create-ride-form` | `create-ride-form` | Formular zum Erstellen einer Fahrt |
| Abfahrtszeit | `create-ride-departure-time` | `create-ride-departure-time` | Eingabefeld für Abfahrtszeit |
| Abfahrtsort | `create-ride-departure-location` | `create-ride-departure-location` | Eingabefeld für Abfahrtsort |
| Verfügbare Plätze | `create-ride-available-seats` | `create-ride-available-seats` | Eingabefeld für Sitzplätze |
| Notizen | `create-ride-notes` | `create-ride-notes` | Textfeld für zusätzliche Informationen |
| Form absenden | `create-ride-submit` | `create-ride-submit` | Button zum Speichern der Fahrt |
| Form abbrechen | `create-ride-cancel` | `create-ride-cancel` | Button zum Abbrechen |
| Fahrt bearbeiten Form | `edit-ride-form` | `edit-ride-form` | Formular zum Bearbeiten einer Fahrt |
| Abfahrtszeit bearbeiten | `edit-ride-departure-time` | `edit-ride-departure-time` | Eingabefeld für Abfahrtszeit (Edit) |
| Abfahrtsort bearbeiten | `edit-ride-departure-location` | `edit-ride-departure-location` | Eingabefeld für Abfahrtsort (Edit) |
| Verfügbare Plätze bearbeiten | `edit-ride-available-seats` | `edit-ride-available-seats` | Eingabefeld für Sitzplätze (Edit) |
| Zusätzliche Informationen bearbeiten | `edit-ride-additional-info` | `edit-ride-additional-info` | Textfeld für zusätzliche Informationen (Edit) |
| Änderungen speichern | `edit-ride-submit` | `edit-ride-submit` | Button zum Speichern der Änderungen |
| Bearbeitung abbrechen | `edit-ride-cancel` | `edit-ride-cancel` | Button zum Abbrechen der Bearbeitung |
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
| Fahrt löschen Modal | `md-ride-{index}-delete-modal` | `md-ride-0-delete-modal` | Modal zum Bestätigen der Fahrt-Löschung |
| Fahrt löschen bestätigen | `delete-ride-confirm` | `delete-ride-confirm` | Button zum endgültigen Löschen der Fahrt |
| Fahrt löschen abbrechen | `delete-ride-cancel` | `delete-ride-cancel` | Button zum Abbrechen der Löschung |
| Mitbring löschen bestätigen | `delete-bring-item-confirm` | `delete-bring-item-confirm` | Button zum endgültigen Löschen der BringItem Sache |
| Mitbring löschen abbrechen | `delete-bringt-item-cancel` | `delete-bring-item-cancel` | Button zum Abbrechen der Löschung |

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

## Verwendungsbeispiele

### Fahrt löschen Testing

```javascript
// Fahrt löschen Dialog öffnen
await page.getByTestId('md-ride-0-delete').click();

// Delete Modal sollte erscheinen
await expect(page.getByTestId('md-ride-0-delete-modal')).toBeVisible();

// Löschung abbrechen
await page.getByTestId('delete-ride-cancel').click();
await expect(page.getByTestId('md-ride-0-delete-modal')).not.toBeVisible();

// Fahrt endgültig löschen
await page.getByTestId('md-ride-0-delete').click();
await page.getByTestId('delete-ride-confirm').click();

// Validierung dass Fahrt entfernt wurde
await expect(page.getByTestId('md-ride-0')).not.toBeVisible();
```