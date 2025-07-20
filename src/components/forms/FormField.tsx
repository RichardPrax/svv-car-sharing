// src/components/forms/FormField.tsx
import { ReactNode } from "react";
import styles from "./Forms.module.css";

interface FormFieldProps {
    label: string;
    children: ReactNode;
    error?: string;
}

export default function FormField({ label, children, error }: FormFieldProps) {
    return (
        <div className={styles.formField}>
            <label className={styles.formLabel}>{label}</label>
            {children}
            {error && <p className={styles.formError}>{error}</p>}
        </div>
    );
}

