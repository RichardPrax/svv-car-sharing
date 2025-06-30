// src/hooks/rides/useEditRide.tsx
import { useState } from "react";
import { RideWithDetails } from "@/entities/Ride";
import { RideRepository } from "@/lib/repositories/rideRepository";

const rideRepository = new RideRepository();

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

    // Helper function to format departure time for form
    const formatDepartureTimeForForm = (departureTime: Date): string => {
        return departureTime.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    };

    const [formData, setFormData] = useState<EditRideData>({
        departureTime: formatDepartureTimeForForm(ride.departureTime),
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
        const result = await updateRide(formData);
        return result;
    };

    const updateRide = async (data: EditRideData) => {
        setLoading(true);
        setError(null);

        try {
            await rideRepository.update(ride.id, {
                departureTime: new Date(`1970-01-01T${data.departureTime}:00`),
                departureLocation: data.departureLocation,
                availableSeats: data.availableSeats,
                additionalInfo: data.additionalInfo || null,
            });

            onSuccess();
            return { success: true };
        } catch (err) {
            console.error("Error updating ride:", err);
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
            // Prisma wird automatisch die Mitfahrer löschen (CASCADE)
            await rideRepository.delete(ride.id);

            onDelete();
            return { success: true };
        } catch (err) {
            console.error("Error deleting ride:", err);
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
