// src/components/rides/RideCard.tsx
import { useState } from "react";
import { RideWithDetails } from "@/entities/Ride";
import { useRideActions } from "@/hooks/rides/useRideActions";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import RideDetails from "./RideDetails";
import RidePassengers from "./RidePassengers";
import RideActions from "./RideActions";
import DeleteRideConfirm from "./DeleteRideConfirm";
import { EditRideForm } from "@/components/forms";
import { Modal } from "@/components/ui";
import styles from "./Rides.module.css";

interface RideCardProps {
    ride: RideWithDetails;
    rideIndex: number;
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
    rideIndex,
    isUserDriverOfThisRide,
    isUserPassengerOfThisRide,
    hasExistingRide,
    isParticipating,
    onJoinRide,
    onLeaveRide,
    onRideUpdated,
}: RideCardProps) {
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const { user } = useOptimizedAuth();
    const { deleteRide } = useRideActions({ 
        currentUserId: user?.id || null, 
        matchId: ride.matchDayId,
        onSuccess: onRideUpdated 
    });
    
    const testIdPrefix = `md-ride-${rideIndex}`;

    const isRideFull = (): boolean => {
        return ride.passengers.length >= ride.availableSeats;
    };

    const handleEditRide = () => {
        setShowEditForm(true);
    };

    const handleDeleteRide = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        
        try {
            const result = await deleteRide(ride.id);
            
            if (result?.error) {
                throw new Error(result.error);
            }
            
            setShowDeleteConfirm(false);
            // onRideUpdated wird bereits vom Hook aufgerufen
        } catch (error) {
            console.error('Fehler beim Löschen der Fahrt:', error);
            // Hier könnte man eine Fehlerbehandlung hinzufügen
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const handleRideUpdated = () => {
        setShowEditForm(false);
        onRideUpdated();
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
    };

    return (
        <>
            <div className={styles.rideCard} data-testid={testIdPrefix}>
                <RideDetails ride={ride} isRideFull={isRideFull()} testIdPrefix={testIdPrefix} />

                <RidePassengers 
                    passengerCount={ride.passengerCount} 
                    passengerNames={ride.passengerNames}
                    testIdPrefix={testIdPrefix}
                />

                {ride.additionalInfo && (
                    <div className={styles.rideAdditionalInfo} data-testid={`${testIdPrefix}-additional-info`}>
                        <p className={styles.rideAdditionalInfoText}>&quot;{ride.additionalInfo}&quot;</p>
                    </div>
                )}

                <RideActions
                    isOwnRide={isUserDriverOfThisRide}
                    isUserInRide={isUserPassengerOfThisRide}
                    isRideFull={isRideFull()}
                    isUserDriver={hasExistingRide}
                    isUserParticipating={isParticipating}
                    testIdPrefix={testIdPrefix}
                    onEdit={handleEditRide}
                    onDelete={handleDeleteRide}
                    onJoin={() => onJoinRide(ride.id)}
                    onLeave={() => onLeaveRide(ride.id)}
                />
            </div>

            {/* Modal für EditRideForm */}
            <Modal 
                isOpen={showEditForm} 
                onClose={handleCancelEdit} 
                title="Fahrt bearbeiten" 
                maxWidth="md"
                data-testid={`md-edit-ride-${rideIndex}-modal`}
            >
                <EditRideForm ride={ride} onRideUpdated={handleRideUpdated} onCancel={handleCancelEdit} />
            </Modal>

            {/* Modal für Delete Confirmation */}
            <Modal 
                isOpen={showDeleteConfirm} 
                onClose={handleCancelDelete} 
                title="Fahrt löschen" 
                maxWidth="sm"
                data-testid={`${testIdPrefix}-delete-modal`}
            >
                <DeleteRideConfirm 
                    onConfirm={handleConfirmDelete} 
                    onCancel={handleCancelDelete}
                    loading={isDeleting}
                />
            </Modal>
        </>
    );
}

