const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding lokale Datenbank...");

    // Erstelle einen Testnutzer
    const user = await prisma.userProfile.create({
        data: {
            firstName: "Max",
            lastName: "Mustermann",
        },
    });
    console.log("✅ Testnutzer erstellt:", user);

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

    // Erstelle eine Test-Mitfahrgelegenheit
    const ride = await prisma.ride.create({
        data: {
            matchDayId: matchDay.id,
            driverId: user.id,
            departureTime: new Date("2025-07-15T14:00:00.000Z"),
            departureLocation: "Bahnhof",
            availableSeats: 3,
            additionalInfo: "Bitte pünktlich sein!",
        },
    });
    console.log("✅ Test-Mitfahrgelegenheit erstellt:", ride);

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
