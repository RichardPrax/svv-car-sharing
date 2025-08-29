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

export default function DeclineReasonModal({ isOpen, onClose, onConfirm, isLoading = false }: DeclineReasonModalProps) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!reason.trim()) {
            setError("Bitte geben Sie einen Grund für Ihre Absage an.");
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
        <Modal isOpen={isOpen} onClose={handleClose} title="Absage begründen" maxWidth="sm" data-testid="decline-reason-modal">
            <form onSubmit={handleSubmit} data-testid="decline-reason-form">
                <p className={styles.modalDescription}>Bitte geben Sie einen Grund für Ihre Absage an. Dies hilft bei der Planung und Kommunikation.</p>

                <div className={styles.formField}>
                    <label htmlFor="reason" className={styles.formLabel}>
                        Grund für die Absage *
                    </label>
                    <textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="z.B. Verletzung, Arbeit, Familie, Krankheit..."
                        className={styles.formTextarea}
                        rows={3}
                        disabled={isLoading}
                        maxLength={255}
                        data-testid="decline-reason-input"
                    />
                    {error && <div className={styles.formError} data-testid="decline-reason-error">{error}</div>}
                </div>

                <div className={styles.modalFooter}>
                    <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={handleClose} 
                        disabled={isLoading}
                        data-testid="decline-reason-cancel"
                    >
                        Abbrechen
                    </Button>
                    <Button 
                        type="submit" 
                        variant="primary" 
                        loading={isLoading} 
                        disabled={!reason.trim() || reason.trim().length < 3}
                        data-testid="decline-reason-submit"
                    >
                        Absage bestätigen
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

