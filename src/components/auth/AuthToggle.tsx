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

type AuthMode = "login" | "register";

// Modified LoginForm that includes toggle functionality
function LoginFormWithToggle({ onToggleToRegister }: { onToggleToRegister: () => void }) {
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
                />

                <AuthField 
                    label="Passwort" 
                    type="password" 
                    placeholder="Dein Passwort" 
                    value={password} 
                    onChange={setPassword} 
                    required 
                    hasError={!!error} 
                />

                <AuthError message={error} />

                <Button 
                    type="submit" 
                    loading={loading} 
                    disabled={!email || !password} 
                    size="large" 
                    className={styles.loginButton}
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

export default function AuthToggle() {
    const [mode, setMode] = useState<AuthMode>("login");

    const toggleToLogin = () => setMode("login");
    const toggleToRegister = () => setMode("register");

    if (mode === "register") {
        return <RegisterForm onToggleToLogin={toggleToLogin} />;
    }

    return <LoginFormWithToggle onToggleToRegister={toggleToRegister} />;
}
