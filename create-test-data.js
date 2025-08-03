const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Realistische Abfahrtsorte in Deutschland
const departureLocations = [
    "Hauptbahnhof",
    "Stadtzentrum",
    "Parkplatz am Sportplatz",
    "Vereinsheim",
    "Busbahnhof",
    "Marktplatz",
    "Rathaus",
    "Sporthalle",
    "Vereinsgelände",
    "Ortsmitte",
];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomTime(matchDate, hoursBeforeMatch = 2) {
    const matchDateTime = new Date(matchDate);
    const departureTime = new Date(matchDateTime);

    // Abfahrt zwischen 1-4 Stunden vor dem Spiel
    const hoursBefore = Math.random() * 3 + 1; // 1-4 Stunden
    departureTime.setHours(departureTime.getHours() - hoursBefore);

    // Auf 15-Minuten-Intervalle runden
    const minutes = Math.round(departureTime.getMinutes() / 15) * 15;
    departureTime.setMinutes(minutes);
    departureTime.setSeconds(0);

    return departureTime;
}

async function createRideTestData() {
    console.log("🚗 Creating ride test data with various scenarios...");

    // Hole alle Benutzer und Spieltage
    const users = await prisma.userProfile.findMany();
    const matchDays = await prisma.matchDay.findMany({
        orderBy: { date: "asc" },
    });

    if (users.length === 0) {
        console.error("❌ No users found! Please create users first.");
        return;
    }

    if (matchDays.length === 0) {
        console.error("❌ No match days found! Please import match data first.");
        return;
    }

    console.log(`Found ${users.length} users and ${matchDays.length} match days`);

    // Definiere verschiedene Szenarien für realistische Tests
    const scenarios = [
        {
            name: "Kein Interesse - keine Fahrgemeinschaften",
            ridesCount: 0,
            fillRate: 0,
            description: "Niemand bietet eine Fahrt an",
        },
        {
            name: "Wenig Interesse - nur leere Fahrten",
            ridesCount: 2,
            fillRate: 0,
            description: "Fahrer bieten Fahrten an, aber niemand fährt mit",
        },
        {
            name: "Hohe Nachfrage - nur volle Fahrten",
            ridesCount: 2,
            fillRate: 1.0,
            description: "Alle Fahrten sind komplett ausgebucht",
        },
        {
            name: "Gemischt - teilweise gefüllt",
            ridesCount: 3,
            fillRate: 0.5,
            description: "Manche Fahrten voll, manche halb leer",
        },
        {
            name: "Viele Angebote - verschiedene Füllgrade",
            ridesCount: 4,
            fillRate: 0.3,
            description: "Viele Fahrtangebote, unterschiedlich gefüllt",
        },
        {
            name: "Ein Fahrer allein",
            ridesCount: 1,
            fillRate: 0,
            description: "Nur eine Person bietet eine Fahrt an",
        },
        {
            name: "Optimale Auslastung",
            ridesCount: 2,
            fillRate: 0.8,
            description: "Gute Auslastung, aber noch Plätze frei",
        },
    ];

    for (let i = 0; i < matchDays.length; i++) {
        const matchDay = matchDays[i];
        // Zykliere durch die Szenarien
        const scenario = scenarios[i % scenarios.length];

        console.log(`\n🎯 Match ${i + 1}: ${matchDay.opponent} on ${matchDay.date.toISOString().split("T")[0]}`);
        console.log(`   Scenario: ${scenario.name}`);
        console.log(`   ${scenario.description}`);

        if (scenario.ridesCount === 0) {
            console.log("   ℹ️  No rides created for this match day");
            continue;
        }

        // Tracking für diesen Spieltag
        const usedUsers = new Set();
        const maxRides = Math.min(scenario.ridesCount, users.length);

        for (let rideIndex = 0; rideIndex < maxRides; rideIndex++) {
            // Verfügbare Fahrer
            const availableDrivers = users.filter((user) => !usedUsers.has(user.id));

            if (availableDrivers.length === 0) {
                console.log("   ⚠️  No more available drivers");
                break;
            }

            // Zufälligen verfügbaren Fahrer auswählen
            const driver = getRandomElement(availableDrivers);
            usedUsers.add(driver.id);

            // Realistische Abfahrtszeit generieren
            const departureTime = generateRandomTime(matchDay.date);

            // Zufälligen Abfahrtsort
            const departureLocation = getRandomElement(departureLocations);

            // Verfügbare Plätze (1-4)
            const availableSeats = getRandomInt(1, 4);

            try {
                const ride = await prisma.ride.create({
                    data: {
                        matchDayId: matchDay.id,
                        driverId: driver.id,
                        departureTime: departureTime,
                        departureLocation: departureLocation,
                        availableSeats: availableSeats,
                        additionalInfo: Math.random() > 0.7 ? "Bitte pünktlich sein!" : null,
                    },
                });

                console.log(
                    `   ✅ Ride ${rideIndex + 1}: ${driver.firstName} ${driver.lastName} from ${departureLocation} at ${departureTime.toLocaleTimeString("de-DE", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })} (${availableSeats} seats)`
                );

                // Mitfahrer basierend auf Szenario hinzufügen
                const availablePassengers = users.filter((user) => !usedUsers.has(user.id));
                let passengersCount = 0;

                if (scenario.fillRate > 0 && availablePassengers.length > 0) {
                    if (scenario.fillRate === 1.0) {
                        // Komplett voll
                        passengersCount = Math.min(availableSeats, availablePassengers.length);
                    } else {
                        // Prozentuale Füllung mit etwas Zufall
                        const targetFill = scenario.fillRate + (Math.random() - 0.5) * 0.4; // ±20% Variation
                        const maxPossible = Math.min(availableSeats, availablePassengers.length);
                        passengersCount = Math.max(0, Math.min(maxPossible, Math.floor(availableSeats * targetFill)));
                    }
                }

                if (passengersCount > 0) {
                    // Zufällige Mitfahrer auswählen
                    const shuffledPassengers = availablePassengers.sort(() => 0.5 - Math.random());
                    const selectedPassengers = shuffledPassengers.slice(0, passengersCount);

                    for (const passenger of selectedPassengers) {
                        try {
                            await prisma.ridePassenger.create({
                                data: {
                                    rideId: ride.id,
                                    passengerId: passenger.id,
                                },
                            });
                            usedUsers.add(passenger.id);
                            console.log(`      👤 Passenger: ${passenger.firstName} ${passenger.lastName}`);
                        } catch (error) {
                            console.error(`      ❌ Error adding passenger ${passenger.firstName} ${passenger.lastName}:`, error.message);
                        }
                    }

                    const remainingSeats = availableSeats - passengersCount;
                    if (remainingSeats > 0) {
                        console.log(`      🪑 ${remainingSeats} seat(s) still available`);
                    }
                } else {
                    console.log(`      🪑 ${availableSeats} seat(s) available - no passengers`);
                }
            } catch (error) {
                console.error(`   ❌ Error creating ride for ${matchDay.opponent}:`, error);
            }
        }

        const unusedCount = users.length - usedUsers.size;
        if (unusedCount > 0) {
            console.log(`   ℹ️  ${unusedCount} users not participating in rides for this match`);
        }
    }

    console.log("\n✅ Ride test data creation with various scenarios completed!");
    console.log("\n📊 Scenarios created:");
    scenarios.forEach((scenario, index) => {
        console.log(`   ${index + 1}. ${scenario.name}`);
    });
}

