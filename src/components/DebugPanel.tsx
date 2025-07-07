import { useState } from "react";
import { supabaseConfig } from "../lib/supabaseClient";
import { prismaConfig } from "../lib/prisma";
import { envConfig } from "../lib/env";

interface DebugPanelProps {
    show?: boolean;
}

export default function DebugPanel({ show = false }: DebugPanelProps) {
    const [isOpen, setIsOpen] = useState(show);

    // Only show in development
    if (!envConfig.isDevelopment) {
        return null;
    }

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 z-50 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                title="Debug Panel"
            >
                🔧
            </button>

            {/* Debug Panel */}
            {isOpen && (
                <div className="fixed bottom-16 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-md w-full max-h-96 overflow-y-auto">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">Debug Panel</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                            ✕
                        </button>
                    </div>

                    <div className="space-y-3 text-sm">
                        {/* Environment Info */}
                        <div className="border-b border-gray-200 pb-2">
                            <h4 className="font-medium text-gray-700 mb-1">Environment</h4>
                            <div className="space-y-1 text-xs">
                                <div>
                                    <span className="font-medium">Mode:</span>{" "}
                                    <span className={`px-2 py-1 rounded text-white ${envConfig.isDevelopment ? "bg-blue-500" : "bg-green-500"}`}>{envConfig.nodeEnv}</span>
                                </div>
                                <div>
                                    <span className="font-medium">Local:</span>{" "}
                                    <span className={`px-2 py-1 rounded text-white ${envConfig.isLocal ? "bg-green-500" : "bg-orange-500"}`}>
                                        {envConfig.isLocal ? "Yes" : "No"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Supabase Info */}
                        <div className="border-b border-gray-200 pb-2">
                            <h4 className="font-medium text-gray-700 mb-1">Supabase</h4>
                            <div className="space-y-1 text-xs">
                                <div>
                                    <span className="font-medium">URL:</span> <span className="text-gray-600 break-all">{supabaseConfig.url}</span>
                                </div>
                                <div>
                                    <span className="font-medium">Type:</span>{" "}
                                    <span className={`px-2 py-1 rounded text-white ${supabaseConfig.isLocal ? "bg-blue-500" : "bg-purple-500"}`}>
                                        {supabaseConfig.isLocal ? "Local" : "Remote"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Database Info */}
                        <div className="border-b border-gray-200 pb-2">
                            <h4 className="font-medium text-gray-700 mb-1">Database</h4>
                            <div className="space-y-1 text-xs">
                                <div>
                                    <span className="font-medium">URL:</span>{" "}
                                    <span className="text-gray-600 break-all">{prismaConfig.databaseUrl?.replace(/:[^:]*@/, ":***@")}</span>
                                </div>
                                <div>
                                    <span className="font-medium">Type:</span>{" "}
                                    <span className={`px-2 py-1 rounded text-white ${prismaConfig.isLocal ? "bg-blue-500" : "bg-purple-500"}`}>
                                        {prismaConfig.isLocal ? "Local" : "Remote"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <h4 className="font-medium text-gray-700 mb-1">Quick Actions</h4>
                            <div className="space-y-1">
                                <button onClick={() => window.open("/api/health", "_blank")} className="w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded">
                                    📊 Health Check
                                </button>
                                <button
                                    onClick={() => console.log("Environment Config:", envConfig)}
                                    className="w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                                >
                                    🔍 Log Config
                                </button>
                                <button onClick={() => window.location.reload()} className="w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded">
                                    🔄 Reload Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

