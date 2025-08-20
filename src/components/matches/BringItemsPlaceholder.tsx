import React from "react";
import styles from "./BringItemsPlaceholder.module.css";

interface BringItemsPlaceholderProps {
    matchId: string;
}
// TODO: Implementation
export default function BringItemsPlaceholder({ matchId }: BringItemsPlaceholderProps) {
    return (
        <div className={styles.placeholderContainer}>
            <div className={styles.placeholderHeader}>
                <h2 className={styles.placeholderTitle}>🎒 Was müssen wir mitbringen?</h2>
                <p className={styles.placeholderSubtitle}>Hier können Spieler sich eintragen, was sie zum Spiel {matchId}mitbringen</p>
            </div>

            <div className={styles.exampleList}>
                <h3 className={styles.exampleTitle}>Beispiele:</h3>
                <div className={styles.exampleItems}>
                    <div className={styles.exampleItem}>
                        <div className={styles.itemHeader}>
                            <span className={styles.itemName}>🏃‍♂️ Trikots</span>
                            <span className={styles.itemStatus}>✅ Richard</span>
                        </div>
                        <p className={styles.itemDescription}>Vereinstrikots für alle Spieler</p>
                    </div>

                    <div className={styles.exampleItem}>
                        <div className={styles.itemHeader}>
                            <span className={styles.itemName}>🥤 Getränke</span>
                            <span className={styles.itemStatus}>✅ Max</span>
                        </div>
                        <p className={styles.itemDescription}>Wasser und Sportgetränke für die Pause</p>
                    </div>

                    <div className={styles.exampleItem}>
                        <div className={styles.itemHeader}>
                            <span className={styles.itemName}>⚽ Fußbälle</span>
                            <span className={styles.itemStatus}>❓ Noch offen</span>
                        </div>
                        <p className={styles.itemDescription}>Bälle zum Aufwärmen und für das Spiel</p>
                    </div>

                    <div className={styles.exampleItem}>
                        <div className={styles.itemHeader}>
                            <span className={styles.itemName}>🩹 Erste Hilfe</span>
                            <span className={styles.itemStatus}>✅ Sarah</span>
                        </div>
                        <p className={styles.itemDescription}>Erste-Hilfe-Kasten und Tape</p>
                    </div>

                    <div className={styles.exampleItem}>
                        <div className={styles.itemHeader}>
                            <span className={styles.itemName}>📋 Aufstellung</span>
                            <span className={styles.itemStatus}>✅ Trainer</span>
                        </div>
                        <p className={styles.itemDescription}>Taktikboard und Spielerliste</p>
                    </div>
                </div>
            </div>

            <div className={styles.comingSoon}>
                <div className={styles.comingSoonIcon}>🚧</div>
                <h3 className={styles.comingSoonTitle}>Feature in Entwicklung</h3>
                <p className={styles.comingSoonText}>
                    Diese Funktion wird bald verfügbar sein. Spieler können sich dann selbst eintragen und angeben, was sie zum Spiel mitbringen möchten.
                </p>
            </div>
        </div>
    );
}

