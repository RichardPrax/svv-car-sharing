// src/pages/match/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MatchDay } from "@/entities/MatchDay";
import CreateRideForm from "@/components/CreateRideForm";
import RidesList from "@/components/rides/RidesList";

// Helper function to format date from YYYY-MM-DD to DD.MM.YYYY
const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

// Helper function to format time
const formatTime = (timeStr: string): string => {
    const timeWithoutSeconds = timeStr.substring(0, 5);
    return `Beginn: ${timeWithoutSeconds}`;
};

export default function MatchDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [match, setMatch] = useState<MatchDay | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const getMatchData = async () => {
            if (!id) return;

            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                router.push("/login");
                return;
            }

            const { data, error } = await supabase.from("match_days").select("*").eq("id", id).single();

            if (error) {
                console.error("Error fetching match:", error);
                router.push("/");
                return;
            }

            if (data) setMatch(data);
            setLoading(false);
        };

        getMatchData();
    }, [id, router]);
    const handleBackClick = () => {
        router.push("/");
    };

    const handleRideCreated = () => {
        setShowCreateForm(false);
        setRefreshTrigger((prev) => prev + 1);
    };

    const handleShowCreateForm = () => {
        setShowCreateForm(true);
    };

    const handleCancelCreate = () => {
        setShowCreateForm(false);
    };

    if (loading) return <p>Lade...</p>;
    if (!match) return <p>Spieltag nicht gefunden</p>;

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
                    maxWidth: "800px",
                    margin: "0 auto",
                    padding: "0 var(--spacing-md)",
                }}
            >
                {/* Back Button */}
                <button
                    onClick={handleBackClick}
                    style={{
                        backgroundColor: "var(--card-background)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "var(--radius-md)",
                        padding: "var(--spacing-sm) var(--spacing-md)",
                        fontSize: "0.875rem",
                        color: "var(--text-primary)",
                        cursor: "pointer",
                        marginBottom: "var(--spacing-xl)",
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--spacing-xs)",
                        transition: "all 0.2s ease-in-out",
                    }}
                    onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = "var(--card-past-background)";
                    }}
                    onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = "var(--card-background)";
                    }}
                >
                    ← Zurück zur Übersicht
                </button>

                {/* Match Details Card */}
                <div
                    style={{
                        backgroundColor: "var(--card-background)",
                        borderColor: "var(--card-border)",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderRadius: "var(--radius-lg)",
                        boxShadow: "var(--card-shadow)",
                        padding: "var(--spacing-xl)",
                        width: "100%",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "2rem",
                            fontWeight: "700",
                            color: "var(--text-primary)",
                            marginBottom: "var(--spacing-lg)",
                            textAlign: "center",
                        }}
                    >
                        Spieltag Details
                    </h1>

                    <div
                        style={{
                            display: "grid",
                            gap: "var(--spacing-lg)",
                        }}
                    >
                        {/* Date and Time */}
                        <div
                            style={{
                                textAlign: "center",
                                padding: "var(--spacing-lg)",
                                backgroundColor: "var(--background)",
                                borderRadius: "var(--radius-md)",
                            }}
                        >
                            <h2
                                style={{
                                    fontSize: "1.5rem",
                                    fontWeight: "700",
                                    color: "var(--text-primary)",
                                    marginBottom: "var(--spacing-xs)",
                                }}
                            >
                                {formatDate(match.date)}
                            </h2>
                            <p
                                style={{
                                    fontSize: "1.125rem",
                                    color: "var(--text-accent)",
                                    fontWeight: "600",
                                }}
                            >
                                {formatTime(match.time)}
                            </p>
                        </div>

                        {/* Match Info */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr",
                                gap: "var(--spacing-md)",
                            }}
                        >
                            <div
                                style={{
                                    padding: "var(--spacing-md)",
                                    borderLeft: "4px solid var(--text-accent)",
                                    backgroundColor: "var(--background)",
                                }}
                            >
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
                                        fontSize: "1.25rem",
                                        fontWeight: "600",
                                        color: "var(--text-primary)",
                                    }}
                                >
                                    {match.opponent}
                                </p>
                            </div>
                            <div
                                style={{
                                    padding: "var(--spacing-md)",
                                    borderLeft: "4px solid var(--text-accent)",
                                    backgroundColor: "var(--background)",
                                }}
                            >
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
                                    Spielort
                                </h3>
                                <p
                                    style={{
                                        fontSize: "1.25rem",
                                        fontWeight: "600",
                                        color: "var(--text-primary)",
                                    }}
                                >
                                    {match.location}
                                </p>
                            </div>{" "}
                        </div>
                    </div>
                </div>

                {/* Fahrtverwaltung Sektion */}
                <div
                    style={{
                        backgroundColor: "var(--card-background)",
                        borderColor: "var(--card-border)",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderRadius: "var(--radius-lg)",
                        boxShadow: "var(--card-shadow)",
                        padding: "var(--spacing-xl)",
                        width: "100%",
                        marginTop: "var(--spacing-xl)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "var(--spacing-lg)",
                            flexWrap: "wrap",
                            gap: "var(--spacing-sm)",
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: "700",
                                color: "var(--text-primary)",
                                margin: 0,
                            }}
                        >
                            🚗 Fahrgemeinschaften
                        </h2>
                        {!showCreateForm && (
                            <button
                                onClick={handleShowCreateForm}
                                style={{
                                    padding: "var(--spacing-sm) var(--spacing-md)",
                                    border: "none",
                                    borderRadius: "var(--radius-sm)",
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    color: "white",
                                    backgroundColor: "var(--text-accent)",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease-in-out",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "var(--spacing-xs)",
                                }}
                                onMouseEnter={(e) => {
                                    (e.target as HTMLElement).style.transform = "translateY(-1px)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.target as HTMLElement).style.transform = "translateY(0)";
                                }}
                            >
                                + Fahrt anbieten
                            </button>
                        )}
                    </div>

                    {/* Create Ride Form */}
                    {showCreateForm && <CreateRideForm matchId={match.id} onRideCreated={handleRideCreated} onCancel={handleCancelCreate} />}

                    {/* Rides List */}
                    <RidesList matchId={match.id} refreshTrigger={refreshTrigger} />
                </div>
            </div>
        </div>
    );
}
