// src/components/rides/RidesList.tsx
import { useOptimizedCurrentUser } from "@/hooks/rides/useOptimizedCurrentUser";
import { useOptimizedUserProfiles } from "@/hooks/auth/useUserProfileCache";
import { useRides } from "@/hooks/rides";
import { useRideActions } from "@/hooks/rides";
import { useUserRideCheck, useUserParticipationCheck } from "@/hooks/rides";
import RideCard from "./RideCard";
import { LoadingSpinner } from "@/components/ui";
import styles from "./Rides.module.css";

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
    const allUserIds = rides
        .flatMap((ride) => [
            ride.driverId, 
            ...(ride.passengers || []).map((p) => p.passengerId)
        ])
        .filter((id) => id && typeof id === 'string' && id.trim() !== '');

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

    // Enriche Rides mit gecachten User-Namen (nur für Driver, da Passengers bereits korrekt von API kommen)
    const enrichedRides = rides.map((ride) => ({
        ...ride,
        driverName: ride.driverId ? getProfileName(ride.driverId) : 'Unbekannter Fahrer',
        // passengerNames kommen bereits korrekt von der API über useRides
    }));

    if (loading) {
        return <LoadingSpinner message="Lade Fahrten..." />;
    }

    if (error) {
        return <div className={styles.ridesListError}>{error}</div>;
    }

    if (enrichedRides.length === 0) {
        return (
            <div className={styles.ridesListEmpty}>
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
        <div className={styles.ridesList}>
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

