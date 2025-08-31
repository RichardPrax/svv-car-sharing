// src/components/auth/AuthField.tsx
import Input from "@/components/forms/Input";
import styles from "./Auth.module.css";

interface AuthFieldProps {
    label: string;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    hasError?: boolean;
    testId?: string;
}

export default function AuthField({ label, type = "text", placeholder, value, onChange, required = false, hasError = false, testId }: AuthFieldProps) {
    return (
        <div>
            <label className={styles.authLabel}>{label}</label>
            <Input 
                type={type} 
                placeholder={placeholder} 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                required={required} 
                variant={hasError ? "error" : "default"}
                data-testid={testId}
            />
        </div>
    );
}

