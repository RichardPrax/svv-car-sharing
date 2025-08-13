// src/entities/UserProfile.ts
import { UserRole } from "@prisma/client";

// Re-export Prisma's UserRole for convenience
export { UserRole } from "@prisma/client";

// Base UserProfile type based on Prisma schema
export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserProfileWithName {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    fullName: string;
}

// More specific types instead of unknown
export interface UserProfileWithRides extends UserProfile {
    drivenRides: BasicRide[];
    ridePassengers: RidePassengerRelation[];
}

export interface RidePassengerRelation {
    id: string;
    rideId: string;
    passengerId: string;
    joinedAt: Date;
    ride: BasicRide;
}

// Basic ride type to avoid circular dependency
interface BasicRide {
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

// Utility functions
export function getUserFullName(user: UserProfile): string {
    return `${user.firstName} ${user.lastName}`;
}

export function transformUserProfile(user: UserProfile): UserProfileWithName {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        fullName: getUserFullName(user),
    };
}

// Role utility functions
export function isAdmin(user: UserProfile | null | undefined): boolean {
    return user?.role === UserRole.ADMIN;
}

export function isTrainer(user: UserProfile | null | undefined): boolean {
    return user?.role === UserRole.TRAINER;
}

export function isPenaltyMaster(user: UserProfile | null | undefined): boolean {
    return user?.role === UserRole.PENALTY_MASTER;
}

export function hasAdminAccess(user: UserProfile | null | undefined): boolean {
    return isAdmin(user) || isTrainer(user);
}

