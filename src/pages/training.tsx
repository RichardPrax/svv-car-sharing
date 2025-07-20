import styles from "../styles/Pages.module.css";

export default function TrainingPage() {
    return (
        <>
            <div className={styles.pageContainerFullHeight}>
                <div className={styles.pageWrapper}>
                    {/* Page Header */}
                    <section className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>
                            <span>🏃‍♂️</span>
                            Training
                        </h1>
                    </section>

                    {/* Coming Soon Content */}
                    <section>
                        <div className={styles.comingSoonCard}>
                            <div className={styles.comingSoonIcon}>🚧</div>
                            <h2 className={styles.comingSoonTitle}>In Entwicklung</h2>
                            <p className={styles.comingSoonDescription}>Diese Funktion wird bald verfügbar sein. Hier werden Trainingspläne und Übungen verwaltet.</p>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

