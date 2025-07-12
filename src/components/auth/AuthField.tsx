// src/components/auth/AuthField.tsx
import Input from "@/components/forms/Input";

interface AuthFieldProps {
    label: string;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    hasError?: boolean;
}

export default function AuthField({ label, type = "text", placeholder, value, onChange, required = false, hasError = false }: AuthFieldProps) {
    return (
        <div>
            <label
                style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "var(--text-primary)",
                    marginBottom: "var(--spacing-sm)",
                }}
            >
                {label}
            </label>
            <Input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} required={required} variant={hasError ? "error" : "default"} />
        </div>
    );
}

