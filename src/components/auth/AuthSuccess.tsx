// src/components/auth/AuthSuccess.tsx
import AuthContainer from "./AuthContainer";

interface AuthSuccessProps {
    title: string;
    message: string;
    submessage?: string;
}

export default function AuthSuccess({ title, message, submessage }: AuthSuccessProps) {
    return (
        <AuthContainer>
            <div style={{ textAlign: "center" }}>
                <div
                    style={{
                        width: "64px",
                        height: "64px",
                        background: "#dcfce7",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto var(--spacing-lg)",
                        fontSize: "2rem",
                    }}
                >
                    ✓
                </div>
                <h2
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "var(--text-primary)",
                        marginBottom: "var(--spacing-sm)",
                    }}
                >
                    {title}
                </h2>
                <p
                    style={{
                        color: "var(--text-secondary)",
                        marginBottom: submessage ? "var(--spacing-md)" : 0,
                    }}
                >
                    {message}
                </p>
                {submessage && (
                    <p
                        style={{
                            color: "var(--text-secondary)",
                            fontSize: "0.875rem",
                        }}
                    >
                        {submessage}
                    </p>
                )}
            </div>
        </AuthContainer>
    );
}

