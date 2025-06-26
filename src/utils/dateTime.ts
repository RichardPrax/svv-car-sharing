// src/utils/dateTime.ts
export const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

export const formatTime = (timeStr: string): string => {
    const timeWithoutSeconds = timeStr.substring(0, 5);
    return `Beginn: ${timeWithoutSeconds}`;
};

export const isMatchInFuture = (dateStr: string, timeStr: string): boolean => {
    const now = new Date();
    const matchDate = new Date(`${dateStr} ${timeStr}`);
    return matchDate > now;
};

export const isMatchInPast = (dateStr: string, timeStr: string): boolean => {
    const today = new Date();
    const matchDate = new Date(`${dateStr} ${timeStr}`);
    return matchDate < today;
};

export const sortMatchesByDateTime = <T extends { date: string; time: string }>(matches: T[]): T[] => {
    return matches.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA.getTime() - dateB.getTime();
    });
};
