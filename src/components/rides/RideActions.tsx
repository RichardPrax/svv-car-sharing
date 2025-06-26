// src/components/rides/RideActions.tsx
interface RideActionsProps {
    isOwnRide: boolean;
    isUserInRide: boolean;
    isRideFull: boolean;
    onEdit: () => void;
    onJoin: () => void;
    onLeave: () => void;
}

export default function RideActions({ isOwnRide, isUserInRide, isRideFull, onEdit, onJoin, onLeave }: RideActionsProps) {
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
                                disabled={isRideFull}
                                style={{
                                    padding: "var(--spacing-xs) var(--spacing-sm)",
                                    border: "none",
                                    borderRadius: "var(--radius-sm)",
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    color: "white",
                                    backgroundColor: isRideFull ? "#9ca3af" : "var(--text-accent)",
                                    cursor: isRideFull ? "not-allowed" : "pointer",
                                    transition: "all 0.2s ease-in-out",
                                }}
                            >
                                {isRideFull ? "Voll" : "Mitfahren"}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
