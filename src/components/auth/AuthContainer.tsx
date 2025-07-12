// src/components/auth/AuthContainer.tsx
import { ReactNode } from "react";

interface AuthContainerProps {
    children: ReactNode;
}

export default function AuthContainer({ children }: AuthContainerProps) {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--background)",
                padding: "var(--spacing-md)",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "400px",
                    background: "var(--card-background)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--card-shadow)",
                    border: "1px solid var(--card-border)",
                    padding: "var(--spacing-xl)",
                }}
            >
                {children}
            </div>
        </div>
    );
}

