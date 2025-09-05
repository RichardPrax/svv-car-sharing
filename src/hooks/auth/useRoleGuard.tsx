// src/hooks/auth/useRoleGuard.tsx
import { useOptimizedAuth } from "./useOptimizedAuth";
import { UserRole, isAdmin, hasAdminAccess } from "@/entities/UserProfile";

export function useRoleGuard() {
    const { userProfile, loading } = useOptimizedAuth();

    const hasRole = (role: UserRole): boolean => {
        return userProfile?.role === role;
    };

    const isUserAdmin = (): boolean => {
        return isAdmin(userProfile);
    };

    const hasAdminPermissions = (): boolean => {
        return hasAdminAccess(userProfile);
    };

    const hasPlayerAccess = (): boolean => {
        return userProfile?.role === "PLAYER" || userProfile?.role === "ADMIN" || userProfile?.role === "TRAINER" || userProfile?.role === "PENALTY_MASTER";
    };

    const canAccessAdminPanel = (): boolean => {
        return !loading && hasAdminPermissions();
    };

    return {
        userProfile,
        loading,
        hasRole,
        isAdmin: isUserAdmin,
        hasAdminAccess: hasAdminPermissions,
        hasPlayerAccess,
        canAccessAdminPanel,
        currentRole: userProfile?.role || UserRole.PLAYER,
    };
}

export function useAdminGuard() {
    const roleGuard = useRoleGuard();

    return {
        ...roleGuard,
        isAuthorized: roleGuard.canAccessAdminPanel(),
    };
}

