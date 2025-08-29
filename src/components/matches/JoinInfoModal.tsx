import React, { useState } from "react";
import Button from "@/components/forms/Button";
import Modal from "@/components/ui/Modal";
import styles from "./Matches.module.css";

interface JoinInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (info?: string) => void;
    isLoading?: boolean;
}

export default function JoinInfoModal({ isOpen, onClose, onConfirm, isLoading = false }: JoinInfoModalProps) {
    const [info, setInfo] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(info.trim() || undefined);
    };

    const handleClose = () => {
        setInfo("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Zusage bestätigen" maxWidth="sm" data-testid="join-info-modal">
            <form onSubmit={handleSubmit} data-testid="join-info-form">
                <p className={styles.modalDescription}>Super, du bist dabei! Falls du zusätzliche Informationen hast, kannst du sie hier optional angeben.</p>

                <div className={styles.formField}>
                    <label htmlFor="info" className={styles.formLabel}>
                        Zusätzliche Information (optional)
                    </label>
                    <textarea
                        id="info"
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                        placeholder="z.B. Ich komme etwas später, Bringe Wasser mit, ..."
                        className={styles.formTextarea}
                        rows={2}
                        disabled={isLoading}
                        maxLength={255}
                        data-testid="join-info-input"
                    />
                </div>

                <div className={styles.modalFooter}>
                    <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={handleClose} 
                        disabled={isLoading}
                        data-testid="join-info-cancel"
                    >
                        Abbrechen
                    </Button>
                    <Button 
                        type="submit" 
                        variant="primary" 
                        loading={isLoading}
                        data-testid="join-info-submit"
                    >
                        Zusage bestätigen
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

