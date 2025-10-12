# 🔐 Passwort-Zurücksetzen Funktionalität

## 📋 Übersicht

Die Passwort-Zurücksetzen-Funktion ermöglicht es Benutzern, ihr Passwort zurückzusetzen, wenn sie es vergessen haben. Der Prozess verwendet Supabase's integrierte E-Mail-Authentifizierung.

## 🔄 Prozessablauf

1. **Passwort-Reset anfordern**
   - Benutzer klickt auf "Passwort vergessen?" auf der Login-Seite
   - Gibt seine E-Mail-Adresse ein
   - System sendet eine E-Mail mit einem Reset-Link

2. **E-Mail empfangen**
   - Benutzer erhält E-Mail mit einem sicheren Token-Link
   - Link ist zeitlich begrenzt gültig (normalerweise 1 Stunde)

3. **Neues Passwort festlegen**
   - Benutzer klickt auf den Link in der E-Mail
   - Wird zu `/reset-password-confirm` weitergeleitet
   - Gibt neues Passwort ein und bestätigt es
   - System aktualisiert das Passwort

4. **Fertig**
   - Benutzer wird zur Login-Seite weitergeleitet
   - Kann sich mit dem neuen Passwort anmelden

## 🗂️ Implementierte Dateien

### Frontend-Komponenten

- **`src/components/auth/AuthToggle.tsx`**
  - Erweiterter `LoginFormWithToggle` mit "Passwort vergessen?" Link
  - Neue `ResetPasswordForm` Komponente für die Reset-Anfrage
  - Toggle-Funktionalität zwischen Login, Register und Password-Reset

- **`src/pages/reset-password-confirm.tsx`**
  - Seite zum Festlegen des neuen Passworts
  - Validiert den Reset-Token aus der URL
  - Zeigt Erfolg/Fehler Feedback

### Backend-APIs

- **`src/pages/api/auth/reset-password.ts`**
  - Endpoint für Password-Reset Anfragen
  - Rate-limiting: 3 Anfragen pro 15 Minuten
  - Verhindert E-Mail-Enumeration (gibt immer Erfolg zurück)

### Hooks

- **`src/hooks/auth/usePasswordReset.tsx`**
  - `usePasswordReset()` - Hook für Reset-Anfragen
  - `usePasswordUpdate()` - Hook für Passwort-Updates
  - Zentrale State-Verwaltung für Reset-Flow

### Styles

- **`src/components/auth/Auth.module.css`**
  - Neue CSS-Klassen für "Passwort vergessen?" Link
  - `.forgotPasswordContainer` und `.forgotPasswordLink`

## 🔧 Konfiguration

### Environment-Variablen

In `.env.local` oder `.env.production`:

```bash
# Für Password-Reset Redirects (WICHTIG!)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"  # Lokal
# NEXT_PUBLIC_SITE_URL="https://deine-domain.de"  # Produktion

# Supabase (bereits vorhanden)
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
```

> **⚠️ Wichtig:** `NEXT_PUBLIC_SITE_URL` muss auf die richtige Domain gesetzt sein, damit der Reset-Link funktioniert!

## 🧪 Testen

### Lokale Entwicklung

1. **Supabase E-Mail-Konfiguration prüfen**
   ```bash
   # Supabase lokal starten
   npm run supabase:start
   
   # InBucket öffnen (lokaler E-Mail-Fänger)
   # Meist auf http://localhost:54324
   ```

2. **Password-Reset testen**
   ```bash
   # App starten
   npm run dev:local
   
   # Navigiere zu http://localhost:3000/login
   # Klicke auf "Passwort vergessen?"
   # Gib eine E-Mail-Adresse ein
   # Öffne InBucket und klicke auf den Link in der E-Mail
   ```

3. **Reset-Link funktioniert nicht?**
   - Prüfe ob `NEXT_PUBLIC_SITE_URL` gesetzt ist
   - Prüfe Supabase-Logs: `npm run supabase:logs`
   - Prüfe Browser-Konsole für Fehler

