#!/bin/bash

# PWA Icon Generator Script
# Dieses Script hilft dir, Platzhalter-Icons zu erstellen

echo "🎨 PWA Icon Generator"
echo "===================="
echo ""
echo "Du benötigst Icons in folgenden Größen:"
echo "  - 192x192px"
echo "  - 256x256px"
echo "  - 384x384px"
echo "  - 512x512px"
echo ""
echo "Optionen:"
echo ""
echo "1. Online-Tool verwenden (empfohlen):"
echo "   → https://www.pwabuilder.com/imageGenerator"
echo "   → Lade dein SVV-Logo hoch (min. 512x512px)"
echo "   → Lade alle Icons herunter und speichere sie in /public/"
echo ""
echo "2. Platzhalter im Browser generieren:"
echo "   → Starte die Dev-App: npm run dev"
echo "   → Öffne: http://localhost:3000/generate-icons.html"
echo "   → Lade die Icons herunter und speichere sie in /public/"
echo ""
echo "3. ImageMagick verwenden (wenn installiert):"
echo "   → Hast du ein SVV-Logo? (logo.png)"
read -p "   Pfad zum Logo eingeben (oder Enter zum Überspringen): " LOGO_PATH

if [ -n "$LOGO_PATH" ] && [ -f "$LOGO_PATH" ]; then
    echo "   📦 Generiere Icons..."
    
    # Überprüfe ob ImageMagick installiert ist
    if command -v convert &> /dev/null; then
        convert "$LOGO_PATH" -resize 192x192 public/icon-192x192.png
        convert "$LOGO_PATH" -resize 256x256 public/icon-256x256.png
        convert "$LOGO_PATH" -resize 384x384 public/icon-384x384.png
        convert "$LOGO_PATH" -resize 512x512 public/icon-512x512.png
        echo "   ✅ Icons erfolgreich erstellt!"
    else
        echo "   ❌ ImageMagick ist nicht installiert."
        echo "   Installiere es mit: apt-get install imagemagick (Linux)"
        echo "   oder: brew install imagemagick (Mac)"
    fi
else
    echo "   ⚠️  Kein Logo gefunden oder übersprungen."
fi

echo ""
echo "4. Node.js Script verwenden:"
echo "   → npm install -g sharp-cli"
echo "   → sharp -i logo.png -o public/icon-192x192.png resize 192 192"
echo ""
echo "📝 Nächste Schritte:"
echo "  1. Icons in /public/ platzieren"
echo "  2. App bauen: npm run build"
echo "  3. App starten: npm run start"
echo "  4. PWA testen: http://localhost:3000"
echo "  5. Chrome DevTools → Application → Manifest prüfen"
echo ""
