// src/entities/Training.ts
import { formatDate } from "@/utils/dateTime";

// Base Training type based on Prisma schema
export interface Training {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// Helper function to format date for display
export function formatTrainingDate(training: Training): string {
    return formatDate(training.date);
}

// Helper function to get training display info
export function getTrainingDisplayInfo(training: Training): string {
    return `${formatTrainingDate(training)} ${training.startTime} - ${training.endTime}`;
}

// Helper function to format training time range
export function formatTrainingTimeRange(training: Training): string {
    return `${training.startTime} - ${training.endTime}`;
}
