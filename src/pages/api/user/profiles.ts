import { NextApiRequest, NextApiResponse } from "next";
import { UserProfileRepository } from "@/lib/repositories/userProfileRepository";
import { recordUserApiCall } from "../admin/session-analytics";
import { withRateLimit, profileBatchRateLimiter } from "@/lib/middleware/rateLimiter";

const userProfileRepository = new UserProfileRepository();

async function profilesHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { userIds } = req.body;

            if (!userIds || !Array.isArray(userIds)) {
                return res.status(400).json({ error: "User IDs Array ist erforderlich" });
            }

            // Track batch profile API call for analytics
            userIds.forEach((userId) => recordUserApiCall(userId));

            const userProfiles = await userProfileRepository.findByIds(userIds);
            res.status(200).json(userProfiles);
        } catch (error) {
            console.error("Fehler beim Laden der Benutzerprofile:", error);
            res.status(500).json({ error: "Fehler beim Laden der Benutzerprofile" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// Apply rate limiting for batch profile requests
export default withRateLimit(profileBatchRateLimiter)(profilesHandler);

