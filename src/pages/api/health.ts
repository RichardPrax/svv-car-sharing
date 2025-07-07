import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";
import { prisma } from "../../lib/prisma";
import { envConfig } from "../../lib/env";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const checks = {
            environment: {
                nodeEnv: envConfig.nodeEnv,
                isLocal: envConfig.isLocal,
                isProduction: envConfig.isProduction,
            },
            database: {
                status: "unknown",
                error: null as string | null,
            },
            supabase: {
                status: "unknown",
                error: null as string | null,
            },
            timestamp: new Date().toISOString(),
        };

        // Check database connection
        try {
            await prisma.$queryRaw`SELECT 1`;
            checks.database.status = "connected";
        } catch (error) {
            checks.database.status = "error";
            checks.database.error = error instanceof Error ? error.message : "Unknown error";
        }

        // Check Supabase connection
        try {
            const { error } = await supabase.from("UserProfile").select("count").limit(1);

            if (error) {
                checks.supabase.status = "error";
                checks.supabase.error = error.message;
            } else {
                checks.supabase.status = "connected";
            }
        } catch (error) {
            checks.supabase.status = "error";
            checks.supabase.error = error instanceof Error ? error.message : "Unknown error";
        }

        // Determine overall status
        const overallStatus = checks.database.status === "connected" && checks.supabase.status === "connected" ? "healthy" : "unhealthy";

        res.status(overallStatus === "healthy" ? 200 : 503).json({
            status: overallStatus,
            checks,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

