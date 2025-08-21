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

// Realistische Mitbring-Items
const bringItems = [
    { name: "Bälle", description: "Trainingsbälle für die Aufwärmung" },
    { name: "Trikots", description: "Ersatztrikots in verschiedenen Größen" },
    { name: "Wasser", description: "Wasserflaschen für alle Spieler" },
    { name: "Erste-Hilfe-Kasten", description: "Für kleinere Verletzungen" },
    { name: "Hütchen", description: "Markierungshütchen für Aufwärmübungen" },
    { name: "Torwarthandschuhe", description: "Ersatzhandschuhe für den Torwart" },
    { name: "Isotonische Getränke", description: "Energy-Drinks für nach dem Spiel" },
    { name: "Handtücher", description: "Handtücher für die Spieler" },
    { name: "Tape", description: "Sporttape für Verletzungen" },
    { name: "Pfeifen", description: "Ersatzpfeifen für den Schiedsrichter" },
    { name: "Stutzen", description: "Ersatzstutzen" },
    { name: "Schienbeinschoner", description: "Ersatz-Schienbeinschoner" },
    { name: "Kühlpacks", description: "Kühlpacks für Verletzungen" },
    { name: "Mannschaftsliste", description: "Aufstellungsbögen und Spielerlisten" },
    { name: "Vereinsfahne", description: "Fahne zum Anfeuern" },
];

// Realistische Gründe für Absagen
const declineReasons = [
    "Beruflich verhindert",
    "Familienfeier",
    "Verletzung",
    "Krankheit",
    "Urlaub",
    "Prüfung",
    "Andere Verpflichtung",
    "Zu wenig trainiert",
    "Persönliche Gründe",
    "Arzttermin",
    "Hochzeit",
    "Umzug",
    "Arbeitsschicht",
    "Kinderbetreuung",
    "Anderes Spiel",
];

// Optionale Infos für Zusagen
const joinInfos = [
    "Komme etwas später",
    "Bringe einen Freund mit",
    "Bin sehr motiviert!",
    "Hoffe auf einen Sieg",
    "Freue mich aufs Spiel",
    null, // Oft keine Info
    null,
    null,
    "Bin pünktlich da",
    "Gebe alles!",
];

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

async function createGameParticipationTestData() {
    console.log("\n⚽ Creating game participation test data...");

    const users = await prisma.userProfile.findMany();
    const matchDays = await prisma.matchDay.findMany({
        orderBy: { date: "asc" },
    });

    if (users.length === 0 || matchDays.length === 0) {
        console.error("❌ No users or match days found!");
        return;
    }

    for (let i = 0; i < matchDays.length; i++) {
        const matchDay = matchDays[i];
        console.log(`\n🎯 Creating participation data for ${matchDay.opponent} on ${matchDay.date.toISOString().split("T")[0]}`);

        // Verschiedene Beteiligungsszenarien für realistische Tests
        const participationScenarios = [
            { joiningRate: 0.8, description: "Hohe Beteiligung" },
            { joiningRate: 0.5, description: "Mittlere Beteiligung" },
            { joiningRate: 0.3, description: "Niedrige Beteiligung" },
            { joiningRate: 0.9, description: "Sehr hohe Beteiligung" },
            { joiningRate: 0.6, description: "Gute Beteiligung" },
        ];

        const scenario = participationScenarios[i % participationScenarios.length];
        console.log(`   Scenario: ${scenario.description} (${(scenario.joiningRate * 100).toFixed(0)}% Zusagen)`);

        // Für jeden User entscheiden, ob er teilnimmt oder nicht
        for (const user of users) {
            // Manche User antworten gar nicht (20% Chance)
            if (Math.random() < 0.2) {
                console.log(`   ⏳ ${user.firstName} ${user.lastName}: Noch keine Antwort`);
                continue;
            }

            const isJoining = Math.random() < scenario.joiningRate;
            const status = isJoining ? "JOINING" : "DECLINING";

            let reason = null;
            if (isJoining && Math.random() < 0.3) {
                // 30% der Zusagen haben eine Info
                reason = getRandomElement(joinInfos);
            } else if (!isJoining) {
                // Absagen brauchen immer einen Grund
                reason = getRandomElement(declineReasons);
            }

            try {
                await prisma.gameParticipation.create({
                    data: {
                        matchDayId: matchDay.id,
                        playerId: user.id,
                        status: status,
                        reason: reason,
                    },
                });

                const statusIcon = isJoining ? "✅" : "❌";
                const reasonText = reason ? ` (${reason})` : "";
                console.log(`   ${statusIcon} ${user.firstName} ${user.lastName}: ${status}${reasonText}`);
            } catch (error) {
                console.error(`   ❌ Error creating participation for ${user.firstName} ${user.lastName}:`, error.message);
            }
        }

        // Statistik für diesen Spieltag
        const participations = await prisma.gameParticipation.findMany({
            where: { matchDayId: matchDay.id },
        });
        const joining = participations.filter((p) => p.status === "JOINING").length;
        const declining = participations.filter((p) => p.status === "DECLINING").length;
        const total = users.length;
        const noResponse = total - participations.length;

        console.log(`   📊 Ergebnis: ${joining} Zusagen, ${declining} Absagen, ${noResponse} keine Antwort (von ${total} Spielern)`);
    }

    console.log("\n✅ Game participation test data creation completed!");
}

