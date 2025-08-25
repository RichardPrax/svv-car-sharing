import { useRouter } from "next/router";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { Icon, type IconName } from "@/components/ui";
import styles from "../styles/Pages.module.css";

interface CategoryCard {
    title: string;
    description: string;
    route: string;
    icon: IconName;
    color: string;
}

export default function HomePage() {
    const router = useRouter();
    const { userProfile } = useOptimizedAuth();
    const { hasAdminAccess } = useRoleGuard();

    const baseCategories: CategoryCard[] = [
        {
            title: "Training",
            description: "Trainingspläne und Übungen verwalten",
            route: "/training",
            icon: "runner" as IconName,
            color: "#3B82F6",
        },
        {
            title: "Spieltage",
            description: "Spielpläne und Fahrgemeinschaften",
            route: "/matches",
            icon: "volleyball" as IconName,
            color: "#10B981",
        },
        {
            title: "Strafen",
            description: "Strafenkatalog und Verwaltung",
            route: "/penalties",
            icon: "scales" as IconName,
            color: "#EF4444",
        },
        {
            title: "Statistiken",
            description: "Spieler- und Teamstatistiken",
            route: "/statistics",
            icon: "chart" as IconName,
            color: "#8B5CF6",
        },
    ];

    // Admin-Kategorien (nur hinzufügen wenn Berechtigung vorhanden)
    const adminCategories: CategoryCard[] = [
        {
            title: "Benutzer verwalten",
            description: "Übersicht aller Benutzer und Rollenverwaltung",
            route: "/admin/users",
            icon: "users" as IconName,
            color: "#F59E0B",
        },
    ];

    // Alle Kategorien zusammenfügen basierend auf Berechtigung
    const categories = hasAdminAccess() ? [...baseCategories, ...adminCategories] : baseCategories;

    const handleCategoryClick = (route: string) => {
        router.push(route);
    };

    return (
        <>
            <div className={styles.pageContainer}>
                <div className={styles.pageWrapper}>
                    {/* Willkommen Section */}
                    <section className={styles.pageHeader}>
                        <div>
                            <h1 className={styles.pageTitleGradient}>{userProfile ? `Willkommen zurück, ${userProfile.firstName}!` : "Willkommen!"}</h1>
                            <p className={styles.pageSubtitle}>Wähle einen Bereich aus, um loszulegen:</p>
                        </div>
                    </section>

                    {/* Kategorien Grid */}
                    <section>
                        <div className={styles.categoriesGrid}>
                            {categories.map((category) => (
                                <div key={category.title} onClick={() => handleCategoryClick(category.route)} className={styles.categoryCard}>
                                    <div className={styles.categoryCardIcon}>
                                        <Icon name={category.icon} size={32} color={category.color} />
                                    </div>
                                    <h3 className={styles.categoryCardTitle} style={{ color: category.color }}>
                                        {category.title}
                                    </h3>
                                    <p className={styles.categoryCardDescription}>{category.description}</p>

                                    <div className={styles.categoryCardDecorative} style={{ background: `linear-gradient(135deg, ${category.color}20, transparent)` }} />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

