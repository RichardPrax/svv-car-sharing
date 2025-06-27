// src/pages/match/[id].tsx
import { useRouter } from "next/router";
import { useState } from "react";
import { useMatchDetail } from "@/hooks/matches/useMatchDetail";
import { useUserRideCheck } from "@/hooks/rides/useUserRideCheck";
import { formatDate, formatTime } from "@/utils/dateTime";
import { CreateRideForm } from "@/components/forms";
import { RidesList } from "@/components/rides";

export default function MatchDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showExistingRideWarning, setShowExistingRideWarning] = useState(false);

    const { match, loading, error } = useMatchDetail(id);
    const {
        hasExistingRide,
        loading: checkingRide,
        recheckExistingRide,
    } = useUserRideCheck({
        matchId: id as string,
    });

    const handleBackClick = () => {
        router.push("/");
    };

    const handleRideCreated = () => {
        setShowCreateForm(false);
        setRefreshTrigger((prev) => prev + 1);
        recheckExistingRide();
    };

    const handleCancelCreate = () => {
        setShowCreateForm(false);
    };

    const handleShowCreateForm = () => {
        setShowCreateForm(true);
    };

    const handleRideUpdated = () => {
        setRefreshTrigger((prev) => prev + 1);
        recheckExistingRide();
    };

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    backgroundColor: "var(--background)",
                }}
            >
                <p style={{ color: "var(--text-secondary)" }}>Lade Spieltag...</p>
            </div>
        );
    }

    if (error || !match) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    backgroundColor: "var(--background)",
                    gap: "var(--spacing-md)",
                }}
            >
                <p style={{ color: "#dc2626", textAlign: "center" }}>{error || "Spieltag nicht gefunden"}</p>
                <button
                    onClick={handleBackClick}
                    style={{
                        padding: "var(--spacing-sm) var(--spacing-md)",
                        backgroundColor: "var(--text-accent)",
                        color: "white",
                        border: "none",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                    }}
                >
                    Zurück zur Übersicht
                </button>
            </div>
        );
    }

    return (
        <div
            style={{
                padding: "var(--spacing-lg) 0",
                minHeight: "100vh",
                backgroundColor: "var(--background)",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "0 var(--spacing-md)",
                }}
            >
                {/* Header with Back Button */}
                <div
                    style={{
                        marginBottom: "var(--spacing-xl)",
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--spacing-md)",
                    }}
                >
                    <button
                        onClick={handleBackClick}
                        style={{
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            backgroundColor: "var(--card-background)",
                            color: "var(--text-secondary)",
                            border: "1px solid var(--card-border)",
                            borderRadius: "var(--radius-sm)",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            transition: "all 0.2s ease-in-out",
                        }}
                    >
                        ← Zurück
                    </button>
                </div>

                {/* Match Info Card */}
                <div
                    style={{
                        backgroundColor: "var(--card-background)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "var(--radius-lg)",
                        padding: "var(--spacing-xl)",
                        marginBottom: "var(--spacing-xl)",
                        textAlign: "center",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "2rem",
                            fontWeight: "700",
                            color: "var(--text-primary)",
                            marginBottom: "var(--spacing-lg)",
                        }}
                    >
                        {formatDate(match.date)}
                    </h1>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "var(--spacing-lg)",
                            marginBottom: "var(--spacing-lg)",
                        }}
                    >
                        <div>
                            <h3
                                style={{
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    color: "var(--text-secondary)",
                                    marginBottom: "var(--spacing-xs)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.025em",
                                }}
                            >
                                Zeit
                            </h3>
                            <p
                                style={{
                                    fontSize: "1.125rem",
                                    fontWeight: "600",
                                    color: "var(--text-primary)",
                                    margin: "0",
                                }}
                            >
                                {formatTime(match.time)}
                            </p>
                        </div>

                        <div>
                            <h3
                                style={{
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    color: "var(--text-secondary)",
                                    marginBottom: "var(--spacing-xs)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.025em",
                                }}
                            >
                                Gegner
                            </h3>
                            <p
                                style={{
                                    fontSize: "1.125rem",
                                    fontWeight: "600",
                                    color: "var(--text-primary)",
                                    margin: "0",
                                }}
                            >
                                {match.opponent}
                            </p>
                        </div>

                        <div>
                            <h3
                                style={{
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    color: "var(--text-secondary)",
                                    marginBottom: "var(--spacing-xs)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.025em",
                                }}
                            >
                                Ort
                            </h3>
                            <p
                                style={{
                                    fontSize: "1.125rem",
                                    fontWeight: "600",
                                    color: "var(--text-primary)",
                                    margin: "0",
                                }}
                            >
                                {match.location}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Rides Section */}
                <div
                    style={{
                        backgroundColor: "var(--card-background)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "var(--radius-lg)",
                        padding: "var(--spacing-xl)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "var(--spacing-lg)",
                            flexWrap: "wrap",
                            gap: "var(--spacing-md)",
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: "700",
                                color: "var(--text-primary)",
                                margin: "0",
                            }}
                        >
                            Fahrten
                        </h2>
                        <div style={{ position: "relative" }}>
                            <button
                                onClick={handleShowCreateForm}
                                disabled={hasExistingRide || checkingRide}
                                title={hasExistingRide ? "Sie haben bereits eine Fahrt für diesen Spieltag angeboten" : "Neue Fahrt anbieten"}
                                style={{
                                    padding: "var(--spacing-sm) var(--spacing-md)",
                                    backgroundColor: hasExistingRide ? "#9ca3af" : "var(--text-accent)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "var(--radius-sm)",
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    cursor: hasExistingRide ? "not-allowed" : "pointer",
                                    transition: "all 0.2s ease-in-out",
                                    opacity: hasExistingRide ? 0.7 : 1,
                                }}
                            >
                                {checkingRide ? "Überprüfe..." : hasExistingRide ? "Bereits angeboten" : "+ Fahrt anbieten"}
                            </button>

                            {showExistingRideWarning && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "calc(100% + 8px)",
                                        right: "0",
                                        backgroundColor: "#fef2f2",
                                        color: "#dc2626",
                                        padding: "var(--spacing-sm)",
                                        borderRadius: "var(--radius-sm)",
                                        border: "1px solid #fecaca",
                                        fontSize: "0.875rem",
                                        whiteSpace: "nowrap",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                        zIndex: 10,
                                    }}
                                >
                                    Sie haben bereits eine Fahrt für diesen Spieltag angeboten
                                </div>
                            )}
                        </div>
                    </div>

                    <RidesList matchId={match.id} refreshTrigger={refreshTrigger} onRideUpdated={handleRideUpdated} />

                    {showCreateForm && <CreateRideForm matchId={match.id} onRideCreated={handleRideCreated} onCancel={handleCancelCreate} />}
                </div>
            </div>
        </div>
    );
}

