// src/components/auth/AuthSuccess.tsx
import AuthContainer from "./AuthContainer";
import styles from "./Auth.module.css";

interface AuthSuccessProps {
    title: string;
    message: string;
    submessage?: string;
    buttonText?: string;
    onButtonClick?: () => void;
}

export default function AuthSuccess({ title, message, submessage, buttonText, onButtonClick }: AuthSuccessProps) {
    return (
        <AuthContainer>
            <div className={styles.authSuccess}>
                <div className={styles.successIcon}>✓</div>
                <h2 className={styles.successTitle}>{title}</h2>
                <p className={styles.successMessage}>{message}</p>
                {submessage && <p className={styles.successMessage}>{submessage}</p>}
                {buttonText && onButtonClick && (
                    <button onClick={onButtonClick} className={styles.authLink}>
                        {buttonText}
                    </button>
                )}
            </div>
        </AuthContainer>
    );
}

