// src/components/auth/AuthToggle.tsx
import { useState } from "react";
import RegisterForm from "./RegisterForm";
import AuthContainer from "./AuthContainer";
import AuthHeader from "./AuthHeader";
import AuthField from "./AuthField";
import AuthError from "./AuthError";
import Button from "@/components/forms/Button";
import { useLogin } from "@/hooks/auth";
import styles from "./Auth.module.css";

type AuthMode = "login" | "register" | "reset-password" | "reset-confirm";

// Modified LoginForm that includes toggle functionality
function LoginFormWithToggle({ 
    onToggleToRegister, 
    onToggleToResetPassword 
}: { 
    onToggleToRegister: () => void;
    onToggleToResetPassword: () => void;
}) {
    const { email, password, error, loading, setEmail, setPassword, login } = useLogin();

    return (
        <AuthContainer>
            <AuthHeader title="Willkommen zurück" subtitle="Melde dich an, um fortzufahren" />

            <form onSubmit={login} className={styles.loginForm}>
                <AuthField 
                    label="E-Mail-Adresse" 
                    type="email" 
                    placeholder="deine@email.de" 
                    value={email} 
                    onChange={setEmail} 
                    required 
                    hasError={!!error}
                    testId="login-email"
                />

                <AuthField 
                    label="Passwort" 
                    type="password" 
                    placeholder="Dein Passwort" 
                    value={password} 
                    onChange={setPassword} 
                    required 
                    hasError={!!error}
                    testId="login-password"
                />

                <AuthError message={error} />

                <div className={styles.forgotPasswordContainer}>
                    <button 
                        type="button"
                        onClick={onToggleToResetPassword} 
                        className={styles.forgotPasswordLink}
                    >
                        Passwort vergessen?
                    </button>
                </div>

                <Button 
                    type="submit" 
                    loading={loading} 
                    disabled={!email || !password} 
                    size="large" 
                    className={styles.loginButton}
                    testId="login-submit"
                >
                    Anmelden
                </Button>
            </form>

            <div className={styles.authLinkContainer}>
                <p className={styles.authLinkText}>
                    Noch keinen Account?{" "}
                    <button onClick={onToggleToRegister} className={styles.authLink}>
                        Hier registrieren
                    </button>
                </p>
            </div>

            <div className={styles.loginFooter}>Bei Problemen wende dich an den Administrator</div>
        </AuthContainer>
    );
}

// Password Reset Request Form Component
function ResetPasswordForm({ onToggleToLogin }: { onToggleToLogin: () => void }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Ein Fehler ist aufgetreten");
                setLoading(false);
                return;
            }

            setSuccess(true);
            setLoading(false);
        } catch (err) {
            setError("Netzwerkfehler. Bitte versuche es später erneut.");
            setLoading(false);
        }
    };

    if (success) {
        return (
            <AuthContainer>
                <AuthHeader 
                    title="E-Mail versendet" 
                    subtitle="Überprüfe deinen Posteingang" 
                />
                
                <div className={styles.successMessage}>
                    <p>
                        Wir haben dir eine E-Mail mit einem Link zum Zurücksetzen deines Passworts gesendet.
                        Bitte überprüfe auch deinen Spam-Ordner.
                    </p>
                </div>

                <Button 
                    type="button"
                    onClick={onToggleToLogin}
                    size="large"
                    className={styles.loginButton}
                >
                    Zurück zur Anmeldung
                </Button>
            </AuthContainer>
        );
    }

    return (
        <AuthContainer>
            <AuthHeader 
                title="Passwort zurücksetzen" 
                subtitle="Gib deine E-Mail-Adresse ein" 
            />

            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <AuthField 
                    label="E-Mail-Adresse" 
                    type="email" 
                    placeholder="deine@email.de" 
                    value={email} 
                    onChange={setEmail} 
                    required 
                    hasError={!!error}
                    testId="reset-email"
                />

                <AuthError message={error} />

                <Button 
                    type="submit" 
                    loading={loading} 
                    disabled={!email} 
                    size="large" 
                    className={styles.loginButton}
                    testId="reset-submit"
                >
                    Link senden
                </Button>
            </form>

            <div className={styles.authLinkContainer}>
                <p className={styles.authLinkText}>
                    Zurück zur{" "}
                    <button onClick={onToggleToLogin} className={styles.authLink}>
                        Anmeldung
                    </button>
                </p>
            </div>
        </AuthContainer>
    );
}

export default function AuthToggle() {
    const [mode, setMode] = useState<AuthMode>("login");

    const toggleToLogin = () => setMode("login");
    const toggleToRegister = () => setMode("register");
    const toggleToResetPassword = () => setMode("reset-password");

    if (mode === "register") {
        return <RegisterForm onToggleToLogin={toggleToLogin} />;
    }

    if (mode === "reset-password") {
        return <ResetPasswordForm onToggleToLogin={toggleToLogin} />;
    }

    return (
        <LoginFormWithToggle 
            onToggleToRegister={toggleToRegister}
            onToggleToResetPassword={toggleToResetPassword}
        />
    );
}
