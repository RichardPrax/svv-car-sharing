// src/lib/repositories/rideRepository.ts
import { prisma } from "../prisma";
import { Ride, RidePassenger } from "../../entities/Ride";

export class RideRepository {
    // Get all rides with details
    async findAllWithDetails() {
        return await prisma.ride.findMany({
            include: {
                driver: true,
                matchDay: true,
                passengers: {
                    include: {
                        passenger: true,
                    },
                },
            },
            orderBy: { departureTime: "asc" },
        });
    }

    // Get rides by match day
    async findByMatchDay(matchDayId: string) {
        return await prisma.ride.findMany({
            where: { matchDayId },
            include: {
                driver: true,
                passengers: {
                    include: {
                        passenger: true,
                    },
                },
            },
            orderBy: { departureTime: "asc" },
        });
    }

    // Get ride by ID with details
    async findByIdWithDetails(id: string) {
        return await prisma.ride.findUnique({
            where: { id },
            include: {
                driver: true,
                matchDay: true,
                passengers: {
                    include: {
                        passenger: true,
                    },
                },
            },
        });
    }

    // Create new ride
    async create(data: Omit<Ride, "id" | "createdAt" | "updatedAt">): Promise<Ride> {
        return await prisma.ride.create({
            data,
        });
    }

    // Update ride
    async update(id: string, data: Partial<Omit<Ride, "id" | "createdAt" | "updatedAt">>): Promise<Ride> {
        return await prisma.ride.update({
            where: { id },
            data,
        });
    }

    // Delete ride
    async delete(id: string): Promise<Ride> {
        return await prisma.ride.delete({
            where: { id },
        });
    }

    // Add passenger to ride
    async addPassenger(rideId: string, passengerId: string): Promise<RidePassenger> {
        return await prisma.ridePassenger.create({
            data: {
                rideId,
                passengerId,
            },
        });
    }

    // Remove passenger from ride
    async removePassenger(rideId: string, passengerId: string): Promise<RidePassenger> {
        return await prisma.ridePassenger.delete({
            where: {
                rideId_passengerId: {
                    rideId,
                    passengerId,
                },
            },
        });
    }

    // Check if user is passenger of ride
    async isPassenger(rideId: string, passengerId: string): Promise<boolean> {
        const passenger = await prisma.ridePassenger.findUnique({
            where: {
                rideId_passengerId: {
                    rideId,
                    passengerId,
                },
            },
        });
        return !!passenger;
    }

    // Check if user is passenger in any ride for a specific match day
    async isPassengerInMatchDay(matchDayId: string, passengerId: string): Promise<boolean> {
        const passenger = await prisma.ridePassenger.findFirst({
            where: {
                passengerId,
                ride: {
                    matchDayId,
                },
            },
        });
        return !!passenger;
    }

    // Get rides where user is driver
    async findByDriver(driverId: string) {
        return await prisma.ride.findMany({
            where: { driverId },
            include: {
                matchDay: true,
                passengers: {
                    include: {
                        passenger: true,
                    },
                },
            },
            orderBy: { departureTime: "asc" },
        });
    }

    // Get rides where user is passenger
    async findByPassenger(passengerId: string) {
        return await prisma.ridePassenger.findMany({
            where: { passengerId },
            include: {
                ride: {
                    include: {
                        driver: true,
                        matchDay: true,
                    },
                },
            },
        });
    }
}
