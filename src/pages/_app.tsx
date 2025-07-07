import "@/styles/globals.css";
import type { AppProps } from "next/app";
import DebugPanel from "../components/DebugPanel";
import AuthGuard from "../components/auth/AuthGuard";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthGuard>
            <Component {...pageProps} />
            <DebugPanel />
        </AuthGuard>
    );
}

