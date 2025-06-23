// src/components/CreateRideForm.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  matchId: string;
  onRideCreated: () => void;
  onCancel: () => void;
};

export default function CreateRideForm({
  matchId,
  onRideCreated,
  onCancel,
}: Props) {
  const [formData, setFormData] = useState({
    departure_time: "",
    departure_location: "",
    available_seats: 1,
    additional_info: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("Sie müssen angemeldet sein");
        return;
      }

      const { error: insertError } = await supabase.from("rides").insert({
        match_day_id: matchId,
        driver_id: session.user.id,
        departure_time: formData.departure_time,
        departure_location: formData.departure_location,
        available_seats: formData.available_seats,
        additional_info: formData.additional_info || null,
      });

      if (insertError) {
        console.error("Error creating ride:", insertError);
        setError("Fehler beim Erstellen der Fahrt");
        return;
      }

      onRideCreated();
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
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--spacing-lg)",
        marginTop: "var(--spacing-lg)",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <h3
        style={{
          fontSize: "1.125rem",
          fontWeight: "700",
          color: "var(--text-primary)",
          marginBottom: "var(--spacing-lg)",
          textAlign: "center",
        }}
      >
        Fahrt anbieten
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
                setFormData({ ...formData, departure_location: e.target.value })
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
            </label>{" "}
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
              flexDirection: "column",
              gap: "var(--spacing-sm)",
              marginTop: "var(--spacing-md)",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "white",
                backgroundColor: "var(--text-accent)",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "all 0.2s ease-in-out",
              }}
            >
              {loading ? "Wird erstellt..." : "Fahrt anbieten"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                border: "1px solid var(--card-border)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "var(--text-secondary)",
                backgroundColor: "var(--card-background)",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease-in-out",
              }}
            >
              Abbrechen
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
