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

## Hinweise

- Datumsformat ist immer `YYYY-MM-DD` (ISO-Format)
- Alle Test-IDs verwenden `data-testid` Attribute (nicht `id`)
- IDs sind eindeutig pro Kontext (Übersicht vs. Detail)
- Für Playwright wird `page.getByTestId()` empfohlen
- Index-basierte IDs beginnen bei 0
- Modal- und Form-IDs sind kontextspezifisch benannt