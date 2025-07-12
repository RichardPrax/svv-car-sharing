// src/hooks/auth/useAuth.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

interface AuthState {
    email: string;
    password: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    error: string;
    loading: boolean;
    success: boolean;
}

export function useLogin() {
    const [state, setState] = useState<AuthState>({
        email: "",
        password: "",
        error: "",
        loading: false,
        success: false,
    });
    const router = useRouter();

    const setEmail = (email: string) => setState((prev) => ({ ...prev, email }));
    const setPassword = (password: string) => setState((prev) => ({ ...prev, password }));

    const login = async (e: React.FormEvent) => {
        e.preventDefault();
        setState((prev) => ({ ...prev, loading: true, error: "" }));

        try {
            // Pre-validation API call für Security und Rate Limiting
            const preValidation = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": navigator.userAgent,
                    Accept: "application/json",
                    "Accept-Language": navigator.language,
                },
                body: JSON.stringify({
                    email: state.email,
                    password: state.password,
                }),
            });

            if (!preValidation.ok) {
                const errorData = await preValidation.json();
                if (preValidation.status === 429) {
                    setState((prev) => ({
                        ...prev,
                        error: `Zu viele Login-Versuche. Versuche es in ${errorData.retryAfter || 60} Sekunden erneut.`,
                        loading: false,
                    }));
                    return;
                } else if (preValidation.status === 403) {
                    setState((prev) => ({
                        ...prev,
                        error: "Login temporär blockiert. Bitte wende dich an den Administrator.",
                        loading: false,
                    }));
                    return;
                } else {
                    setState((prev) => ({
                        ...prev,
                        error: errorData.error || "Login-Validierung fehlgeschlagen",
                        loading: false,
                    }));
                    return;
                }
            }

            // Supabase Auth nach erfolgreicher Pre-Validation
            const { error } = await supabase.auth.signInWithPassword({
                email: state.email,
                password: state.password,
            });

            if (error) {
                setState((prev) => ({ ...prev, error: "Ungültige E-Mail oder Passwort", loading: false }));
                return;
            }

            // Erfolgreicher Login - leite direkt weiter
            setState((prev) => ({ ...prev, loading: false, success: true }));
            router.push("/");
        } catch (error) {
            console.error("Login error:", error);
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
        setPassword,
        login,
    };
}

