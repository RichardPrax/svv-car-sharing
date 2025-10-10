# E2E Test ID Strategie

Diese Dokumentation beschreibt die HTML-ID Konventionen für End-to-End Tests mit kontextbewusster Strategie.

## ID-Format

Wir verwenden eine **kontextbewusste** ID-Strategie mit verschiedenen Präfixen:

- **`md-`** für MatchDay-Elemente
- **`tr-`** für Training-Elemente
- Keine Präfixe für globale Elemente (z.B. Login, Kategorien)

### Datum-basierte IDs (für Listen und Überblick)
```
{prefix}-{YYYY-MM-DD}-{action}
```
Beispiele:
- `md-2025-08-30-participate` (MatchDay)
- `tr-2025-10-15-participate` (Training)

### Vereinfachte IDs (für Detailseiten und Formulare)
```
{prefix}-{element}
```
Beispiele:
- `md-tab-participation` (MatchDay Detail)
- `tr-join-info-form` (Training Modal)
- `login-email` (Global, ohne Präfix)

## Verfügbare Test-IDs

| Komponente | ID Pattern | Beispiel | Beschreibung |
|------------|------------|----------|--------------|
| **MatchDay** | **Übersicht** | | |
| MatchDay Card | `md-{YYYY-MM-DD}` | `md-2025-08-30` | Hauptcontainer einer MatchDay Karte |
| **MatchDay** | **Teilnahme** | | |
| Participate Button | `md-{YYYY-MM-DD}-participate` | `md-2025-08-30-participate` | "Dabei" Button für Spielteilnahme |
| Teilnahme Info Form | `join-info-form` | `join-info-form` | Formular für Teilnahme-Details |
| Teilnahme Info Text | `join-info-input` | `join-info-input` | Textfeld für zusätzliche Angaben bei Zusage |
| Teilnahme bestätigen | `join-info-submit` | `join-info-submit` | Button zum Bestätigen der Teilnahme |
| Teilnahme abbrechen | `join-info-cancel` | `join-info-cancel` | Button zum Abbrechen der Teilnahme |
| **MatchDay** | **Absage** | | |
| Decline Button | `md-{YYYY-MM-DD}-decline` | `md-2025-08-30-decline` | "Nicht dabei" Button für Spielabsage |
| Absage-Grund Form | `decline-reason-form` | `decline-reason-form` | Formular für Absage-Grund |
| Absage-Grund Text | `decline-reason-input` | `decline-reason-input` | Textfeld für Absage-Begründung |
| Absage bestätigen | `decline-reason-submit` | `decline-reason-submit` | Button zum Bestätigen der Absage |
| Absage abbrechen | `decline-reason-cancel` | `decline-reason-cancel` | Button zum Abbrechen der Absage |
| **MatchDay Detail** | **Teilnahme übersicht** | | |
| Tab Teilnahme | `md-tab-participation` | `md-tab-participation` | Tab für Teilnahme-Übersicht |
| Content Teilnahme | `md-content-participation` | `md-content-participation` | Inhalt des Teilnahme-Tabs |
| Teilnahme Container | `md-participation-summary` | `md-participation-summary` | Hauptcontainer der Teilnahme-Übersicht |
| Loading State | `md-participation-loading` | `md-participation-loading` | Ladeindikator für Teilnahme-Daten |
| Empty State | `md-participation-empty` | `md-participation-empty` | Anzeige wenn keine Spieler registriert |
| Gruppe "Dabei" | `md-group-joining` | `md-group-joining` | Gruppe der zusagenden Spieler |
| Gruppe "Absage" | `md-group-declining` | `md-group-declining` | Gruppe der absagenden Spieler |
| Gruppe "Offen" | `md-group-open` | `md-group-open` | Gruppe der noch nicht entschiedenen Spieler |
| User in Gruppe | `md-user-{type}-{index}` | `md-user-joining-0` | Einzelner User in Teilnahme-Gruppe |
| **MatchDay Detail** | **Fahrten übersicht** | | |
| Tab Fahrten | `md-tab-rides` | `md-tab-rides` | Tab für Fahrten-Übersicht |
| Content Fahrten | `md-content-rides` | `md-content-rides` | Inhalt des Fahrten-Tabs |
| Fahrten Liste | `md-rides-list` | `md-rides-list` | Container für alle Fahrten |
| Einzelne Fahrt | `md-ride-{index}` | `md-ride-0` | Einzelne Fahrt-Karte |
| **MatchDay Detail** | **Fahrten erstellen** | | |
| Fahrt erstellen Button | `md-create-ride` | `md-create-ride` | Button zum Erstellen einer neuen Fahrt |
| Fahrt erstellen Form | `create-ride-form` | `create-ride-form` | Formular zum Erstellen einer Fahrt |
| Abfahrtszeit | `create-ride-departure-time` | `create-ride-departure-time` | Eingabefeld für Abfahrtszeit |
| Abfahrtsort | `create-ride-departure-location` | `create-ride-departure-location` | Eingabefeld für Abfahrtsort |
| Verfügbare Plätze | `create-ride-available-seats` | `create-ride-available-seats` | Eingabefeld für Sitzplätze |
| Notizen | `create-ride-notes` | `create-ride-notes` | Textfeld für zusätzliche Informationen |
| Form absenden | `create-ride-submit` | `create-ride-submit` | Button zum Speichern der Fahrt |
| Form abbrechen | `create-ride-cancel` | `create-ride-cancel` | Button zum Abbrechen |
| **MatchDay Detail** | **Fahrten bearbeiten** | | |
| Fahrt bearbeiten Button | `md-ride-{index}-edit` | `md-ride-0-edit` | Button zum Bearbeiten einer Fahrt |
| Fahrt bearbeiten Form | `edit-ride-form` | `edit-ride-form` | Formular zum Bearbeiten einer Fahrt |
| Abfahrtszeit bearbeiten | `edit-ride-departure-time` | `edit-ride-departure-time` | Eingabefeld für Abfahrtszeit (Edit) |
| Abfahrtsort bearbeiten | `edit-ride-departure-location` | `edit-ride-departure-location` | Eingabefeld für Abfahrtsort (Edit) |
| Verfügbare Plätze bearbeiten | `edit-ride-available-seats` | `edit-ride-available-seats` | Eingabefeld für Sitzplätze (Edit) |
| Zusätzliche Informationen bearbeiten | `edit-ride-additional-info` | `edit-ride-additional-info` | Textfeld für zusätzliche Informationen (Edit) |
| Form absenden | `edit-ride-submit` | `edit-ride-submit` | Button zum Speichern der Änderungen |
| Form abbrechen | `edit-ride-cancel` | `edit-ride-cancel` | Button zum Abbrechen der Bearbeitung |
| **MatchDay Detail** | **Fahrten löschen** | | |
| Fahrt löschen | `md-ride-{index}-delete` | `md-ride-0-delete` | Button zum Löschen einer Fahrt |
| Fahrt löschen bestätigen | `delete-ride-confirm` | `delete-ride-confirm` | Button zum endgültigen Löschen der Fahrt |
| Fahrt löschen abbrechen | `delete-ride-cancel` | `delete-ride-cancel` | Button zum Abbrechen der Löschung |
| **MatchDay Detail** | **Fahrt beitreten/verlassen** | | |
| Fahrt beitreten | `md-ride-{index}-join` | `md-ride-0-join` | Button um Fahrt beizutreten |
| Fahrt verlassen | `md-ride-{index}-leave` | `md-ride-0-leave` | Button um Fahrt zu verlassen |
| **MatchDay Detail** | **Fahrt Details** | | |
| Fahrt Details Container | `md-ride-{index}-details` | `md-ride-0-details` | Container für Fahrt-Details |
| Fahrt Titel/Zeit | `md-ride-{index}-title` | `md-ride-0-title` | Abfahrtszeit der Fahrt |
| Abfahrtsort | `md-ride-{index}-location` | `md-ride-0-location` | Abfahrtsort der Fahrt |
| Fahrer | `md-ride-{index}-driver` | `md-ride-0-driver` | Name des Fahrers |
| Verfügbare Plätze | `md-ride-{index}-seats` | `md-ride-0-seats` | Anzeige verfügbarer/belegter Plätze |
| Zusätzliche Informationen | `md-ride-{index}-additional-info` | `md-ride-0-additional-info` | Zusätzliche Informationen zur Fahrt |
| **MatchDay Detail** | **Fahrt Mitfahrer** | | |
| Mitfahrer Container | `md-ride-{index}-passengers` | `md-ride-0-passengers` | Container für Mitfahrer-Liste |
| Mitfahrer Label | `md-ride-{index}-passengers-label` | `md-ride-0-passengers-label` | Label "Mitfahrer (X)" |
| Mitfahrer Liste | `md-ride-{index}-passengers-list` | `md-ride-0-passengers-list` | Liste aller Mitfahrer |
| Einzelner Mitfahrer | `md-ride-{index}-passenger-{passengerIndex}` | `md-ride-0-passenger-0` | Einzelner Mitfahrer in der Liste |
| **MatchDay Detail** | **Mitbringen Übersicht**| | |
| Tab Mitbringen | `md-tab-bring-items` | `md-tab-bring-items` | Tab für Mitbring-Items |
| Content Mitbringen | `md-content-bring-items` | `md-content-bring-items` | Inhalt des Mitbring-Tabs |
| Mitbringen Container | `md-bring-items` | `md-bring-items` | Hauptcontainer für Mitbring-Items |
| Items Liste | `md-bring-items-list` | `md-bring-items-list` | Liste aller Mitbring-Items |
| Einzelnes Item | `md-bring-item-{index}` | `md-bring-item-0` | Einzelnes Mitbring-Item |
| **MatchDay Detail** | **Mitbringen hinzufügen**| | |
| Mitbringen hinzufügen | `md-add-bring-item` | `md-add-bring-item` | Button zum Hinzufügen eines Mitbring-Items |
| Mitbringen erstellen Form | `create-bring-item-form` | `create-bring-item-form` | Formular zum Erstellen eines Items |
| Item Name | `create-bring-item-name` | `create-bring-item-name` | Eingabefeld für Item-Name |
| Item Notizen | `create-bring-item-description` | `create-bring-item-description` | Textfeld für Notizen |
| Item absenden | `create-bring-item-submit` | `create-bring-item-submit` | Button zum Speichern des Items |
| Item abbrechen | `create-bring-item-cancel` | `create-bring-item-cancel` | Button zum Abbrechen |
| **MatchDay Detail** | **Mitbringen löschen**| | |
| Mitbringen löschen | `md-delete-bring-item-{index}` | `md-delete-bring-item-0` | Button zum Löschen eines Mitbring-Items |
| Mitbring löschen bestätigen | `delete-bring-item-confirm` | `delete-bring-item-confirm` | Button zum endgültigen Löschen der BringItem Sache |
| Mitbring löschen abbrechen | `delete-bringt-item-cancel` | `delete-bring-item-cancel` | Button zum Abbrechen der Löschung |
| **Homepage** | **Kategorien** | | |
| Training Kategorie | `category-training` | `category-training` | Kategorie-Karte für Training |
| Spieltage Kategorie | `category-matches` | `category-matches` | Kategorie-Karte für Spieltage |
| Strafen Kategorie | `category-penalties` | `category-penalties` | Kategorie-Karte für Strafen |
| Statistiken Kategorie | `category-statistics` | `category-statistics` | Kategorie-Karte für Statistiken |
| Benutzer verwalten Kategorie | `category-user-management` | `category-user-management` | Kategorie-Karte für Benutzerverwaltung (nur für Admins) |
| **Authentication** | **Login** | | |
| Login E-Mail Feld | `login-email` | `login-email` | Eingabefeld für E-Mail-Adresse |
| Login Passwort Feld | `login-password` | `login-password` | Eingabefeld für Passwort |
| Login Submit Button | `login-submit` | `login-submit` | Button zum Absenden des Login-Formulars |
| **Training** | **Übersicht** | | |
| Training Card | `tr-{YYYY-MM-DD}` | `tr-2025-10-15` | Hauptcontainer einer Training Karte |
| Training Liste | `tr-list` | `tr-list` | Container für alle Trainings |
| Training Liste Loading | `tr-list-loading` | `tr-list-loading` | Ladeindikator für Training-Liste |
| Training Liste Leer | `tr-list-empty` | `tr-list-empty` | Anzeige wenn keine Trainings vorhanden |
| Nächstes Training Sektion | `tr-next-training-section` | `tr-next-training-section` | Sektion für nächstes Training |
| Nächstes Training Card | `tr-next-training-card` | `tr-next-training-card` | Karte mit nächstem Training |
| Nächstes Training Loading | `tr-next-training-loading` | `tr-next-training-loading` | Ladeindikator für nächstes Training |
| Nächstes Training Leer | `tr-next-training-empty` | `tr-next-training-empty` | Anzeige wenn kein Training geplant |
| Training Sektion | `tr-list-section` | `tr-list-section` | Sektion für alle Trainings |
| **Training** | **Aktionen** | | |
| Training bearbeiten | `tr-{YYYY-MM-DD}-edit` | `tr-2025-10-15-edit` | Button zum Bearbeiten eines Trainings |
| Training löschen | `tr-{YYYY-MM-DD}-delete` | `tr-2025-10-15-delete` | Button zum Löschen eines Trainings |
| Ansicht umschalten | `tr-{YYYY-MM-DD}-toggle-view` | `tr-2025-10-15-toggle-view` | Button zum Umschalten zwischen Details und Teilnehmern |
| Training Details | `tr-{YYYY-MM-DD}-details` | `tr-2025-10-15-details` | Container für Training-Details |
| Teilnehmer Ansicht | `tr-{YYYY-MM-DD}-participants-view` | `tr-2025-10-15-participants-view` | Container für Teilnehmer-Ansicht |
| **Training** | **Teilnahme** | | |
| Participate Button | `tr-{YYYY-MM-DD}-participate` | `tr-2025-10-15-participate` | "Dabei" Button für Training-Teilnahme |
| Decline Button | `tr-{YYYY-MM-DD}-decline` | `tr-2025-10-15-decline` | "Nicht dabei" Button für Training-Absage |
| **Training** | **Zusage** | | |
| Zusage Info Form | `tr-join-info-form` | `tr-join-info-form` | Formular für Zusage-Details |
| Zusage Info Text | `tr-join-info-input` | `tr-join-info-input` | Textfeld für zusätzliche Angaben bei Zusage |
| Zusage bestätigen | `tr-join-info-submit` | `tr-join-info-submit` | Button zum Bestätigen der Zusage |
| Zusage abbrechen | `tr-join-info-cancel` | `tr-join-info-cancel` | Button zum Abbrechen der Zusage |
| **Training** | **Absage** | | |
| Absage-Grund Form | `tr-decline-reason-form` | `tr-decline-reason-form` | Formular für Absage-Grund |
| Absage-Grund Text | `tr-decline-reason-input` | `tr-decline-reason-input` | Textfeld für Absage-Begründung |
| Absage-Grund Fehler | `tr-decline-reason-error` | `tr-decline-reason-error` | Fehlermeldung bei ungültigem Grund |
| Absage bestätigen | `tr-decline-reason-submit` | `tr-decline-reason-submit` | Button zum Bestätigen der Absage |
| Absage abbrechen | `tr-decline-reason-cancel` | `tr-decline-reason-cancel` | Button zum Abbrechen der Absage |
| **Training** | **Teilnahme Übersicht** | | |
| Teilnahme Container | `tr-participation-summary` | `tr-participation-summary` | Hauptcontainer der Teilnahme-Übersicht |
| Loading State | `tr-participation-loading` | `tr-participation-loading` | Ladeindikator für Teilnahme-Daten |
| Empty State | `tr-participation-empty` | `tr-participation-empty` | Anzeige wenn keine Spieler registriert |
| Gruppe "Dabei" | `tr-group-joining` | `tr-group-joining` | Gruppe der zusagenden Spieler |
| Gruppe "Absage" | `tr-group-declining` | `tr-group-declining` | Gruppe der absagenden Spieler |
| Gruppe "Offen" | `tr-group-open` | `tr-group-open` | Gruppe der noch nicht entschiedenen Spieler |
| User in Gruppe | `tr-user-{type}-{index}` | `tr-user-joining-0` | Einzelner User in Teilnahme-Gruppe |
| **Training** | **Training erstellen** | | |
| Einzelnes Training erstellen | `tr-create-single-button` | `tr-create-single-button` | Button zum Erstellen eines einzelnen Trainings |
| Training erstellen Form | `tr-create-form` | `tr-create-form` | Formular zum Erstellen eines Trainings |
| Datum | `tr-create-date` | `tr-create-date` | Eingabefeld für Datum |
| Startzeit | `tr-create-start-time` | `tr-create-start-time` | Eingabefeld für Startzeit |
| Endzeit | `tr-create-end-time` | `tr-create-end-time` | Eingabefeld für Endzeit |
| Form absenden | `tr-create-submit` | `tr-create-submit` | Button zum Speichern des Trainings |
| Form abbrechen | `tr-create-cancel` | `tr-create-cancel` | Button zum Abbrechen |
| **Training** | **Training bearbeiten** | | |
| Training bearbeiten Form | `tr-edit-form` | `tr-edit-form` | Formular zum Bearbeiten eines Trainings |
| Bearbeitungsbereich Auswahl | `tr-edit-scope-selector` | `tr-edit-scope-selector` | Selector für Bearbeitungsbereich (Serie) |
| Scope: Nur dieses | `tr-edit-scope-single` | `tr-edit-scope-single` | Radio-Button für einzelnes Training |
| Scope: Dieses und folgende | `tr-edit-scope-future` | `tr-edit-scope-future` | Radio-Button für dieses und folgende |
| Scope: Gesamte Serie | `tr-edit-scope-series` | `tr-edit-scope-series` | Radio-Button für gesamte Serie |
| Datum bearbeiten | `tr-edit-date` | `tr-edit-date` | Eingabefeld für Datum (Edit) |
| Startzeit bearbeiten | `tr-edit-start-time` | `tr-edit-start-time` | Eingabefeld für Startzeit (Edit) |
| Endzeit bearbeiten | `tr-edit-end-time` | `tr-edit-end-time` | Eingabefeld für Endzeit (Edit) |
| Form absenden | `tr-edit-submit` | `tr-edit-submit` | Button zum Speichern der Änderungen |
| Form abbrechen | `tr-edit-cancel` | `tr-edit-cancel` | Button zum Abbrechen der Bearbeitung |
| **Training** | **Training löschen** | | |
| Löschbereich Auswahl | `tr-delete-scope-selector` | `tr-delete-scope-selector` | Selector für Löschbereich (Serie) |
| Scope: Nur dieses | `tr-delete-scope-single` | `tr-delete-scope-single` | Radio-Button für einzelnes Training |
| Scope: Dieses und folgende | `tr-delete-scope-future` | `tr-delete-scope-future` | Radio-Button für dieses und folgende |
| Scope: Gesamte Serie | `tr-delete-scope-series` | `tr-delete-scope-series` | Radio-Button für gesamte Serie |
| Training löschen bestätigen | `tr-delete-confirm` | `tr-delete-confirm` | Button zum endgültigen Löschen des Trainings |
| Training löschen abbrechen | `tr-delete-cancel` | `tr-delete-cancel` | Button zum Abbrechen der Löschung |
| **Training** | **Trainings-Serie erstellen** | | |
| Serie erstellen Button | `tr-create-series-button` | `tr-create-series-button` | Button zum Erstellen einer Trainings-Serie |
| Serie erstellen Form | `tr-create-series-form` | `tr-create-series-form` | Formular zum Erstellen einer Serie |
| Serie Name | `tr-series-name` | `tr-series-name` | Eingabefeld für Serien-Name |
| Serie Beschreibung | `tr-series-description` | `tr-series-description` | Textfeld für Beschreibung |
| Trainingstage | `tr-series-weekdays` | `tr-series-weekdays` | Container für Wochentag-Auswahl |
| Startzeit | `tr-series-start-time` | `tr-series-start-time` | Eingabefeld für Startzeit |
| Endzeit | `tr-series-end-time` | `tr-series-end-time` | Eingabefeld für Endzeit |
| Startwoche | `tr-series-start-week` | `tr-series-start-week` | Eingabefeld für Startwoche |
| Endwoche | `tr-series-end-week` | `tr-series-end-week` | Eingabefeld für Endwoche |
| Form absenden | `tr-series-submit` | `tr-series-submit` | Button zum Erstellen der Serie |
| Form abbrechen | `tr-series-cancel` | `tr-series-cancel` | Button zum Abbrechen |

## Hinweise

- Datumsformat ist immer `YYYY-MM-DD` (ISO-Format)
- Alle Test-IDs verwenden `data-testid` Attribute (nicht `id`)
- IDs sind eindeutig pro Kontext und Feature-Bereich
- Präfixe: `md-` für MatchDay, `tr-` für Training
- Für Playwright wird `page.getByTestId()` empfohlen
- Index-basierte IDs beginnen bei 0
- Modal- und Form-IDs sind kontextspezifisch benannt