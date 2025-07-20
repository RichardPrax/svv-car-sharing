// src/components/rides/RidePassengers.tsx
import styles from "./Rides.module.css";

interface RidePassengersProps {
    passengerCount: number;
    passengerNames?: string[];
}

export default function RidePassengers({ passengerCount, passengerNames }: RidePassengersProps) {
    if (passengerCount === 0) return null;

    return (
        <div className={styles.ridePassengers}>
            <p className={styles.ridePassengersLabel}>Mitfahrer ({passengerCount})</p>
            <div className={styles.ridePassengersList}>
                {passengerNames?.map((name, index) => (
                    <span key={index} className={styles.ridePassengerTag}>
                        👤 {name}
                    </span>
                ))}
            </div>
        </div>
    );
}

