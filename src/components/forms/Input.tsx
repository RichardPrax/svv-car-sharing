// src/components/forms/Input.tsx
import { InputHTMLAttributes } from "react";
import styles from "./Forms.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: "default" | "error";
}

export default function Input({ variant = "default", className, ...props }: InputProps) {
    const inputClasses = [styles.input, variant === "error" && styles.inputError, className].filter(Boolean).join(" ");

    return <input className={inputClasses} {...props} />;
}

