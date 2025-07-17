import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { AuthProvider } from "@/hooks/auth/useOptimizedAuth";
import { UserProfileProvider } from "@/hooks/auth/useUserProfileCache";
import OptimizedAuthGuard from "../components/auth/OptimizedAuthGuard";
import { Header } from "@/components/layout";

function AppContent({ Component, pageProps }: AppProps) {
    const router = useRouter();
    
    // Seiten ohne Header (Login/Auth Seiten)
    const routesWithoutHeader = ["/login"];
    const showHeader = !routesWithoutHeader.includes(router.pathname);

    return (
        <OptimizedAuthGuard>
            {showHeader && <Header />}
            <Component {...pageProps} />
        </OptimizedAuthGuard>
    );
}

export default function App({ Component, pageProps, router }: AppProps) {
    return (
        <AuthProvider>
            <UserProfileProvider>
                <AppContent Component={Component} pageProps={pageProps} router={router} />
            </UserProfileProvider>
        </AuthProvider>
    );
}

