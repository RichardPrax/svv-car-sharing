// src/components/rides/RideActions.tsx
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
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "var(--spacing-sm)",
            }}
        >
            <div>
                {isOwnRide && (
                    <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
                        <span
                            style={{
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                color: "var(--text-accent)",
                                backgroundColor: "#f0fdf4",
                                padding: "var(--spacing-xs) var(--spacing-sm)",
                                borderRadius: "var(--radius-sm)",
                            }}
                        >
                            Ihre Fahrt
                        </span>
                        <button
                            onClick={onEdit}
                            style={{
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                color: "var(--text-primary)",
                                backgroundColor: "var(--card-background)",
                                border: "1px solid var(--card-border)",
                                padding: "var(--spacing-xs) var(--spacing-sm)",
                                borderRadius: "var(--radius-sm)",
                                cursor: "pointer",
                                transition: "all 0.2s ease-in-out",
                            }}
                        >
                            ✏️ Bearbeiten
                        </button>
                    </div>
                )}
            </div>
            <div>
                {!isOwnRide && (
                    <>
                        {isUserInRide ? (
                            <button
                                onClick={onLeave}
                                style={{
                                    padding: "var(--spacing-xs) var(--spacing-sm)",
                                    border: "1px solid #dc2626",
                                    borderRadius: "var(--radius-sm)",
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    color: "#dc2626",
                                    backgroundColor: "white",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease-in-out",
                                }}
                            >
                                Aussteigen
                            </button>
                        ) : (
                            <button
                                onClick={onJoin}
                                disabled={!canJoin}
                                title={getJoinButtonTitle()}
                                style={{
                                    padding: "var(--spacing-xs) var(--spacing-sm)",
                                    border: "none",
                                    borderRadius: "var(--radius-sm)",
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    color: "white",
                                    backgroundColor: canJoin ? "var(--text-accent)" : "#9ca3af",
                                    cursor: canJoin ? "pointer" : "not-allowed",
                                    transition: "all 0.2s ease-in-out",
                                    opacity: canJoin ? 1 : 0.7,
                                }}
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

