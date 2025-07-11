# 🔐 Auth-Setup für lokale Entwicklung

## Manuelle Einrichtung der Testbenutzer

Nach dem Ausführen von `npm run db:local:seed` müssen die Auth-Benutzer manuell im Supabase Dashboard angelegt werden.

### Warum manuell?

-   Die User-IDs von Supabase Auth und der UserProfile-Tabelle müssen exakt übereinstimmen
-   Supabase Auth generiert normalerweise automatisch UUIDs
-   Durch manuelle Eingabe können wir die gewünschten IDs setzen

### Anleitung

1. **Supabase Studio öffnen:**

    ```bash
    npm run db:local:studio
    ```

2. **Zu Authentication navigieren:**

    - Im linken Menü auf **"Authentication"** klicken
    - Dann auf **"Users"** klicken

3. **Testbenutzer erstellen:**

    **Benutzer 1:**

    - User ID: `550e8400-e29b-41d4-a716-446655440001`
    - Email: `max@test.com`
    - Password: `password123`
    - Email Confirm: ✅

    **Benutzer 2:**

    - User ID: `550e8400-e29b-41d4-a716-446655440002`
    - Email: `anna@test.com`
    - Password: `password123`
    - Email Confirm: ✅

### Verifikation

Nach dem Anlegen der Auth-Benutzer kannst du dich in der Anwendung anmelden:

-   `http://localhost:3000/login`

Die User-IDs in der `auth.users` Tabelle sollten mit denen in der `user_profiles` Tabelle übereinstimmen.

