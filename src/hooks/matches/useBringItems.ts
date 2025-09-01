// src/hooks/matches/useBringItems.ts
import { useState, useEffect, useCallback } from "react";
import { BringItem, CreateBringItemData } from "@/entities/BringItem";
import { useAuthenticatedFetch } from "@/hooks/auth/useAuthenticatedFetch";

interface UseBringItemsProps {
    matchId: string;
    refreshTrigger?: number;
}

interface UseBringItemsReturn {
    bringItems: BringItem[];
    loading: boolean;
    error: string | null;
    addBringItem: (data: CreateBringItemData) => Promise<void>;
    deleteBringItem: (itemId: string, userId: string) => Promise<void>;
    refreshBringItems: () => void;
}

export function useBringItems({ matchId, refreshTrigger = 0 }: UseBringItemsProps): UseBringItemsReturn {
    const [bringItems, setBringItems] = useState<BringItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { authenticatedFetch } = useAuthenticatedFetch();

    const fetchBringItems = useCallback(async () => {
        if (!matchId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/matches/${matchId}/bring-items`);

            if (!response.ok) {
                throw new Error("Failed to fetch bring items");
            }

            const data = await response.json();
            setBringItems(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error("Error fetching bring items:", err);
        } finally {
            setLoading(false);
        }
    }, [matchId]);

    const addBringItem = async (data: CreateBringItemData) => {
        setError(null);

        try {
            const response = await authenticatedFetch(`/api/matches/${matchId}/bring-items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add bring item");
            }

            const newItem = await response.json();
            setBringItems((prev) => [...prev, newItem]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            throw err;
        }
    };

    const deleteBringItem = async (itemId: string, userId: string) => {
        setError(null);

        try {
            const response = await authenticatedFetch(`/api/matches/${matchId}/bring-items/${itemId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete bring item");
            }

            setBringItems((prev) => prev.filter((item) => item.id !== itemId));
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            throw err;
        }
    };

    const refreshBringItems = () => {
        fetchBringItems();
    };

    useEffect(() => {
        fetchBringItems();
    }, [matchId, refreshTrigger, fetchBringItems]);

    return {
        bringItems,
        loading,
        error,
        addBringItem,
        deleteBringItem,
        refreshBringItems,
    };
}

