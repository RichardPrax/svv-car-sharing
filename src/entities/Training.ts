// src/entities/Training.ts

// Base Training type based on Prisma schema
export interface Training {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    location: string;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// Helper function to format date for display
export function formatTrainingDate(training: Training): string {
    return training.date.toLocaleDateString();
}

// Helper function to get training display info
export function getTrainingDisplayInfo(training: Training): string {
    return `${formatTrainingDate(training)} ${training.startTime} - ${training.endTime}`;
}

// Helper function to format training time range
export function formatTrainingTimeRange(training: Training): string {
    return `${training.startTime} - ${training.endTime}`;
}

// Helper function to check if training is in the past
export function isTrainingInPast(date: Date, startTime: string): boolean {
    const now = new Date();
    const trainingDate = new Date(date);
    
    // Parse the time string (assuming format "HH:mm")
    const [hours, minutes] = startTime.split(':').map(Number);
    trainingDate.setHours(hours, minutes, 0, 0);
    
    return trainingDate < now;
}
