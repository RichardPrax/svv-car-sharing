const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding lokale Datenbank...");

    // Lösche bestehende Daten
    await prisma.ridePassenger.deleteMany();
    await prisma.ride.deleteMany();
    await prisma.userProfile.deleteMany();
    await prisma.matchDay.deleteMany();

    // Note: User profiles will be created by the auth user creation script
    // to ensure IDs match between auth and database
    console.log("ℹ️  User profiles will be created by auth user creation script");

    // Erstelle einen Test-Spieltag
    const matchDay = await prisma.matchDay.create({
        data: {
            date: new Date("2025-07-15T15:00:00.000Z"),
            time: "15:00",
            location: "Vereinsgelände",
            opponent: "SV Testverein",
        },
    });
    console.log("✅ Test-Spieltag erstellt:", matchDay);

    // Note: Rides will be created after user profiles are created by auth script
    console.log("ℹ️  Rides will be created after user profiles are available");

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
