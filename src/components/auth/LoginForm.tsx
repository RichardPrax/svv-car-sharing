// src/components/auth/LoginForm.tsx
import { useLogin } from "@/hooks/auth";
import Button from "@/components/forms/Button";
import AuthContainer from "./AuthContainer";
import AuthHeader from "./AuthHeader";
import AuthField from "./AuthField";
import AuthError from "./AuthError";
import AuthLink from "./AuthLink";

export default function LoginForm() {
    const { email, password, error, loading, setEmail, setPassword, login } = useLogin();

    return (
        <AuthContainer>
            <AuthHeader title="Willkommen zurück" subtitle="Melde dich an, um fortzufahren" />

            <form
                onSubmit={login}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-lg)",
                }}
            >
                <AuthField label="E-Mail-Adresse" type="email" placeholder="deine@email.de" value={email} onChange={setEmail} required hasError={!!error} />

                <AuthField label="Passwort" type="password" placeholder="Dein Passwort" value={password} onChange={setPassword} required hasError={!!error} />

                <AuthError message={error} />

                <Button type="submit" loading={loading} disabled={!email || !password} size="large" style={{ width: "100%" }}>
                    Anmelden
                </Button>
            </form>

            <div
                style={{
                    textAlign: "center",
                    marginTop: "var(--spacing-lg)",
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                }}
            >
                Bei Problemen wende dich an den Administrator
            </div>
        </AuthContainer>
    );
}

