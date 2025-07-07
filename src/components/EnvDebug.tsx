"use client";

import { useEffect, useState } from "react";

export default function EnvDebug() {
    const [clientEnv, setClientEnv] = useState<Record<string, string>>({});

    useEffect(() => {
        // This runs only on the client
        const env: Record<string, string> = {};

        // Get all NEXT_PUBLIC_ variables available on client
        if (typeof window !== "undefined") {
            Object.keys(process.env).forEach((key) => {
                if (key.startsWith("NEXT_PUBLIC_")) {
                    env[key] = process.env[key] || "undefined";
                }
            });
        }

        setClientEnv(env);
    }, []);

    return (
        <div
            style={{
                position: "fixed",
                top: "10px",
                right: "10px",
                background: "#f0f0f0",
                padding: "10px",
                border: "1px solid #ccc",
                fontSize: "12px",
                maxWidth: "300px",
                zIndex: 9999,
            }}
        >
            <h3>🔍 Client-side Environment Debug</h3>
            <div>
                <strong>Client-side NEXT_PUBLIC_ variables:</strong>
                <ul>
                    {Object.entries(clientEnv).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}:</strong> {value ? `${value.substring(0, 30)}...` : "undefined"}
                        </li>
                    ))}
                </ul>
                {Object.keys(clientEnv).length === 0 && <p style={{ color: "red" }}>❌ No NEXT_PUBLIC_ variables found on client!</p>}
            </div>
        </div>
    );
}

