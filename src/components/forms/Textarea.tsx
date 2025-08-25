// src/components/forms/Textarea.tsx
import { TextareaHTMLAttributes } from "react";
import styles from "./Forms.module.css";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    variant?: "default" | "error";
}

export default function Textarea({ variant = "default", className, ...props }: TextareaProps) {
    const textareaClasses = [styles.textarea, variant === "error" && styles.textareaError, className].filter(Boolean).join(" ");

    return <textarea className={textareaClasses} {...props} />;
}

