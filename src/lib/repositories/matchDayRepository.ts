// src/lib/repositories/matchDayRepository.ts
import { prisma } from "../prisma";
import { MatchDay } from "../../entities/MatchDay";

export class MatchDayRepository {
    // Get all match days
    async findAll(): Promise<MatchDay[]> {
        return await prisma.matchDay.findMany({
            orderBy: { date: "asc" },
        });
    }

    // Get match day by ID
    async findById(id: string): Promise<MatchDay | null> {
        return await prisma.matchDay.findUnique({
            where: { id },
        });
    }

    // Get match day with rides
    async findByIdWithRides(id: string) {
        return await prisma.matchDay.findUnique({
            where: { id },
            include: {
                rides: {
                    include: {
                        driver: true,
                        passengers: {
                            include: {
                                passenger: true,
                            },
                        },
                    },
                    orderBy: { departureTime: "asc" },
                },
            },
        });
    }

    // get upcoming match days
    async findUpcoming(limit?: number) {
        const now = new Date();
        return await prisma.matchDay.findMany({
            where: {
                date: {
                    gte: now,
                },
            },
            orderBy: { date: "asc" },
            take: limit,
        });
    }

    // Get next match day
    async findNext(): Promise<MatchDay | null> {
        const upcoming = await this.findUpcoming(1);
        return upcoming[0] || null;
    }

    // Create new match day
    async create(data: Omit<MatchDay, "id">): Promise<MatchDay> {
        return await prisma.matchDay.create({
            data,
        });
    }

    // Update match day
    async update(id: string, data: Partial<Omit<MatchDay, "id">>): Promise<MatchDay> {
        return await prisma.matchDay.update({
            where: { id },
            data,
        });
    }

    // Delete match day
    async delete(id: string): Promise<MatchDay> {
        return await prisma.matchDay.delete({
            where: { id },
        });
    }

    // Get match days by date range
    async findByDateRange(startDate: Date, endDate: Date): Promise<MatchDay[]> {
        return await prisma.matchDay.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { date: "asc" },
        });
    }

    // Get match days for current month
    async findForCurrentMonth(): Promise<MatchDay[]> {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        return await this.findByDateRange(startOfMonth, endOfMonth);
    }
}

