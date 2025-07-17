// src/components/layout/Header.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import { useRouter } from "next/router";
import styles from "./Header.module.css";

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

    const handleLogoClick = () => {
        router.push("/");
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Logo */}
                <h1 className={styles.title} onClick={handleLogoClick}>
                    SVV Teammanager
                </h1>

                {/* Desktop Navigation */}
                <nav className={styles.desktopNav}>
                    {navigationItems.map((item) => (
                        <button
                            key={item.route}
                            onClick={() => handleNavClick(item.route)}
                            className={`${styles.navButton} ${router.pathname === item.route ? styles.active : ""}`}
                        >
                            {item.label}
                        </button>
                    ))}

                    {/* User Info & Logout - Desktop */}
                    <div className={styles.userSection}>
                        {userProfile && (
                            <span className={styles.userInfo}>
                                {userProfile.firstName} {userProfile.lastName}
                            </span>
                        )}
                        <button onClick={handleLogout} disabled={loading} className={styles.logoutButton}>
                            {loading ? "Abmelden..." : "Abmelden"}
                        </button>
                    </div>
                </nav>

                {/* Mobile Burger Menu Button */}
                <button onClick={toggleMenu} className={styles.mobileMenuToggle}>
                    {isMenuOpen ? "✕" : "☰"}
                </button>

                {/* Mobile Dropdown Menu */}
                {isMenuOpen && (
                    <div className={styles.mobileMenu}>
                        {/* Navigation Items */}
                        {navigationItems.map((item) => (
                            <button
                                key={item.route}
                                onClick={() => handleNavClick(item.route)}
                                className={`${styles.mobileMenuItem} ${router.pathname === item.route ? styles.active : ""}`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}

                        {/* Separator */}
                        <div className={styles.mobileMenuSeparator} />

                        {/* User Info */}
                        {userProfile && (
                            <div className={styles.mobileUserInfo}>
                                Angemeldet als:
                                <br />
                                <span className={styles.mobileUserName}>
                                    {userProfile.firstName} {userProfile.lastName}
                                </span>
                            </div>
                        )}

                        {/* Logout Button */}
                        <button onClick={handleLogout} disabled={loading} className={styles.mobileLogoutButton}>
                            {loading ? "Abmelden..." : "Abmelden"}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;

