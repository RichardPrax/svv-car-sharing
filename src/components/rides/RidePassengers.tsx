// src/components/rides/RidePassengers.tsx
interface RidePassengersProps {
    passengerCount: number;
    passengerNames?: string[];
}

export default function RidePassengers({ passengerCount, passengerNames }: RidePassengersProps) {
    if (passengerCount === 0) return null;

    return (
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
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    color: "var(--text-secondary)",
                    margin: "0 0 var(--spacing-xs) 0",
                    textTransform: "uppercase",
                    letterSpacing: "0.025em",
                }}
            >
                Mitfahrer ({passengerCount})
            </p>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--spacing-xs)",
                }}
            >
                {passengerNames?.map((name, index) => (
                    <span
                        key={index}
                        style={{
                            fontSize: "0.75rem",
                            color: "var(--text-primary)",
                            backgroundColor: "var(--card-background)",
                            padding: "var(--spacing-xs)",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--card-border)",
                        }}
                    >
                        👤 {name}
                    </span>
                ))}
            </div>
        </div>
    );
}
