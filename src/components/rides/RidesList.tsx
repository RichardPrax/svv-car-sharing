// src/components/rides/RidesList.tsx
import { useOptimizedCurrentUser } from "@/hooks/rides/useOptimizedCurrentUser";
import { useOptimizedUserProfiles } from "@/hooks/auth/useUserProfileCache";
import { useRides } from "@/hooks/rides";
import { useRideActions } from "@/hooks/rides";
import { useUserRideCheck, useUserParticipationCheck } from "@/hooks/rides";
import RideCard from "./RideCard";

interface RidesListProps {
    matchId: string;
    refreshTrigger: number;
    onRideUpdated?: () => void;
}

export default function RidesList({ matchId, refreshTrigger, onRideUpdated }: RidesListProps) {
    const { currentUserId } = useOptimizedCurrentUser();
    const { rides, loading, error, refetch } = useRides({ matchId, refreshTrigger });
    const { hasExistingRide } = useUserRideCheck({ matchId, refreshTrigger });
    const { isParticipating } = useUserParticipationCheck({ matchId, refreshTrigger });

    // Sammle alle User-IDs aus den Rides für optimiertes Preloading
    const allUserIds = rides.flatMap((ride) => [ride.driverId, ...ride.passengers.map((p) => p.passengerId)]).filter(Boolean);

    // Preload alle benötigten User-Profile in einem Batch
    const { getProfileName } = useOptimizedUserProfiles(allUserIds);

    const { joinRide, leaveRide } = useRideActions({
        currentUserId,
        matchId,
        onSuccess: () => {
            refetch();
            onRideUpdated?.();
        },
    });

    const handleRideUpdated = () => {
        refetch();
        onRideUpdated?.();
    };

    const handleJoinRide = async (rideId: string) => {
        const result = await joinRide(rideId);
        if (result.error) {
            console.error("Join ride error:", result.error);
            // Hier könnte man eine Toast-Nachricht anzeigen
        }
    };

    const handleLeaveRide = async (rideId: string) => {
        const result = await leaveRide(rideId);
        if (result.error) {
            console.error("Leave ride error:", result.error);
            // Hier könnte man eine Toast-Nachricht anzeigen
        }
    };

    // Enriche Rides mit gecachten User-Namen
    const enrichedRides = rides.map((ride) => ({
        ...ride,
        driverName: getProfileName(ride.driverId),
        passengerNames: ride.passengers.map((p) => getProfileName(p.passengerId)),
    }));

    if (loading) {
        return (
            <div
                style={{
                    textAlign: "center",
                    padding: "var(--spacing-xl)",
                    color: "var(--text-secondary)",
                }}
            >
                Lade Fahrten...
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    textAlign: "center",
                    padding: "var(--spacing-xl)",
                    color: "var(--danger)",
                }}
            >
                {error}
            </div>
        );
    }

    if (enrichedRides.length === 0) {
        return (
            <div
                style={{
                    textAlign: "center",
                    padding: "var(--spacing-xl)",
                    color: "var(--text-secondary)",
                }}
            >
                Noch keine Fahrten erstellt.
                {!hasExistingRide && !isParticipating && (
                    <>
                        <br />
                        Erstelle die erste Fahrt!
                    </>
                )}
            </div>
        );
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-md)",
            }}
        >
            {enrichedRides.map((ride) => {
                // Check ob User bereits Fahrer oder Mitfahrer ist
                const isUserDriverOfThisRide = ride.driverId === currentUserId;
                const isUserPassengerOfThisRide = ride.passengers.some((p) => p.passengerId === currentUserId);

                return (
                    <RideCard
                        key={ride.id}
                        ride={ride}
                        isUserDriverOfThisRide={isUserDriverOfThisRide}
                        isUserPassengerOfThisRide={isUserPassengerOfThisRide}
                        hasExistingRide={hasExistingRide}
                        isParticipating={isParticipating}
                        onJoinRide={handleJoinRide}
                        onLeaveRide={handleLeaveRide}
                        onRideUpdated={handleRideUpdated}
                    />
                );
            })}
        </div>
    );
}

