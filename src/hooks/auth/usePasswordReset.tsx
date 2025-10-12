// src/hooks/auth/usePasswordReset.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface PasswordResetState {
    email: string;
    loading: boolean;
    error: string;
    success: boolean;
}

/**
 * Hook for handling password reset requests
 */
export function usePasswordReset() {
    const [state, setState] = useState<PasswordResetState>({
        email: "",
        loading: false,
        error: "",
        success: false,
    });

    const setEmail = (email: string) => {
        setState((prev) => ({ ...prev, email, error: "" }));
    };

    const requestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setState((prev) => ({ ...prev, loading: true, error: "" }));

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: state.email }),
            });

            const data = await response.json();

            if (!response.ok) {
                setState((prev) => ({
                    ...prev,
                    error: data.error || "Ein Fehler ist aufgetreten",
                    loading: false,
                }));
                return;
            }

            setState((prev) => ({ ...prev, success: true, loading: false }));
        } catch (error) {
            console.error("Password reset request error:", error);
            setState((prev) => ({
                ...prev,
                error: "Netzwerkfehler. Bitte versuche es später erneut.",
                loading: false,
            }));
        }
    };

    return {
        ...state,
        setEmail,
        requestReset,
    };
}

interface PasswordUpdateState {
    password: string;
    confirmPassword: string;
    loading: boolean;
    error: string;
    success: boolean;
}

/**
 * Hook for handling password updates after reset
 */
export function usePasswordUpdate() {
    const [state, setState] = useState<PasswordUpdateState>({
        password: "",
        confirmPassword: "",
        loading: false,
        error: "",
        success: false,
    });

    const setPassword = (password: string) => {
        setState((prev) => ({ ...prev, password, error: "" }));
    };

    const setConfirmPassword = (confirmPassword: string) => {
        setState((prev) => ({ ...prev, confirmPassword, error: "" }));
    };

    const updatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setState((prev) => ({ ...prev, loading: true, error: "" }));

        // Validate passwords match
        if (state.password !== state.confirmPassword) {
            setState((prev) => ({
                ...prev,
                error: "Die Passwörter stimmen nicht überein",
                loading: false,
            }));
            return;
        }

        // Validate password length
        if (state.password.length < 6) {
            setState((prev) => ({
                ...prev,
                error: "Das Passwort muss mindestens 6 Zeichen lang sein",
                loading: false,
            }));
            return;
        }

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: state.password,
            });

            if (updateError) {
                console.error("Password update error:", updateError);
                setState((prev) => ({
                    ...prev,
                    error: "Fehler beim Zurücksetzen des Passworts. Bitte versuche es erneut.",
                    loading: false,
                }));
                return;
            }

            setState((prev) => ({ ...prev, success: true, loading: false }));
        } catch (error) {
            console.error("Unexpected password update error:", error);
            setState((prev) => ({
                ...prev,
                error: "Ein unerwarteter Fehler ist aufgetreten",
                loading: false,
            }));
        }
    };

    return {
        ...state,
        setPassword,
        setConfirmPassword,
        updatePassword,
    };
}

