/**
 * Environment Configuration Validator
 * This file validates and exports environment variables for the application.
 *
 * Why do we need this validation?
 * 1. **Early Error Detection**: Catch missing environment variables at startup instead of runtime
 * 2. **Development Safety**: Prevent deployment with missing critical configuration
 * 3. **Type Safety**: Provide typed access to environment variables
 * 4. **Documentation**: Central place to see all required environment variables
 * 5. **Fallback Values**: Provide sensible defaults for optional variables
 */

// Required client-side environment variables (available in browser)
const requiredClientEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const;

// Required server-side environment variables (only available on server)
const requiredServerEnvVars = ["DATABASE_URL"] as const;

// Optional environment variables with defaults
const optionalEnvVars = {
    NODE_ENV: "development",
    NEXTAUTH_URL: "http://localhost:3000",
    NEXTAUTH_SECRET: "development-secret",
    SUPABASE_SERVICE_ROLE_KEY: "",
    DIRECT_URL: "",
} as const;

// Check if we're running on the server
const isServer = typeof window === "undefined";

// Validate required environment variables
function validateEnvVars() {
    const missing: string[] = [];

    // Only validate on the server side during build/development
    // Client-side validation is problematic because env vars might not be available during hydration
    if (isServer) {
        // Validate client-side variables (these should be available on server too)
        requiredClientEnvVars.forEach((envVar) => {
            if (!process.env[envVar]) {
                missing.push(envVar);
            }
        });

        // Validate server-side variables
        requiredServerEnvVars.forEach((envVar) => {
            if (!process.env[envVar]) {
                missing.push(envVar);
            }
        });

        if (missing.length > 0) {
            console.error(`Missing required environment variables: ${missing.join(", ")}`);
            console.error(`Please check your .env files and ensure all required variables are set.`);
            // Only throw in development to help with debugging
            if (process.env.NODE_ENV === "development") {
                throw new Error(`Missing required environment variables: ${missing.join(", ")}\nPlease check your .env files and ensure all required variables are set.`);
            }
        }
    }
}

// Get environment configuration
export function getEnvConfig() {
    validateEnvVars();

    return {
        // Required variables - with safe fallbacks for client-side
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || (isServer ? "" : ""),
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (isServer ? "" : ""),
        databaseUrl: isServer ? process.env.DATABASE_URL || "" : "",

        // Optional variables with defaults
        nodeEnv: process.env.NODE_ENV || optionalEnvVars.NODE_ENV,
        nextAuthUrl: process.env.NEXTAUTH_URL || optionalEnvVars.NEXTAUTH_URL,
        nextAuthSecret: process.env.NEXTAUTH_SECRET || optionalEnvVars.NEXTAUTH_SECRET,
        supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || optionalEnvVars.SUPABASE_SERVICE_ROLE_KEY,
        directUrl: process.env.DIRECT_URL || optionalEnvVars.DIRECT_URL,

        // Derived values
        isProduction: process.env.NODE_ENV === "production",
        isDevelopment: process.env.NODE_ENV === "development",
        isLocal: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("localhost") || false,
        isServer,
    };
}

// Export configuration for use in other files
export const envConfig = getEnvConfig();

// Log environment info in development (only on server)
if (envConfig.isDevelopment && envConfig.isServer) {
    console.log("🔧 Environment Configuration:");
    console.log(`  - Environment: ${envConfig.nodeEnv}`);
    console.log(`  - Supabase: ${envConfig.isLocal ? "Local" : "Remote"}`);
    console.log(`  - Database: ${envConfig.databaseUrl.includes("localhost") ? "Local" : "Remote"}`);
}

