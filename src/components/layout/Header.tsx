// src/components/layout/Header.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import { useRouter } from "next/router";

const Header = () => {
    const [loading, setLoading] = useState(false);
    const { userProfile } = useOptimizedAuth();
    const router = useRouter();

    const handleLogout = async () => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <header
            className="app-header"
            style={{
                padding: "var(--spacing-md)",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1
                    className="app-header__title"
                    style={{
                        fontSize: "1.5rem",
                        margin: 0,
                    }}
                >
                    SVV Car Sharing
                </h1>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
                    {userProfile && (
                        <span style={{ fontSize: "0.9rem" }}>
                            👤 {userProfile.firstName} {userProfile.lastName}
                        </span>
                    )}

                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="app-header__logout-btn"
                        style={{
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "0.9rem",
                        }}
                    >
                        {loading ? "Abmelden..." : "Abmelden"}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;

