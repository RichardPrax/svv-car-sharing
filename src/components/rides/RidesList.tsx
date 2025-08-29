// src/components/rides/RidesList.tsx
import { useOptimizedCurrentUser } from "@/hooks/rides/useOptimizedCurrentUser";
import { useOptimizedUserProfiles } from "@/hooks/auth/useUserProfileCache";
import { useRideActions } from "@/hooks/rides";
import RideCard from "./RideCard";
import { LoadingSpinner } from "@/components/ui";
import { RideWithDetails } from "@/entities/Ride";
import { formatDateForId } from "@/utils/dateTime";
import styles from "./Rides.module.css";

interface RidesListProps {
    matchId: string;
    matchDate: string | Date;
    onRideUpdated?: () => void;
    rides?: RideWithDetails[];
    userRideCheck?: {
        hasExistingRide: boolean;
        rideId: string | null;
    } | null;
    userParticipationCheck?: {
        isParticipating: boolean;
        participatingRideId: string | null;
    } | null;
}

export default function RidesList({ 
    matchId, 
    matchDate,
    onRideUpdated, 
    rides: passedRides, 
    userRideCheck, 
    userParticipationCheck 
}: RidesListProps) {
    const { currentUserId } = useOptimizedCurrentUser();
    
    // Use passed data if available
    const rides = passedRides || [];
    const loading = !passedRides;
    const error = null; // No error handling for passed data
    const hasExistingRide = userRideCheck?.hasExistingRide || false;
    const isParticipating = userParticipationCheck?.isParticipating || false;
    
    const testIdPrefix = `md-${formatDateForId(matchDate)}`;

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
            onRideUpdated?.();
        },
    });

    const handleRideUpdated = () => {
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
        return <LoadingSpinner message="Lade Fahrten..." data-testid={`${testIdPrefix}-rides-loading`} />;
    }

    if (error) {
        return <div className={styles.ridesListError} data-testid={`${testIdPrefix}-rides-error`}>{error}</div>;
    }

    if (enrichedRides.length === 0) {
        return (
            <div className={styles.ridesListEmpty} data-testid={`${testIdPrefix}-rides-empty`}>
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
        <div className={styles.ridesList} data-testid={`${testIdPrefix}-rides-list`}>
            {enrichedRides.map((ride, index) => {
                // Check ob User bereits Fahrer oder Mitfahrer ist
                const isUserDriverOfThisRide = ride.driverId === currentUserId;
                const isUserPassengerOfThisRide = ride.passengers.some((p) => p.passengerId === currentUserId);

                return (
                    <RideCard
                        key={ride.id}
                        ride={ride}
                        matchDate={matchDate}
                        rideIndex={index}
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

