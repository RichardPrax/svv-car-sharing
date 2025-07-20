// src/components/forms/Button.tsx
import { ButtonHTMLAttributes } from "react";
import styles from "./Forms.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
    size?: "small" | "medium" | "large";
    loading?: boolean;
}

export default function Button({ variant = "primary", size = "medium", loading = false, disabled, children, className, ...props }: ButtonProps) {
    const isDisabled = disabled || loading;

    const buttonClasses = [
        styles.button,
        styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
        styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`],
        isDisabled && styles.buttonDisabled,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button className={buttonClasses} disabled={isDisabled} {...props}>
            {loading ? "Lädt..." : children}
        </button>
    );
}

