// src/hooks/rides/useEditRide.tsx
import { useState } from "react";
import { useAuthenticatedFetch } from "@/hooks/auth/useAuthenticatedFetch";
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
}

export function useEditRide({ ride, onSuccess }: UseEditRideProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { authenticatedFetch } = useAuthenticatedFetch();
    const [formData, setFormData] = useState<EditRideData>({
        departureTime: (() => {
            const date = new Date(ride.departureTime);
            // Format für time input: HH:MM
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
        })(),
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
            // Das ursprüngliche Datum beibehalten, nur die Zeit ändern
            const originalDate = new Date(ride.departureTime);
            const [hours, minutes] = formData.departureTime.split(":").map(Number);

            const updatedDateTime = new Date(originalDate);
            updatedDateTime.setHours(hours, minutes, 0, 0);

            const updateData = {
                departureTime: updatedDateTime.toISOString(),
                departureLocation: formData.departureLocation,
                availableSeats: formData.availableSeats,
                additionalInfo: formData.additionalInfo || null,
            };

            const response = await authenticatedFetch(`/api/rides/${ride.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('🚗 Edit failed', errorData);
                throw new Error("Fehler beim Aktualisieren der Fahrt");
            }

            onSuccess();
            return { success: true };
        } catch (err) {
            console.error("🚗 Error updating ride:", err);
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
        handleChange,
        handleSubmit,
    };
}

