const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.production" });

// Für Produktion - lädt .env.production
console.log("🌍 Production environment loaded");
console.log("🔗 Database URL:", process.env.DATABASE_URL ? "✅ Configured" : "❌ Missing");

const prisma = new PrismaClient();

async function importSpielplanProduction() {
    console.log("🚀 Importing match data to PRODUCTION database...");
    console.log("📂 Reading from spielplan.csv...");

    try {
        // Verbindung testen
        await prisma.$connect();
        console.log("✅ Connected to PRODUCTION database");
        
        // CSV-Datei lesen
        const csvPath = path.join(__dirname, "spielplan.csv");
        if (!fs.existsSync(csvPath)) {
            throw new Error("spielplan.csv file not found!");
        }

        const csvContent = fs.readFileSync(csvPath, "latin1");
        const lines = csvContent.split("\n");
        
        console.log(`📊 Found ${lines.length - 1} matches in CSV`);
        
        // Eigenes Team (für Heim-/Auswärtsspiele)
        const ownTeam = "SVV Weimar e.V. I";
        const matchDays = {};
        
        // CSV verarbeiten (Header überspringen)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(";").map(v => v.replace(/"/g, ""));
            
            const matchData = {
                date: values[0],        // Datum
                time: values[1],        // Uhrzeit
                team1: values[5],       // Mannschaft 1
                team2: values[6],       // Mannschaft 2
                location: values[10],   // Austragungsort
            };
            
            // Datum validieren
            if (!matchData.date || matchData.date === "Datum") {
                continue;
            }
            
            try {
                // Deutsches Datum parsen (DD.MM.YYYY)
                const [day, month, year] = matchData.date.split(".");
                const date = new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
                
                // Zeit parsen (HH:MM:SS)
                const time = matchData.time ? matchData.time.substring(0, 5) : "00:00";
                
                // Ort bereinigen
                const location = matchData.location || "TBD";
                
                // Eindeutigen Schlüssel erstellen
                const key = `${date.toISOString().split('T')[0]}_${time}_${location}`;
                
                if (matchData.team1 === ownTeam) {
                    // Heimspiel
                    if (key in matchDays) {
                        matchDays[key].opponents.push(matchData.team2);
                    } else {
                        matchDays[key] = {
                            date: date,
                            time: time,
                            location: location,
                            opponents: [matchData.team2]
                        };
                    }
                } else if (matchData.team2 === ownTeam) {
                    // Auswärtsspiel
                    matchDays[key] = {
                        date: date,
                        time: time,
                        location: location,
                        opponents: [matchData.team1]
                    };
                }
                
            } catch (error) {
                console.error(`❌ Error processing match ${matchData.date}:`, error.message);
            }
        }
        
        console.log(`🎯 Found ${Object.keys(matchDays).length} unique match days for SVV Weimar`);
        
        // Bestehende Daten prüfen
        const existingCount = await prisma.matchDay.count();
        if (existingCount > 0) {
            console.log(`⚠️  Found ${existingCount} existing match days in PRODUCTION database`);
            console.log("❓ Do you want to clear existing data? This will DELETE all current match days!");
            console.log("🗑️  Clearing existing match days...");
            await prisma.matchDay.deleteMany();
            console.log("✅ Cleared existing match days");
        }
        
        // Spieltage einfügen
        let insertedCount = 0;
        let errorCount = 0;
        
        for (const data of Object.values(matchDays)) {
            try {
                await prisma.matchDay.create({
                    data: {
                        date: data.date,
                        time: data.time,
                        location: data.location,
                        opponent: data.opponents.join(" / ")
                    }
                });
                
                console.log(`✅ Inserted: ${data.date.toISOString().split('T')[0]} - ${data.location} - ${data.opponents.join(" / ")}`);
                insertedCount++;
                
            } catch (error) {
                console.error(`❌ Error inserting match day:`, error.message);
                errorCount++;
            }
        }
        
        console.log("\n" + "=".repeat(60));
        console.log("🎉 PRODUCTION Import completed!");
        console.log(`✅ Successfully inserted: ${insertedCount} match days`);
        if (errorCount > 0) {
            console.log(`❌ Errors: ${errorCount}`);
        }
        console.log("💾 All changes saved to PRODUCTION database");
        console.log("🌍 Your production database is now updated with the latest match schedule!");
        console.log("=".repeat(60));
        
    } catch (error) {
        console.error("❌ Error during production import:", error.message);
        console.error("🔍 Check your .env.production file and database connection");
        process.exit(1);
    }
}

// Sicherheitscheck
console.log("⚠️  WARNING: This will import data to your PRODUCTION database!");
console.log("📋 Make sure your .env.production file is correctly configured");
console.log("🔄 Starting import in 3 seconds...");

setTimeout(() => {
    importSpielplanProduction()
        .catch((e) => {
            console.error("❌ Fatal error:", e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
            console.log("🔌 Database connection closed");
        });
}, 3000);
