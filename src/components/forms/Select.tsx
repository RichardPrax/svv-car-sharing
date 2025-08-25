// src/components/forms/Select.tsx
import { SelectHTMLAttributes } from "react";
import styles from "./Forms.module.css";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    variant?: "default" | "error";
}

export default function Select({ variant = "default", className, children, ...props }: SelectProps) {
    const selectClasses = [styles.select, variant === "error" && styles.selectError, className].filter(Boolean).join(" ");

    return (
        <select className={selectClasses} {...props}>
            {children}
        </select>
    );
}

