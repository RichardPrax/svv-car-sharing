// src/components/auth/AuthLink.tsx
import { useRouter } from "next/router";
import styles from "./Auth.module.css";

interface AuthLinkProps {
    text: string;
    linkText: string;
    href: string;
}

export default function AuthLink({ text, linkText, href }: AuthLinkProps) {
    const router = useRouter();

    return (
        <div className={styles.authLinkContainer}>
            <p className={styles.authLinkText}>
                {text}{" "}
                <button onClick={() => router.push(href)} className={styles.authLink}>
                    {linkText}
                </button>
            </p>
        </div>
    );
}

