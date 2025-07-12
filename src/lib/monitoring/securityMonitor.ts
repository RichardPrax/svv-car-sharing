// src/lib/monitoring/securityMonitor.ts
// Einfache Monitoring-Lösung für kleine Apps

export const logSecurity = {
    authFailure: (ip: string, details?: string) => {
        console.warn(`� Login failed from ${ip}: ${details || "Invalid credentials"}`);
    },

    suspiciousActivity: (ip: string, details?: string) => {
        console.error(`� Suspicious activity from ${ip}: ${details || "Unknown"}`);
    },

    rateLimit: (ip: string) => {
        console.info(`⏱️ Rate limit hit by ${ip}`);
    },

    blockedIP: (ip: string, reason: string) => {
        console.warn(`🚫 Blocked IP ${ip}: ${reason}`);
    },
};

// Nur bei wirklich kritischen Events
export const alertAdmin = (message: string) => {
    console.error(`🆘 ADMIN ALERT: ${message}`);
    // TODO: Hier später E-Mail/Slack hinzufügen wenn nötig
};

// Einfache Helper-Funktionen für Kompatibilität
export const logRateLimitExceeded = (ip: string) => {
    logSecurity.rateLimit(ip);
};

export const logSuspiciousRequest = (ip: string, details?: string) => {
    logSecurity.suspiciousActivity(ip, details);
};

export const logBlockedIP = (ip: string, reason: string) => {
    logSecurity.blockedIP(ip, reason);
};

export const logAuthFailure = (ip: string, details?: string) => {
    logSecurity.authFailure(ip, details);
};

