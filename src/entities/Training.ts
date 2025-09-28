// src/entities/Training.ts
import { formatDate } from "@/utils/dateTime";

// Base Training type based on Prisma schema
export interface Training {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    seriesId?: string | null;
    series?: TrainingSeries | null;
    createdAt: Date;
    updatedAt: Date;
}

// Training Series type
export interface TrainingSeries {
    id: string;
    name?: string | null;
    description?: string | null;
    weekdays: number[]; // Days of week (1=Monday, 7=Sunday)
    startTime: string;
    endTime: string;
    startWeek: Date; // Start of the first week
    endWeek: Date;   // Start of the last week
    trainings?: Training[];
    createdAt: Date;
    updatedAt: Date;
}

// Type for creating a new training series
export interface CreateTrainingSeriesData {
    name?: string;
    description?: string;
    weekdays: number[];
    startTime: string;
    endTime: string;
    startWeek: Date;
    endWeek: Date;
}

// Type for creating individual training
export interface CreateTrainingData {
    date: Date;
    startTime: string;
    endTime: string;
    seriesId?: string;
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

// Helper function to get week start (Monday) for a given date
export function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    return new Date(d.setDate(diff));
}

// Helper function to generate training dates for a series
export function generateTrainingDatesForSeries(series: CreateTrainingSeriesData): Date[] {
    const dates: Date[] = [];
    const startWeek = getWeekStart(series.startWeek);
    const endWeek = getWeekStart(series.endWeek);
    
    const currentWeek = new Date(startWeek);
    
    while (currentWeek <= endWeek) {
        // For each weekday in the series
        for (const weekday of series.weekdays) {
            const trainingDate = new Date(currentWeek);
            trainingDate.setDate(currentWeek.getDate() + weekday - 1); // weekday: 1=Monday, 7=Sunday
            
            // Only add if within our date range
            if (trainingDate >= series.startWeek && trainingDate <= new Date(series.endWeek.getTime() + 6 * 24 * 60 * 60 * 1000)) {
                dates.push(new Date(trainingDate));
            }
        }
        
        // Move to next week
        currentWeek.setDate(currentWeek.getDate() + 7);
    }
    
    return dates.sort((a, b) => a.getTime() - b.getTime());
}

// Helper function to check if a training is part of a series
export function isPartOfSeries(training: Training): boolean {
    return !!training.seriesId;
}

// Helper function to get weekday names
export function getWeekdayName(weekday: number): string {
    const names = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
    return names[weekday - 1] || '';
}

// Helper function to get weekday names for series
export function getSeriesWeekdayNames(series: TrainingSeries): string {
    return series.weekdays.map(getWeekdayName).join(', ');
}
