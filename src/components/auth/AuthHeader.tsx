// src/components/auth/AuthHeader.tsx
import styles from "./Auth.module.css";

interface AuthHeaderProps {
    title: string;
    subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
    return (
        <div className={styles.authHeader}>
            <h1 className={styles.authTitle}>{title}</h1>
            <p className={styles.authSubtitle}>{subtitle}</p>
        </div>
    );
}

