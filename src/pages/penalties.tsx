import { Header } from "@/components/layout";

export default function PenaltiesPage() {
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
                    {/* Page Header */}
                    <section style={{ marginBottom: "var(--spacing-xl)", textAlign: "center" }}>
                        <h1
                            style={{
                                fontSize: "2.5rem",
                                fontWeight: "800",
                                marginBottom: "var(--spacing-md)",
                                color: "var(--text-primary)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "var(--spacing-sm)",
                            }}
                        >
                            <span>⚖️</span>
                            Strafen
                        </h1>
                        <p
                            style={{
                                fontSize: "1.1rem",
                                color: "var(--text-secondary)",
                                maxWidth: "600px",
                                margin: "0 auto",
                            }}
                        >
                            Strafenkatalog und Verwaltung von Vereinsstrafen
                        </p>
                    </section>

                    {/* Coming Soon Content */}
                    <section>
                        <div
                            style={{
                                backgroundColor: "var(--surface)",
                                borderRadius: "16px",
                                padding: "var(--spacing-xl)",
                                textAlign: "center",
                                border: "1px solid var(--border)",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "4rem",
                                    marginBottom: "var(--spacing-lg)",
                                }}
                            >
                                🚧
                            </div>
                            <h2
                                style={{
                                    fontSize: "1.5rem",
                                    fontWeight: "700",
                                    marginBottom: "var(--spacing-md)",
                                    color: "var(--text-primary)",
                                }}
                            >
                                In Entwicklung
                            </h2>
                            <p
                                style={{
                                    color: "var(--text-secondary)",
                                    fontSize: "1.1rem",
                                    lineHeight: "1.6",
                                    maxWidth: "500px",
                                    margin: "0 auto",
                                }}
                            >
                                Diese Funktion wird bald verfügbar sein. Hier wird der Strafenkatalog verwaltet und Strafen können eingetragen und verfolgt werden.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

