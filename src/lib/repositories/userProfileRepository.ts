// src/lib/repositories/userProfileRepository.ts
import { prisma } from "../prisma";
import { UserProfile } from "../../entities/UserProfile";
import { UserRole } from "@prisma/client";

export class UserProfileRepository {
    // Get all user profiles
    async findAll(): Promise<UserProfile[]> {
        return await prisma.userProfile.findMany({
            orderBy: { firstName: "asc" },
        });
    }

    // Get user profile by ID
    async findById(id: string): Promise<UserProfile | null> {
        return await prisma.userProfile.findUnique({
            where: { id },
        });
    }

    // Get multiple user profiles by IDs
    async findByIds(ids: string[]): Promise<UserProfile[]> {
        return await prisma.userProfile.findMany({
            where: { id: { in: ids } },
            orderBy: { firstName: "asc" },
        });
    }

    // Get user profile with rides
    async findByIdWithRides(id: string) {
        return await prisma.userProfile.findUnique({
            where: { id },
            include: {
                drivenRides: {
                    include: {
                        matchDay: true,
                        passengers: {
                            include: {
                                passenger: true,
                            },
                        },
                    },
                },
                ridePassengers: {
                    include: {
                        ride: {
                            include: {
                                matchDay: true,
                                driver: true,
                            },
                        },
                    },
                },
            },
        });
    }

    // Create new user profile
    async create(data: Omit<UserProfile, "id" | "createdAt" | "updatedAt">): Promise<UserProfile> {
        return await prisma.userProfile.create({
            data,
        });
    }

    // Update user profile
    async update(id: string, data: Partial<Omit<UserProfile, "id" | "createdAt" | "updatedAt">>): Promise<UserProfile> {
        return await prisma.userProfile.update({
            where: { id },
            data,
        });
    }

    // Update user role (admin only)
    async updateRole(id: string, role: UserRole): Promise<UserProfile> {
        return await prisma.userProfile.update({
            where: { id },
            data: { role },
        });
    }

    // Delete user profile
    async delete(id: string): Promise<UserProfile> {
        return await prisma.userProfile.delete({
            where: { id },
        });
    }

    // Search users by name
    async searchByName(searchTerm: string): Promise<UserProfile[]> {
        return await prisma.userProfile.findMany({
            where: {
                OR: [{ firstName: { contains: searchTerm, mode: "insensitive" } }, { lastName: { contains: searchTerm, mode: "insensitive" } }],
            },
            orderBy: { firstName: "asc" },
        });
    }
}

