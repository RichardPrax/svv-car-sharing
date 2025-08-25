// src/components/auth/LoginForm.tsx
import { useLogin } from "@/hooks/auth";
import Button from "@/components/forms/Button";
import AuthContainer from "./AuthContainer";
import AuthHeader from "./AuthHeader";
import AuthField from "./AuthField";
import AuthError from "./AuthError";
import styles from "./Auth.module.css";

export default function LoginForm() {
    const { email, password, error, loading, setEmail, setPassword, login } = useLogin();

    return (
        <AuthContainer>
            <AuthHeader title="Willkommen zurück" subtitle="Melde dich an, um fortzufahren" />

            <form onSubmit={login} className={styles.loginForm}>
                <AuthField label="E-Mail-Adresse" type="email" placeholder="deine@email.de" value={email} onChange={setEmail} required hasError={!!error} />

                <AuthField label="Passwort" type="password" placeholder="Dein Passwort" value={password} onChange={setPassword} required hasError={!!error} />

                <AuthError message={error} />

                <Button type="submit" loading={loading} disabled={!email || !password} size="large" className={styles.loginButton}>
                    Anmelden
                </Button>
            </form>

            <div className={styles.loginFooter}>Bei Problemen wende dich an den Administrator</div>
        </AuthContainer>
    );
}

