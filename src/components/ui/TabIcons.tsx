import React from "react";

interface IconProps {
    className?: string;
    size?: number;
}

export const UsersIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM6.5 8a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM1.5 15a1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 1.5 1.5v.5a3 3 0 0 1-3 3H4.5a3 3 0 0 1-3-3v-.5ZM17.5 8a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM13.5 15a1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 1.5 1.5v.5a3 3 0 0 1-3 3h-2.5a3 3 0 0 1-3-3v-.5Z" />
    </svg>
);

export const CarIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6ZM5.25 6.75a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM17.25 6.75a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM3 19.5a.75.75 0 0 1 .75-.75H6a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75ZM18 19.5a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H18.75a.75.75 0 0 1-.75-.75Z" />
    </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
            clipRule="evenodd"
        />
    </svg>
);

export const BagIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v12z" />
    </svg>
);

