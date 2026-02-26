"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

export default function InstallPWA() {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);
        };
        window.addEventListener("beforeinstallprompt", handler);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setSupportsPWA(false);
        }

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const onClick = (e: any) => {
        e.preventDefault();
        if (!promptInstall) return;
        promptInstall.prompt();
    };

    if (!supportsPWA) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-white rounded-2xl shadow-2xl p-4 border border-brand-yellow/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-red flex items-center justify-center text-white shrink-0 shadow-lg">
                        <Download className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">Sabor Limeño App</p>
                        <p className="text-xs text-gray-500 font-medium leading-tight">Instala nuestra app para pedir más rápido</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onClick}
                        className="bg-brand-red hover:bg-red-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
                    >
                        Instalar
                    </button>
                    <button
                        onClick={() => setSupportsPWA(false)}
                        className="p-2 text-gray-300 hover:text-gray-500 transition-colors"
                        title="Cerrar"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
