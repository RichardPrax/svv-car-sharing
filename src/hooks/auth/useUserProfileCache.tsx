// src/hooks/auth/useUserProfileCache.tsx
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { UserProfile } from "@/entities/UserProfile";

interface UserProfileCache {
    [userId: string]: {
        profile: UserProfile;
        timestamp: number;
        loading: boolean;
    };
}

interface UserProfileContextType {
    getProfile: (userId: string) => UserProfile | null;
    getProfiles: (userIds: string[]) => UserProfile[];
    isLoading: (userId: string) => boolean;
    preloadProfiles: (userIds: string[]) => Promise<void>;
    refreshProfile: (userId: string) => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

interface UserProfileProviderProps {
    children: ReactNode;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 Minuten Cache
const MAX_CACHE_SIZE = 100; // Maximal 100 Profile im Cache

export function UserProfileProvider({ children }: UserProfileProviderProps) {
    const [cache, setCache] = useState<UserProfileCache>({});

    const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
        try {
            const response = await fetch(`/api/user/${userId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error("Failed to fetch user profile");
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching profile for user ${userId}:`, error);
            return null;
        }
    };

    const fetchProfiles = async (userIds: string[]): Promise<UserProfile[]> => {
        try {
            // Filter out empty or invalid user IDs
            const validUserIds = userIds.filter(id => id && typeof id === 'string' && id.trim() !== '');
            
            if (validUserIds.length === 0) {
                console.log('No valid user IDs to fetch profiles for');
                return [];
            }

            const response = await fetch("/api/user/profiles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userIds: validUserIds }),
            });

            if (!response.ok) {
                console.error(`Failed to fetch user profiles: ${response.status} ${response.statusText}`);
                return [];
            }

            const profiles = await response.json();
            return Array.isArray(profiles) ? profiles : [];
        } catch (error) {
            console.error("Error fetching user profiles:", error);
            return [];
        }
    };

    const isProfileCacheValid = (userId: string): boolean => {
        const cached = cache[userId];
        if (!cached) return false;

        const now = Date.now();
        return now - cached.timestamp < CACHE_DURATION;
    };

    const cleanupCache = useCallback(() => {
        const now = Date.now();
        const cacheEntries = Object.entries(cache);

        // Entferne abgelaufene Einträge
        const validEntries = cacheEntries.filter(([, data]) => now - data.timestamp < CACHE_DURATION);

        // Behalte nur die neuesten Einträge wenn Cache zu groß wird
        if (validEntries.length > MAX_CACHE_SIZE) {
            validEntries.sort((a, b) => b[1].timestamp - a[1].timestamp);
            validEntries.splice(MAX_CACHE_SIZE);
        }

        const newCache = Object.fromEntries(validEntries);
        setCache(newCache);
    }, [cache]);

    const updateCache = (profiles: UserProfile[]) => {
        const timestamp = Date.now();
        const updates: UserProfileCache = {};

        profiles.forEach((profile) => {
            updates[profile.id] = {
                profile,
                timestamp,
                loading: false,
            };
        });

        setCache((prev) => ({ ...prev, ...updates }));
    };

    const setLoading = (userIds: string[], loading: boolean) => {
        const updates: UserProfileCache = {};

        userIds.forEach((userId) => {
            if (cache[userId]) {
                updates[userId] = {
                    ...cache[userId],
                    loading,
                };
            } else {
                updates[userId] = {
                    profile: {} as UserProfile, // Temporary placeholder
                    timestamp: Date.now(),
                    loading,
                };
            }
        });

        setCache((prev) => ({ ...prev, ...updates }));
    };

    const getProfile = (userId: string): UserProfile | null => {
        if (isProfileCacheValid(userId)) {
            return cache[userId].profile;
        }
        return null;
    };

    const getProfiles = (userIds: string[]): UserProfile[] => {
        const profiles: UserProfile[] = [];

        userIds.forEach((userId) => {
            const profile = getProfile(userId);
            if (profile) {
                profiles.push(profile);
            }
        });

        return profiles;
    };

    const isLoading = (userId: string): boolean => {
        return cache[userId]?.loading || false;
    };

    const preloadProfiles = async (userIds: string[]): Promise<void> => {
        // Filtere bereits gecachte Profile heraus
        const uncachedUserIds = userIds.filter((userId) => !isProfileCacheValid(userId));

        if (uncachedUserIds.length === 0) {
            return;
        }

        // Setze Loading-Status
        setLoading(uncachedUserIds, true);

        try {
            const profiles = await fetchProfiles(uncachedUserIds);
            if (profiles && profiles.length > 0) {
                updateCache(profiles);
            }
        } catch (error) {
            console.error("Error preloading profiles:", error);
            // Don't throw, just log the error
        } finally {
            setLoading(uncachedUserIds, false);
        }
    };

    const refreshProfile = async (userId: string): Promise<void> => {
        setLoading([userId], true);

        try {
            const profile = await fetchProfile(userId);
            if (profile) {
                updateCache([profile]);
            }
        } catch (error) {
            console.error("Error refreshing profile:", error);
        } finally {
            setLoading([userId], false);
        }
    };

    // Cleanup Cache alle 5 Minuten
    useEffect(() => {
        const interval = setInterval(cleanupCache, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [cleanupCache]);

    const value: UserProfileContextType = {
        getProfile,
        getProfiles,
        isLoading,
        preloadProfiles,
        refreshProfile,
    };

    return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfileCache() {
    const context = useContext(UserProfileContext);
    if (context === undefined) {
        throw new Error("useUserProfileCache must be used within a UserProfileProvider");
    }
    return context;
}

// Optimierter Hook für einzelne Profile
export function useOptimizedUserProfile(userId?: string) {
    const { getProfile, isLoading, refreshProfile } = useUserProfileCache();
    const [error, setError] = useState<string | null>(null);

    const profile = userId ? getProfile(userId) : null;
    const loading = userId ? isLoading(userId) : false;

    useEffect(() => {
        if (!userId) return;

        const loadProfile = async () => {
            if (!getProfile(userId) && !isLoading(userId)) {
                try {
                    await refreshProfile(userId);
                    setError(null);
                } catch {
                    setError("Fehler beim Laden des Benutzerprofils");
                }
            }
        };

        loadProfile();
    }, [userId, getProfile, isLoading, refreshProfile]);

    return { profile, loading, error, refreshProfile: () => refreshProfile(userId!) };
}

// Optimierter Hook für mehrere Profile
export function useOptimizedUserProfiles(userIds: string[]) {
    const { getProfiles, preloadProfiles, isLoading } = useUserProfileCache();
    const [error, setError] = useState<string | null>(null);

    const profiles = getProfiles(userIds);
    const loading = userIds.some((id) => isLoading(id));

    useEffect(() => {
        if (userIds.length === 0) return;

        const loadProfiles = async () => {
            try {
                await preloadProfiles(userIds);
                setError(null);
            } catch {
                setError("Fehler beim Laden der Benutzerprofile");
            }
        };

        loadProfiles();
    }, [userIds, preloadProfiles]);

    const getProfileName = (userId: string): string => {
        const profile = profiles.find((p) => p.id === userId);
        if (profile) {
            return `${profile.firstName} ${profile.lastName}`;
        }
        return userId.substring(0, 8) + "..."; // Fallback
    };

    return { profiles, loading, error, getProfileName };
}

