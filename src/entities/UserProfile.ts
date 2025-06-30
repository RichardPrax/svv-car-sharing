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

// Transform function for creating display names
export function transformUserProfile(user: UserProfile): UserProfileWithName {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: getUserFullName(user),
    };
}
