// src/components/rides/RideDetails.tsx
import { RideWithDetails } from "@/entities/Ride";
import styles from "./Rides.module.css";

interface RideDetailsProps {
    ride: RideWithDetails;
    isRideFull: boolean;
    testIdPrefix?: string;
}

export default function RideDetails({ ride, isRideFull, testIdPrefix }: RideDetailsProps) {
    return (
        <div className={styles.rideDetails} data-testid={testIdPrefix ? `${testIdPrefix}-details` : undefined}>
            <div className={styles.rideDetailsInfo}>
                <h4 className={styles.rideDetailsTitle} data-testid={testIdPrefix ? `${testIdPrefix}-title` : undefined}>
                    Abfahrt:{" "}
                    {(() => {
                        const date = new Date(ride.departureTime);
                        return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")} Uhr`;
                    })()}
                </h4>
                <p className={styles.rideDetailsLocation} data-testid={testIdPrefix ? `${testIdPrefix}-location` : undefined}>von {ride.departureLocation}</p>
                <p className={styles.rideDetailsDriver} data-testid={testIdPrefix ? `${testIdPrefix}-driver` : undefined}>
                    Fahrer: {ride.driver.firstName} {ride.driver.lastName}
                </p>
            </div>
            <div className={styles.rideDetailsSeats} data-testid={testIdPrefix ? `${testIdPrefix}-seats` : undefined}>
                <span className={`${styles.rideDetailsSeatsCount} ${isRideFull ? styles.rideDetailsSeatsFull : styles.rideDetailsSeatsAvailable}`}>
                    {ride.passengers.length}/{ride.availableSeats} Plätze
                </span>
            </div>
        </div>
    );
}

