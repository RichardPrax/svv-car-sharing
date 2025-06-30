// src/entities/UserProfile.ts

// Base UserProfile type based on Prisma schema
export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserProfileWithName {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
}

export interface UserProfileWithRides extends UserProfile {
    drivenRides: unknown[];
    ridePassengers: unknown[];
}

// Utility function to create full name
export function getUserFullName(user: UserProfile): string {
    return `${user.firstName} ${user.lastName}`;
}

// Transform function for compatibility with existing code
export function transformUserProfile(user: UserProfile): UserProfileWithName {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: getUserFullName(user),
    };
}

// Backwards compatibility types for migration period
export interface LegacyUserProfile {
    id: string;
    first_name: string;
    last_name: string;
    created_at: string;
    updated_at: string;
}

// Helper to transform from legacy format
export function transformFromLegacy(legacy: LegacyUserProfile): UserProfile {
    return {
        id: legacy.id,
        firstName: legacy.first_name,
        lastName: legacy.last_name,
        createdAt: new Date(legacy.created_at),
        updatedAt: new Date(legacy.updated_at),
    };
}
