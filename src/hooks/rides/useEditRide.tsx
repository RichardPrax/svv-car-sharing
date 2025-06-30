// src/hooks/useEditRide.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RideWithDetails } from "@/entities/Ride";

export interface EditRideData {
  departure_time: string;
  departure_location: string;
  available_seats: number;
  additional_info: string;
}

interface UseEditRideProps {
  ride: RideWithDetails;
  onSuccess: () => void;
  onDelete: () => void;
}

export function useEditRide({ ride, onSuccess, onDelete }: UseEditRideProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Helper function to format departure time for form
  const formatDepartureTimeForForm = (departureTime: Date): string => {
    return departureTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  const [formData, setFormData] = useState<EditRideData>({
    departure_time: formatDepartureTimeForForm(ride.departureTime),
    departure_location: ride.departureLocation,
    available_seats: ride.availableSeats,
    additional_info: ride.additionalInfo || "",
  });

  const handleChange = (field: keyof EditRideData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateRide(formData);
    return result;
  };

  const updateRide = async (data: EditRideData) => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("rides")
        .update({
          departure_time: data.departure_time,
          departure_location: data.departure_location,
          available_seats: data.available_seats,
          additional_info: data.additional_info || null,
        })
        .eq("id", ride.id);

      if (updateError) {
        console.error("Error updating ride:", updateError);
        setError("Fehler beim Aktualisieren der Fahrt");
        return { success: false };
      }

      onSuccess();
      return { success: true };
    } catch (err) {
      console.error("Error:", err);
      setError("Ein unerwarteter Fehler ist aufgetreten");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const deleteRide = async () => {
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
        return { success: false };
      }

      // Dann die Fahrt löschen
      const { error: rideError } = await supabase
        .from("rides")
        .delete()
        .eq("id", ride.id);

      if (rideError) {
        console.error("Error deleting ride:", rideError);
        setError("Fehler beim Löschen der Fahrt");
        return { success: false };
      }

      onDelete();
      return { success: true };
    } catch (err) {
      console.error("Error:", err);
      setError("Ein unerwarteter Fehler ist aufgetreten");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    deleteRide();
  };

  return {
    formData,
    loading,
    error,
    showDeleteConfirm,
    handleChange,
    handleSubmit,
    updateRide,
    deleteRide,
    setShowDeleteConfirm,
    handleDeleteConfirm,
    clearError: () => setError(null),
  };
}
