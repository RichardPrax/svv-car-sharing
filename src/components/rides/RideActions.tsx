// src/components/rides/RideActions.tsx
import styles from "./Rides.module.css";

interface RideActionsProps {
    isOwnRide: boolean;
    isUserInRide: boolean;
    isRideFull: boolean;
    isUserDriver: boolean;
    isUserParticipating: boolean;
    onEdit: () => void;
    onJoin: () => void;
    onLeave: () => void;
}

export default function RideActions({ isOwnRide, isUserInRide, isRideFull, isUserDriver, isUserParticipating, onEdit, onJoin, onLeave }: RideActionsProps) {
    // Bestimme, ob der "Mitfahren" Button deaktiviert werden soll
    // isUserDriver bedeutet hier: "Bietet der User bereits eine Fahrt für diesen Spieltag an"
    // isUserParticipating bedeutet: "Ist der User bereits Mitfahrer in einer anderen Fahrt"
    const canJoin = !isRideFull && !isUserDriver && !isUserParticipating && !isOwnRide;

    const getJoinButtonText = () => {
        if (isRideFull) return "Voll";
        if (isUserDriver) return "Sie fahren bereits";
        if (isUserParticipating) return "Bereits angemeldet";
        return "Mitfahren";
    };

    const getJoinButtonTitle = () => {
        if (isUserDriver) return "Sie können sich nicht als Mitfahrer anmelden, da Sie bereits eine Fahrt anbieten";
        if (isUserParticipating) return "Sie sind bereits als Mitfahrer in einer anderen Fahrt angemeldet";
        if (isRideFull) return "Diese Fahrt ist bereits voll";
        return "Als Mitfahrer anmelden";
    };

    return (
        <div className={styles.rideActions}>
            <div className={styles.rideActionsLeft}>
                {isOwnRide && (
                    <>
                        <span className={styles.ownRideIndicator}>Ihre Fahrt</span>
                        <button onClick={onEdit} className={styles.editButton}>
                            ✏️ Bearbeiten
                        </button>
                    </>
                )}
            </div>
            <div className={styles.rideActionsRight}>
                {!isOwnRide && (
                    <>
                        {isUserInRide ? (
                            <button onClick={onLeave} className={styles.leaveButton}>
                                Aussteigen
                            </button>
                        ) : (
                            <button
                                onClick={onJoin}
                                disabled={!canJoin}
                                title={getJoinButtonTitle()}
                                className={`${styles.joinButton} ${canJoin ? styles.joinButtonEnabled : styles.joinButtonDisabled}`}
                            >
                                {getJoinButtonText()}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

