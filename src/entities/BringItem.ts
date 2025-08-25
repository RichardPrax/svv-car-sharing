// src/entities/BringItem.ts
export interface BringItem {
    id: string;
    matchDayId: string;
    userId: string;
    itemName: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        firstName: string;
        lastName: string;
    };
}

export interface CreateBringItemData {
    userId: string;
    itemName: string;
    description?: string;
}

