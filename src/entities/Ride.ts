// src/entities/Ride.ts
import { UserProfile } from "./UserProfile";
import { MatchDay } from "./MatchDay";

// Base types based on Prisma schema
export interface Ride {
    id: string;
    matchDayId: string;
    driverId: string;
    departureTime: Date;
    departureLocation: string;
    availableSeats: number;
    additionalInfo: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface RidePassenger {
    id: string;
    rideId: string;
    passengerId: string;
    joinedAt: Date;
}

// Properly typed passenger with user profile
export interface RidePassengerWithProfile extends RidePassenger {
    passenger: UserProfile;
}

// Ride with complete driver and match day information
export interface RideWithDetails extends Ride {
    driver: UserProfile;
    matchDay: MatchDay;
    passengers: RidePassengerWithProfile[];
    passengerCount: number;
    passengerNames: string[];
    driverName: string;
}

// Simpler version for when we only need driver and passengers
export interface RideWithDriverAndPassengers extends Ride {
    driver: UserProfile;
    passengers: RidePassengerWithProfile[];
}

// API response type for creating/updating rides
export interface RideCreateData {
    matchDayId: string;
    driverId: string;
    departureTime: Date;
    departureLocation: string;
    availableSeats: number;
    additionalInfo: string | null;
}

export interface RideUpdateData {
    departureTime?: Date;
    departureLocation?: string;
    availableSeats?: number;
    additionalInfo?: string | null;
}

// Helper functions
export function getPassengerCount(ride: RideWithDetails): number {
    return ride.passengers.length;
}

export function getDriverName(ride: RideWithDetails): string {
    return `${ride.driver.firstName} ${ride.driver.lastName}`;
}

export function getPassengerNames(ride: RideWithDetails): string[] {
    return ride.passengers.map((p) => `${p.passenger.firstName} ${p.passenger.lastName}`);
}

export function isRideFull(ride: RideWithDetails): boolean {
    return ride.passengers.length >= ride.availableSeats;
}

export function isUserDriver(ride: RideWithDetails, userId: string): boolean {
    return ride.driverId === userId;
}

export function isUserPassenger(ride: RideWithDetails, userId: string): boolean {
    return ride.passengers.some((p) => p.passengerId === userId);
}

