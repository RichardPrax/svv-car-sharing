// src/components/forms/Input.tsx
import { InputHTMLAttributes } from "react";
import styles from "./Forms.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: "default" | "error";
    testId?: string;
}

export default function Input({ variant = "default", className, testId, ...props }: InputProps) {
    const inputClasses = [styles.input, variant === "error" && styles.inputError, className].filter(Boolean).join(" ");
    return <input className={inputClasses} data-testid={testId} {...props} />;
}

