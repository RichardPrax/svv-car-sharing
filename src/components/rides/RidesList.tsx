// src/components/rides/RidesList.tsx
import { useCurrentUser } from "@/hooks/rides/useCurrentUser";
import { useRides } from "@/hooks/rides/useRides";
import { useRideActions } from "@/hooks/rides/useRideActions";
import { useUserRideCheck, useUserParticipationCheck } from "@/hooks/rides";
import RideCard from "./RideCard";

interface RidesListProps {
    matchId: string;
    refreshTrigger: number;
    onRideUpdated?: () => void;
}

export default function RidesList({ matchId, refreshTrigger, onRideUpdated }: RidesListProps) {
    const { currentUserId } = useCurrentUser();
    const { rides, loading, error, refetch } = useRides({ matchId, refreshTrigger });
    const { hasExistingRide } = useUserRideCheck({ matchId, refreshTrigger });
    const { isParticipating } = useUserParticipationCheck({ matchId, refreshTrigger });

    const { joinRide, leaveRide, deleteRide } = useRideActions({
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
                    color: "#dc2626",
                    backgroundColor: "#fef2f2",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid #fecaca",
                }}
            >
                {error}
            </div>
        );
    }

    if (rides.length === 0) {
        return (
            <div
                style={{
                    textAlign: "center",
                    padding: "var(--spacing-xl)",
                    color: "var(--text-secondary)",
                }}
            >
                Noch keine Fahrten verfügbar. Seien Sie der Erste und bieten Sie eine Fahrt an!
            </div>
        );
    }

    return (
        <div
            style={{
                display: "grid",
                gap: "var(--spacing-md)",
                marginTop: "var(--spacing-lg)",
            }}
        >
            {rides.map((ride) => (
                <RideCard
                    key={ride.id}
                    ride={ride}
                    currentUserId={currentUserId}
                    isUserDriver={hasExistingRide}
                    isUserParticipating={isParticipating}
                    onJoinRide={handleJoinRide}
                    onLeaveRide={handleLeaveRide}
                    onRideUpdated={handleRideUpdated}
                />
            ))}
        </div>
    );
}

