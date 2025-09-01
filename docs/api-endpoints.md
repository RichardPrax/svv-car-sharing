# API Endpunkte Dokumentation

## Übersicht

Diese Dokumentation beschreibt alle verfügbaren API-Endpunkte des SVV Car Sharing Systems. Die API basiert auf Next.js API Routes und verwendet ein rollenbasiertes Berechtigungssystem.

## Rollen-Legende

| Rolle | Beschreibung |
|-------|-------------|
| **🌐 Public** | Kein Login erforderlich |
| **🔐 Auth** | Login erforderlich (alle Rollen) |
| **👤 USER** | Standard-Benutzer |
| **👨‍🏫 TRAINER** | Trainer/Coach |
| **🛡️ ADMIN** | Administrator |
| **⚽ PLAYER** | Aktiver Spieler |

## Authentifizierung

| Endpunkt | Methode | Berechtigung | Beschreibung |
|----------|---------|--------------|-------------|
| `/api/auth/login` | POST | 🌐 Public | Benutzer-Login (Monitoring) |

## Benutzer-Verwaltung

| Endpunkt | Methode | Berechtigung | Beschreibung |
|----------|---------|--------------|-------------|
| `/api/admin/users` | GET | 👨‍🏫 TRAINER, 🛡️ ADMIN | Alle Benutzer auflisten |
| `/api/user/[userId]` | GET | 🌐 Public | Einzelnes Benutzerprofil |
| `/api/user/[userId]` | PUT | 🔐 Auth (eigenes Profil) | Benutzerprofil bearbeiten |
| `/api/user/profiles` | GET | 🌐 Public | Alle Benutzerprofile |

## Spieltage

| Endpunkt | Methode | Berechtigung | Beschreibung |
|----------|---------|--------------|-------------|
| `/api/matches` | GET | 🌐 Public | Alle Spieltage auflisten |
| `/api/matches/[matchId]` | GET | 🌐 Public | Einzelnen Spieltag laden |
| `/api/matches/[matchId]/detail-batch` | GET | 🌐 Public | Spieltag-Details batch laden |

## Spiel-Teilnahme

| Endpunkt | Methode | Berechtigung | Beschreibung |
|----------|---------|--------------|-------------|
| `/api/matches/[matchId]/participation` | POST | 👤 USER, ⚽ PLAYER, 🛡️ ADMIN | An Spiel teilnehmen |
| `/api/matches/[matchId]/participation` | DELETE | 👤 USER, ⚽ PLAYER, 🛡️ ADMIN | Spiel-Teilnahme absagen |
| `/api/matches/[matchId]/participation/[playerId]` | GET | 🌐 Public | Teilnahme eines Spielers |
| `/api/matches/[matchId]/participation/[playerId]` | PUT | 🔐 Auth (eigene Teilnahme) | Teilnahme-Status ändern |
| `/api/matches/[matchId]/participation/overview` | GET | 🌐 Public | Teilnahme-Übersicht |
| `/api/matches/participation/overview-batch` | GET | 🌐 Public | Teilnahme-Übersicht (Batch) |
| `/api/matches/participation/user-batch` | GET | 🌐 Public | Benutzer-Teilnahmen (Batch) |

## Mitbring-Artikel

| Endpunkt | Methode | Berechtigung | Beschreibung |
|----------|---------|--------------|-------------|
| `/api/matches/[matchId]/bring-items` | GET | 🌐 Public | Mitbring-Artikel für Spiel |
| `/api/matches/[matchId]/bring-items` | POST | 🔐 Auth | Neuen Mitbring-Artikel erstellen |
| `/api/matches/[matchId]/bring-items/[itemId]` | PUT | 🔐 Auth (eigener Artikel) | Mitbring-Artikel bearbeiten |
| `/api/matches/[matchId]/bring-items/[itemId]` | DELETE | 🔐 Auth (eigener Artikel) | Mitbring-Artikel löschen |

## Fahrten

| Endpunkt | Methode | Berechtigung | Beschreibung |
|----------|---------|--------------|-------------|
| `/api/rides/create` | POST | 🔐 Auth | Neue Fahrt erstellen |
| `/api/rides/[rideId]` | GET | 🌐 Public | Fahrt-Details |
| `/api/rides/[rideId]` | PUT | 🔐 Auth (eigene Fahrt) | Fahrt bearbeiten |
| `/api/rides/[rideId]` | DELETE | 🔐 Auth (eigene Fahrt) | Fahrt löschen |
| `/api/rides/by-match/[matchId]` | GET | 🌐 Public | Alle Fahrten zu einem Spiel |
| `/api/rides/driver/[userId]` | GET | 🌐 Public | Fahrten als Fahrer |
| `/api/rides/passenger/[userId]` | GET | 🌐 Public | Fahrten als Mitfahrer |
| `/api/rides/actions` | POST | 🔐 Auth | Fahrt-Aktionen (Beitreten/Verlassen) |

