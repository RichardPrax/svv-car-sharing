// src/components/auth/AuthSuccess.tsx
import pageStyles from "@/styles/Pages.module.css";

interface AuthSuccessProps {
    title: string;
    message: string;
    submessage?: string;
    buttonText?: string;
    onButtonClick?: () => void;
}

// Modern success checkmark icon component
const SuccessIcon = () => (
    <div style={{ 
        width: '80px', 
        height: '80px', 
        borderRadius: '50%', 
        backgroundColor: '#10b981', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        margin: '0 auto 2rem',
        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)',
        animation: 'successPulse 0.6s ease-out'
    }}>
        <svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ animation: 'checkmarkDraw 0.8s ease-out 0.2s both' }}
        >
            <path d="M20 6L9 17l-5-5" />
        </svg>
        <style jsx>{`
            @keyframes successPulse {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes checkmarkDraw {
                0% { stroke-dasharray: 0 50; }
                100% { stroke-dasharray: 50 0; }
            }
        `}</style>
    </div>
);

export default function AuthSuccess({ title, message, submessage, buttonText, onButtonClick }: AuthSuccessProps) {
    return (
        <div className={pageStyles.pageContainerFullHeight}>
            <div className={pageStyles.pageWrapper}>
                <section className={pageStyles.pageHeader}>
                    <div className={pageStyles.comingSoonCard}>
                        <SuccessIcon />
                        <h1 className={pageStyles.comingSoonTitle}>{title}</h1>
                        <p className={pageStyles.comingSoonDescription}>{message}</p>
                        {submessage && <p className={pageStyles.comingSoonDescription} style={{ marginTop: "1rem" }}>{submessage}</p>}
                        {buttonText && onButtonClick && (
                            <button onClick={onButtonClick} className={pageStyles.backButton} style={{ marginTop: "2rem" }}>
                                {buttonText}
                            </button>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

