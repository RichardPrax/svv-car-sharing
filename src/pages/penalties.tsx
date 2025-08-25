import { Icon } from "@/components/ui";
import styles from "../styles/Pages.module.css";

export default function PenaltiesPage() {
    return (
        <>
            <div className={styles.pageContainerFullHeight}>
                <div className={styles.pageWrapper}>
                    {/* Page Header */}
                    <section className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>
                            <Icon name="scales" size={32} color="#EF4444" />
                            Strafen
                        </h1>
                    </section>

                    {/* Coming Soon Content */}
                    <section>
                        <div className={styles.comingSoonCard}>
                            <div className={styles.comingSoonIcon}>🚧</div>
                            <h2 className={styles.comingSoonTitle}>In Entwicklung</h2>
                            <p className={styles.comingSoonDescription}>
                                Diese Funktion wird bald verfügbar sein. Hier wird der Strafenkatalog und die Verwaltung von Strafen angezeigt.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

