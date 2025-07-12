// src/components/auth/AuthError.tsx
interface AuthErrorProps {
    message: string;
}

export default function AuthError({ message }: AuthErrorProps) {
    if (!message) return null;

    return (
        <div
            style={{
                padding: "var(--spacing-sm)",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "var(--radius-sm)",
                color: "#dc2626",
                fontSize: "0.875rem",
            }}
        >
            {message}
        </div>
    );
}

