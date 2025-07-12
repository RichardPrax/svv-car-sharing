// src/components/forms/Select.tsx
import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    variant?: "default" | "error";
}

const selectStyles = {
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

export default function Select({ variant = "default", style, children, ...props }: SelectProps) {
    const combinedStyles = {
        ...selectStyles.base,
        ...(variant === "error" && selectStyles.error),
        ...style,
    };

    return (
        <select style={combinedStyles} {...props}>
            {children}
        </select>
    );
}
