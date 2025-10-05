// src/utils/dateTime.ts
export const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}.${month}.${year}`;
};

export const formatTime = (timeStr: string): string => {
    const timeWithoutSeconds = timeStr.substring(0, 5);
    return `Beginn: ${timeWithoutSeconds}`;
};

export const isMatchInFuture = (date: string | Date, timeStr: string): boolean => {
    const now = new Date();
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const matchDate = new Date(`${dateObj.toDateString()} ${timeStr}`);
    return matchDate > now;
};

export const isMatchInPast = (date: string | Date, timeStr: string): boolean => {
    const today = new Date();
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const matchDate = new Date(`${dateObj.toDateString()} ${timeStr}`);
    return matchDate < today;
};

export const sortMatchesByDateTime = <T extends { date: string | Date; time: string }>(matches: T[]): T[] => {
    return matches.sort((a, b) => {
        const dateA = typeof a.date === "string" ? new Date(a.date) : a.date;
        const dateB = typeof b.date === "string" ? new Date(b.date) : b.date;
        const dateTimeA = new Date(`${dateA.toDateString()} ${a.time}`);
        const dateTimeB = new Date(`${dateB.toDateString()} ${b.time}`);
        return dateTimeA.getTime() - dateTimeB.getTime();
    });
};

export const formatDateForId = (date: string | Date): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${year}-${month}-${day}`;
};

export const isTrainingInPast = (date: string | Date, startTime: string): boolean => {
    const now = new Date();
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const trainingDate = new Date(dateObj);
    
    // Parse the time string (assuming format "HH:mm")
    const [hours, minutes] = startTime.split(':').map(Number);
    trainingDate.setHours(hours, minutes, 0, 0);
    
    return trainingDate < now;
};
