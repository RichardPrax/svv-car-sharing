const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding lokale Datenbank...");

    await prisma.ridePassenger.deleteMany();
    await prisma.ride.deleteMany();
    await prisma.userProfile.deleteMany();
    await prisma.matchDay.deleteMany();
    await prisma.training.deleteMany();
    await prisma.trainingSeries.deleteMany();

    console.log("ℹ️  Test data will be created by special import scripts");
    console.log("ℹ️  Training series will be created by create-training-series.js");

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

