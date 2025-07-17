import { Header } from "@/components/layout";
import { useRouter } from "next/router";

interface CategoryCard {
    title: string;
    description: string;
    route: string;
    icon: string;
    color: string;
}

export default function HomePage() {
    const router = useRouter();

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
            <Header />
            <div
                style={{
                    padding: "var(--spacing-lg) 0",
                    minHeight: "100vh",
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
                        <h1
                            style={{
                                fontSize: "2.5rem",
                                fontWeight: "800",
                                marginBottom: "var(--spacing-md)",
                                color: "var(--text-primary)",
                                background: "linear-gradient(135deg, #3B82F6, #10B981)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            SVV Teammanager
                        </h1>
                        <p
                            style={{
                                fontSize: "1.2rem",
                                color: "var(--text-secondary)",
                                maxWidth: "600px",
                                margin: "0 auto",
                                lineHeight: "1.6",
                            }}
                        >
                            Willkommen! Wähle einen Bereich aus, um loszulegen.
                        </p>
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

