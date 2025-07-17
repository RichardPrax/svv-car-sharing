// src/components/layout/Header.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import { useRouter } from "next/router";

interface NavigationItem {
    label: string;
    route: string;
    icon: string;
}

const Header = () => {
    const [loading, setLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { userProfile } = useOptimizedAuth();
    const router = useRouter();

    const navigationItems: NavigationItem[] = [
        { label: "Hauptmenü", route: "/", icon: "🏠" },
        { label: "Training", route: "/training", icon: "🏃‍♂️" },
        { label: "Spieltage", route: "/matches", icon: "🏐" },
        { label: "Strafen", route: "/penalties", icon: "⚖️" },
        { label: "Statistiken", route: "/statistics", icon: "📊" },
    ];

    const handleLogoClick = () => {
        router.push("/");
        setIsMenuOpen(false);
    };

    const handleNavClick = (route: string) => {
        router.push(route);
        setIsMenuOpen(false);
    };

    const handleLogout = async () => {
        setLoading(true);
        setIsMenuOpen(false);
        try {
            await supabase.auth.signOut();
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header
            className="app-header"
            style={{
                padding: "var(--spacing-md)",
                position: "sticky",
                top: 0,
                zIndex: 100,
                background: "linear-gradient(135deg, #3B82F6, #1E40AF)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                {/* Logo */}
                <h1
                    className="app-header__title"
                    onClick={handleLogoClick}
                    style={{
                        fontSize: "1.5rem",
                        margin: 0,
                        cursor: "pointer",
                        transition: "color 0.2s ease",
                        userSelect: "none",
                        color: "white",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = "white";
                    }}
                >
                    SVV Teammanager
                </h1>

                {/* Desktop Navigation */}
                <nav
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--spacing-lg)",
                    }}
                    className="desktop-nav"
                >
                    {navigationItems.map((item) => (
                        <button
                            key={item.route}
                            onClick={() => handleNavClick(item.route)}
                            style={{
                                backgroundColor: router.pathname === item.route ? "var(--primary)" : "transparent",
                                color: "white",
                                border: router.pathname === item.route ? "2px solid rgba(255, 255, 255, 0.3)" : "none",
                                padding: "var(--spacing-sm) var(--spacing-lg)",
                                borderRadius: "25px",
                                cursor: "pointer",
                                fontSize: "0.95rem",
                                fontWeight: router.pathname === item.route ? "600" : "500",
                                transition: "all 0.3s ease",
                                whiteSpace: "nowrap",
                                boxShadow: router.pathname === item.route ? "0 2px 8px rgba(59, 130, 246, 0.3)" : "none",
                            }}
                            onMouseEnter={(e) => {
                                if (router.pathname !== item.route) {
                                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 255, 255, 0.1)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (router.pathname !== item.route) {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }
                            }}
                        >
                            {item.label}
                        </button>
                    ))}

                    {/* User Info & Logout - Desktop */}
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-lg)", marginLeft: "var(--spacing-xl)" }}>
                        {userProfile && (
                            <span
                                style={{
                                    fontSize: "0.9rem",
                                    color: "rgba(255, 255, 255, 0.9)",
                                    fontWeight: "500",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "var(--spacing-xs)",
                                }}
                            >
                                {userProfile.firstName} {userProfile.lastName}
                            </span>
                        )}
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            style={{
                                padding: "var(--spacing-sm) var(--spacing-lg)",
                                borderRadius: "25px",
                                fontSize: "0.9rem",
                                backgroundColor: "transparent",
                                color: "white",
                                border: "2px solid rgba(255, 255, 255, 0.3)",
                                cursor: "pointer",
                                fontWeight: "500",
                                transition: "all 0.3s ease",
                                whiteSpace: "nowrap",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)";
                                e.currentTarget.style.transform = "translateY(-1px)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 255, 255, 0.1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            {loading ? "Abmelden..." : "Abmelden"}
                        </button>
                    </div>
                </nav>

                {/* Mobile Burger Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="mobile-menu-toggle"
                    style={{
                        display: "none",
                        background: "none",
                        border: "none",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        padding: "var(--spacing-xs)",
                        color: "var(--text-primary)",
                    }}
                >
                    {isMenuOpen ? "✕" : "☰"}
                </button>

                {/* Mobile Dropdown Menu */}
                {isMenuOpen && (
                    <div
                        className="mobile-menu"
                        style={{
                            position: "absolute",
                            top: "100%",
                            right: 0,
                            backgroundColor: "white",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                            minWidth: "220px",
                            padding: "var(--spacing-md)",
                            zIndex: 1000,
                        }}
                    >
                        {/* Navigation Items */}
                        {navigationItems.map((item) => (
                            <button
                                key={item.route}
                                onClick={() => handleNavClick(item.route)}
                                style={{
                                    width: "100%",
                                    textAlign: "left",
                                    backgroundColor: router.pathname === item.route ? "var(--primary)" : "transparent",
                                    color: router.pathname === item.route ? "white" : "var(--text-primary)",
                                    border: "none",
                                    padding: "var(--spacing-sm) var(--spacing-md)",
                                    borderRadius: "var(--radius-sm)",
                                    cursor: "pointer",
                                    fontSize: "0.9rem",
                                    fontWeight: "500",
                                    marginBottom: "var(--spacing-xs)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "var(--spacing-sm)",
                                    transition: "background-color 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    if (router.pathname !== item.route) {
                                        e.currentTarget.style.backgroundColor = "var(--background)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (router.pathname !== item.route) {
                                        e.currentTarget.style.backgroundColor = "transparent";
                                    }
                                }}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}

                        {/* Separator */}
                        <div
                            style={{
                                height: "1px",
                                backgroundColor: "var(--border)",
                                margin: "var(--spacing-md) 0",
                            }}
                        />

                        {/* User Info */}
                        {userProfile && (
                            <div
                                style={{
                                    padding: "var(--spacing-sm) var(--spacing-md)",
                                    fontSize: "0.85rem",
                                    color: "var(--text-secondary)",
                                    marginBottom: "var(--spacing-sm)",
                                }}
                            >
                                Angemeldet als:
                                <br />
                                <strong style={{ color: "var(--text-primary)" }}>
                                    {userProfile.firstName} {userProfile.lastName}
                                </strong>
                            </div>
                        )}

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "var(--spacing-sm) var(--spacing-md)",
                                borderRadius: "var(--radius-sm)",
                                fontSize: "0.9rem",
                                backgroundColor: "var(--error)",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "500",
                                transition: "background-color 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "var(--error-hover)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "var(--error)";
                            }}
                        >
                            {loading ? "Abmelden..." : "Abmelden"}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;

