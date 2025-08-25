const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding lokale Datenbank...");

    await prisma.ridePassenger.deleteMany();
    await prisma.ride.deleteMany();
    await prisma.userProfile.deleteMany();
    await prisma.matchDay.deleteMany();

    console.log("ℹ️  Testdatea will be created by special import scripts");

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