async function main() {
    try {
        console.log("🚗 Creating ride test data for existing users...");
        console.log("");

        // Hole alle bestehenden Benutzer
        const users = await prisma.userProfile.findMany();
        console.log(`Found ${users.length} existing users`);

        if (users.length === 0) {
            console.error("❌ No users found! Please run 'npm run auth:create-users' first.");
            process.exit(1);
        }

        // Erstelle nur Fahrgemeinschafts-Testdaten
        await createRideTestData();
        console.log("");

        // Zusammenfassung
        const userCount = await prisma.userProfile.count();
        const matchDayCount = await prisma.matchDay.count();
        const rideCount = await prisma.ride.count();
        const passengerCount = await prisma.ridePassenger.count();

        console.log("📊 Test data summary:");
        console.log(`  👥 Total users: ${userCount}`);
        console.log(`  ⚽ Total match days: ${matchDayCount}`);
        console.log(`  🚗 Total rides: ${rideCount}`);
        console.log(`  👤 Total passengers: ${passengerCount}`);
        console.log("");
        console.log("🎉 Ride test data creation completed successfully!");
        console.log("");
        console.log("ℹ️  All users were created via 'npm run auth:create-users'");
        console.log("📧 All test users have the password: test1234");
        console.log("📧 Email format: firstname.lastname@test.com");
    } catch (error) {
        console.error("❌ Error creating test data:", error);
        process.exit(1);
    }
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

