// src/components/rides/RideCard.tsx
import { useState } from "react";
import { RideWithDetails } from "@/entities/Ride";
import RideDetails from "./RideDetails";
import RidePassengers from "./RidePassengers";
import RideActions from "./RideActions";
import { EditRideForm } from "@/components/forms";

interface RideCardProps {
    ride: RideWithDetails;
    isUserDriverOfThisRide: boolean;
    isUserPassengerOfThisRide: boolean;
    hasExistingRide: boolean;
    isParticipating: boolean;
    onJoinRide: (rideId: string) => void;
    onLeaveRide: (rideId: string) => void;
    onRideUpdated: () => void;
}

export default function RideCard({
    ride,
    isUserDriverOfThisRide,
    isUserPassengerOfThisRide,
    hasExistingRide,
    isParticipating,
    onJoinRide,
    onLeaveRide,
    onRideUpdated,
}: RideCardProps) {
    const [editingRideId, setEditingRideId] = useState<string | null>(null);

    const isRideFull = (): boolean => {
        return ride.passengers.length >= ride.availableSeats;
    };

    const handleEditRide = () => {
        setEditingRideId(ride.id);
    };

    const handleRideUpdated = () => {
        setEditingRideId(null);
        onRideUpdated();
    };

    const handleRideDeleted = () => {
        setEditingRideId(null);
        onRideUpdated();
    };

    const handleCancelEdit = () => {
        setEditingRideId(null);
    };

    if (editingRideId === ride.id) {
        return <EditRideForm ride={ride} onRideUpdated={handleRideUpdated} onCancel={handleCancelEdit} onDelete={handleRideDeleted} />;
    }

    return (
        <div
            style={{
                backgroundColor: "var(--card-background)",
                border: "1px solid var(--card-border)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--spacing-lg)",
                transition: "all 0.2s ease-in-out",
            }}
        >
            <RideDetails ride={ride} isRideFull={isRideFull()} />

            <RidePassengers passengerCount={ride.passengerCount} passengerNames={ride.passengerNames} />

            {ride.additionalInfo && (
                <div
                    style={{
                        backgroundColor: "var(--background)",
                        padding: "var(--spacing-sm)",
                        borderRadius: "var(--radius-sm)",
                        marginBottom: "var(--spacing-md)",
                        borderLeft: "3px solid var(--text-accent)",
                    }}
                >
                    <p
                        style={{
                            fontSize: "0.875rem",
                            color: "var(--text-secondary)",
                            margin: 0,
                            fontStyle: "italic",
                        }}
                    >
                        &quot;{ride.additionalInfo}&quot;
                    </p>
                </div>
            )}

            <RideActions
                isOwnRide={isUserDriverOfThisRide}
                isUserInRide={isUserPassengerOfThisRide}
                isRideFull={isRideFull()}
                isUserDriver={hasExistingRide}
                isUserParticipating={isParticipating}
                onEdit={handleEditRide}
                onJoin={() => onJoinRide(ride.id)}
                onLeave={() => onLeaveRide(ride.id)}
            />
        </div>
    );
}

