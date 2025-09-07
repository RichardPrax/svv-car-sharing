import { Training } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class TrainingRepository {
    private prisma = prisma;

    /**
     * Find all trainings ordered by date (newest first)
     */
    async findAll(): Promise<Training[]> {
        return this.prisma.training.findMany({
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
            where: { id }
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
