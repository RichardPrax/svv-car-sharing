// src/components/forms/Button.tsx
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
    size?: "small" | "medium" | "large";
    loading?: boolean;
}

const buttonStyles = {
    base: {
        borderRadius: "var(--radius-sm)",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        border: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center" as const,
    },
    variants: {
        primary: {
            backgroundColor: "var(--text-accent)",
            color: "white",
            border: "none",
        },
        secondary: {
            backgroundColor: "var(--card-background)",
            color: "var(--text-secondary)",
            border: "1px solid var(--card-border)",
        },
        danger: {
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
        },
    },
    sizes: {
        small: {
            padding: "var(--spacing-xs) var(--spacing-sm)",
            fontSize: "0.75rem",
        },
        medium: {
            padding: "var(--spacing-sm) var(--spacing-md)",
            fontSize: "0.875rem",
        },
        large: {
            padding: "var(--spacing-md) var(--spacing-lg)",
            fontSize: "1rem",
        },
    },
    disabled: {
        opacity: 0.6,
        cursor: "not-allowed",
    },
};

export default function Button({ variant = "primary", size = "medium", loading = false, disabled, children, style, ...props }: ButtonProps) {
    const isDisabled = disabled || loading;

    const combinedStyles = {
        ...buttonStyles.base,
        ...buttonStyles.variants[variant],
        ...buttonStyles.sizes[size],
        ...(isDisabled && buttonStyles.disabled),
        ...style,
    };

    return (
        <button style={combinedStyles} disabled={isDisabled} {...props}>
            {loading ? "Lädt..." : children}
        </button>
    );
}
