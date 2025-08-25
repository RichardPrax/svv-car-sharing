// src/components/ui/SkeletonLoader.tsx
import React from "react";
import styles from "./SkeletonLoader.module.css";

interface SkeletonProps {
    width?: string;
    height?: string;
    borderRadius?: string;
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
    width = "100%", 
    height = "20px", 
    borderRadius = "4px",
    className = ""
}) => {
    return (
        <div 
            className={`${styles.skeleton} ${className}`}
            style={{ width, height, borderRadius }}
        />
    );
};

interface UsersListSkeletonProps {
    count?: number;
}

export const UsersListSkeleton: React.FC<UsersListSkeletonProps> = ({ count = 5 }) => {
    return (
        <div className={styles.usersListSkeleton}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className={styles.userItemSkeleton}>
                    <div className={styles.userInfoSkeleton}>
                        <Skeleton width="200px" height="24px" borderRadius="6px" />
                    </div>
                    <div className={styles.userActionsSkeleton}>
                        <Skeleton width="80px" height="24px" borderRadius="12px" />
                        <div className={styles.buttonsSkeleton}>
                            <Skeleton width="32px" height="32px" borderRadius="6px" />
                            <Skeleton width="32px" height="32px" borderRadius="6px" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Skeleton;
