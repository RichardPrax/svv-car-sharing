// scripts/migrateFromSupabase.ts
/**
 * Migration script to move data from direct Supabase queries to Prisma
 * This script helps you migrate your existing data structure to the new Prisma-based approach
 */

import { supabase } from "../src/lib/supabaseClient";
import { prisma } from "../src/lib/prisma";
import { transformFromLegacy as transformUserProfile, LegacyUserProfile } from "../src/entities/UserProfile";
import { transformRideFromLegacy, transformRidePassengerFromLegacy, LegacyRide, LegacyRidePassenger } from "../src/entities/Ride";
import { transformMatchDayFromLegacy, LegacyMatchDay } from "../src/entities/MatchDay";

async function migrateUserProfiles() {
    console.log("Migrating user profiles...");

    // Fetch existing user profiles from Supabase
    const { data: legacyProfiles, error } = await supabase.from("user_profiles").select("*");

    if (error) {
        console.error("Error fetching user profiles:", error);
        return;
    }

    if (!legacyProfiles) {
        console.log("No user profiles found");
        return;
    }

    // Transform and insert into Prisma
    for (const legacy of legacyProfiles as LegacyUserProfile[]) {
        try {
            const transformed = transformUserProfile(legacy);
            await prisma.userProfile.upsert({
                where: { id: transformed.id },
                update: transformed,
                create: transformed,
            });
            console.log(`Migrated user profile: ${transformed.firstName} ${transformed.lastName}`);
        } catch (err) {
            console.error(`Error migrating user profile ${legacy.id}:`, err);
        }
    }
}

async function migrateMatchDays() {
    console.log("Migrating match days...");

    // Fetch existing match days from Supabase
    const { data: legacyMatchDays, error } = await supabase.from("match_days").select("*");

    if (error) {
        console.error("Error fetching match days:", error);
        return;
    }

    if (!legacyMatchDays) {
        console.log("No match days found");
        return;
    }

    // Transform and insert into Prisma
    for (const legacy of legacyMatchDays as LegacyMatchDay[]) {
        try {
            const transformed = transformMatchDayFromLegacy(legacy);
            await prisma.matchDay.upsert({
                where: { id: transformed.id },
                update: transformed,
                create: transformed,
            });
            console.log(`Migrated match day: ${transformed.opponent} on ${transformed.date.toDateString()}`);
        } catch (err) {
            console.error(`Error migrating match day ${legacy.id}:`, err);
        }
    }
}

async function migrateRides() {
    console.log("Migrating rides...");

    // Fetch existing rides from Supabase
    const { data: legacyRides, error } = await supabase.from("rides").select("*");

    if (error) {
        console.error("Error fetching rides:", error);
        return;
    }

    if (!legacyRides) {
        console.log("No rides found");
        return;
    }

    // Transform and insert into Prisma
    for (const legacy of legacyRides as LegacyRide[]) {
        try {
            const transformed = transformRideFromLegacy(legacy);
            await prisma.ride.upsert({
                where: { id: transformed.id },
                update: transformed,
                create: transformed,
            });
            console.log(`Migrated ride: ${transformed.departureLocation} at ${transformed.departureTime.toISOString()}`);
        } catch (err) {
            console.error(`Error migrating ride ${legacy.id}:`, err);
        }
    }
}

async function migrateRidePassengers() {
    console.log("Migrating ride passengers...");

    // Fetch existing ride passengers from Supabase
    const { data: legacyPassengers, error } = await supabase.from("ride_passengers").select("*");

    if (error) {
        console.error("Error fetching ride passengers:", error);
        return;
    }

    if (!legacyPassengers) {
        console.log("No ride passengers found");
        return;
    }

    // Transform and insert into Prisma
    for (const legacy of legacyPassengers as LegacyRidePassenger[]) {
        try {
            const transformed = transformRidePassengerFromLegacy(legacy);
            await prisma.ridePassenger.upsert({
                where: {
                    rideId_passengerId: {
                        rideId: transformed.rideId,
                        passengerId: transformed.passengerId,
                    },
                },
                update: transformed,
                create: transformed,
            });
            console.log(`Migrated ride passenger: ${transformed.passengerId} -> ${transformed.rideId}`);
        } catch (err) {
            console.error(`Error migrating ride passenger ${legacy.id}:`, err);
        }
    }
}

async function runMigration() {
    try {
        console.log("Starting migration from Supabase to Prisma...");

        // Run migrations in order (due to foreign key constraints)
        await migrateUserProfiles();
        await migrateMatchDays();
        await migrateRides();
        await migrateRidePassengers();

        console.log("Migration completed successfully!");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run migration if called directly
if (require.main === module) {
    runMigration();
}

export { runMigration };
