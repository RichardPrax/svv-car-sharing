// src/entities/MatchDay.ts

import { Ride } from "@prisma/client";

// Base MatchDay type based on Prisma schema
export interface MatchDay {
    id: string;
    date: Date;
    time: string;
    location: string;
    opponent: string;
}

export interface MatchDayWithRides extends MatchDay {
    rides: Ride[];
}

// Helper function to format date for display
export function formatMatchDate(matchDay: MatchDay): string {
    return matchDay.date.toLocaleDateString();
}

// Helper function to get match display info
export function getMatchDisplayInfo(matchDay: MatchDay): string {
    return `${formatMatchDate(matchDay)} ${matchDay.time} - vs ${matchDay.opponent}`;
}

// Backwards compatibility type for migration period
export interface LegacyMatchDay {
    id: string;
    date: string;
    time: string;
    location: string;
    opponent: string;
}

// Helper to transform from legacy format
export function transformMatchDayFromLegacy(legacy: LegacyMatchDay): MatchDay {
    return {
        id: legacy.id,
        date: new Date(legacy.date),
        time: legacy.time,
        location: legacy.location,
        opponent: legacy.opponent,
    };
}
