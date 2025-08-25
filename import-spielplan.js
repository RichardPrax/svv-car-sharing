const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function importSpielplan() {
    console.log("📅 Importing match data from spielplan.csv...");

    try {
        // Read the CSV file with proper encoding (like Python script)
        const csvPath = path.join(__dirname, "spielplan.csv");
        const csvContent = fs.readFileSync(csvPath, "latin1");
        
        // Parse CSV content (semicolon-separated)
        const lines = csvContent.split("\n");
        const headers = lines[0].split(";").map(h => h.replace(/"/g, ""));
        
        console.log(`Found ${lines.length - 1} matches to import`);
        
        // 🧠 Own team identification (for detecting home games)
        const ownTeam = "SVV Weimar e.V. I";
        
        // 🗃 Collect match days (like Python script)
        const matchDays = {};
        
        // Process each line (skip header)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(";").map(v => v.replace(/"/g, ""));
            
            // Map CSV columns to our data structure
            const matchData = {
                date: values[0],           // Datum
                time: values[1],           // Uhrzeit
                weekday: values[2],        // Wochentag
                matchNumber: values[3],    // #
                matchDay: values[4],       // ST
                team1: values[5],          // Mannschaft 1
                team2: values[6],          // Mannschaft 2
                referee: values[7],        // Schiedsgericht
                host: values[8],           // Gastgeber
                location: values[9],       // Austragungsort/Ergebnis
                venue: values[10],         // Austragungsort
                result: values[11],        // Ergebnis
                season: values[12],        // Saison
                round: values[13],         // Spielrunde
                gender: values[14],        // Geschlecht
            };
            
            // Skip if no date
            if (!matchData.date || matchData.date === "Datum") {
                continue;
            }
            
            try {
                // Parse German date format (DD.MM.YYYY)
                const [day, month, year] = matchData.date.split(".");
                const date = new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
                
                // Parse time (HH:MM:SS)
                const time = matchData.time ? matchData.time.split(":")[0] + ":" + matchData.time.split(":")[1] : "00:00";
                
                // Create location string
                const location = matchData.venue || matchData.location || "TBD";
                
                // Create unique key (like Python script)
                const key = `${date.toISOString().split('T')[0]}_${time}_${location}`;
                
                if (matchData.team1 === ownTeam) {
                    // Home game → multiple opponents possible
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
                } else {
                    // Away game → save individually
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
        
        console.log(`🎯 Found ${Object.keys(matchDays).length} unique match days`);
        
        // Check if we should clear existing data
        const existingCount = await prisma.matchDay.count();
        if (existingCount > 0) {
            console.log(`⚠️  Found ${existingCount} existing match days in database`);
            console.log("🗑️  Clearing existing match days...");
            await prisma.matchDay.deleteMany();
            console.log("✅ Cleared existing match days");
        }
        
        // 🚀 Insert match days into database
        let insertedCount = 0;
        let errorCount = 0;
        
        for (const data of Object.values(matchDays)) {
            try {
                const matchDay = await prisma.matchDay.create({
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
                console.error(`❌ Error inserting ${data}:`, error.message);
                errorCount++;
            }
        }
        
        console.log("\n" + "=".repeat(50));
        console.log("🎉 Import completed!");
        console.log(`✅ Successfully inserted: ${insertedCount}`);
        if (errorCount > 0) {
            console.log(`❌ Errors: ${errorCount}`);
        }
        console.log("💾 All changes saved to local database");
        console.log("=".repeat(50));
        
    } catch (error) {
        console.error("❌ Error reading spielplan.csv:", error.message);
        process.exit(1);
    }
}

importSpielplan()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 