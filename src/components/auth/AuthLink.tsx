// src/components/auth/AuthLink.tsx
import { useRouter } from "next/router";

interface AuthLinkProps {
    text: string;
    linkText: string;
    href: string;
}

export default function AuthLink({ text, linkText, href }: AuthLinkProps) {
    const router = useRouter();

    return (
        <div
            style={{
                marginTop: "var(--spacing-lg)",
                textAlign: "center",
                paddingTop: "var(--spacing-lg)",
                borderTop: "1px solid var(--card-border)",
            }}
        >
            <p
                style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.875rem",
                }}
            >
                {text}{" "}
                <button
                    onClick={() => router.push(href)}
                    style={{
                        color: "var(--text-accent)",
                        textDecoration: "underline",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                    }}
                >
                    {linkText}
                </button>
            </p>
        </div>
    );
}

