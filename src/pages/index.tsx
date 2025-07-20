import { useRouter } from "next/router";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import styles from "../styles/Pages.module.css";

interface CategoryCard {
    title: string;
    description: string;
    route: string;
    icon: string;
    color: string;
}

export default function HomePage() {
    const router = useRouter();
    const { userProfile } = useOptimizedAuth();

    const categories: CategoryCard[] = [
        {
            title: "Training",
            description: "Trainingspläne und Übungen verwalten",
            route: "/training",
            icon: "🏃‍♂️",
            color: "#3B82F6",
        },
        {
            title: "Spieltage",
            description: "Spielpläne und Fahrgemeinschaften",
            route: "/matches",
            icon: "🏐",
            color: "#10B981",
        },
        {
            title: "Strafen",
            description: "Strafenkatalog und Verwaltung",
            route: "/penalties",
            icon: "⚖️",
            color: "#EF4444",
        },
        {
            title: "Statistiken",
            description: "Spieler- und Teamstatistiken",
            route: "/statistics",
            icon: "📊",
            color: "#8B5CF6",
        },
    ];

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
                                    <div className={styles.categoryCardIcon}>{category.icon}</div>
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

