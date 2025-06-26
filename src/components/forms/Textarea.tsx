// src/components/forms/Textarea.tsx
import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    variant?: "default" | "error";
}

const textareaStyles = {
    base: {
        width: "100%",
        padding: "var(--spacing-sm)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius-sm)",
        fontSize: "1rem",
        backgroundColor: "var(--card-background)",
        color: "var(--text-primary)",
        resize: "vertical" as const,
        boxSizing: "border-box" as const,
        fontFamily: "inherit",
        transition: "border-color 0.2s ease-in-out",
    },
    error: {
        borderColor: "#dc2626",
    },
};

export default function Textarea({ variant = "default", style, ...props }: TextareaProps) {
    const combinedStyles = {
        ...textareaStyles.base,
        ...(variant === "error" && textareaStyles.error),
        ...style,
    };

    return <textarea style={combinedStyles} {...props} />;
}
