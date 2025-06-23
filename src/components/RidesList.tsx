// src/components/RidesList.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RideWithDetails } from "@/entities/Ride";
import EditRideForm from "./EditRideForm";

type Props = {
  matchId: string;
  refreshTrigger: number;
};

export default function RidesList({ matchId, refreshTrigger }: Props) {
  const [rides, setRides] = useState<RideWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editingRideId, setEditingRideId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id || null);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      try {
        // Lade Fahrten mit Mitfahrer-Details und Benutzer-Profilen
        const { data: ridesData, error: ridesError } = await supabase
          .from("rides")
          .select(
            `
            *,
            ride_passengers (
              id,
              passenger_id,
              joined_at
            )
          `
          )
          .eq("match_day_id", matchId)
          .order("departure_time", { ascending: true });

        if (ridesError) {
          console.error("Error fetching rides:", ridesError);
          return;
        }
        // Lade Benutzerprofile für alle beteiligten User IDs
        const allUserIds = new Set<string>();
        ridesData.forEach((ride) => {
          allUserIds.add(ride.driver_id);
          ride.ride_passengers?.forEach((passenger: any) => {
            allUserIds.add(passenger.passenger_id);
          });
        });

        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, display_name, email")
          .in("id", Array.from(allUserIds));

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          // Fallback: Verwende auth.users wenn profiles nicht existiert
          const { data: usersData } = await supabase.auth.admin.listUsers();
          const userMap = new Map();
          usersData.users?.forEach((user) => {
            userMap.set(user.id, user.email || user.id);
          });
          const ridesWithDetails: RideWithDetails[] = ridesData.map((ride) => ({
            ...ride,
            passenger_count: ride.ride_passengers?.length || 0,
            passengers: ride.ride_passengers || [],
            driver_name: userMap.get(ride.driver_id) || "Unbekannt",
            passenger_names:
              ride.ride_passengers?.map(
                (p: any) => userMap.get(p.passenger_id) || "Unbekannt"
              ) || [],
          }));

          setRides(ridesWithDetails);
          return;
        }

        // Erstelle eine Map für schnelle Lookups
        const profileMap = new Map();
        profilesData?.forEach((profile) => {
          profileMap.set(
            profile.id,
            profile.display_name || profile.email || "Unbekannt"
          );
        });
        // Transformiere die Daten mit Benutzer-Namen
        const ridesWithDetails: RideWithDetails[] = ridesData.map((ride) => ({
          ...ride,
          passenger_count: ride.ride_passengers?.length || 0,
          passengers: ride.ride_passengers || [],
          driver_name: profileMap.get(ride.driver_id) || "Unbekannt",
          passenger_names:
            ride.ride_passengers?.map(
              (p: any) => profileMap.get(p.passenger_id) || "Unbekannt"
            ) || [],
        }));

        setRides(ridesWithDetails);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [matchId, refreshTrigger]);
  const handleJoinRide = async (rideId: string) => {
    if (!currentUserId) return;

    try {
      const { error } = await supabase.from("ride_passengers").insert({
        ride_id: rideId,
        passenger_id: currentUserId,
      });

      if (error) {
        console.error("Error joining ride:", error);
        return;
      }

      // Lade aktuellen User-Namen für das Update
      const { data: profileData } = await supabase
        .from("profiles")
        .select("display_name, email")
        .eq("id", currentUserId)
        .single();

      const currentUserName =
        profileData?.display_name || profileData?.email || "Unbekannt";

      // Refresh the rides list mit aktualisierten Namen
      setRides((prevRides) =>
        prevRides.map((ride) =>
          ride.id === rideId
            ? {
                ...ride,
                passenger_count: ride.passenger_count + 1,
                passengers: [
                  ...ride.passengers!,
                  {
                    id: `temp-${Date.now()}`,
                    ride_id: rideId,
                    passenger_id: currentUserId,
                    joined_at: new Date().toISOString(),
                  },
                ],
                passenger_names: [
                  ...(ride.passenger_names || []),
                  currentUserName,
                ],
              }
            : ride
        )
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleLeaveRide = async (rideId: string) => {
    if (!currentUserId) return;

    try {
      const { error } = await supabase
        .from("ride_passengers")
        .delete()
        .eq("ride_id", rideId)
        .eq("passenger_id", currentUserId);

      if (error) {
        console.error("Error leaving ride:", error);
        return;
      }

      // Lade aktuellen User-Namen für das Update
      const { data: profileData } = await supabase
        .from("profiles")
        .select("display_name, email")
        .eq("id", currentUserId)
        .single();

      const currentUserName =
        profileData?.display_name || profileData?.email || "Unbekannt";

      // Refresh the rides list mit entferntem Namen
      setRides((prevRides) =>
        prevRides.map((ride) =>
          ride.id === rideId
            ? {
                ...ride,
                passenger_count: Math.max(0, ride.passenger_count - 1),
                passengers: ride.passengers!.filter(
                  (p) => p.passenger_id !== currentUserId
                ),
                passenger_names: (ride.passenger_names || []).filter(
                  (name) => name !== currentUserName
                ),
              }
            : ride
        )
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditRide = (rideId: string) => {
    setEditingRideId(rideId);
  };

  const handleRideUpdated = () => {
    setEditingRideId(null);
    // Trigger refresh
    const fetchRides = async () => {
      setLoading(true);
      try {
        // Lade Fahrten mit Mitfahrer-Details und Benutzer-Profilen
        const { data: ridesData, error: ridesError } = await supabase
          .from("rides")
          .select(
            `
            *,
            ride_passengers (
              id,
              passenger_id,
              joined_at
            )
          `
          )
          .eq("match_day_id", matchId)
          .order("departure_time", { ascending: true });

        if (ridesError) {
          console.error("Error fetching rides:", ridesError);
          return;
        }
        // Lade Benutzerprofile für alle beteiligten User IDs
        const allUserIds = new Set<string>();
        ridesData.forEach((ride) => {
          allUserIds.add(ride.driver_id);
          ride.ride_passengers?.forEach((passenger: any) => {
            allUserIds.add(passenger.passenger_id);
          });
        });

        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, display_name, email")
          .in("id", Array.from(allUserIds));

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          // Fallback: Verwende auth.users wenn profiles nicht existiert
          const { data: usersData } = await supabase.auth.admin.listUsers();
          const userMap = new Map();
          usersData.users?.forEach((user) => {
            userMap.set(user.id, user.email || user.id);
          });
          const ridesWithDetails: RideWithDetails[] = ridesData.map((ride) => ({
            ...ride,
            passenger_count: ride.ride_passengers?.length || 0,
            passengers: ride.ride_passengers || [],
            driver_name: userMap.get(ride.driver_id) || "Unbekannt",
            passenger_names:
              ride.ride_passengers?.map(
                (p: any) => userMap.get(p.passenger_id) || "Unbekannt"
              ) || [],
          }));

          setRides(ridesWithDetails);
          return;
        }

        // Erstelle eine Map für schnelle Lookups
        const profileMap = new Map();
        profilesData?.forEach((profile) => {
          profileMap.set(
            profile.id,
            profile.display_name || profile.email || "Unbekannt"
          );
        });
        // Transformiere die Daten mit Benutzer-Namen
        const ridesWithDetails: RideWithDetails[] = ridesData.map((ride) => ({
          ...ride,
          passenger_count: ride.ride_passengers?.length || 0,
          passengers: ride.ride_passengers || [],
          driver_name: profileMap.get(ride.driver_id) || "Unbekannt",
          passenger_names:
            ride.ride_passengers?.map(
              (p: any) => profileMap.get(p.passenger_id) || "Unbekannt"
            ) || [],
        }));

        setRides(ridesWithDetails);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  };

  const handleRideDeleted = () => {
    setEditingRideId(null);
    // Trigger refresh
    const fetchRides = async () => {
      setLoading(true);
      try {
        // Lade Fahrten mit Mitfahrer-Details und Benutzer-Profilen
        const { data: ridesData, error: ridesError } = await supabase
          .from("rides")
          .select(
            `
            *,
            ride_passengers (
              id,
              passenger_id,
              joined_at
            )
          `
          )
          .eq("match_day_id", matchId)
          .order("departure_time", { ascending: true });

        if (ridesError) {
          console.error("Error fetching rides:", ridesError);
          return;
        }
        // Lade Benutzerprofile für alle beteiligten User IDs
        const allUserIds = new Set<string>();
        ridesData.forEach((ride) => {
          allUserIds.add(ride.driver_id);
          ride.ride_passengers?.forEach((passenger: any) => {
            allUserIds.add(passenger.passenger_id);
          });
        });

        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, display_name, email")
          .in("id", Array.from(allUserIds));

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          // Fallback: Verwende auth.users wenn profiles nicht existiert
          const { data: usersData } = await supabase.auth.admin.listUsers();
          const userMap = new Map();
          usersData.users?.forEach((user) => {
            userMap.set(user.id, user.email || user.id);
          });
          const ridesWithDetails: RideWithDetails[] = ridesData.map((ride) => ({
            ...ride,
            passenger_count: ride.ride_passengers?.length || 0,
            passengers: ride.ride_passengers || [],
            driver_name: userMap.get(ride.driver_id) || "Unbekannt",
            passenger_names:
              ride.ride_passengers?.map(
                (p: any) => userMap.get(p.passenger_id) || "Unbekannt"
              ) || [],
          }));

          setRides(ridesWithDetails);
          return;
        }

        // Erstelle eine Map für schnelle Lookups
        const profileMap = new Map();
        profilesData?.forEach((profile) => {
          profileMap.set(
            profile.id,
            profile.display_name || profile.email || "Unbekannt"
          );
        });
        // Transformiere die Daten mit Benutzer-Namen
        const ridesWithDetails: RideWithDetails[] = ridesData.map((ride) => ({
          ...ride,
          passenger_count: ride.ride_passengers?.length || 0,
          passengers: ride.ride_passengers || [],
          driver_name: profileMap.get(ride.driver_id) || "Unbekannt",
          passenger_names:
            ride.ride_passengers?.map(
              (p: any) => profileMap.get(p.passenger_id) || "Unbekannt"
            ) || [],
        }));

        setRides(ridesWithDetails);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  };

  const handleCancelEdit = () => {
    setEditingRideId(null);
  };

  const isUserInRide = (ride: RideWithDetails): boolean => {
    return (
      ride.passengers?.some((p) => p.passenger_id === currentUserId) || false
    );
  };

  const isRideFull = (ride: RideWithDetails): boolean => {
    return ride.passenger_count >= ride.available_seats;
  };

  const isOwnRide = (ride: RideWithDetails): boolean => {
    return ride.driver_id === currentUserId;
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "var(--spacing-xl)",
          color: "var(--text-secondary)",
        }}
      >
        Lade Fahrten...
      </div>
    );
  }

  if (rides.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "var(--spacing-xl)",
          color: "var(--text-secondary)",
        }}
      >
        Noch keine Fahrten verfügbar. Seien Sie der Erste und bieten Sie eine
        Fahrt an!
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "var(--spacing-md)",
        marginTop: "var(--spacing-lg)",
      }}
    >
      {rides.map((ride) => (
        <div
          key={ride.id}
          style={{
            backgroundColor: "var(--card-background)",
            border: "1px solid var(--card-border)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--spacing-lg)",
            transition: "all 0.2s ease-in-out",
          }}
        >
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
                Abfahrt: {ride.departure_time.substring(0, 5)}
              </h4>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  margin: 0,
                }}
              >
                von {ride.departure_location}
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
                  color: isRideFull(ride) ? "#dc2626" : "var(--text-accent)",
                  backgroundColor: isRideFull(ride) ? "#fef2f2" : "#f0fdf4",
                  padding: "var(--spacing-xs) var(--spacing-sm)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {ride.passenger_count}/{ride.available_seats} Plätze
              </span>
            </div>
          </div>
          {ride.additional_info && (
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
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                "{ride.additional_info}"
              </p>
            </div>
          )}{" "}
          {/* Mitfahrer anzeigen (für alle sichtbar) */}
          <div
            style={{
              marginBottom: "var(--spacing-md)",
            }}
          >
            <h5
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "var(--text-primary)",
                margin: "0 0 var(--spacing-xs) 0",
              }}
            >
              Fahrer: {ride.driver_name}
            </h5>
            {ride.passenger_count > 0 && (
              <>
                <h6
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    color: "var(--text-secondary)",
                    margin: "var(--spacing-xs) 0 var(--spacing-xs) 0",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Mitfahrer:
                </h6>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--spacing-xs)",
                  }}
                >
                  {ride.passenger_names?.map((name, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                        backgroundColor: "var(--background)",
                        padding: "var(--spacing-xs) var(--spacing-sm)",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--card-border)",
                      }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </>
            )}
            {ride.passenger_count === 0 && (
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  margin: "var(--spacing-xs) 0 0 0",
                  fontStyle: "italic",
                }}
              >
                Noch keine Mitfahrer
              </p>
            )}
          </div>
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
              {isOwnRide(ride) && (
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
              )}
            </div>
            <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
              {isOwnRide(ride) ? (
                <button
                  onClick={() => handleEditRide(ride.id)}
                  style={{
                    padding: "var(--spacing-xs) var(--spacing-sm)",
                    border: "1px solid var(--text-accent)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "var(--text-accent)",
                    backgroundColor: "white",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  Bearbeiten
                </button>
              ) : (
                <>
                  {isUserInRide(ride) ? (
                    <button
                      onClick={() => handleLeaveRide(ride.id)}
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
                      onClick={() => handleJoinRide(ride.id)}
                      disabled={isRideFull(ride)}
                      style={{
                        padding: "var(--spacing-xs) var(--spacing-sm)",
                        border: "none",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "white",
                        backgroundColor: isRideFull(ride)
                          ? "#9ca3af"
                          : "var(--text-accent)",
                        cursor: isRideFull(ride) ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      {isRideFull(ride) ? "Voll" : "Mitfahren"}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          {/* EditRideForm anzeigen wenn in Bearbeitungsmodus */}
          {editingRideId === ride.id && (
            <EditRideForm
              ride={ride}
              onRideUpdated={handleRideUpdated}
              onCancel={handleCancelEdit}
              onDelete={handleRideDeleted}
            />
          )}
        </div>
      ))}
    </div>
  );
}
