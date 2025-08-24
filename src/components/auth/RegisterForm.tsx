// src/components/auth/RegisterForm.tsx
import { useRegistration } from "@/hooks/auth";
import Button from "@/components/forms/Button";
import AuthContainer from "./AuthContainer";
import AuthHeader from "./AuthHeader";
import AuthField from "./AuthField";
import AuthError from "./AuthError";
import AuthSuccess from "./AuthSuccess";
import styles from "./Auth.module.css";

interface RegisterFormProps {
    onToggleToLogin: () => void;
}

export default function RegisterForm({ onToggleToLogin }: RegisterFormProps) {
    const { 
        email, 
        password, 
        firstName, 
        lastName, 
        error, 
        loading, 
        success,
        setEmail, 
        setPassword, 
        setFirstName,
        setLastName,
        register 
    } = useRegistration();

    if (success) {
        return (
            <AuthContainer>
                <AuthSuccess 
                    title="Registrierung erfolgreich!"
                    message="Ihre Registrierung war erfolgreich. Sie können sich jetzt anmelden."
                    buttonText="Zum Login"
                    onButtonClick={onToggleToLogin}
                />
            </AuthContainer>
        );
    }

    return (
        <AuthContainer>
            <AuthHeader title="Konto erstellen" subtitle="Registrieren Sie sich für Zugang zur Plattform" />

            <form onSubmit={register} className={styles.loginForm}>
                <div className={styles.nameFields}>
                    <AuthField 
                        label="Vorname" 
                        type="text" 
                        placeholder="Ihr Vorname" 
                        value={firstName || ""} 
                        onChange={setFirstName} 
                        required 
                        hasError={!!error} 
                    />
                    
                    <AuthField 
                        label="Nachname" 
                        type="text" 
                        placeholder="Ihr Nachname" 
                        value={lastName || ""} 
                        onChange={setLastName} 
                        required 
                        hasError={!!error} 
                    />
                </div>

                <AuthField 
                    label="E-Mail-Adresse" 
                    type="email" 
                    placeholder="ihre@email.de" 
                    value={email} 
                    onChange={setEmail} 
                    required 
                    hasError={!!error} 
                />

                <AuthField 
                    label="Passwort" 
                    type="password" 
                    placeholder="Mindestens 6 Zeichen" 
                    value={password} 
                    onChange={setPassword} 
                    required 
                    hasError={!!error} 
                />

                <AuthError message={error} />

                <Button 
                    type="submit" 
                    loading={loading} 
                    disabled={!email || !password || !firstName || !lastName} 
                    size="large" 
                    className={styles.loginButton}
                >
                    Registrieren
                </Button>
            </form>

            <div className={styles.authLinkContainer}>
                <p className={styles.authLinkText}>
                    Schon registriert?{" "}
                    <button onClick={onToggleToLogin} className={styles.authLink}>
                        Hier anmelden
                    </button>
                </p>
            </div>
        </AuthContainer>
    );
}
