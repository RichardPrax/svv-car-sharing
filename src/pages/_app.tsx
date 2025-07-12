import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/hooks/auth/useOptimizedAuth";
import { UserProfileProvider } from "@/hooks/auth/useUserProfileCache";
import OptimizedAuthGuard from "../components/auth/OptimizedAuthGuard";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <UserProfileProvider>
                <OptimizedAuthGuard>
                    <Component {...pageProps} />
                </OptimizedAuthGuard>
            </UserProfileProvider>
        </AuthProvider>
    );
}

