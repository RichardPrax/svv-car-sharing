// src/lib/middleware/authMiddleware.ts
import { NextApiRequest, NextApiResponse } from "next";
import { authCache } from "./authCache";
import { User } from "@supabase/supabase-js";

export interface AuthenticatedRequest extends NextApiRequest {
    user: User;
}

export async function withAuth(
    req: NextApiRequest,
    res: NextApiResponse,
    handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
    try {
        // Check authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No valid authorization token provided" });
        }

        const token = authHeader.split(" ")[1];
        
        // Use cached auth validation
        const user = await authCache.getUser(token);

        if (!user) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        // Add user to request object
        (req as AuthenticatedRequest).user = user;

        // Call the handler
        await handler(req as AuthenticatedRequest, res);
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
