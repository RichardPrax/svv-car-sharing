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

        const { error } = await supabase.auth.signInWithPassword({
            email: state.email,
            password: state.password,
        });

        if (error) {
            setState((prev) => ({ ...prev, error: error.message, loading: false }));
        } else {
            setState((prev) => ({ ...prev, loading: false, success: true }));
            router.push("/");
        }
    };

    return {
        ...state,
        setEmail,
        setPassword,
        login,
    };
}

export function useRegister() {
    const [state, setState] = useState<AuthState>({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        error: "",
        loading: false,
        success: false,
    });
    const router = useRouter();

    const setEmail = (email: string) => setState((prev) => ({ ...prev, email }));
    const setPassword = (password: string) => setState((prev) => ({ ...prev, password }));
    const setConfirmPassword = (confirmPassword: string) => setState((prev) => ({ ...prev, confirmPassword }));
    const setFirstName = (firstName: string) => setState((prev) => ({ ...prev, firstName }));
    const setLastName = (lastName: string) => setState((prev) => ({ ...prev, lastName }));

    const register = async (e: React.FormEvent) => {
        e.preventDefault();
        setState((prev) => ({ ...prev, loading: true, error: "" }));

        // Validation
        if (!state.firstName?.trim()) {
            setState((prev) => ({
                ...prev,
                error: "Vorname ist erforderlich",
                loading: false,
            }));
            return;
        }

        if (!state.lastName?.trim()) {
            setState((prev) => ({
                ...prev,
                error: "Nachname ist erforderlich",
                loading: false,
            }));
            return;
        }

        if (state.password !== state.confirmPassword) {
            setState((prev) => ({
                ...prev,
                error: "Die Passwörter stimmen nicht überein",
                loading: false,
            }));
            return;
        }

        if (state.password.length < 6) {
            setState((prev) => ({
                ...prev,
                error: "Das Passwort muss mindestens 6 Zeichen lang sein",
                loading: false,
            }));
            return;
        }

        const { error } = await supabase.auth.signUp({
            email: state.email,
            password: state.password,
            options: {
                data: {
                    first_name: state.firstName.trim(),
                    last_name: state.lastName.trim(),
                },
            },
        });

        if (error) {
            setState((prev) => ({ ...prev, error: error.message, loading: false }));
        } else {
            setState((prev) => ({ ...prev, loading: false, success: true }));
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        }
    };

    return {
        ...state,
        setEmail,
        setPassword,
        setConfirmPassword,
        setFirstName,
        setLastName,
        register,
    };
}

