// src/lib/supabaseAdmin.ts
import { createClient } from "@supabase/supabase-js";
import { envConfig } from "./env";

// Admin client for server-side operations (uses service role key)
let supabaseAdmin: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
    if (!supabaseAdmin) {
        if (!envConfig.supabaseUrl) {
            throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
        }

        if (!envConfig.supabaseServiceRoleKey) {
            throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable for admin operations");
        }

        supabaseAdmin = createClient(envConfig.supabaseUrl, envConfig.supabaseServiceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });
    }

    return supabaseAdmin;
}

// Helper function to delete a user from Supabase Auth
export async function deleteUserFromAuth(userId: string): Promise<void> {
    const admin = getSupabaseAdmin();

    const { error } = await admin.auth.admin.deleteUser(userId);

    if (error) {
        throw new Error(`Failed to delete user from Supabase Auth: ${error.message}`);
    }
}

