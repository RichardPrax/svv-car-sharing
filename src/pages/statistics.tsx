import { Icon } from "@/components/ui";
import styles from "../styles/Pages.module.css";

export default function StatisticsPage() {
    return (
        <>
            <div className={styles.pageContainerFullHeight}>
                <div className={styles.pageWrapper}>
                    {/* Page Header */}
                    <section className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>
                            <Icon name="chart" size={32} color="#8B5CF6" />
                            Statistiken
                        </h1>
                    </section>

                    {/* Coming Soon Content */}
                    <section>
                        <div className={styles.comingSoonCard}>
                            <div className={styles.comingSoonIcon}>
                                <Icon name="chart" size={48} color="#8B5CF6" />
                            </div>
                            <h2 className={styles.comingSoonTitle}>In Entwicklung</h2>
                            <p className={styles.comingSoonDescription}>
                                Diese Funktion wird bald verfügbar sein. Hier werden detaillierte Statistiken zu Fahrgemeinschaften, Teilnahmen und Trends angezeigt.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

