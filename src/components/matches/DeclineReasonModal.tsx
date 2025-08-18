import React, { useState } from "react";
import Button from "@/components/forms/Button";
import Modal from "@/components/ui/Modal";
import { GameParticipationStatus } from "@/hooks/matches/useGameParticipation";
import styles from "./Matches.module.css";

interface DeclineReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    isLoading?: boolean;
    statusType?: GameParticipationStatus | null;
}

export default function DeclineReasonModal({ isOpen, onClose, onConfirm, isLoading = false, statusType = "DECLINING" }: DeclineReasonModalProps) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    // Dynamische Texte basierend auf Status
    const isDecline = statusType === "DECLINING";
    const titleText = isDecline ? "Absage begründen" : "Unsicherheit begründen";
    const actionText = isDecline ? "Absage" : "unsichere Teilnahme";
    const placeholderText = isDecline ? "z.B. Verletzung, Arbeit, Familie, Krankheit..." : "z.B. noch unsicher wegen Arbeit, Familie, andere Termine...";
    const buttonText = isDecline ? "Absage bestätigen" : "Als unsicher markieren";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!reason.trim()) {
            setError(`Bitte geben Sie einen Grund für Ihre ${actionText} an.`);
            return;
        }

        if (reason.trim().length < 3) {
            setError("Der Grund muss mindestens 3 Zeichen lang sein.");
            return;
        }

        setError("");
        onConfirm(reason.trim());
    };

    const handleClose = () => {
        setReason("");
        setError("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={titleText} maxWidth="sm">
            <form onSubmit={handleSubmit}>
                <p className={styles.modalDescription}>Bitte geben Sie einen Grund für Ihre {actionText} an. Dies hilft bei der Planung und Kommunikation.</p>

                <div className={styles.formField}>
                    <label htmlFor="reason" className={styles.formLabel}>
                        Grund für die {actionText} *
                    </label>
                    <textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder={placeholderText}
                        className={styles.formTextarea}
                        rows={3}
                        disabled={isLoading}
                        maxLength={255}
                    />
                    {error && <div className={styles.formError}>{error}</div>}
                </div>

                <div className={styles.modalFooter}>
                    <Button type="button" variant="secondary" onClick={handleClose} disabled={isLoading}>
                        Abbrechen
                    </Button>
                    <Button type="submit" variant="primary" loading={isLoading} disabled={!reason.trim() || reason.trim().length < 3}>
                        {buttonText}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

