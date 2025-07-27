// src/components/layout/AppLayout.tsx
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import styles from "./AppLayout.module.css";

interface AppLayoutProps {
    children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <div className={styles.appLayout}>
            <Sidebar />
            <main className={styles.mainContent}>{children}</main>
        </div>
    );
};

export default AppLayout;

