// src/lib/middleware/authCache.ts
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface CachedUser {
    user: User;
    timestamp: number;
}

class AuthCache {
    private cache = new Map<string, CachedUser>();
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    private readonly CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes

    constructor() {
        // Auto-cleanup expired entries (server-side only)
        if (typeof window === 'undefined') {
            setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
        }
    }

    async getUser(token: string): Promise<User | null> {
        // Quick cache lookup first
        const cached = this.cache.get(token);
        
        // Return cached user if still valid
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
            return cached.user;
        }

        // Remove expired cache entry
        if (cached) {
            this.cache.delete(token);
        }

        // Fetch from Supabase if not cached or expired
        try {
            const { data: { user }, error } = await supabase.auth.getUser(token);
            
            if (error || !user) {
                return null;
            }

            // Cache the user with current timestamp
            this.cache.set(token, {
                user,
                timestamp: Date.now()
            });

            return user;
        } catch (error) {
            console.error("Auth cache error:", error);
            return null;
        }
    }

    clearCache(token?: string) {
        if (token) {
            this.cache.delete(token);
        } else {
            this.cache.clear();
        }
    }

    // Clean expired entries
    private cleanup() {
        const now = Date.now();
        for (const [token, cached] of this.cache.entries()) {
            if (now - cached.timestamp >= this.CACHE_DURATION) {
                this.cache.delete(token);
            }
        }
    }

    // Get cache stats for debugging
    getStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.entries()).map(([token, cached]) => ({
                token: token.substring(0, 8) + '...',
                age: Date.now() - cached.timestamp,
                userId: cached.user.id
            }))
        };
    }
}

export const authCache = new AuthCache();
