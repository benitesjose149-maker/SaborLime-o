"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    type: "success",
                    text: "Si el correo está registrado, recibirás un código en unos minutos."
                });
                // Redirigir automáticamente después de unos segundos
                setTimeout(() => router.push(`/reset-password?email=${email}`), 3000);
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
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 lg:p-12">
                <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-brand-red transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al login
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Recuperar Acceso</h1>
                    <p className="text-gray-600">
                        Ingresa tu correo y te enviaremos un código para restablecer tu contraseña.
                    </p>
                </div>

                {message.text && (
                    <div className={`p-4 rounded-xl mb-6 text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                        {message.text}
                        {message.type === "success" && (
                            <div className="mt-4">
                                <Link
                                    href={`/reset-password?email=${email}`}
                                    className="font-bold underline"
                                >
                                    Ir a ingresar el código →
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-red outline-none transition-all"
                                placeholder="tu@correo.com"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-brand-red hover:bg-red-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center ${isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                            }`}
                    >
                        {isLoading ? "Enviando..." : "Enviar Código de Verificación"}
                    </button>
                </form>
            </div>
        </main>
    );
}
