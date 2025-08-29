// src/components/ui/Modal.tsx
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl";
    'data-testid'?: string;
};

export default function Modal({ isOpen, onClose, title, children, maxWidth = "md", 'data-testid': testId }: Props) {
    // Verhindere Scrollen im Hintergrund, wenn Modal offen ist
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        // Cleanup beim Unmount
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Schließe Modal bei Escape-Taste
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const getModalSizeClass = () => {
        switch (maxWidth) {
            case "sm":
                return styles.modalContentSm;
            case "lg":
                return styles.modalContentLg;
            case "xl":
                return styles.modalContentXl;
            default:
                return styles.modalContentMd;
        }
    };

    // Modal-Content als Portal ins body rendern
    return createPortal(
        <div className={styles.modalOverlay} onClick={handleBackdropClick} data-testid={testId}>
            <div className={`${styles.modalContent} ${getModalSizeClass()}`}>
                {title && (
                    <div className={styles.modalHeader}>
                        <h2 className={styles.modalTitle}>{title}</h2>
                        <button 
                            className={styles.modalCloseButton} 
                            onClick={onClose} 
                            aria-label="Modal schließen"
                            data-testid={testId ? `${testId}-close` : undefined}
                        >
                            ×
                        </button>
                    </div>
                )}
                <div className={styles.modalBody}>{children}</div>
            </div>
        </div>,
        document.body
    );
}

