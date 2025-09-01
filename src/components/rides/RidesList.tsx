// src/components/rides/RidesList.tsx
import { useState } from "react";
import { useOptimizedCurrentUser } from "@/hooks/rides/useOptimizedCurrentUser";
import { useOptimizedUserProfiles } from "@/hooks/auth/useUserProfileCache";
import { useRideActions } from "@/hooks/rides";
import { useRides } from "@/hooks/rides/useRides";
import { useUserRideCheck } from "@/hooks/rides/useUserRideCheck";
import { useUserParticipationCheck } from "@/hooks/rides/useUserParticipationCheck";
import RideCard from "./RideCard";
import { CreateRideForm } from "@/components/forms";
import { LoadingSpinner, Modal } from "@/components/ui";
import styles from "./Rides.module.css";
import pageStyles from "../../styles/Pages.module.css";

interface RidesListProps {
    matchId: string;
    matchDate: string | Date;
}

export default function RidesList({ matchId }: RidesListProps) {
    const { currentUserId } = useOptimizedCurrentUser();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showExistingRideWarning, setShowExistingRideWarning] = useState(false);
    
    // Verwende eigene Hooks für Daten
    const { rides, loading, error } = useRides({ matchId, refreshTrigger });
    const { hasExistingRide } = useUserRideCheck({ matchId, refreshTrigger });
    const { isParticipating } = useUserParticipationCheck({ matchId, refreshTrigger });
    
    const testIdPrefix = "md";

    // Sammle alle User-IDs aus den Rides für optimiertes Preloading
    const allUserIds = rides
        .flatMap((ride) => [
            ride.driverId, 
            ...(ride.passengers || []).map((p) => p.passengerId)
        ])
        .filter((id) => id && typeof id === 'string' && id.trim() !== '');

    // Preload alle benötigten User-Profile in einem Batch
    const { getProfileName } = useOptimizedUserProfiles(allUserIds);

    const { joinRide, leaveRide } = useRideActions({
        currentUserId,
        matchId,
        onSuccess: () => {
            setRefreshTrigger((prev) => prev + 1);
        },
    });

    const handleRideUpdated = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    const handleShowCreateForm = () => {
        if (hasExistingRide) {
            setShowExistingRideWarning(true);
            setTimeout(() => setShowExistingRideWarning(false), 3000);
            return;
        }
        if (isParticipating) {
            setShowExistingRideWarning(true);
            setTimeout(() => setShowExistingRideWarning(false), 3000);
            return;
        }
        setShowCreateForm(true);
    };

    const handleRideCreated = () => {
        setShowCreateForm(false);
        setRefreshTrigger((prev) => prev + 1);
    };

    const handleCancelCreate = () => {
        setShowCreateForm(false);
    };

    const handleJoinRide = async (rideId: string) => {
        const result = await joinRide(rideId);
        if (result.error) {
            console.error("Join ride error:", result.error);
            // Hier könnte man eine Toast-Nachricht anzeigen
        }
    };

    const handleLeaveRide = async (rideId: string) => {
        const result = await leaveRide(rideId);
        if (result.error) {
            console.error("Leave ride error:", result.error);
            // Hier könnte man eine Toast-Nachricht anzeigen
        }
    };

    // Enriche Rides mit gecachten User-Namen (nur für Driver, da Passengers bereits korrekt von API kommen)
    const enrichedRides = rides.map((ride) => ({
        ...ride,
        driverName: ride.driverId ? getProfileName(ride.driverId) : 'Unbekannter Fahrer',
        // passengerNames kommen bereits korrekt von der API über useRides
    }));

    if (loading) {
        return (
            <div>
                <div className={pageStyles.summaryHeader}>
                    <h2 className={pageStyles.summaryTitle}>Fahrten-Übersicht</h2>
                    <div className={pageStyles.summaryActions}>
                        <button
                            disabled={true}
                            className={pageStyles.headerActionButton}
                            style={{ opacity: 0.7 }}
                        >
                            Wird geladen...
                        </button>
                    </div>
                </div>
                <LoadingSpinner message="Lade Fahrten..." data-testid={`${testIdPrefix}-rides-loading`} />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className={pageStyles.summaryHeader}>
                    <h2 className={pageStyles.summaryTitle}>Fahrten-Übersicht</h2>
                    <div className={pageStyles.summaryActions}>
                        <button
                            disabled={true}
                            className={pageStyles.headerActionButton}
                            style={{ opacity: 0.7 }}
                        >
                            Fehler
                        </button>
                    </div>
                </div>
                <div className={styles.ridesListError} data-testid={`${testIdPrefix}-rides-error`}>{error}</div>
            </div>
        );
    }

    return (
        <div>
            <div className={pageStyles.summaryHeader}>
                <h2 className={pageStyles.summaryTitle}>Fahrten-Übersicht</h2>
                <div className={pageStyles.summaryActions}>
                    <button
                        data-testid="md-create-ride"
                        onClick={handleShowCreateForm}
                        disabled={hasExistingRide || isParticipating || loading}
                        title={
                            hasExistingRide
                                ? "Sie haben bereits eine Fahrt für diesen Spieltag angeboten"
                                : isParticipating
                                ? "Sie können keine eigene Fahrt anbieten, da Sie bereits als Mitfahrer angemeldet sind"
                                : "Neue Fahrt anbieten"
                        }
                        className={pageStyles.headerActionButton}
                        style={{
                            backgroundColor: hasExistingRide || isParticipating ? "#9ca3af" : undefined,
                            cursor: hasExistingRide || isParticipating ? "not-allowed" : "pointer",
                            opacity: hasExistingRide || isParticipating ? 0.7 : 1,
                            position: "relative"
                        }}
                    >
                        {loading ? "Überprüfe..." : hasExistingRide ? "Bereits angeboten" : isParticipating ? "Als Mitfahrer angemeldet" : "+ Fahrt anbieten"}
                    </button>

                    {showExistingRideWarning && (
                        <div
                            className={pageStyles.warningAlert}
                            style={{
                                position: "absolute",
                                top: "calc(100% + 8px)",
                                right: "0",
                                fontSize: "0.875rem",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                zIndex: 10,
                                maxWidth: "300px",
                                whiteSpace: "normal",
                            }}
                        >
                            {hasExistingRide
                                ? "Sie haben bereits eine Fahrt für diesen Spieltag angeboten"
                                : "Sie können keine eigene Fahrt anbieten, da Sie bereits als Mitfahrer angemeldet sind"}
                        </div>
                    )}
                </div>
            </div>

            {enrichedRides.length === 0 ? (
                <div className={styles.ridesListEmpty} data-testid={`${testIdPrefix}-rides-empty`}>
                    Noch keine Fahrten erstellt.
                    {!hasExistingRide && !isParticipating && (
                        <>
                            <br />
                            Erstelle die erste Fahrt!
                        </>
                    )}
                </div>
            ) : (
                <div className={styles.ridesList} data-testid={`${testIdPrefix}-rides-list`}>
                    {enrichedRides.map((ride, index) => {
                        // Check ob User bereits Fahrer oder Mitfahrer ist
                        const isUserDriverOfThisRide = ride.driverId === currentUserId;
                        const isUserPassengerOfThisRide = ride.passengers.some((p) => p.passengerId === currentUserId);

                        return (
                            <RideCard
                                key={ride.id}
                                ride={ride}
                                rideIndex={index}
                                isUserDriverOfThisRide={isUserDriverOfThisRide}
                                isUserPassengerOfThisRide={isUserPassengerOfThisRide}
                                hasExistingRide={hasExistingRide}
                                isParticipating={isParticipating}
                                onJoinRide={handleJoinRide}
                                onLeaveRide={handleLeaveRide}
                                onRideUpdated={handleRideUpdated}
                            />
                        );
                    })}
                </div>
            )}

            {/* Modal für CreateRideForm */}
            <Modal isOpen={showCreateForm} onClose={handleCancelCreate} title="Fahrt anbieten" maxWidth="md">
                <CreateRideForm matchId={matchId} onRideCreated={handleRideCreated} onCancel={handleCancelCreate} />
            </Modal>
        </div>
    );
}

