import { createClient } from "@supabase/supabase-js";

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables. Please check your .env files.");
}

// Create Supabase client with environment-specific configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Enable auto-refresh for better UX
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
    // Configure based on environment
    realtime: {
        params: {
            eventsPerSecond: process.env.NODE_ENV === "development" ? 10 : 5,
        },
    },
});

// Export environment info for debugging
export const supabaseConfig = {
    url: supabaseUrl,
    isLocal: supabaseUrl.includes("localhost"),
    environment: process.env.NODE_ENV,
};

