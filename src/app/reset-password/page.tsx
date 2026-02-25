"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Key } from "lucide-react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const emailParam = searchParams.get("email") || "";

    const [email, setEmail] = useState(emailParam);
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage({ type: "error", text: "Las contraseñas no coinciden." });
            return;
        }

        setIsLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    type: "success",
                    text: "¡Contraseña actualizada! Ahora puedes iniciar sesión."
                });
                setTimeout(() => router.push("/login"), 3000);
            } else {
                setMessage({ type: "error", text: data.error || "Ocurrió un error." });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Error de conexión." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            <Link
                href="/forgot-password"
                className="inline-flex items-center text-sm text-gray-500 hover:text-brand-red transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Pedir nuevo código
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Nueva Contraseña</h1>
                <p className="text-gray-600">
                    Ingresa el código que recibiste y tu nueva clave.
                </p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl mb-6 text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-red outline-none transition-all bg-gray-50"
                        placeholder="tu@correo.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Código de Verificación</label>
                    <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            required
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-red outline-none transition-all text-center text-xl tracking-widest font-mono"
                            placeholder="000000"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nueva Contraseña</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-red outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Confirmar Contraseña</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all ${confirmPassword && password !== confirmPassword
                                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                                    : "border-gray-200 focus:ring-2 focus:ring-brand-red"
                                }`}
                            placeholder="••••••••"
                        />
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                        <p className="text-xs text-red-500 mt-2 font-medium">Las contraseñas no coinciden</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-brand-red hover:bg-red-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center ${isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                        }`}
                >
                    {isLoading ? "Actualizando..." : "Cambiar Contraseña"}
                </button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <Suspense fallback={<div>Cargando...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </main>
    );
}
