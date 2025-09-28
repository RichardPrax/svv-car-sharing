import { TrainingSeries } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CreateTrainingSeriesData } from "@/entities/Training";

export class TrainingSeriesRepository {
    private prisma = prisma;

    /**
     * Find all training series ordered by creation date
     */
    async findAll(): Promise<TrainingSeries[]> {
        return this.prisma.trainingSeries.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                trainings: {
                    orderBy: {
                        date: 'asc'
                    }
                }
            }
        });
    }

    /**
     * Find training series by ID
     */
    async findById(id: string): Promise<TrainingSeries | null> {
        return this.prisma.trainingSeries.findUnique({
            where: { id },
            include: {
                trainings: {
                    orderBy: {
                        date: 'asc'
                    }
                }
            }
        });
    }

    /**
     * Find active training series (current and future)
     */
    async findActive(): Promise<TrainingSeries[]> {
        const now = new Date();
        
        return this.prisma.trainingSeries.findMany({
            where: {
                endWeek: {
                    gte: now
                }
            },
            orderBy: {
                startWeek: 'asc'
            },
            include: {
                trainings: {
                    orderBy: {
                        date: 'asc'
                    }
                }
            }
        });
    }

    /**
     * Create a new training series
     */
    async create(data: CreateTrainingSeriesData): Promise<TrainingSeries> {
        return this.prisma.trainingSeries.create({
            data: {
                name: data.name,
                description: data.description,
                weekdays: data.weekdays,
                startTime: data.startTime,
                endTime: data.endTime,
                startWeek: data.startWeek,
                endWeek: data.endWeek,
            }
        });
    }

    /**
     * Update a training series
     */
    async update(id: string, data: Partial<CreateTrainingSeriesData>): Promise<TrainingSeries> {
        return this.prisma.trainingSeries.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.weekdays && { weekdays: data.weekdays }),
                ...(data.startTime && { startTime: data.startTime }),
                ...(data.endTime && { endTime: data.endTime }),
                ...(data.startWeek && { startWeek: data.startWeek }),
                ...(data.endWeek && { endWeek: data.endWeek }),
            }
        });
    }

    /**
     * Delete a training series and all associated trainings
     */
    async delete(id: string): Promise<TrainingSeries> {
        return this.prisma.trainingSeries.delete({
            where: { id }
        });
    }

    /**
     * Check if training series exists
     */
    async exists(id: string): Promise<boolean> {
        const series = await this.prisma.trainingSeries.findUnique({
            where: { id },
            select: { id: true }
        });
        return !!series;
    }
}

// Export singleton instance
export const trainingSeriesRepository = new TrainingSeriesRepository();




