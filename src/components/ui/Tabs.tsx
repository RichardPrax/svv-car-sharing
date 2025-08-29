import React, { useState, createContext, useContext } from "react";
import styles from "./Tabs.module.css";

interface TabsContextValue {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

interface TabsProps {
    defaultTab: string;
    children: React.ReactNode;
    className?: string;
}

interface TabListProps {
    children: React.ReactNode;
    className?: string;
}

interface TabProps {
    value: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    badge?: number;
    className?: string;
    'data-testid'?: string;
}

interface TabPanelProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ defaultTab, children, className }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={`${styles.tabsContainer} ${className || ""}`}>{children}</div>
        </TabsContext.Provider>
    );
};

export const TabList: React.FC<TabListProps> = ({ children, className }) => {
    return (
        <div className={`${styles.tabList} ${className || ""}`} role="tablist">
            {children}
        </div>
    );
};

export const Tab: React.FC<TabProps> = ({ value, children, icon, badge, className, 'data-testid': testId }) => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error("Tab must be used within a Tabs component");
    }

    const { activeTab, setActiveTab } = context;
    const isActive = activeTab === value;

    return (
        <button
            className={`${styles.tab} ${isActive ? styles.tabActive : ""} ${className || ""}`}
            onClick={() => setActiveTab(value)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${value}`}
            data-testid={testId}
        >
            <div className={styles.tabContent}>
                {icon && <span className={styles.tabIcon}>{icon}</span>}
                <span className={styles.tabText}>{children}</span>
                {badge !== undefined && badge > 0 && <span className={styles.tabBadge}>{badge}</span>}
            </div>
        </button>
    );
};

export const TabPanel: React.FC<TabPanelProps> = ({ value, children, className }) => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error("TabPanel must be used within a Tabs component");
    }

    const { activeTab } = context;
    const isActive = activeTab === value;

    if (!isActive) return null;

    return (
        <div className={`${styles.tabPanel} ${className || ""}`} role="tabpanel" id={`tabpanel-${value}`} aria-labelledby={`tab-${value}`}>
            {children}
        </div>
    );
};

