const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Helper function to get week start (Monday) for a given date
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    return new Date(d.setDate(diff));
}

// Helper function to generate training dates for a series
function generateTrainingDatesForSeries(seriesData) {
    const dates = [];
    const startWeek = getWeekStart(seriesData.startWeek);
    const endWeek = getWeekStart(seriesData.endWeek);
    
    const currentWeek = new Date(startWeek);
    
    while (currentWeek <= endWeek) {
        // For each weekday in the series
        for (const weekday of seriesData.weekdays) {
            const trainingDate = new Date(currentWeek);
            trainingDate.setDate(currentWeek.getDate() + weekday - 1); // weekday: 1=Monday, 7=Sunday
            
            // Only add if within our date range
            if (trainingDate >= seriesData.startWeek && trainingDate <= new Date(seriesData.endWeek.getTime() + 6 * 24 * 60 * 60 * 1000)) {
                dates.push(new Date(trainingDate));
            }
        }
        
        // Move to next week
        currentWeek.setDate(currentWeek.getDate() + 7);
    }
    
    return dates.sort((a, b) => a.getTime() - b.getTime());
}

async function createTrainingSeries() {
    console.log("🏐 Creating training series for local development...");

    try {
        // Clean up existing training series and their trainings
        console.log("🧹 Cleaning up existing training series and trainings...");
        await prisma.training.deleteMany({
            where: {
                seriesId: {
                    not: null
                }
            }
        });
        await prisma.trainingSeries.deleteMany();

        const now = new Date();
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);

        // Training Series 1: Weekday Evening Training (Tuesday & Thursday)
        console.log("\n📅 Creating Training Series 1: Wochentags-Training (Dienstag & Donnerstag)");
        const series1StartWeek = getWeekStart(nextWeek);
        const series1EndWeek = new Date(series1StartWeek);
        series1EndWeek.setDate(series1EndWeek.getDate() + (6 * 7)); // 6 weeks

        const series1Data = {
            name: "Wochentags-Training",
            description: "Regelmäßiges Training für alle Spieler - Dienstag und Donnerstag Abends",
            weekdays: [2, 4], // Tuesday and Thursday
            startTime: "19:00",
            endTime: "21:00",
            startWeek: series1StartWeek,
            endWeek: series1EndWeek,
        };

        const series1 = await prisma.trainingSeries.create({
            data: series1Data
        });

        console.log(`✅ Training Series 1 created: ${series1.name}`);
        console.log(`   📍 Schedule: Dienstag & Donnerstag, 19:00-21:00`);
        console.log(`   📅 Duration: ${series1StartWeek.toISOString().split('T')[0]} bis ${series1EndWeek.toISOString().split('T')[0]}`);

        // Generate and create trainings for series 1
        const series1Dates = generateTrainingDatesForSeries(series1Data);
        console.log(`   🗓️  Generating ${series1Dates.length} training sessions...`);

        for (const date of series1Dates) {
            await prisma.training.create({
                data: {
                    date: date,
                    startTime: series1Data.startTime,
                    endTime: series1Data.endTime,
                    seriesId: series1.id,
                }
            });
        }

        console.log(`   ✅ Created ${series1Dates.length} training sessions for Series 1`);

        // Training Series 2: Weekend Intensive Training (Saturday mornings)
        console.log("\n📅 Creating Training Series 2: Wochenend-Training (Samstag Vormittag)");
        const series2StartWeek = getWeekStart(nextWeek);
        const series2EndWeek = new Date(series2StartWeek);
        series2EndWeek.setDate(series2EndWeek.getDate() + (4 * 7)); // 4 weeks

        const series2Data = {
            name: "Wochenend-Training",
            description: "Intensives Training am Wochenende - Samstag Vormittag für Technik und Taktik",
            weekdays: [6], // Saturday
            startTime: "10:00",
            endTime: "12:00",
            startWeek: series2StartWeek,
            endWeek: series2EndWeek,
        };

        const series2 = await prisma.trainingSeries.create({
            data: series2Data
        });

        console.log(`✅ Training Series 2 created: ${series2.name}`);
        console.log(`   📍 Schedule: Samstag, 10:00-12:00`);
        console.log(`   📅 Duration: ${series2StartWeek.toISOString().split('T')[0]} bis ${series2EndWeek.toISOString().split('T')[0]}`);

        // Generate and create trainings for series 2
        const series2Dates = generateTrainingDatesForSeries(series2Data);
        console.log(`   🗓️  Generating ${series2Dates.length} training sessions...`);

        for (const date of series2Dates) {
            await prisma.training.create({
                data: {
                    date: date,
                    startTime: series2Data.startTime,
                    endTime: series2Data.endTime,
                    seriesId: series2.id,
                }
            });
        }

        console.log(`   ✅ Created ${series2Dates.length} training sessions for Series 2`);

        // Create individual trainings (not part of any series)
        console.log("\n📅 Creating individual trainings (not part of any series)...");
        
        const individualTrainings = [
            {
                name: "Technik-Workshop",
                date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                startTime: "18:00",
                endTime: "20:00"
            },
            {
                name: "Konditions-Training",
                date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
                startTime: "17:30",
                endTime: "19:30"
            },
            {
                name: "Taktik-Schulung",
                date: new Date(now.getTime() + 17 * 24 * 60 * 60 * 1000), // 17 days from now
                startTime: "19:00",
                endTime: "21:30"
            },
            {
                name: "Freundschaftsspiel Vorbereitung",
                date: new Date(now.getTime() + 24 * 24 * 60 * 60 * 1000), // 24 days from now
                startTime: "18:30",
                endTime: "20:30"
            },
            {
                name: "Regenerations-Training",
                date: new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000), // 31 days from now
                startTime: "19:00",
                endTime: "20:30"
            }
        ];

        for (const trainingData of individualTrainings) {
            const training = await prisma.training.create({
                data: {
                    date: trainingData.date,
                    startTime: trainingData.startTime,
                    endTime: trainingData.endTime,
                    // seriesId is null for individual trainings
                }
            });
            
            console.log(`   ✅ Created individual training: ${trainingData.name}`);
            console.log(`      📅 Date: ${trainingData.date.toISOString().split('T')[0]}`);
            console.log(`      ⏰ Time: ${trainingData.startTime} - ${trainingData.endTime}`);
        }

        console.log(`\n   ✅ Created ${individualTrainings.length} individual training sessions`);

        // Summary
        const totalSeries = await prisma.trainingSeries.count();
        const totalTrainings = await prisma.training.count();
        const seriesTrainings = await prisma.training.count({
            where: {
                seriesId: {
                    not: null
                }
            }
        });

        console.log("\n📊 Training Series Summary:");
        console.log(`   🏐 Total training series: ${totalSeries}`);
        console.log(`   📅 Total trainings: ${totalTrainings}`);
        console.log(`   🔗 Trainings in series: ${seriesTrainings}`);
        console.log(`   📝 Individual trainings: ${totalTrainings - seriesTrainings}`);

        console.log("\n🎉 Training series creation completed successfully!");
        console.log("\n📋 Created Training Series:");
        console.log("   1. Wochentags-Training (Di & Do, 19:00-21:00) - 6 Wochen");
        console.log("   2. Wochenend-Training (Sa, 10:00-12:00) - 4 Wochen");
        console.log("\n📝 Created Individual Trainings:");
        console.log("   1. Technik-Workshop (18:00-20:00)");
        console.log("   2. Konditions-Training (17:30-19:30)");
        console.log("   3. Taktik-Schulung (19:00-21:30)");
        console.log("   4. Freundschaftsspiel Vorbereitung (18:30-20:30)");
        console.log("   5. Regenerations-Training (19:00-20:30)");

    } catch (error) {
        console.error("❌ Error creating training series:", error);
        throw error;
    }
}

async function main() {
    try {
        await createTrainingSeries();
    } catch (error) {
        console.error("❌ Script failed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
