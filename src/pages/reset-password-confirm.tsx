// pages/reset-password-confirm.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import AuthContainer from "@/components/auth/AuthContainer";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthField from "@/components/auth/AuthField";
import AuthError from "@/components/auth/AuthError";
import Button from "@/components/forms/Button";
import styles from "@/components/auth/Auth.module.css";

export default function ResetPasswordConfirmPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [validatingToken, setValidatingToken] = useState(true);

    useEffect(() => {
        // Listen for auth state changes when Supabase processes the recovery token from URL
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state changed:", event, session?.user?.email);
            
            if (event === 'PASSWORD_RECOVERY') {
                // Token is valid, user can now reset password
                setValidatingToken(false);
            } else if (event === 'SIGNED_IN' && session) {
                // Also accept SIGNED_IN event (sometimes Supabase uses this)
                setValidatingToken(false);
            }
        });

        // Also check immediately if there's already a session
        const checkExistingSession = async () => {
            // Give Supabase time to process the URL hash
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
                console.error("Error getting session:", error);
            }
            
            if (session) {
                console.log("Existing session found");
                setValidatingToken(false);
            } else if (!session) {
                // No session after waiting - token is invalid or expired
                setError("Ungültiger oder abgelaufener Link. Bitte fordere einen neuen Link an.");
                setValidatingToken(false);
            }
        };

        checkExistingSession();

        // Cleanup subscription
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Die Passwörter stimmen nicht überein");
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setError("Das Passwort muss mindestens 6 Zeichen lang sein");
            return;
        }

        setLoading(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) {
                console.error("Password update error:", updateError);
                setError("Fehler beim Zurücksetzen des Passworts. Bitte versuche es erneut.");
                setLoading(false);
                return;
            }

            setSuccess(true);
            setLoading(false);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err) {
            console.error("Unexpected error:", err);
            setError("Ein unerwarteter Fehler ist aufgetreten");
            setLoading(false);
        }
    };

    if (validatingToken) {
        return (
            <AuthContainer>
                <AuthHeader title="Passwort zurücksetzen" subtitle="Validiere Link..." />
                <div className={styles.successMessage}>
                    <p>Bitte warten...</p>
                </div>
            </AuthContainer>
        );
    }

    if (success) {
        return (
            <AuthContainer>
                <AuthHeader title="Passwort erfolgreich zurückgesetzt" subtitle="Du kannst dich jetzt anmelden" />
                <div className={styles.successMessage}>
                    <p>Dein Passwort wurde erfolgreich geändert. Du wirst in Kürze zur Anmeldeseite weitergeleitet.</p>
                </div>
                <Button 
                    type="button"
                    onClick={() => router.push("/login")}
                    size="large"
                    className={styles.loginButton}
                >
                    Zur Anmeldung
                </Button>
            </AuthContainer>
        );
    }

    if (error && !password) {
        return (
            <AuthContainer>
                <AuthHeader title="Ungültiger Link" subtitle="Der Link ist abgelaufen oder ungültig" />
                <AuthError message={error} />
                <Button 
                    type="button"
                    onClick={() => router.push("/login")}
                    size="large"
                    className={styles.loginButton}
                >
                    Zur Anmeldung
                </Button>
            </AuthContainer>
        );
    }

    return (
        <AuthContainer>
            <AuthHeader title="Neues Passwort festlegen" subtitle="Gib dein neues Passwort ein" />

            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <AuthField 
                    label="Neues Passwort" 
                    type="password" 
                    placeholder="Mindestens 6 Zeichen" 
                    value={password} 
                    onChange={setPassword} 
                    required 
                    hasError={!!error}
                    testId="new-password"
                />

                <AuthField 
                    label="Passwort bestätigen" 
                    type="password" 
                    placeholder="Passwort wiederholen" 
                    value={confirmPassword} 
                    onChange={setConfirmPassword} 
                    required 
                    hasError={!!error}
                    testId="confirm-password"
                />

                <AuthError message={error} />

                <Button 
                    type="submit" 
                    loading={loading} 
                    disabled={!password || !confirmPassword} 
                    size="large" 
                    className={styles.loginButton}
                    testId="reset-confirm-submit"
                >
                    Passwort zurücksetzen
                </Button>
            </form>

            <div className={styles.authLinkContainer}>
                <p className={styles.authLinkText}>
                    Zurück zur{" "}
                    <button 
                        type="button"
                        onClick={() => router.push("/login")} 
                        className={styles.authLink}
                    >
                        Anmeldung
                    </button>
                </p>
            </div>
        </AuthContainer>
    );
}

