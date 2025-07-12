// src/components/forms/FormField.tsx
import { ReactNode } from "react";

interface FormFieldProps {
    label: string;
    children: ReactNode;
    error?: string;
}

export default function FormField({ label, children, error }: FormFieldProps) {
    return (
        <div>
            <label
                style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "var(--spacing-xs)",
                }}
            >
                {label}
            </label>
            {children}
            {error && (
                <p
                    style={{
                        fontSize: "0.75rem",
                        color: "#dc2626",
                        marginTop: "var(--spacing-xs)",
                        margin: "var(--spacing-xs) 0 0 0",
                    }}
                >
                    {error}
                </p>
            )}
        </div>
    );
}
