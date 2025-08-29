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
| **Teilnahme-Übersicht** | | | |
| Teilnahme Container | `md-{YYYY-MM-DD}-participation-summary` | `md-2025-08-30-participation-summary` | Hauptcontainer der Teilnahme-Übersicht |
| Gruppe "Dabei" | `md-{YYYY-MM-DD}-group-joining` | `md-2025-08-30-group-joining` | Gruppe der zusagenden Spieler |
| Gruppe "Absage" | `md-{YYYY-MM-DD}-group-declining` | `md-2025-08-30-group-declining` | Gruppe der absagenden Spieler |
| Gruppe "Offen" | `md-{YYYY-MM-DD}-group-open` | `md-2025-08-30-group-open` | Gruppe der noch offenen Spieler |
| User in Gruppe | `md-{YYYY-MM-DD}-user-{type}-{index}` | `md-2025-08-30-user-joining-0` | Einzelner User in einer Gruppe |
| **Fahrten** | | | |
| Fahrten Liste | `md-{YYYY-MM-DD}-rides-list` | `md-2025-08-30-rides-list` | Container für alle Fahrten |
| Einzelne Fahrt | `md-{YYYY-MM-DD}-ride-{index}` | `md-2025-08-30-ride-0` | Einzelne Fahrt-Karte |
| Fahrt bearbeiten Modal | `md-{YYYY-MM-DD}-ride-{index}-edit-modal` | `md-2025-08-30-ride-0-edit-modal` | Modal zum Bearbeiten einer Fahrt |
| Zusatzinfo | `md-{YYYY-MM-DD}-ride-{index}-additional-info` | `md-2025-08-30-ride-0-additional-info` | Zusatzinformationen einer Fahrt |
| **Mitbringen** | | | |
| Mitbringen Container | `md-{YYYY-MM-DD}-bring-items` | `md-2025-08-30-bring-items` | Hauptcontainer der Mitbringen-Übersicht |
| Hinzufügen Button | `md-{YYYY-MM-DD}-add-bring-item` | `md-2025-08-30-add-bring-item` | Button zum Hinzufügen eines Items |
| Items Liste | `md-{YYYY-MM-DD}-bring-items-list` | `md-2025-08-30-bring-items-list` | Liste aller Mitbring-Items |
| Einzelnes Item | `md-{YYYY-MM-DD}-bring-item-{index}` | `md-2025-08-30-bring-item-0` | Einzelnes Mitbring-Item |
| Item löschen | `md-{YYYY-MM-DD}-delete-bring-item-{index}` | `md-2025-08-30-delete-bring-item-0` | Button zum Löschen eines Items |
| Erstellen Modal | `md-{YYYY-MM-DD}-create-bring-item-modal` | `md-2025-08-30-create-bring-item-modal` | Modal zum Erstellen eines Items |
| Löschen Modal | `md-{YYYY-MM-DD}-delete-bring-item-modal` | `md-2025-08-30-delete-bring-item-modal` | Modal zum Bestätigen des Löschens |
| **Formulare** | | | |
| Fahrt erstellen Form | `create-ride-form` | `create-ride-form` | Formular zum Erstellen einer Fahrt |
| Abfahrtszeit Feld | `create-ride-departure-time` | `create-ride-departure-time` | Zeit-Input für Abfahrt |
| Abfahrtsort Feld | `create-ride-departure-location` | `create-ride-departure-location` | Text-Input für Abfahrtsort |
| Verfügbare Plätze | `create-ride-available-seats` | `create-ride-available-seats` | Select für Anzahl Plätze |
| Zusatzinfo Feld | `create-ride-additional-info` | `create-ride-additional-info` | Textarea für Zusatzinfos |
| Fahrt erstellen Button | `create-ride-submit` | `create-ride-submit` | Submit-Button für Fahrt |
| Fahrt Abbrechen | `create-ride-cancel` | `create-ride-cancel` | Cancel-Button für Fahrt |
| Mitbringen Form | `create-bring-item-form` | `create-bring-item-form` | Formular zum Hinzufügen eines Items |
| Item Name Feld | `create-bring-item-name` | `create-bring-item-name` | Text-Input für Item-Name |
| Item Beschreibung | `create-bring-item-description` | `create-bring-item-description` | Textarea für Item-Beschreibung |
| Item erstellen Button | `create-bring-item-submit` | `create-bring-item-submit` | Submit-Button für Item |
| Item Abbrechen | `create-bring-item-cancel` | `create-bring-item-cancel` | Cancel-Button für Item |
| **Teilnahme Modals** | | | |
| Absage Modal | `decline-reason-modal` | `decline-reason-modal` | Modal für Absage-Begründung |
| Absage Form | `decline-reason-form` | `decline-reason-form` | Formular für Absage-Grund |
| Grund Input | `decline-reason-input` | `decline-reason-input` | Textarea für Absage-Grund |
| Absage Bestätigen | `decline-reason-submit` | `decline-reason-submit` | Submit-Button für Absage |
| Absage Abbrechen | `decline-reason-cancel` | `decline-reason-cancel` | Cancel-Button für Absage |
| Zusage Modal | `join-info-modal` | `join-info-modal` | Modal für Zusage-Info |
| Zusage Form | `join-info-form` | `join-info-form` | Formular für Zusage-Info |
| Info Input | `join-info-input` | `join-info-input` | Textarea für Zusage-Info |
| Zusage Bestätigen | `join-info-submit` | `join-info-submit` | Submit-Button für Zusage |
| Zusage Abbrechen | `join-info-cancel` | `join-info-cancel` | Cancel-Button für Zusage |

