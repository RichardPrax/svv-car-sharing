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
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token_hash = params.get("token_hash");
        const type = (params.get("type") || "recovery") as "recovery";

        if (!token_hash) {
          setError("Kein Token gefunden. Bitte fordere einen neuen Link an.");
          return;
        }

        // Einmalige Verifikation des Links (kein PKCE nötig)
        const { error } = await supabase.auth.verifyOtp({ type, token_hash });
        if (error) {
          setError(error.message || "Link ungültig oder abgelaufen.");
          return;
        }
      } catch (e) {
        setError("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
      } finally {
        if (!cancelled) setValidating(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Die Passwörter stimmen nicht überein");
      return;
    }
    if (password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen lang sein");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message || "Fehler beim Zurücksetzen des Passworts.");
      return;
    }

    setSuccess(true);
    // Optional: direkt in die App oder zum Login
    setTimeout(() => router.push("/login"), 1500);
  };

  if (validating) {
    return (
      <AuthContainer>
        <AuthHeader title="Passwort zurücksetzen" subtitle="Validiere Link..." />
        <div className={styles.successMessage}><p>Bitte warten…</p></div>
      </AuthContainer>
    );
  }

  if (error && !password) {
    return (
      <AuthContainer>
        <AuthHeader title="Ungültiger Link" subtitle="Der Link ist abgelaufen oder ungültig" />
        <AuthError message={error} />
        <Button type="button" onClick={() => router.push("/login")} size="large" className={styles.loginButton}>
          Zur Anmeldung
        </Button>
      </AuthContainer>
    );
  }

  if (success) {
    return (
      <AuthContainer>
        <AuthHeader title="Passwort aktualisiert" subtitle="Du kannst dich jetzt anmelden" />
        <div className={styles.successMessage}><p>Weiterleitung…</p></div>
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
          <button type="button" onClick={() => router.push("/login")} className={styles.authLink}>
            Anmeldung
          </button>
        </p>
      </div>
    </AuthContainer>
  );
}
