import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    // Reload on route changes
    reloadOnOnline: true,
    // Scope of the PWA
    scope: "/",
    // Service worker path
    sw: "sw.js",
    // Deaktiviere Offline-Caching - App funktioniert nur mit Internet
    runtimeCaching: [],
    // Kein Precaching von statischen Assets
    cacheOnFrontEndNav: false,
    // Minimales Caching - nur für Installierbarkeit
    publicExcludes: ['!**/*'],
});

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

// @ts-ignore - Type mismatch between next-pwa types and Next.js 15
export default withPWA(nextConfig);

