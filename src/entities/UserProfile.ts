// src/entities/UserProfile.ts
export interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    created_at: string;
    updated_at: string;
}

export interface UserProfileWithName {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
}