### Produktion

1. **E-Mail-Provider konfigurieren**
   - In Supabase Dashboard → Authentication → Email Templates
   - SMTP-Settings konfigurieren (oder Supabase's Standard-Mailer verwenden)

2. **Domain konfigurieren**
   ```bash
   NEXT_PUBLIC_SITE_URL="https://deine-domain.de"
   ```

3. **Redirect-URLs in Supabase**
   - Supabase Dashboard → Authentication → URL Configuration
   - Füge `https://deine-domain.de/reset-password-confirm` zu "Redirect URLs" hinzu

## 🔒 Sicherheitsmerkmale

### Rate Limiting
- **3 Anfragen pro 15 Minuten** pro IP-Adresse
- Verhindert Spam und Missbrauch

### E-Mail-Enumeration-Schutz
- API gibt immer "Erfolg" zurück
- Verhindert, dass Angreifer herausfinden können, welche E-Mails registriert sind

### Token-Sicherheit
- Reset-Tokens sind einmalig verwendbar
- Automatisches Ablaufen nach 1 Stunde
- Tokens werden von Supabase sicher verwaltet

### Passwort-Validierung
- Mindestlänge: 6 Zeichen
- Passwort-Bestätigung erforderlich
- Client- und serverseitige Validierung

## 🎨 Benutzeroberfläche

### "Passwort vergessen?" Link
- Erscheint unter dem Passwort-Feld auf der Login-Seite
- Rechtsbündig ausgerichtet
- Accent-Farbe mit Hover-Effekt

### Reset-Anfrage Formular
- Einfaches E-Mail-Feld
- Klare Anweisungen
- Erfolgs-Feedback nach dem Absenden

### Passwort-Bestätigung Seite
- Zwei Passwort-Felder (neu + bestätigen)
- Echtzeit-Validierung
- Automatische Weiterleitung nach Erfolg

## 🐛 Troubleshooting

### "Ungültiger oder abgelaufener Link"
- Token ist abgelaufen (> 1 Stunde)
- Token wurde bereits verwendet
- **Lösung:** Neuen Reset-Link anfordern

### "E-Mail wurde nicht empfangen"
- **Lokal:** Prüfe InBucket (http://localhost:54324)
- **Produktion:** Prüfe Spam-Ordner, SMTP-Konfiguration

### "Redirect funktioniert nicht"
- `NEXT_PUBLIC_SITE_URL` nicht gesetzt
- Redirect URL nicht in Supabase konfiguriert
- **Lösung:** Environment-Variable setzen und Supabase-Konfiguration prüfen

### "Rate Limit erreicht"
- Zu viele Anfragen in kurzer Zeit
- **Lösung:** 15 Minuten warten oder Rate-Limit in Code anpassen

## 📝 API-Dokumentation

### POST /api/auth/reset-password

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Wenn ein Konto mit dieser E-Mail-Adresse existiert, wurde eine E-Mail zum Zurücksetzen des Passworts versendet."
}
```

**Response (Error):**
```json
{
  "error": "E-Mail-Adresse ist erforderlich"
}
```

**Rate Limiting:**
- 429 Too Many Requests wenn Limit überschritten

## 🚀 Zukünftige Erweiterungen

Mögliche Verbesserungen:

- [ ] Customizable E-Mail-Templates
- [ ] Passwort-Stärke-Anzeige
- [ ] 2FA-Integration
- [ ] Passwort-Historie (verhindert Wiederverwendung)
- [ ] Admin-Benachrichtigungen bei verdächtigen Reset-Anfragen
- [ ] Multi-Language Support für E-Mails

## 📚 Weitere Ressourcen

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Rate Limiting Best Practices](https://www.rfc-editor.org/rfc/rfc6585#section-4)

---

_Implementiert am: Oktober 2025_

