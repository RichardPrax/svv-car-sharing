const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding lokale Datenbank...");

    // Lösche bestehende Daten
    await prisma.ridePassenger.deleteMany();
    await prisma.ride.deleteMany();
    await prisma.userProfile.deleteMany();
    await prisma.matchDay.deleteMany();

    // Erstelle Testbenutzer 1
    const user1 = await prisma.userProfile.create({
        data: {
            id: "550e8400-e29b-41d4-a716-446655440001", // Feste UUID für Konsistenz
            firstName: "Max",
            lastName: "Mustermann",
        },
    });
    console.log("✅ Testnutzer 1 erstellt:", user1);

    // Erstelle Testbenutzer 2
    const user2 = await prisma.userProfile.create({
        data: {
            id: "550e8400-e29b-41d4-a716-446655440002", // Feste UUID für Konsistenz
            firstName: "Anna",
            lastName: "Schmidt",
        },
    });
    console.log("✅ Testnutzer 2 erstellt:", user2);

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

    // Erstelle eine Test-Mitfahrgelegenheit mit User 1 als Fahrer
    const ride = await prisma.ride.create({
        data: {
            matchDayId: matchDay.id,
            driverId: user1.id,
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
