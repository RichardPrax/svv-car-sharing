// src/components/admin/types.ts
import { UserProfile, UserProfileWithPositions } from "@/entities/UserProfile";

export interface UserActionsProps {
    user: UserProfileWithPositions;
    onEdit: (user: UserProfileWithPositions) => void;
    onDelete: (user: UserProfileWithPositions) => void;
}

export interface UserItemProps {
    user: UserProfileWithPositions;
    onEdit: (user: UserProfileWithPositions) => void;
    onDelete: (user: UserProfileWithPositions) => void;
}

export interface UsersListProps {
    className?: string;
}

// Event Handler Types
export type UserEditHandler = (user: UserProfileWithPositions) => void;
export type UserDeleteHandler = (user: UserProfileWithPositions) => void;

// Component State Types
export interface UsersListState {
    users: UserProfileWithPositions[];
    loading: boolean;
    error: string | null;
    totalUsers: number;
}

