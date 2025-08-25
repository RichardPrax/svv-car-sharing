// src/components/admin/types.ts
import { UserProfile } from "@/entities/UserProfile";

export interface UserActionsProps {
    user: UserProfile;
    onEdit: (user: UserProfile) => void;
    onDelete: (user: UserProfile) => void;
}

export interface UserItemProps {
    user: UserProfile;
    onEdit: (user: UserProfile) => void;
    onDelete: (user: UserProfile) => void;
}

export interface UsersListProps {
    className?: string;
}

// Event Handler Types
export type UserEditHandler = (user: UserProfile) => void;
export type UserDeleteHandler = (user: UserProfile) => void;

// Component State Types
export interface UsersListState {
    users: UserProfile[];
    loading: boolean;
    error: string | null;
    totalUsers: number;
}
