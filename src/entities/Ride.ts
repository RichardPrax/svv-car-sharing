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
