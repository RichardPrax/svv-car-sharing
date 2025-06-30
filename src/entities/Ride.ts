// src/entities/Ride.ts

// Base types based on Prisma schema
export interface Ride {
    id: string;
    matchDayId: string;
    driverId: string;
    departureTime: Date;
    departureLocation: string;
    availableSeats: number;
    additionalInfo?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface RidePassenger {
    id: string;
    rideId: string;
    passengerId: string;
    joinedAt: Date;
}

export interface RideWithDetails extends Ride {
    driver?: unknown;
    matchDay?: unknown;
    passengers?: unknown[];
    passengerCount: number;
    passengerNames?: string[];
}

export interface RideWithDriverAndPassengers extends Ride {
    driver: unknown;
    passengers: unknown[];
}

// Helper function to calculate passenger count
export function getPassengerCount(ride: RideWithDetails): number {
    return Array.isArray(ride.passengers) ? ride.passengers.length : 0;
}

// Backwards compatibility types for migration period
export interface LegacyRide {
    id: string;
    match_day_id: string;
    driver_id: string;
    departure_time: string;
    departure_location: string;
    available_seats: number;
    additional_info?: string;
    created_at: string;
    updated_at: string;
}

export interface LegacyRidePassenger {
    id: string;
    ride_id: string;
    passenger_id: string;
    joined_at: string;
}

// Helper to transform from legacy format
export function transformRideFromLegacy(legacy: LegacyRide): Ride {
    return {
        id: legacy.id,
        matchDayId: legacy.match_day_id,
        driverId: legacy.driver_id,
        departureTime: new Date(legacy.departure_time),
        departureLocation: legacy.departure_location,
        availableSeats: legacy.available_seats,
        additionalInfo: legacy.additional_info,
        createdAt: new Date(legacy.created_at),
        updatedAt: new Date(legacy.updated_at),
    };
}

export function transformRidePassengerFromLegacy(legacy: LegacyRidePassenger): RidePassenger {
    return {
        id: legacy.id,
        rideId: legacy.ride_id,
        passengerId: legacy.passenger_id,
        joinedAt: new Date(legacy.joined_at),
    };
}
