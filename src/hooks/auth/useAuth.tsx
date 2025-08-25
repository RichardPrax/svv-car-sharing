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

// Email validation utility
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function useRegistration() {
    const [state, setState] = useState<AuthState>({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        error: "",
        loading: false,
        success: false,
    });
    const router = useRouter();

    const setEmail = (email: string) => setState((prev) => ({ ...prev, email }));
    const setPassword = (password: string) => setState((prev) => ({ ...prev, password }));
    const setFirstName = (firstName: string) => setState((prev) => ({ ...prev, firstName }));
    const setLastName = (lastName: string) => setState((prev) => ({ ...prev, lastName }));

    const register = async (e: React.FormEvent) => {
        e.preventDefault();
        setState((prev) => ({ ...prev, loading: true, error: "" }));

        // Form validation
        if (!isValidEmail(state.email)) {
            setState((prev) => ({ ...prev, error: "Bitte geben Sie eine gültige E-Mail-Adresse ein.", loading: false }));
            return;
        }

        if (!state.password || state.password.length < 6) {
            setState((prev) => ({ ...prev, error: "Das Passwort muss mindestens 6 Zeichen lang sein.", loading: false }));
            return;
        }

        if (!state.firstName || !state.lastName) {
            setState((prev) => ({ ...prev, error: "Vor- und Nachname sind erforderlich.", loading: false }));
            return;
        }

        try {
            // Create auth user in Supabase
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: state.email,
                password: state.password,
                options: {
                    data: {
                        firstName: state.firstName,
                        lastName: state.lastName,
                    },
                },
            });

            if (authError) {
                if (authError.message.includes("User already registered")) {
                    setState((prev) => ({ ...prev, error: "Ein Benutzer mit dieser E-Mail-Adresse existiert bereits.", loading: false }));
                } else {
                    setState((prev) => ({ ...prev, error: "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.", loading: false }));
                }
                return;
            }

            if (authData.user) {
                // Create user profile in database BEFORE proceeding
                try {
                    const profileResponse = await fetch(`/api/user/${authData.user.id}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            id: authData.user.id,
                            firstName: state.firstName,
                            lastName: state.lastName,
                            role: "USER",
                        }),
                    });

                    if (!profileResponse.ok) {
                        console.error("Failed to create user profile");
                        setState((prev) => ({ 
                            ...prev, 
                            error: "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.", 
                            loading: false 
                        }));
                        return;
                    }
                } catch (profileError) {
                    console.error("Error creating user profile:", profileError);
                    setState((prev) => ({ 
                        ...prev, 
                        error: "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.", 
                        loading: false 
                    }));
                    return;
                }

                setState((prev) => ({ ...prev, loading: false, success: true }));
                
                // If email confirmation is disabled, redirect immediately
                if (authData.session) {
                    // Add small delay to ensure profile is available before components try to fetch it
                    setTimeout(() => {
                        router.push("/");
                    }, 100);
                } else {
                    // Email confirmation required - show success message
                    // User will be redirected after email confirmation
                }
            }
        } catch (error) {
            console.error("Registration error:", error);
            setState((prev) => ({
                ...prev,
                error: "Netzwerkfehler. Bitte versuchen Sie es später erneut.",
                loading: false,
            }));
        }
    };

    return {
        ...state,
        setEmail,
        setPassword,
        setFirstName,
        setLastName,
        register,
    };
}

