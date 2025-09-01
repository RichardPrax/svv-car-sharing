// src/hooks/auth/index.ts
export { useLogin, useRegistration } from "./useAuth";
export { useUserProfile, useUserProfiles } from "./useUserProfile";
export { useOptimizedAuth, useCurrentUser, useUserProfile as useOptimizedUserProfile, AuthProvider } from "./useOptimizedAuth";
export { useUserProfileCache, useOptimizedUserProfile as useOptimizedSingleProfile, useOptimizedUserProfiles, UserProfileProvider } from "./useUserProfileCache";
export { useRoleGuard, useAdminGuard } from "./useRoleGuard";
export { useAuthenticatedFetch } from "./useAuthenticatedFetch";

