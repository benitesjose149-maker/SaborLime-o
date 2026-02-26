"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, pass: string) => Promise<void>;
    register: (name: string, email: string, pass: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "loading") return;


        if (session?.user) {
            console.log("LOG [AuthContext]: session.user ->", session.user);
            const role = (session.user as any).role || "USER";
            const googleUser = {
                id: (session.user as any).id?.toString() || "google-user",
                name: session.user.name || "",
                email: session.user.email || "",
                role: role,
                image: session.user.image || undefined,
            };
            setUser(googleUser);
            setIsLoading(false);

            const isAuthPage = window.location.pathname === "/login" || window.location.pathname === "/register";
            if (isAuthPage) {
                if (role.toUpperCase() === "ADMIN") {
                    router.push("/admin/carta");
                } else {
                    router.push("/");
                }
            }
        } else {
            setUser(null);
            setIsLoading(false);
        }
    }, [session, status, router]);

    const login = async (email: string, pass: string) => {
        setIsLoading(true);
        try {
            const result = await signIn("credentials", {
                email,
                password: pass,
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            router.push("/");
        } catch (error: any) {
            console.error("Login Error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, pass: string) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password: pass }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al registrarse");
            }

            // Automáticamente iniciar sesión con las nuevas credenciales
            await signIn("credentials", {
                email,
                password: pass,
                redirect: false,
            });

            router.push("/");
        } catch (error: any) {
            console.error("Register Error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await signOut({ redirect: false });
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
