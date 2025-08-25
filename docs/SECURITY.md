# 🛡️ Security

## 🔒 Lokale Entwicklung

**Testumgebung**: Alle Passwörter sind `test1234` - **NUR für lokale Entwicklung!**

## 🛡️ Produktions-Sicherheit

**Wichtige Punkte:**

-   Nie Secrets in Git committen (.env.\* sind in .gitignore)
-   SUPABASE_SERVICE_ROLE_KEY nur serverseitig verwenden
-   RLS-Policies in Supabase konfigurieren
-   HTTPS in Produktion verwenden

## ⚡ Rate Limiting

**Implementierte Limits:**

-   **Auth-Endpunkte**: Max. 5 Versuche/Min, 10 Min Sperre
-   **API-Endpunkte**: Max. 30 Requests/Min, 5 Min Sperre
-   **User-Profile**: Max. 50 Requests/Min
-   **Automatische IP-Blockierung** nach 10 fehlgeschlagenen Versuchen

## 📋 Produktion Checklist

-   [ ] `.env.production` nicht in Git
-   [ ] Sichere Passwörter verwenden
-   [ ] HTTPS konfigurieren
-   [ ] Supabase RLS-Policies aktiv

---

_Für lokale Entwicklung: Security ist entspannt, alle Passwörter sind bekannt._