## Verwendung in Tests

```javascript
// MatchDay Navigation
await page.getByTestId('md-2025-08-30').click();                    // Zur Detail-Seite
await page.getByTestId('md-2025-08-30-back').click();               // Zurück zur Übersicht

// Tab Navigation
await page.getByTestId('md-2025-08-30-tab-participation').click();  // Teilnahme-Tab
await page.getByTestId('md-2025-08-30-tab-rides').click();          // Fahrten-Tab
await page.getByTestId('md-2025-08-30-tab-bring-items').click();    // Mitbringen-Tab

// Teilnahme
await page.getByTestId('md-2025-08-30-participate').click();        // Teilnahme zusagen
await page.getByTestId('md-2025-08-30-decline').click();            // Teilnahme absagen

// Fahrten verwalten
await page.getByTestId('md-2025-08-30-create-ride').click();        // Neue Fahrt erstellen

// Fahrt-Formular ausfüllen
await page.getByTestId('create-ride-departure-time').fill('14:00');
await page.getByTestId('create-ride-departure-location').fill('Hauptbahnhof');
await page.getByTestId('create-ride-available-seats').selectOption('3');
await page.getByTestId('create-ride-additional-info').fill('Rückfahrt um 18:00');
await page.getByTestId('create-ride-submit').click();

// Mitbringen verwalten
await page.getByTestId('md-2025-08-30-add-bring-item').click();     // Neues Item hinzufügen

// Mitbring-Formular ausfüllen
await page.getByTestId('create-bring-item-name').fill('Getränke');
await page.getByTestId('create-bring-item-description').fill('Wasser und Sportgetränke');
await page.getByTestId('create-bring-item-submit').click();

// Teilnahme mit Begründung
await page.getByTestId('md-2025-08-30-decline').click();            // Absage starten
await page.getByTestId('decline-reason-input').fill('Verletzung');  // Grund eingeben
await page.getByTestId('decline-reason-submit').click();            // Absage bestätigen

// Zusage mit Info
await page.getByTestId('md-2025-08-30-participate').click();        // Zusage starten
await page.getByTestId('join-info-input').fill('Komme etwas später'); // Info eingeben
await page.getByTestId('join-info-submit').click();                 // Zusage bestätigen

// Kompletter Workflow: Fahrt erstellen
await page.getByTestId('md-2025-08-30').click();                    // Detail-Seite öffnen
await page.getByTestId('md-2025-08-30-tab-rides').click();          // Fahrten-Tab
await page.getByTestId('md-2025-08-30-create-ride').click();        // Fahrt erstellen
await page.getByTestId('create-ride-departure-time').fill('15:30');
await page.getByTestId('create-ride-departure-location').fill('Parkplatz Sporthalle');
await page.getByTestId('create-ride-available-seats').selectOption('4');
await page.getByTestId('create-ride-submit').click();
await page.getByTestId('md-2025-08-30-back').click();               // Zurück zur Übersicht
```

## Hinweise

- Datumsformat ist immer `YYYY-MM-DD` (ISO-Format)
- Alle Test-IDs verwenden `data-testid` Attribute (nicht `id`)
- IDs sind eindeutig pro Datum und enthalten Index für Listen-Elemente
- Buttons sind nur bei zukünftigen Matches und für entsprechende Rollen sichtbar
- Index-basierte IDs (z.B. `ride-0`, `bring-item-1`) für dynamische Listen
- Für Playwright wird `page.getByTestId()` empfohlen (einfacher als Selektoren)
- Modals verwenden das Suffix `-modal` für eindeutige Identifikation
