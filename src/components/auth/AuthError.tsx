// src/components/auth/AuthError.tsx
import styles from "./Auth.module.css";

interface AuthErrorProps {
    message: string;
}

export default function AuthError({ message }: AuthErrorProps) {
    if (!message) return null;

    return <div className={styles.authError}>{message}</div>;
}

