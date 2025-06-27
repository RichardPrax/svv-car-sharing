// src/components/auth/RegisterForm.tsx
import { useRegister } from "@/hooks/auth";
import Button from "@/components/forms/Button";
import AuthContainer from "./AuthContainer";
import AuthHeader from "./AuthHeader";
import AuthField from "./AuthField";
import AuthError from "./AuthError";
import AuthLink from "./AuthLink";
import AuthSuccess from "./AuthSuccess";

export default function RegisterForm() {
    const { email, password, confirmPassword, firstName, lastName, error, loading, success, setEmail, setPassword, setConfirmPassword, setFirstName, setLastName, register } =
        useRegister();

    if (success) {
        return (
            <AuthSuccess
                title="Registrierung erfolgreich!"
                message="Bitte überprüfe deine E-Mails und bestätige dein Konto."
                submessage="Du wirst automatisch zur Anmeldung weitergeleitet..."
            />
        );
    }

    return (
        <AuthContainer>
            <AuthHeader title="Konto erstellen" subtitle="Registriere dich für dein kostenloses Konto" />

            <form
                onSubmit={register}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-lg)",
                }}
            >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
                    <AuthField label="Vorname" type="text" placeholder="Dein Vorname" value={firstName || ""} onChange={setFirstName} required hasError={!!error} />
                    <AuthField label="Nachname" type="text" placeholder="Dein Nachname" value={lastName || ""} onChange={setLastName} required hasError={!!error} />
                </div>

                <AuthField label="E-Mail-Adresse" type="email" placeholder="deine@email.de" value={email} onChange={setEmail} required hasError={!!error} />

                <AuthField label="Passwort" type="password" placeholder="Mindestens 6 Zeichen" value={password} onChange={setPassword} required hasError={!!error} />

                <AuthField
                    label="Passwort bestätigen"
                    type="password"
                    placeholder="Passwort wiederholen"
                    value={confirmPassword || ""}
                    onChange={setConfirmPassword}
                    required
                    hasError={!!error}
                />

                <AuthError message={error} />

                <Button type="submit" loading={loading} disabled={!email || !password || !confirmPassword || !firstName || !lastName} size="large" style={{ width: "100%" }}>
                    Registrieren
                </Button>
            </form>

            <AuthLink text="Bereits ein Konto?" linkText="Jetzt anmelden" href="/login" />
        </AuthContainer>
    );
}

