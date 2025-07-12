// src/components/ui/LoadingSpinner.tsx
import { useEffect } from "react";

interface LoadingSpinnerProps {
    message?: string;
    size?: "small" | "medium" | "large";
    fullScreen?: boolean;
}

export default function LoadingSpinner({ message = "Lädt...", size = "medium", fullScreen = false }: LoadingSpinnerProps) {
    // Inject keyframes into document head if not already present
    useEffect(() => {
        const styleId = "loading-spinner-keyframes";
        if (!document.getElementById(styleId)) {
            const style = document.createElement("style");
            style.id = styleId;
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    const getSizeClasses = () => {
        switch (size) {
            case "small":
                return { width: "20px", height: "20px" };
            case "large":
                return { width: "60px", height: "60px" };
            default:
                return { width: "40px", height: "40px" };
        }
    };

    const containerStyle = fullScreen
        ? {
              position: "fixed" as const,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column" as const,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              zIndex: 9999,
          }
        : {
              display: "flex",
              flexDirection: "column" as const,
              justifyContent: "center",
              alignItems: "center",
              padding: "var(--spacing-xl)",
              minHeight: "200px",
          };

    const spinnerSize = getSizeClasses();

    return (
        <div style={containerStyle}>
            <div
                style={{
                    ...spinnerSize,
                    border: "3px solid #f3f4f6",
                    borderTop: "3px solid var(--text-accent)",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    marginBottom: "var(--spacing-md)",
                }}
            />
            <p
                style={{
                    fontSize: size === "small" ? "0.875rem" : "1rem",
                    color: "var(--text-secondary)",
                    margin: 0,
                    fontWeight: "500",
                }}
            >
                {message}
            </p>
        </div>
    );
}

