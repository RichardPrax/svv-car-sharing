// src/pages/api/admin/users/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { UserProfileRepository } from "@/lib/repositories/userProfileRepository";
import { withRateLimit, userRateLimiter } from "@/lib/middleware/rateLimiter";
import { withSecurity } from "@/lib/middleware/security";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/authMiddleware";
import { UserRole, VolleyballPosition, canAssignRole } from "@/entities/UserProfile";
import { prisma } from "@/lib/prisma";

const userProfileRepository = new UserProfileRepository();

interface UpdateUserBody {
    role: UserRole;
    primaryPosition?: VolleyballPosition | string | null;
    secondaryPosition?: VolleyballPosition | string | null;
}

async function updateUserHandler(req: AuthenticatedRequest, res: NextApiResponse): Promise<void> {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
        res.status(400).json({ error: "User ID is required" });
        return;
    }

    if (req.method !== "PUT") {
        res.setHeader("Allow", ["PUT"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    try {
        // User is already authenticated via middleware
        const { user } = req;

        // Get user profile and check admin role
        const userProfile = await userProfileRepository.findById(user.id);
        if (!userProfile || (userProfile.role !== "ADMIN" && userProfile.role !== "TRAINER")) {
            res.status(403).json({ error: "Insufficient permissions. Admin access required." });
            return;
        }

        // Validate request body
        const { role, primaryPosition, secondaryPosition }: UpdateUserBody = req.body;

        if (!role || !Object.values(UserRole).includes(role)) {
            res.status(400).json({ error: "Valid role is required" });
            return;
        }

        // Check if user to update exists
        const userToUpdate = await userProfileRepository.findById(id);
        if (!userToUpdate) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Check role hierarchy - user can only assign roles at their level or below
        if (!canAssignRole(userProfile.role as UserRole, role)) {
            res.status(403).json({ error: "You can only assign roles at your level or below" });
            return;
        }

        // Prevent self-demotion from admin role
        if (userProfile.id === id && userProfile.role === "ADMIN" && role !== "ADMIN") {
            res.status(400).json({ error: "Cannot demote yourself from admin role" });
            return;
        }

        // Start transaction
        const updatedUser = await prisma.$transaction(async (tx) => {
            // Update user role
            const updated = await tx.userProfile.update({
                where: { id },
                data: { role },
                include: {
                    playerPositions: true,
                },
            });

            // Delete existing positions
            await tx.userPosition.deleteMany({
                where: { userId: id },
            });

            // Add new positions if provided
            const newPositions = [];

            if (primaryPosition && primaryPosition !== "" && primaryPosition !== null && Object.values(VolleyballPosition).includes(primaryPosition as VolleyballPosition)) {
                newPositions.push({
                    userId: id,
                    position: primaryPosition as VolleyballPosition,
                    isPrimary: true,
                });
            }

            if (
                secondaryPosition &&
                secondaryPosition !== "" &&
                secondaryPosition !== null &&
                Object.values(VolleyballPosition).includes(secondaryPosition as VolleyballPosition) &&
                secondaryPosition !== primaryPosition
            ) {
                newPositions.push({
                    userId: id,
                    position: secondaryPosition as VolleyballPosition,
                    isPrimary: false,
                });
            }

            if (newPositions.length > 0) {
                await tx.userPosition.createMany({
                    data: newPositions,
                });
            }

            // Fetch updated user with positions
            return await tx.userProfile.findUnique({
                where: { id },
                include: {
                    playerPositions: true,
                },
            });
        });

        res.status(200).json({
            user: updatedUser,
            updatedBy: {
                id: userProfile.id,
                name: `${userProfile.firstName} ${userProfile.lastName}`,
                role: userProfile.role,
            },
        });
    } catch (error) {
        console.error("Error in update user endpoint:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Apply middleware chain with auth
export default withRateLimit(userRateLimiter)(withSecurity()((req: NextApiRequest, res: NextApiResponse) => withAuth(req, res, updateUserHandler)));

