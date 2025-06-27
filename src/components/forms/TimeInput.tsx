// src/components/forms/TimeInput.tsx
import { InputHTMLAttributes } from "react";
import Input from "./Input";

interface TimeInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    variant?: "default" | "error";
}

export default function TimeInput({ style, ...props }: TimeInputProps) {
    const timeInputStyle = {
        fontSize: "1rem",
        fontFamily: "monospace",
        ...style,
    };

    return <Input type="time" step="300" pattern="[0-9]{2}:[0-9]{2}" placeholder="HH:MM (24h Format)" style={timeInputStyle} {...props} />;
}

