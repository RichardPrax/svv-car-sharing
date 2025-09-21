const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding lokale Datenbank...");

    await prisma.ridePassenger.deleteMany();
    await prisma.ride.deleteMany();
    await prisma.userProfile.deleteMany();
    await prisma.matchDay.deleteMany();
    await prisma.training.deleteMany();

    console.log("ℹ️  Testdatea will be created by special import scripts");

    // Create 10 example trainings
    console.log("📝 Erstelle Beispiel-Trainings...");
    const now = new Date();
    const trainings = [];

    for (let i = 0; i < 10; i++) {
        const futureDate = new Date(now);
        futureDate.setDate(futureDate.getDate() + (i + 1) * 7); // Weekly trainings starting next week
        
        const training = await prisma.training.create({
            data: {
                date: futureDate,
                startTime: "19:00",
                endTime: "21:00"
            }
        });
        trainings.push(training);
    }

    console.log(`✅ ${trainings.length} Trainings erstellt`);
    console.log("🎉 Seeding abgeschlossen!");
}

main()
    .catch((e) => {
        console.error("❌ Fehler beim Seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

