// src/components/EditRideForm.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RideWithDetails } from "@/entities/Ride";

type Props = {
  ride: RideWithDetails;
  onRideUpdated: () => void;
  onCancel: () => void;
  onDelete: () => void;
};

export default function EditRideForm({
  ride,
  onRideUpdated,
  onCancel,
  onDelete,
}: Props) {
  const [formData, setFormData] = useState({
    departure_time: ride.departure_time.substring(0, 5), // Remove seconds
    departure_location: ride.departure_location,
    available_seats: ride.available_seats,
    additional_info: ride.additional_info || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("rides")
        .update({
          departure_time: formData.departure_time,
          departure_location: formData.departure_location,
          available_seats: formData.available_seats,
          additional_info: formData.additional_info || null,
        })
        .eq("id", ride.id);

      if (updateError) {
        console.error("Error updating ride:", updateError);
        setError("Fehler beim Aktualisieren der Fahrt");
        return;
      }

      onRideUpdated();
    } catch (err) {
      console.error("Error:", err);
      setError("Ein unerwarteter Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      // Zuerst alle Mitfahrer entfernen
      const { error: passengersError } = await supabase
        .from("ride_passengers")
        .delete()
        .eq("ride_id", ride.id);

      if (passengersError) {
        console.error("Error deleting passengers:", passengersError);
        setError("Fehler beim Löschen der Mitfahrer");
        return;
      }

      // Dann die Fahrt löschen
      const { error: rideError } = await supabase
        .from("rides")
        .delete()
        .eq("id", ride.id);

      if (rideError) {
        console.error("Error deleting ride:", rideError);
        setError("Fehler beim Löschen der Fahrt");
        return;
      }

      onDelete();
    } catch (err) {
      console.error("Error:", err);
      setError("Ein unerwarteter Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        backgroundColor: "var(--card-background)",
        border: "2px solid var(--text-accent)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--spacing-lg)",
        marginTop: "var(--spacing-lg)",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {" "}
      <h3
        style={{
          fontSize: "1.125rem",
          fontWeight: "700",
          color: "var(--text-primary)",
          marginBottom: "var(--spacing-lg)",
          textAlign: "center",
        }}
      >
        Fahrt bearbeiten
      </h3>
      {error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            color: "#dc2626",
            padding: "var(--spacing-sm)",
            borderRadius: "var(--radius-sm)",
            marginBottom: "var(--spacing-md)",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}
      {showDeleteConfirm ? (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "var(--radius-md)",
            padding: "var(--spacing-lg)",
            textAlign: "center",
          }}
        >
          <h4
            style={{
              color: "#dc2626",
              marginBottom: "var(--spacing-md)",
              fontSize: "1rem",
              fontWeight: "600",
            }}
          >
            Fahrt wirklich löschen?
          </h4>
          <p
            style={{
              color: "#7f1d1d",
              marginBottom: "var(--spacing-lg)",
              fontSize: "0.875rem",
            }}
          >
            Diese Aktion kann nicht rückgängig gemacht werden. Alle Mitfahrer
            werden automatisch aus der Fahrt entfernt.
          </p>{" "}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "var(--spacing-xs)",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {" "}
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={loading}
              style={{
                flex: 1,
                minWidth: "80px",
                padding: "var(--spacing-sm) var(--spacing-xs)",
                border: "1px solid var(--card-border)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "var(--text-secondary)",
                backgroundColor: "var(--card-background)",
                cursor: loading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Abbrechen
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              style={{
                flex: 1,
                minWidth: "100px",
                padding: "var(--spacing-sm) var(--spacing-xs)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "white",
                backgroundColor: "#dc2626",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {loading ? "Wird gelöscht..." : "Endgültig löschen"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gap: "var(--spacing-md)",
            }}
          >
            {/* Abfahrtszeit */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                Abfahrtszeit
              </label>{" "}
              <input
                type="time"
                required
                value={formData.departure_time}
                onChange={(e) =>
                  setFormData({ ...formData, departure_time: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "1rem",
                  backgroundColor: "var(--card-background)",
                  color: "var(--text-primary)",
                  boxSizing: "border-box",
                }}
              />
            </div>
            {/* Abfahrtsort */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                Abfahrtsort
              </label>{" "}
              <input
                type="text"
                required
                placeholder="z.B. Hauptbahnhof, Meine Adresse..."
                value={formData.departure_location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    departure_location: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "1rem",
                  backgroundColor: "var(--card-background)",
                  color: "var(--text-primary)",
                  boxSizing: "border-box",
                }}
              />
            </div>
            {/* Verfügbare Plätze */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                Verfügbare Plätze
              </label>
              <select
                value={formData.available_seats}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    available_seats: parseInt(e.target.value),
                  })
                }
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "1rem",
                  backgroundColor: "var(--card-background)",
                  color: "var(--text-primary)",
                  boxSizing: "border-box",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Platz" : "Plätze"}
                  </option>
                ))}
              </select>
              {formData.available_seats < ride.passenger_count && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#dc2626",
                    marginTop: "var(--spacing-xs)",
                  }}
                >
                  ⚠️ Weniger Plätze als aktuelle Mitfahrer (
                  {ride.passenger_count})
                </p>
              )}
            </div>
            {/* Zusätzliche Informationen */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                Zusätzliche Informationen (optional)
              </label>{" "}
              <textarea
                placeholder="z.B. Rückfahrt um 18:00, bringe Bälle mit..."
                value={formData.additional_info}
                onChange={(e) =>
                  setFormData({ ...formData, additional_info: e.target.value })
                }
                rows={3}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "1rem",
                  backgroundColor: "var(--card-background)",
                  color: "var(--text-primary)",
                  resize: "vertical",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>{" "}
            {/* Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "var(--spacing-xs)",
                marginTop: "var(--spacing-md)",
                flexWrap: "wrap",
              }}
            >
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: "2 1 auto",
                  minWidth: "120px",
                  padding: "var(--spacing-sm) var(--spacing-xs)",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  color: "white",
                  backgroundColor: "var(--text-accent)",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  transition: "all 0.2s ease-in-out",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {loading ? "Speichert..." : "Änderungen speichern"}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
                style={{
                  flex: "1 1 auto",
                  minWidth: "80px",
                  padding: "var(--spacing-sm) var(--spacing-xs)",
                  border: "1px solid #dc2626",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  color: "#dc2626",
                  backgroundColor: "var(--card-background)",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease-in-out",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Löschen
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                style={{
                  flex: "1 1 auto",
                  minWidth: "80px",
                  padding: "var(--spacing-sm) var(--spacing-xs)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  color: "var(--text-secondary)",
                  backgroundColor: "var(--card-background)",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease-in-out",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
