// src/components/rides/RideDetails.tsx
import { RideWithDetails } from "@/entities/Ride";

interface RideDetailsProps {
    ride: RideWithDetails;
    isRideFull: boolean;
}

export default function RideDetails({ ride, isRideFull }: RideDetailsProps) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "var(--spacing-md)",
                flexWrap: "wrap",
                gap: "var(--spacing-sm)",
            }}
        >
            <div>
                <h4
                    style={{
                        fontSize: "1.125rem",
                        fontWeight: "700",
                        color: "var(--text-primary)",
                        margin: "0 0 var(--spacing-xs) 0",
                    }}
                >
                    Abfahrt: {ride.departureTime instanceof Date ? 
                        ride.departureTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : 
                        ride.departureTime
                    }
                </h4>
                <p
                    style={{
                        fontSize: "0.875rem",
                        color: "var(--text-secondary)",
                        margin: 0,
                    }}
                >
                    von {ride.departureLocation}
                </p>
                <p
                    style={{
                        fontSize: "0.75rem",
                        color: "var(--text-accent)",
                        margin: "var(--spacing-xs) 0 0 0",
                        fontWeight: "600",
                    }}
                >
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    Fahrer: {(ride.driver as any)?.firstName} {(ride.driver as any)?.lastName}
                </p>
            </div>
            <div
                style={{
                    textAlign: "right",
                }}
            >
                <span
                    style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: isRideFull ? "#dc2626" : "var(--text-accent)",
                        backgroundColor: isRideFull ? "#fef2f2" : "#f0fdf4",
                        padding: "var(--spacing-xs) var(--spacing-sm)",
                        borderRadius: "var(--radius-sm)",
                    }}
                >
                    {ride.passengerCount}/{ride.availableSeats} Plätze
                </span>
            </div>
        </div>
    );
}

