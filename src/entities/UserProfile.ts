// src/entities/UserProfile.ts
import { UserRole } from "@prisma/client";

// Re-export Prisma's UserRole for convenience
export { UserRole } from "@prisma/client";

// Volleyball positions enum (matching Prisma schema)
export enum VolleyballPosition {
    MB = "MB", // Mittelblock
    AA = "AA", // Außenannahme
    L = "L", // Libero
    Z = "Z", // Zuspiel
    D = "D", // Diagonal
}

// Volleyball position with metadata
export interface UserPosition {
    id: string;
    userId: string;
    position: VolleyballPosition;
    isPrimary: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Helper functions for position display
export const getPositionDisplayName = (position: VolleyballPosition): string => {
    switch (position) {
        case VolleyballPosition.MB:
            return "Mittelblock";
        case VolleyballPosition.AA:
            return "Außenannahme";
        case VolleyballPosition.L:
            return "Libero";
        case VolleyballPosition.Z:
            return "Zuspiel";
        case VolleyballPosition.D:
            return "Diagonal";
        default:
            return position;
    }
};

export const getPositionColor = (position: VolleyballPosition): string => {
    switch (position) {
        case VolleyballPosition.MB:
            return "#e74c3c"; // Rot
        case VolleyballPosition.AA:
            return "#3498db"; // Blau
        case VolleyballPosition.L:
            return "#f39c12"; // Orange
        case VolleyballPosition.Z:
            return "#2ecc71"; // Grün
        case VolleyballPosition.D:
            return "#9b59b6"; // Lila
        default:
            return "#95a5a6"; // Grau
    }
};

// Base UserProfile type based on Prisma schema
export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

// UserProfile with volleyball positions
export interface UserProfileWithPositions extends UserProfile {
    playerPositions: UserPosition[];
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

// Role hierarchy functions
export function getRoleHierarchyLevel(role: UserRole): number {
    switch (role) {
        case UserRole.ADMIN:
            return 4;
        case UserRole.TRAINER:
            return 3;
        case UserRole.PENALTY_MASTER:
            return 2;
        case UserRole.PLAYER:
            return 1;
        default:
            return 1; // Default to PLAYER level
    }
}

export function canAssignRole(currentUserRole: UserRole, targetRole: UserRole): boolean {
    const currentLevel = getRoleHierarchyLevel(currentUserRole);
    const targetLevel = getRoleHierarchyLevel(targetRole);
    return currentLevel >= targetLevel;
}

export function getAssignableRoles(currentUserRole: UserRole): UserRole[] {
    const currentLevel = getRoleHierarchyLevel(currentUserRole);
    return Object.values(UserRole)
        .filter((role) => {
            const roleLevel = getRoleHierarchyLevel(role);
            return roleLevel <= currentLevel;
        })
        .sort((a, b) => getRoleHierarchyLevel(b) - getRoleHierarchyLevel(a)); // Sort from highest to lowest level
}

