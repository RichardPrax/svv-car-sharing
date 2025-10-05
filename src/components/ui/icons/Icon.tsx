// src/components/ui/icons/Icon.tsx

export type IconName = "home" | "volleyball" | "runner" | "scales" | "chart" | "users" | "logout" | "menu" | "dashboard" | "car" | "refresh" | "user" | "edit" | "delete" | "plus" | "add" | "calendar" | "clock-loading";

interface IconProps {
    name: IconName;
    size?: number;
    className?: string;
    color?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, className = "", color = "currentColor" }) => {
    const getIconPath = (iconName: IconName): React.ReactElement => {
        switch (iconName) {
            case "home":
            case "dashboard":
                return (
                    <path
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        stroke={color}
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                );

            case "volleyball":
                return (
                    <g transform="scale(0.267)">
                        <path
                            d="M 45 0 C 20.187 0 0 20.187 0 45 c 0 24.813 20.187 45 45 45 c 24.813 0 45 -20.187 45 -45 C 90 20.187 69.813 0 45 0 z M 44.699 87.992 c -7.115 -0.049 -13.822 -1.837 -19.723 -4.956 c 12.973 -8.339 20.043 -20.911 20.992 -37.425 c 6.169 -3.315 12.353 -5.127 18.619 -5.455 C 67.683 60.9 60.997 76.991 44.699 87.992 z M 45.061 43.845 c -5.737 -3.61 -10.327 -8.189 -13.763 -13.698 c 15.56 -13.566 32.28 -15.658 51.066 -6.39 c 3.329 5.831 5.331 12.509 5.596 19.627 C 73.294 36.296 58.873 36.444 45.061 43.845 z M 80.414 20.649 c -18.132 -7.914 -34.986 -5.314 -50.158 7.752 C 26.91 22.428 24.84 15.435 24.065 7.46 C 30.265 3.988 37.403 2 45 2 C 59.676 2 72.652 9.395 80.414 20.649 z M 22.178 8.582 c 1.827 16.549 9.145 28.968 21.782 36.932 c -0.409 7.053 -1.966 13.363 -4.675 18.89 c -18.493 -6 -28.187 -18.747 -31.341 -41.179 C 11.449 17.281 16.343 12.252 22.178 8.582 z M 2 45 c 0 -6.76 1.573 -13.158 4.364 -18.854 c 2.373 14.237 8.769 32.333 31.971 40.046 c -3.514 6.357 -8.634 11.618 -15.338 15.734 C 10.433 74.411 2 60.674 2 45 z M 48.332 87.858 c 15.102 -11.351 21.242 -27.396 18.269 -47.756 c 6.985 -0.009 14.083 1.833 21.383 5.516 C 87.667 67.924 70.286 86.166 48.332 87.858 z"
                            fill={color}
                            strokeLinecap="round"
                        />
                    </g>
                );

            case "runner":
                return (
                    <g transform="scale(0.267)">
                        <path
                            d="M 38.118 58.929 c -0.071 0 -0.144 -0.004 -0.215 -0.012 c -0.666 -0.072 -1.252 -0.473 -1.56 -1.067 l -2.922 -5.635 c -2.219 -4.278 -1.688 -9.458 1.352 -13.197 l 17.011 -20.069 c 0.709 -0.836 1.96 -0.945 2.802 -0.247 l 9.068 7.514 c 0.039 0.031 0.076 0.064 0.113 0.099 c 0.29 0.273 0.481 0.617 0.57 0.982 c 0.03 0.125 0.049 0.255 0.055 0.388 c 0.002 0.033 0.002 0.066 0.002 0.1 v 10.811 H 88 c 1.104 0 2 0.896 2 2 s -0.896 2 -2 2 H 62.394 c -1.104 0 -2 -0.896 -2 -2 v -7.297 l -20.739 24.91 C 39.272 58.667 38.708 58.929 38.118 58.929 z M 53.556 23.044 L 37.849 41.572 c -2.008 2.471 -2.363 5.938 -0.878 8.801 l 1.536 2.962 l 21.067 -25.304 L 53.556 23.044 z"
                            fill={color}
                        />
                        <path
                            d="M 67.968 22.938 c -2.125 0 -4.263 -0.701 -6.036 -2.143 c -1.986 -1.614 -3.226 -3.906 -3.488 -6.452 c -0.264 -2.547 0.48 -5.043 2.096 -7.03 c 1.614 -1.987 3.906 -3.226 6.452 -3.489 c 2.549 -0.263 5.044 0.481 7.03 2.096 c 4.101 3.333 4.726 9.381 1.393 13.482 v 0 C 73.522 21.73 70.756 22.938 67.968 22.938 z M 67.987 7.773 c -0.194 0 -0.389 0.01 -0.585 0.03 c -1.483 0.153 -2.818 0.875 -3.76 2.032 c -0.94 1.158 -1.374 2.612 -1.221 4.096 c 0.153 1.483 0.875 2.819 2.033 3.759 c 2.387 1.942 5.913 1.577 7.855 -0.811 l 0 0 c 1.941 -2.39 1.577 -5.914 -0.813 -7.855 C 70.493 8.208 69.265 7.773 67.987 7.773 z M 73.862 18.142 h 0.01 H 73.862 z"
                            fill={color}
                        />
                        <path
                            d="M 28.263 86.227 c -0.424 0 -0.852 -0.135 -1.215 -0.412 c -0.877 -0.672 -1.043 -1.928 -0.371 -2.805 l 13.597 -17.745 l -3.923 -7.399 c -0.517 -0.976 -0.146 -2.187 0.83 -2.703 c 0.978 -0.521 2.186 -0.146 2.704 0.83 l 4.524 8.533 c 0.366 0.69 0.296 1.532 -0.18 2.153 L 29.852 85.443 C 29.458 85.957 28.864 86.227 28.263 86.227 z"
                            fill={color}
                        />
                        <path
                            d="M 28.263 36.418 c -0.449 0 -0.901 -0.15 -1.274 -0.459 c -0.851 -0.704 -0.97 -1.965 -0.265 -2.816 l 17.15 -20.716 c 0.338 -0.409 0.825 -0.666 1.354 -0.716 c 0.529 -0.049 1.055 0.113 1.463 0.451 L 63.67 26.229 c 0.851 0.705 0.969 1.965 0.264 2.816 c -0.704 0.85 -1.964 0.969 -2.816 0.264 L 45.679 16.519 L 29.805 35.694 C 29.409 36.171 28.838 36.418 28.263 36.418 z"
                            fill={color}
                        />
                        <path
                            d="M 1.999 86.227 c -0.43 0 -0.864 -0.138 -1.229 -0.424 c -0.871 -0.679 -1.026 -1.936 -0.346 -2.807 l 25.445 -32.602 c 0.68 -0.87 1.938 -1.027 2.807 -0.346 c 0.871 0.679 1.026 1.936 0.346 2.807 L 3.577 85.457 C 3.182 85.962 2.593 86.227 1.999 86.227 z"
                            fill={color}
                        />
                    </g>
                );

            case "scales":
                return (
                    <g transform="scale(0.267)">
                        <path
                            d="M 45.237 43.014 c -5.53 -0.659 -7.997 -3.057 -7.997 -7.774 c 0 -4.279 3.481 -7.76 7.76 -7.76 c 4.278 0 7.76 3.481 7.76 7.76 c 0 1.104 0.896 2 2 2 s 2 -0.896 2 -2 c 0 -5.801 -4.227 -10.623 -9.76 -11.577 v -2.607 c 0 -1.104 -0.896 -2 -2 -2 s -2 0.896 -2 2 v 2.607 c -5.533 0.954 -9.76 5.775 -9.76 11.577 c 0 4.732 1.999 10.611 11.523 11.746 c 5.531 0.658 7.997 3.056 7.997 7.773 c 0 4.278 -3.481 7.76 -7.76 7.76 c -4.279 0 -7.76 -3.481 -7.76 -7.76 c 0 -1.104 -0.896 -2 -2 -2 s -2 0.896 -2 2 c 0 5.801 4.227 10.623 9.76 11.577 v 2.607 c 0 1.104 0.896 2 2 2 s 2 -0.896 2 -2 v -2.607 c 5.533 -0.954 9.76 -5.775 9.76 -11.577 C 56.76 50.027 54.761 44.148 45.237 43.014 z"
                            fill={color}
                        />
                        <path
                            d="M 45 90 C 20.187 90 0 69.813 0 45 C 0 20.187 20.187 0 45 0 c 24.813 0 45 20.187 45 45 C 90 69.813 69.813 90 45 90 z M 45 4 C 22.393 4 4 22.393 4 45 s 18.393 41 41 41 s 41 -18.393 41 -41 S 67.607 4 45 4 z"
                            fill={color}
                        />
                        <path
                            d="M 45 81.693 c -1.104 0 -2 -0.896 -2 -2 s 0.896 -2 2 -2 c 12.349 0 23.513 -6.837 29.134 -17.843 c 0.502 -0.983 1.704 -1.373 2.691 -0.871 c 0.983 0.503 1.373 1.707 0.871 2.691 C 71.388 74.021 58.859 81.693 45 81.693 z"
                            fill={color}
                        />
                        <path
                            d="M 79.254 52.556 c -0.106 0 -0.213 -0.008 -0.32 -0.025 c -1.091 -0.176 -1.833 -1.202 -1.657 -2.292 c 0.276 -1.72 0.417 -3.482 0.417 -5.238 c 0 -1.104 0.896 -2 2 -2 s 2 0.896 2 2 c 0 1.968 -0.157 3.944 -0.468 5.873 C 81.067 51.856 80.218 52.556 79.254 52.556 z"
                            fill={color}
                        />
                        <path
                            d="M 14.083 31.24 c -0.306 0 -0.617 -0.071 -0.908 -0.219 c -0.984 -0.502 -1.374 -1.708 -0.872 -2.691 C 18.613 15.979 31.141 8.307 45 8.307 c 1.104 0 2 0.896 2 2 s -0.896 2 -2 2 c -12.349 0 -23.512 6.837 -29.134 17.843 C 15.512 30.842 14.811 31.24 14.083 31.24 z"
                            fill={color}
                        />
                        <path
                            d="M 10.307 47 c -1.104 0 -2 -0.896 -2 -2 c 0 -1.969 0.158 -3.946 0.468 -5.874 c 0.176 -1.091 1.203 -1.828 2.293 -1.656 c 1.09 0.176 1.832 1.202 1.656 2.293 c -0.277 1.718 -0.417 3.48 -0.417 5.237 C 12.307 46.104 11.411 47 10.307 47 z"
                            fill={color}
                        />
                    </g>
                );

            case "chart":
                return (
                    <g transform="scale(0.267)">
                        <path
                            d="M 22.801 90 H 9.875 c -2.461 0 -4.463 -2.002 -4.463 -4.463 V 58.453 c 0 -2.461 2.002 -4.463 4.463 -4.463 h 12.926 c 2.461 0 4.464 2.002 4.464 4.463 v 27.084 C 27.265 87.998 25.263 90 22.801 90 z M 9.875 56.957 c -0.825 0 -1.496 0.671 -1.496 1.496 v 27.084 c 0 0.825 0.671 1.496 1.496 1.496 h 12.926 c 0.825 0 1.497 -0.671 1.497 -1.496 V 58.453 c 0 -0.825 -0.671 -1.496 -1.497 -1.496 H 9.875 z"
                            fill={color}
                        />
                        <path
                            d="M 51.463 90 H 38.537 c -2.461 0 -4.464 -2.002 -4.464 -4.463 V 40.279 c 0 -2.461 2.002 -4.464 4.464 -4.464 h 12.926 c 2.461 0 4.463 2.002 4.463 4.464 v 45.257 C 55.926 87.998 53.924 90 51.463 90 z M 38.537 38.783 c -0.825 0 -1.497 0.671 -1.497 1.497 v 45.257 c 0 0.825 0.671 1.496 1.497 1.496 h 12.926 c 0.825 0 1.496 -0.671 1.496 -1.496 V 40.279 c 0 -0.825 -0.671 -1.497 -1.496 -1.497 H 38.537 z"
                            fill={color}
                        />
                        <path
                            d="M 80.124 90 H 67.198 c -2.461 0 -4.463 -2.002 -4.463 -4.463 V 4.464 C 62.735 2.002 64.737 0 67.198 0 h 12.926 c 2.462 0 4.464 2.002 4.464 4.464 v 81.073 C 84.588 87.998 82.586 90 80.124 90 z M 67.198 2.967 c -0.825 0 -1.496 0.671 -1.496 1.497 v 81.073 c 0 0.825 0.671 1.496 1.496 1.496 h 12.926 c 0.826 0 1.497 -0.671 1.497 -1.496 V 4.464 c 0 -0.825 -0.671 -1.497 -1.497 -1.497 H 67.198 z"
                            fill={color}
                        />
                    </g>
                );

            case "users":
                return (
                    <g>
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" fill="none" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                );

            case "logout":
                return (
                    <g>
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="16,17 21,12 16,7" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
                    </g>
                );

            case "menu":
                return (
                    <g>
                        <line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
                        <line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
                        <line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
                    </g>
                );

            case "car":
                return (
                    <g>
                        <path d="M7 16a3 3 0 1 0-6 0 3 3 0 0 0 6 0zM23 16a3 3 0 1 0-6 0 3 3 0 0 0 6 0z" stroke={color} strokeWidth="2" fill="none" />
                        <path d="M5 13h14l-3-8H8l-3 8z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <path
                            d="M19 16h3v2a1 1 0 0 1-1 1h-1M2 16h3v3H4a1 1 0 0 1-1-1v-2z"
                            stroke={color}
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                );

            case "refresh":
                return (
                    <g>
                        <polyline points="23,4 23,10 17,10" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="1,20 1,14 7,14" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <path
                            d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
                            stroke={color}
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                );

            case "user":
                return (
                    <g>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" fill="none" />
                    </g>
                );

            case "edit":
                return (
                    <g>
                        {/* Document/Square background */}
                        <rect x="2" y="2" width="20" height="20" rx="2" ry="2" stroke={color} strokeWidth="1.5" fill="none" />
                        {/* Pencil */}
                        <path d="M16 4l4 4-8 8H8v-4l8-8z" fill={color} stroke={color} strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                        {/* Pencil tip highlight */}
                        <path d="M16 4l4 4-2 2-4-4 2-2z" fill="white" stroke="none" />
                        {/* Writing lines indicator */}
                        <line x1="5" y1="18" x2="10" y2="18" stroke={color} strokeWidth="1" strokeLinecap="round" />
                        <line x1="5" y1="15" x2="8" y2="15" stroke={color} strokeWidth="1" strokeLinecap="round" />
                    </g>
                );

            case "delete":
                return (
                    <g>
                        {/* Trash can lid */}
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        {/* Handle on top */}
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        {/* Vertical lines inside */}
                        <line x1="10" y1="11" x2="10" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
                        <line x1="14" y1="11" x2="14" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
                    </g>
                );

            case "plus":
            case "add":
                return (
                    <g>
                        {/* Circle background */}
                        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
                        {/* Plus sign */}
                        <line x1="12" y1="8" x2="12" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
                        <line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
                    </g>
                );

            case "calendar":
                return (
                    <g>
                        {/* Calendar base */}
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none" />
                        {/* Top line */}
                        <line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
                        <line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
                        {/* Header separator */}
                        <line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
                        {/* Calendar dots */}
                        <circle cx="8" cy="14" r="1" fill={color} />
                        <circle cx="12" cy="14" r="1" fill={color} />
                        <circle cx="16" cy="14" r="1" fill={color} />
                        <circle cx="8" cy="18" r="1" fill={color} />
                        <circle cx="12" cy="18" r="1" fill={color} />
                    </g>
                );

            case "clock-loading":
                return (
                    <g>
                        {/* Clock circle */}
                        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
                        {/* Clock hands */}
                        <path d="M12 6v6l4 2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        {/* Loading indicator dots */}
                        <circle cx="12" cy="2" r="1.5" fill={color} opacity="1">
                            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" begin="0s" />
                        </circle>
                        <circle cx="19.07" cy="5.93" r="1.5" fill={color} opacity="0.8">
                            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" begin="0.2s" />
                        </circle>
                        <circle cx="22" cy="12" r="1.5" fill={color} opacity="0.6">
                            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" begin="0.4s" />
                        </circle>
                        <circle cx="19.07" cy="18.07" r="1.5" fill={color} opacity="0.4">
                            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" begin="0.6s" />
                        </circle>
                    </g>
                );

            default:
                return <rect width="24" height="24" fill="none" />;
        }
    };

    return (
        <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
            {getIconPath(name)}
        </svg>
    );
};

export default Icon;

