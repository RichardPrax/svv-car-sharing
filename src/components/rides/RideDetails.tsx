// src/components/rides/RideDetails.tsx
import { RideWithDetails } from "@/entities/Ride";
import styles from "./Rides.module.css";

interface RideDetailsProps {
    ride: RideWithDetails;
    isRideFull: boolean;
}

export default function RideDetails({ ride, isRideFull }: RideDetailsProps) {
    return (
        <div className={styles.rideDetails}>
            <div className={styles.rideDetailsInfo}>
                <h4 className={styles.rideDetailsTitle}>
                    Abfahrt:{" "}
                    {(() => {
                        const date = new Date(ride.departureTime);
                        return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")} Uhr`;
                    })()}
                </h4>
                <p className={styles.rideDetailsLocation}>von {ride.departureLocation}</p>
                <p className={styles.rideDetailsDriver}>
                    Fahrer: {ride.driver.firstName} {ride.driver.lastName}
                </p>
            </div>
            <div className={styles.rideDetailsSeats}>
                <span className={`${styles.rideDetailsSeatsCount} ${isRideFull ? styles.rideDetailsSeatsFull : styles.rideDetailsSeatsAvailable}`}>
                    {ride.passengers.length}/{ride.availableSeats} Plätze
                </span>
            </div>
        </div>
    );
}

