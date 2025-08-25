// src/components/layout/Sidebar.tsx
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { useRouter } from "next/router";
import { Icon, type IconName } from "@/components/ui";
import styles from "./Sidebar.module.css";

interface NavigationItem {
    label: string;
    route: string;
    icon: IconName;
}

const Sidebar = () => {
    const [loading, setLoading] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { userProfile, loading: authLoading } = useOptimizedAuth();
    const { hasAdminAccess } = useRoleGuard();
    const router = useRouter();

    // Add admin navigation items if user has admin access (only after auth is loaded)
    const allNavigationItems: NavigationItem[] = useMemo(() => {
        const baseNavigationItems: NavigationItem[] = [
            { label: "Dashboard", route: "/", icon: "home" as IconName },
            { label: "Training", route: "/training", icon: "runner" as IconName },
            { label: "Spieltage", route: "/matches", icon: "volleyball" as IconName },
            { label: "Strafen", route: "/penalties", icon: "scales" as IconName },
            { label: "Statistiken", route: "/statistics", icon: "chart" as IconName },
        ];

        if (authLoading || !userProfile) {
            return baseNavigationItems;
        }
        return hasAdminAccess() ? [...baseNavigationItems, { label: "Benutzer verwalten", route: "/admin/users", icon: "users" as IconName }] : baseNavigationItems;
    }, [authLoading, userProfile, hasAdminAccess]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [router.pathname]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMobileOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isRouteActive = (route: string): boolean => {
        if (route === "/") {
            return router.pathname === "/";
        }
        return router.pathname === route || router.pathname.startsWith(route + "/");
    };

    const handleNavClick = (route: string) => {
        router.push(route);
    };

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

    const handleLogoClick = () => {
        router.push("/");
    };

    const toggleMobileMenu = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button className={styles.mobileMenuButton} onClick={toggleMobileMenu} aria-label="Menu öffnen">
                <Icon name="menu" size={24} color="white" />
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && <div className={styles.mobileOverlay} onClick={() => setIsMobileOpen(false)} />}

            <aside className={`${styles.sidebar} ${isMobileOpen ? styles.mobileOpen : ""}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                {/* Header Section */}
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo} onClick={handleLogoClick}>
                        <span className={styles.logoIcon}>
                            <Icon name="volleyball" size={32} />
                        </span>
                        <h1 className={styles.logoText}>SVV Manager</h1>
                    </div>
                </div>

                {/* Navigation Section */}
                <nav className={styles.navigation}>
                    {allNavigationItems.map((item: NavigationItem) => (
                        <button
                            key={item.route}
                            onClick={() => handleNavClick(item.route)}
                            className={`${styles.navItem} ${isRouteActive(item.route) ? styles.active : ""}`}
                            title={!isHovered ? item.label : undefined}
                        >
                            <span className={styles.navIcon}>
                                <Icon name={item.icon} size={24} />
                            </span>
                            <span className={styles.navLabel}>{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* User Section */}
                <div className={styles.userSection}>
                    {userProfile && (
                        <div className={styles.userInfo}>
                            <div className={styles.userAvatar}>
                                {userProfile.firstName?.[0]}
                                {userProfile.lastName?.[0]}
                            </div>
                            <div className={styles.userDetails}>
                                <span className={styles.userName}>
                                    {userProfile.firstName} {userProfile.lastName}
                                </span>
                                <span className={styles.userRole}>
                                    {userProfile.role === "ADMIN"
                                        ? "Administrator"
                                        : userProfile.role === "TRAINER"
                                        ? "Trainer"
                                        : userProfile.role === "PENALTY_MASTER"
                                        ? "Strafenmeister"
                                        : userProfile.role === "PLAYER"
                                        ? "Spieler"
                                        : "Mitglied"}
                                </span>
                            </div>
                        </div>
                    )}

                    <button onClick={handleLogout} disabled={loading} className={styles.logoutButton} title={!isHovered ? "Abmelden" : undefined}>
                        <span className={styles.logoutIcon}>
                            <Icon name="logout" size={20} />
                        </span>
                        <span>{loading ? "Abmelden..." : "Abmelden"}</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

