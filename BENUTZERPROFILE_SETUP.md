# Datenbank-Setup für Benutzerprofile

## Schritte zum Einrichten der user_profiles Tabelle in Supabase

### 1. Supabase Dashboard öffnen

1. Gehe zu [https://supabase.com](https://supabase.com)
2. Melde dich an und öffne dein Projekt

### 2. SQL Editor verwenden

1. Gehe zu "SQL Editor" im linken Menü
2. Klicke auf "New query"
3. Kopiere den Inhalt aus `create_user_profiles.sql` und füge ihn ein
4. Klicke auf "Run" um das SQL auszuführen

### 3. Was wird erstellt:

-   **user_profiles Tabelle**: Speichert Vor- und Nachname für jeden Benutzer
-   **RLS Policies**: Sicherheitsregeln für den Zugriff auf Profile
-   **Trigger**: Automatische Erstellung eines Profils bei Registrierung
-   **Index**: Für bessere Performance bei Name-Suchen

### 4. Testen der Implementierung:

1. Starte die Anwendung: `npm run dev`
2. Gehe zu `/register`
3. Registriere einen neuen Benutzer mit Vor- und Nachname
4. Überprüfe in Supabase Dashboard > Table Editor > user_profiles, ob der Eintrag erstellt wurde

### 5. Funktionalität:

-   ✅ **Registrierung**: Vor- und Nachname sind Pflichtfelder
-   ✅ **Automatische Profile**: Bei Registrierung wird automatisch ein Profil erstellt
-   ✅ **Echte Namen in Fahrten**: Fahrer- und Mitfahrernamen werden angezeigt
-   ✅ **Sicherheit**: RLS schützt persönliche Daten

### 6. Troubleshooting:

Falls Probleme auftreten:

1. Überprüfe die Supabase-Logs im Dashboard
2. Stelle sicher, dass alle SQL-Befehle erfolgreich ausgeführt wurden
3. Überprüfe die RLS-Policies in der Supabase-Tabellenkonfiguration

