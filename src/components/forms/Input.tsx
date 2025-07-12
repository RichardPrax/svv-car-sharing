// src/components/forms/Input.tsx
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: "default" | "error";
}

const inputStyles = {
    base: {
        width: "100%",
        padding: "var(--spacing-sm)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius-sm)",
        fontSize: "1rem",
        backgroundColor: "var(--card-background)",
        color: "var(--text-primary)",
        boxSizing: "border-box" as const,
        transition: "border-color 0.2s ease-in-out",
    },
    error: {
        borderColor: "#dc2626",
    },
};

export default function Input({ variant = "default", style, ...props }: InputProps) {
    const combinedStyles = {
        ...inputStyles.base,
        ...(variant === "error" && inputStyles.error),
        ...style,
    };

    return <input style={combinedStyles} {...props} />;
}
