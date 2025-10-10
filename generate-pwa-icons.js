/**
 * Einfacher PWA Icon Generator
 * 
 * Verwendung:
 * 1. Platziere dein Logo als "logo.png" im Root-Verzeichnis
 * 2. Führe aus: node generate-pwa-icons.js
 * 3. Icons werden in /public/ erstellt
 * 
 * Alternativ ohne Logo (Platzhalter):
 * node generate-pwa-icons.js --placeholder
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 PWA Icon Generator');
console.log('====================\n');

const sizes = [192, 256, 384, 512];
const useplaceholder = process.argv.includes('--placeholder');

if (useplaceholder) {
    console.log('📝 Erstelle Platzhalter-Icons...\n');
    console.log('⚠️  WICHTIG: Dies sind nur Platzhalter!');
    console.log('   Erstelle professionelle Icons mit deinem SVV-Logo:\n');
    console.log('   Option 1: https://www.pwabuilder.com/imageGenerator');
    console.log('   Option 2: http://localhost:3000/generate-icons.html (nach "npm run dev")\n');
    
    sizes.forEach(size => {
        const filename = `public/icon-${size}x${size}.png`;
        console.log(`   ⏭️  Überspringe ${filename} (nutze Web-Generator)`);
    });
    
    console.log('\n📋 Nächste Schritte:');
    console.log('   1. npm run dev');
    console.log('   2. Öffne http://localhost:3000/generate-icons.html');
    console.log('   3. Lade die Icons herunter');
    console.log('   4. Speichere sie in /public/\n');
} else {
    const logoPath = path.join(__dirname, 'logo.png');
    
    if (!fs.existsSync(logoPath)) {
        console.log('❌ Fehler: logo.png nicht gefunden!\n');
        console.log('Bitte erstelle Icons mit einer dieser Methoden:\n');
        console.log('1. Online-Tool (empfohlen):');
        console.log('   → https://www.pwabuilder.com/imageGenerator\n');
        console.log('2. Browser-Tool:');
        console.log('   → npm run dev');
        console.log('   → http://localhost:3000/generate-icons.html\n');
        console.log('3. ImageMagick (wenn installiert):');
        console.log('   → convert logo.png -resize 192x192 public/icon-192x192.png');
        console.log('   → convert logo.png -resize 256x256 public/icon-256x256.png');
        console.log('   → convert logo.png -resize 384x384 public/icon-384x384.png');
        console.log('   → convert logo.png -resize 512x512 public/icon-512x512.png\n');
        process.exit(1);
    }
    
    console.log('📦 Logo gefunden! Verwende externes Tool zum Skalieren.\n');
    console.log('Empfehlung: https://www.pwabuilder.com/imageGenerator\n');
}

console.log('✅ Fertig!\n');
