# PWA (Progressive Web App) Setup

Die SVV Team Manager App ist als Progressive Web App (PWA) konfiguriert. Das bedeutet, dass Benutzer die App auf ihren Geräten installieren können, als wäre es eine native App.

## Features

✅ **Installierbar**: Benutzer können die App auf ihrem Home-Screen installieren
✅ **Offline-Unterstützung**: Service Worker für bessere Performance
✅ **App-ähnliches Erlebnis**: Vollbildmodus ohne Browser-UI
✅ **Schnelles Laden**: Caching-Strategien für bessere Performance
✅ **Cross-Platform**: Funktioniert auf iOS, Android und Desktop

## Konfiguration

### Manifest (`public/manifest.json`)

Das Web App Manifest definiert, wie die App auf dem Gerät erscheint:

- **Name**: "SVV Team Manager"
- **Short Name**: "SVV Manager"
- **Theme Color**: #0070f3 (Blau)
- **Display Mode**: Standalone (Vollbild ohne Browser-UI)
- **Start URL**: / (Startseite)

### Icons

Die App benötigt Icons in verschiedenen Größen. Aktuell verwendest du Platzhalter-Icons.

**TODO: Erstelle professionelle Icons mit dem SVV-Logo**

Benötigte Größen:
- 192x192px
- 256x256px
- 384x384px
- 512x512px

#### Icons erstellen

1. **Option 1: Online Tool verwenden**
   - Gehe zu [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
   - Lade dein SVV-Logo hoch (mindestens 512x512px)
   - Lade die generierten Icons herunter
   - Ersetze die Dateien in `/public/`

2. **Option 2: Platzhalter generieren**
   - Öffne `http://localhost:3000/generate-icons.html` im Browser
   - Lade die generierten Icons herunter
   - Speichere sie im `/public/` Ordner

### Service Worker

Der Service Worker wird automatisch von `next-pwa` generiert:

- **Entwicklung**: Deaktiviert (für einfacheres Debugging)
- **Produktion**: Aktiviert mit automatischem Caching
- **Dateien**: `public/sw.js` (wird automatisch generiert und ist in .gitignore)

### Next.js Konfiguration

In `next.config.ts` ist next-pwa konfiguriert:

```typescript
withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    reloadOnOnline: true,
    scope: "/",
    sw: "sw.js",
})(nextConfig)
```

## Installation auf Geräten

### Desktop (Chrome/Edge)

1. Öffne die App im Browser
2. Klicke auf das ➕ Icon in der Adressleiste
3. Wähle "Installieren"

### iOS (Safari)

1. Öffne die App in Safari
2. Tippe auf das Teilen-Icon
3. Scrolle runter und wähle "Zum Home-Bildschirm"
4. Bestätige mit "Hinzufügen"

### Android (Chrome)

1. Öffne die App in Chrome
2. Tippe auf das Menü (⋮)
3. Wähle "App installieren" oder "Zum Startbildschirm hinzufügen"

## Testing

### PWA Funktionalität testen

1. **Build erstellen**:
   ```bash
   npm run build
   npm run start
   ```

2. **Chrome DevTools öffnen**:
   - F12 → Application Tab
   - Überprüfe:
     - ✅ Manifest
     - ✅ Service Worker
     - ✅ Icons
     - ✅ Installability

3. **Lighthouse Audit**:
   - F12 → Lighthouse Tab
   - "Progressive Web App" auswählen
   - "Generate report"
   - Ziel: Score > 90

### Offline-Funktionalität testen

1. App im Browser öffnen
2. DevTools → Network Tab
3. "Offline" aktivieren
4. Seite neu laden
5. Offline-Fallback-Seite sollte erscheinen

## Deployment

### Vercel

PWA funktioniert automatisch auf Vercel nach dem Deployment:

```bash
npm run build:production
# oder
vercel deploy --prod
```

### Wichtig für Produktion

- [ ] Icons mit SVV-Logo erstellen
- [ ] Theme-Farbe anpassen (falls gewünscht)
- [ ] Screenshots für App-Stores hinzufügen (optional)
- [ ] Manifest-Beschreibung anpassen
- [ ] PWA-Lighthouse-Score überprüfen (Ziel: >90)

## Troubleshooting

### Service Worker wird nicht registriert

- Cache leeren: DevTools → Application → Clear Storage
- Hard Reload: Strg+Shift+R (Cmd+Shift+R auf Mac)
- Inkognito-Fenster verwenden

### Icons werden nicht angezeigt

- Dateinamen in `manifest.json` überprüfen
- Dateipfade überprüfen (relativ zu `/public/`)
- Browser-Cache leeren

### App kann nicht installiert werden

- HTTPS erforderlich (localhost ist OK für Testing)
- Manifest-Datei muss korrekt verlinkt sein
- Mindestens ein Icon muss vorhanden sein
- Service Worker muss registriert sein

## Nächste Schritte

1. **Icons erstellen**: Professionelle Icons mit SVV-Logo
2. **Screenshots hinzufügen**: Für bessere App-Store-Präsentation
3. **Caching-Strategie optimieren**: Für bessere Offline-Performance
4. **Push-Notifications**: Optional für wichtige Updates
5. **Background Sync**: Optional für Offline-Aktionen

## Ressourcen

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [next-pwa GitHub](https://github.com/shadowwalker/next-pwa)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
