// src/components/auth/AuthContainer.tsx
import { ReactNode } from "react";
import styles from "./Auth.module.css";

interface AuthContainerProps {
    children: ReactNode;
}

export default function AuthContainer({ children }: AuthContainerProps) {
    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>{children}</div>
        </div>
    );
}

