// src/components/rides/RidePassengers.tsx
import { Icon } from "@/components/ui";
import styles from "./Rides.module.css";

interface RidePassengersProps {
    passengerCount: number;
    passengerNames?: string[];
    testIdPrefix?: string;
}

export default function RidePassengers({ passengerCount, passengerNames, testIdPrefix }: RidePassengersProps) {
    if (passengerCount === 0) return null;

    return (
        <div className={styles.ridePassengers} data-testid={testIdPrefix ? `${testIdPrefix}-passengers` : undefined}>
            <p className={styles.ridePassengersLabel} data-testid={testIdPrefix ? `${testIdPrefix}-passengers-label` : undefined}>Mitfahrer ({passengerCount})</p>
            <div className={styles.ridePassengersList} data-testid={testIdPrefix ? `${testIdPrefix}-passengers-list` : undefined}>
                {passengerNames?.map((name, index) => (
                    <span key={index} className={styles.ridePassengerTag} data-testid={testIdPrefix ? `${testIdPrefix}-passenger-${index}` : undefined}>
                        <Icon name="user" size={16} color="currentColor" />
                        {name}
                    </span>
                ))}
            </div>
        </div>
    );
}

