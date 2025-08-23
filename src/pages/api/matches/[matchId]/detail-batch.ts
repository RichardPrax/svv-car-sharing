import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { withRateLimit, userRateLimiter } from "@/lib/middleware/rateLimiter";

async function matchDetailBatchHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const { matchId, userId } = req.query;

        if (!matchId || typeof matchId !== "string") {
            return res.status(400).json({ error: "Match ID is required" });
        }

        // Fetch match details
        const match = await prisma.matchDay.findUnique({
            where: { id: matchId },
        });

        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }

        // Fetch participation overview
        const participations = await prisma.gameParticipation.findMany({
            where: { matchDayId: matchId },
            include: {
                player: {
                    include: {
                        playerPositions: {
                            orderBy: [
                                { isPrimary: "desc" },
                                { position: "asc" }
                            ]
                        }
                    }
                }
            },
            orderBy: [
                { status: "asc" },
                { player: { firstName: "asc" } }
            ]
        });

        // Get all users who haven't participated yet
        const allUsers = await prisma.userProfile.findMany({
            include: {
                playerPositions: {
                    orderBy: [
                        { isPrimary: "desc" },
                        { position: "asc" }
                    ]
                }
            },
            orderBy: { firstName: "asc" }
        });

        const participatingUserIds = participations.map(p => p.playerId);
        const openUsers = allUsers.filter(user => !participatingUserIds.includes(user.id));

        // Group participations by status
        const participationsByStatus = {
            JOINING: participations.filter(p => p.status === "JOINING"),
            DECLINING: participations.filter(p => p.status === "DECLINING")
        };

        // Calculate counts
        const counts = {
            joining: participationsByStatus.JOINING.length,
            declining: participationsByStatus.DECLINING.length,
            open: openUsers.length,
            total: allUsers.length
        };

        // Fetch rides for this match
        const rides = await prisma.ride.findMany({
            where: { matchDayId: matchId },
            include: {
                driver: true,
                passengers: {
                    include: {
                        passenger: true
                    }
                }
            },
            orderBy: { departureTime: "asc" }
        });

        // If userId is provided, check user-specific data
        let userRideCheck = null;
        let userParticipationCheck = null;

        if (userId && typeof userId === "string") {
            // Check if user has a ride for this match
            const userRide = rides.find(ride => ride.driverId === userId);
            userRideCheck = {
                hasExistingRide: !!userRide,
                rideId: userRide?.id || null
            };

            // Check if user is participating as passenger
            const userPassengerRide = rides.find(ride => 
                ride.passengers.some(passenger => passenger.passengerId === userId)
            );
            userParticipationCheck = {
                isParticipating: !!userPassengerRide,
                participatingRideId: userPassengerRide?.id || null
            };
        }

        // Format the response
        const response = {
            match,
            participationOverview: {
                participations: participationsByStatus,
                openUsers,
                counts,
                match: {
                    id: match.id,
                    date: match.date,
                    time: match.time,
                    opponent: match.opponent,
                    location: match.location
                }
            },
            rides,
            userRideCheck,
            userParticipationCheck
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching match detail batch:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export default withRateLimit(userRateLimiter)(matchDetailBatchHandler);
