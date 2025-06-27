// src/components/auth/AuthHeader.tsx
interface AuthHeaderProps {
    title: string;
    subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
    return (
        <div
            style={{
                textAlign: "center",
                marginBottom: "var(--spacing-xl)",
            }}
        >
            <h1
                style={{
                    fontSize: "1.875rem",
                    fontWeight: "700",
                    color: "var(--text-primary)",
                    marginBottom: "var(--spacing-sm)",
                }}
            >
                {title}
            </h1>
            <p
                style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.875rem",
                }}
            >
                {subtitle}
            </p>
        </div>
    );
}

