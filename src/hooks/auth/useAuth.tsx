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

        const { data, error } = await supabase.auth.signInWithPassword({
            email: state.email,
            password: state.password,
        });

        if (error) {
            setState((prev) => ({ ...prev, error: error.message, loading: false }));
        } else {
            // Prüfe, ob User-Profil existiert, und erstelle es falls nötig
            if (data.user) {
                try {
                    const profileResponse = await fetch(`/api/user/${data.user.id}`);
                    if (!profileResponse.ok) {
                        // User-Profil existiert nicht, erstelle es
                        const userMeta = data.user.user_metadata;
                        if (userMeta?.first_name && userMeta?.last_name) {
                            await fetch("/api/user/create-profile", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    userId: data.user.id,
                                    firstName: userMeta.first_name,
                                    lastName: userMeta.last_name,
                                }),
                            });
                        }
                    }
                } catch (profileError) {
                    console.error("Error checking/creating user profile:", profileError);
                }
            }

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