## System

| Endpunkt | Methode | Berechtigung | Beschreibung |
|----------|---------|--------------|-------------|
| `/api/hello` | GET | 🌐 Public | API Test/Gesundheitscheck |

## Detaillierte Endpunkt-Beschreibungen

### Authentifizierung

#### `POST /api/auth/login`
- **Zweck**: Benutzer-Login verarbeiten (hauptsächlich für Monitoring)
- **Parameter**: `email`, `password`
- **Validierung**: Email-Format, Passwort-Mindestlänge (6 Zeichen)
- **Rate Limiting**: Ja
- **Besonderheit**: Tatsächliche Authentifizierung über Supabase

### Benutzer-Verwaltung

#### `GET /api/admin/users`
- **Zweck**: Alle Benutzer für Administratoren auflisten
- **Berechtigung**: Nur ADMIN und TRAINER
- **Response**: Liste aller Benutzer mit Profil-Informationen
- **Rate Limiting**: Ja

#### `GET /api/user/[userId]`
- **Zweck**: Einzelnes Benutzerprofil laden
- **Parameter**: `userId` (URL-Parameter)
- **Berechtigung**: Öffentlich lesbar
- **Response**: Benutzerprofil-Daten

#### `PUT /api/user/[userId]`
- **Zweck**: Benutzerprofil bearbeiten
- **Parameter**: `userId` (URL-Parameter), Profil-Daten im Body
- **Berechtigung**: Nur eigenes Profil bearbeitbar
- **Validierung**: Benutzer kann nur eigene Daten ändern

### Spieltage

#### `GET /api/matches`
- **Zweck**: Alle Spieltage auflisten
- **Berechtigung**: Öffentlich
- **Response**: Array aller Spieltage

#### `GET /api/matches/[matchId]`
- **Zweck**: Einzelnen Spieltag mit Details laden
- **Parameter**: `matchId` (URL-Parameter)
- **Berechtigung**: Öffentlich
- **Response**: Spieltag-Details

### Spiel-Teilnahme

#### `POST /api/matches/[matchId]/participation`
- **Zweck**: An einem Spiel teilnehmen
- **Parameter**: `matchId` (URL-Parameter), `status` im Body
- **Berechtigung**: USER, PLAYER, ADMIN
- **Validierung**: Benutzer kann nur für sich selbst anmelden

#### `DELETE /api/matches/[matchId]/participation`
- **Zweck**: Spiel-Teilnahme absagen
- **Parameter**: `matchId` (URL-Parameter)
- **Berechtigung**: USER, PLAYER, ADMIN
- **Validierung**: Benutzer kann nur eigene Teilnahme absagen

### Fahrten

#### `POST /api/rides/create`
- **Zweck**: Neue Fahrt erstellen
- **Parameter**: `matchDayId`, `driverId`, `departureTime`, `departureLocation`, `availableSeats`
- **Berechtigung**: Authentifizierte Benutzer
- **Validierung**: 
  - Nur für sich selbst Fahrten erstellen
  - `availableSeats` zwischen 1-8
  - Gültiges Datum für `departureTime`

#### `PUT /api/rides/[rideId]`
- **Zweck**: Fahrt bearbeiten
- **Parameter**: `rideId` (URL-Parameter), Update-Daten im Body
- **Berechtigung**: Nur der Fahrer kann seine Fahrt bearbeiten
- **Validierung**: Besitz-Prüfung der Fahrt

#### `POST /api/rides/actions`
- **Zweck**: Fahrt-Aktionen (Beitreten/Verlassen)
- **Parameter**: `action`, `rideId`, optional `passengerId`
- **Berechtigung**: Authentifizierte Benutzer
- **Aktionen**: `join`, `leave`, `removePassenger`

### Mitbring-Artikel

#### `POST /api/matches/[matchId]/bring-items`
- **Zweck**: Neuen Mitbring-Artikel erstellen
- **Parameter**: `matchId` (URL-Parameter), `name`, `quantity`, `description`
- **Berechtigung**: Authentifizierte Benutzer
- **Validierung**: Artikel-Details erforderlich

#### `PUT /api/matches/[matchId]/bring-items/[itemId]`
- **Zweck**: Mitbring-Artikel bearbeiten
- **Parameter**: `matchId`, `itemId` (URL-Parameter), Update-Daten
- **Berechtigung**: Nur der Ersteller kann seinen Artikel bearbeiten
- **Validierung**: Besitz-Prüfung des Artikels