async function createBringItemsTestData() {
    console.log("\n🎒 Creating bring items test data...");

    const users = await prisma.userProfile.findMany();
    const matchDays = await prisma.matchDay.findMany({
        orderBy: { date: "asc" },
    });

    if (users.length === 0 || matchDays.length === 0) {
        console.error("❌ No users or match days found!");
        return;
    }

    for (let i = 0; i < matchDays.length; i++) {
        const matchDay = matchDays[i];
        console.log(`\n🎯 Creating bring items for ${matchDay.opponent} on ${matchDay.date.toISOString().split("T")[0]}`);

        // Verschiedene Szenarien für Mitbring-Items
        const itemScenarios = [
            { itemsCount: 0, description: "Niemand bringt etwas mit" },
            { itemsCount: 2, description: "Wenige Items" },
            { itemsCount: 5, description: "Moderate Anzahl Items" },
            { itemsCount: 8, description: "Viele Items" },
            { itemsCount: 3, description: "Standard Items" },
        ];

        const scenario = itemScenarios[i % itemScenarios.length];
        console.log(`   Scenario: ${scenario.description} (${scenario.itemsCount} Items)`);

        if (scenario.itemsCount === 0) {
            console.log("   ℹ️  No items created for this match day");
            continue;
        }

        // Zufällige User auswählen, die Items mitbringen
        const shuffledUsers = users.sort(() => 0.5 - Math.random());
        const selectedUsers = shuffledUsers.slice(0, scenario.itemsCount);

        // Bereits vergebene Items tracken, um Duplikate zu vermeiden
        const usedItems = new Set();

        for (const user of selectedUsers) {
            // Verfügbare Items (noch nicht vergeben)
            const availableItems = bringItems.filter((item) => !usedItems.has(item.name));

            if (availableItems.length === 0) {
                console.log(`   ⚠️  No more unique items available`);
                break;
            }

            const selectedItem = getRandomElement(availableItems);
            usedItems.add(selectedItem.name);

            try {
                await prisma.bringItem.create({
                    data: {
                        matchDayId: matchDay.id,
                        userId: user.id,
                        itemName: selectedItem.name,
                        description: selectedItem.description,
                    },
                });

                console.log(`   📦 ${user.firstName} ${user.lastName}: ${selectedItem.name}`);
                console.log(`      └─ ${selectedItem.description}`);
            } catch (error) {
                console.error(`   ❌ Error creating bring item for ${user.firstName} ${user.lastName}:`, error.message);
            }
        }
    }

    console.log("\n✅ Bring items test data creation completed!");
}

async function main() {
    try {
        console.log("🎯 Creating comprehensive test data for existing users...");
        console.log("");

        // Hole alle bestehenden Benutzer
        const users = await prisma.userProfile.findMany();
        console.log(`Found ${users.length} existing users`);

        if (users.length === 0) {
            console.error("❌ No users found! Please run 'npm run auth:create-users' first.");
            process.exit(1);
        }

        // Erstelle alle Arten von Testdaten
        await createRideTestData();
        await createGameParticipationTestData();
        await createBringItemsTestData();

        console.log("");

        // Zusammenfassung
        const userCount = await prisma.userProfile.count();
        const matchDayCount = await prisma.matchDay.count();
        const rideCount = await prisma.ride.count();
        const passengerCount = await prisma.ridePassenger.count();
        const participationCount = await prisma.gameParticipation.count();
        const bringItemCount = await prisma.bringItem.count();

        console.log("📊 Comprehensive test data summary:");
        console.log(`  👥 Total users: ${userCount}`);
        console.log(`  ⚽ Total match days: ${matchDayCount}`);
        console.log(`  🚗 Total rides: ${rideCount}`);
        console.log(`  👤 Total passengers: ${passengerCount}`);
        console.log(`  ⚽ Total game participations: ${participationCount}`);
        console.log(`  📦 Total bring items: ${bringItemCount}`);
        console.log("");
        console.log("🎉 All test data creation completed successfully!");
        console.log("");
        console.log("ℹ️  All users were created via 'npm run auth:create-users'");
        console.log("📧 All test users have the password: test1234");
        console.log("📧 Email format: firstname.lastname@test.com");
        console.log("");
        console.log("🎯 Test data includes:");
        console.log("  • Diverse ride scenarios (empty, full, mixed participation)");
        console.log("  • Realistic game participation (joining/declining with reasons)");
        console.log("  • Various bring items for matches");
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

