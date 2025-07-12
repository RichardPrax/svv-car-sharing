import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,

    // Environment variables validation
    env: {
        CUSTOM_ENV: process.env.NODE_ENV,
    },

    // Only load specific environment files based on NODE_ENV
    experimental: {
        // This helps with better environment variable handling
        optimizePackageImports: ["@supabase/supabase-js"],
    },

    // Ensure Prisma client is bundled correctly for serverless (moved from experimental)
    serverExternalPackages: ["@prisma/client"],

    // Ensure environment variables are properly loaded
    publicRuntimeConfig: {
        // This is available on both server and client
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
};

export default nextConfig;

