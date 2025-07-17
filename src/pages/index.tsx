import { useRouter } from "next/router";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";

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
            <div
                style={{
                    padding: "var(--spacing-xl) 0",
                    minHeight: "calc(100vh - 80px)", // Account for header height
                    backgroundColor: "var(--background)",
                }}
            >
                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding: "0 var(--spacing-md)",
                    }}
                >
                    {/* Willkommen Section */}
                    <section style={{ marginBottom: "var(--spacing-xl)", textAlign: "center" }}>
                        <div
                            style={{
                                marginBottom: "var(--spacing-lg)",
                            }}
                        >
                            <h1
                                style={{
                                    fontSize: "clamp(1.8rem, 4vw, 2.2rem)",
                                    fontWeight: "700",
                                    marginBottom: "var(--spacing-sm)",
                                    color: "var(--text-primary)",
                                    background: "linear-gradient(135deg, #3B82F6, #10B981)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    textAlign: "center",
                                    lineHeight: "1.2",
                                }}
                            >
                                {userProfile ? `Willkommen zurück, ${userProfile.firstName}!` : "Willkommen!"}
                            </h1>
                            <p
                                style={{
                                    fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                                    color: "var(--text-secondary)",
                                    maxWidth: "700px",
                                    margin: "0 auto",
                                    lineHeight: "1.6",
                                    fontWeight: "400",
                                }}
                            >
                                Wähle einen Bereich aus, um loszulegen:
                            </p>
                        </div>
                    </section>

                    {/* Kategorien Grid */}
                    <section>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                maxWidth: "800px",
                                margin: "0 auto",
                                gap: "var(--spacing-lg)",
                                padding: "0 var(--spacing-sm)",
                            }}
                        >
                            {categories.map((category) => (
                                <div
                                    key={category.title}
                                    onClick={() => handleCategoryClick(category.route)}
                                    style={{
                                        backgroundColor: "var(--surface)",
                                        borderRadius: "16px",
                                        padding: "var(--spacing-xl)",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        border: "1px solid var(--border)",
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                                        textAlign: "center",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-4px)";
                                        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.15)";
                                        e.currentTarget.style.borderColor = category.color;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
                                        e.currentTarget.style.borderColor = "var(--border)";
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "3rem",
                                            marginBottom: "var(--spacing-md)",
                                        }}
                                    >
                                        {category.icon}
                                    </div>
                                    <h3
                                        style={{
                                            fontSize: "1.5rem",
                                            fontWeight: "700",
                                            marginBottom: "var(--spacing-sm)",
                                            color: category.color,
                                        }}
                                    >
                                        {category.title}
                                    </h3>
                                    <p
                                        style={{
                                            color: "var(--text-secondary)",
                                            lineHeight: "1.5",
                                            fontSize: "1rem",
                                        }}
                                    >
                                        {category.description}
                                    </p>

                                    {/* Decorative element */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "-50%",
                                            right: "-50%",
                                            width: "100px",
                                            height: "100px",
                                            background: `linear-gradient(135deg, ${category.color}20, transparent)`,
                                            borderRadius: "50%",
                                            pointerEvents: "none",
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

