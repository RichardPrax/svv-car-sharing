// src/hooks/rides/useEditRide.tsx
import { useState } from "react";
import { RideWithDetails } from "@/entities/Ride";

export interface EditRideData {
    departureTime: string;
    departureLocation: string;
    availableSeats: number;
    additionalInfo: string;
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
    const [formData, setFormData] = useState<EditRideData>({
        departureTime: new Date(ride.departureTime).toISOString().slice(0, 16), // Format for datetime-local input
        departureLocation: ride.departureLocation,
        availableSeats: ride.availableSeats,
        additionalInfo: ride.additionalInfo || "",
    });

    const handleChange = (field: keyof EditRideData, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const updateData = {
                departureTime: new Date(formData.departureTime).toISOString(),
                departureLocation: formData.departureLocation,
                availableSeats: formData.availableSeats,
                additionalInfo: formData.additionalInfo || null,
            };

            const response = await fetch(`/api/rides/${ride.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                throw new Error("Fehler beim Aktualisieren der Fahrt");
            }

            onSuccess();
            return { success: true };
        } catch (err) {
            console.error("Error updating ride:", err);
            const errorMessage = "Ein unerwarteter Fehler ist aufgetreten";
            setError(errorMessage);
            return { error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/rides/${ride.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Fehler beim Löschen der Fahrt");
            }

            setShowDeleteConfirm(false);
            onDelete();
            return { success: true };
        } catch (err) {
            console.error("Error deleting ride:", err);
            const errorMessage = "Ein unerwarteter Fehler ist aufgetreten";
            setError(errorMessage);
            return { error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        error,
        showDeleteConfirm,
        handleChange,
        handleSubmit,
        setShowDeleteConfirm,
        handleDeleteConfirm,
    };
}
