import { Training } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class TrainingRepository {
    private prisma = prisma;

    /**
     * Find all trainings ordered by date (newest first)
     */
    async findAll(): Promise<Training[]> {
        return this.prisma.training.findMany({
            include: {
                series: true
            },
            orderBy: {
                date: 'desc'
            }
        });
    }

    /**
     * Find training by ID
     */
    async findById(id: string): Promise<Training | null> {
        return this.prisma.training.findUnique({
            where: { id },
            include: {
                series: true
            }
        });
    }

    /**
     * Find next upcoming training
     */
    async findNextUpcoming(): Promise<Training | null> {
        const now = new Date();
        
        return this.prisma.training.findFirst({
            where: {
                date: {
                    gte: now
                }
            },
            include: {
                series: true
            },
            orderBy: {
                date: 'asc'
            }
        });
    }

    /**
     * Find trainings for a specific date range
     */
    async findByDateRange(startDate: Date, endDate: Date): Promise<Training[]> {
        return this.prisma.training.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                series: true
            },
            orderBy: {
                date: 'asc'
            }
        });
    }

    /**
     * Create a new training
     */
    async create(data: Omit<Training, "id" | "createdAt" | "updatedAt">): Promise<Training> {
        return this.prisma.training.create({
            data
        });
    }

    /**
     * Create multiple trainings
     */
    async createMultiple(data: Omit<Training, "id" | "createdAt" | "updatedAt">[]): Promise<Training[]> {
        const createdTrainings: Training[] = [];
        
        for (const trainingData of data) {
            const training = await this.prisma.training.create({
                data: trainingData
            });
            createdTrainings.push(training);
        }
        
        return createdTrainings;
    }

    /**
     * Update a training
     */
    async update(id: string, data: Partial<Omit<Training, "id" | "createdAt" | "updatedAt">>): Promise<Training> {
        return this.prisma.training.update({
            where: { id },
            data
        });
    }

    /**
     * Delete a training
     */
    async delete(id: string): Promise<Training> {
        return this.prisma.training.delete({
            where: { id }
        });
    }

    /**
     * Update all trainings in a series (only times, not dates)
     */
    async updateSeriesTrainings(seriesId: string, data: { startTime: string; endTime: string }): Promise<void> {
        await this.prisma.training.updateMany({
            where: { seriesId },
            data: {
                startTime: data.startTime,
                endTime: data.endTime
            }
        });
    }

    /**
     * Delete all trainings in a series
     */
    async deleteSeriesTrainings(seriesId: string): Promise<void> {
        await this.prisma.training.deleteMany({
            where: { seriesId }
        });
    }

    /**
     * Update future trainings in a series (from given date onwards)
     */
    async updateFutureSeriesTrainings(seriesId: string, fromDate: Date, data: { startTime: string; endTime: string }): Promise<void> {
        await this.prisma.training.updateMany({
            where: { 
                seriesId,
                date: {
                    gte: fromDate
                }
            },
            data: {
                startTime: data.startTime,
                endTime: data.endTime
            }
        });
    }

    /**
     * Delete future trainings in a series (from given date onwards)
     */
    async deleteFutureSeriesTrainings(seriesId: string, fromDate: Date): Promise<void> {
        await this.prisma.training.deleteMany({
            where: { 
                seriesId,
                date: {
                    gte: fromDate
                }
            }
        });
    }

    /**
     * Check if training exists
     */
    async exists(id: string): Promise<boolean> {
        const training = await this.prisma.training.findUnique({
            where: { id },
            select: { id: true }
        });
        return !!training;
    }
}
