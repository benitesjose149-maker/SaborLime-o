import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Sabor Limeño | Comida Criolla con Sabor Casero",
  description: "Restaurante Sabor Limeño en Lima. Disfruta de la mejor comida criolla peruana con sabor casero. Pedidos por WhatsApp.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sabor Limeño",
  },
};

export const viewport = {
  themeColor: "#800000",
};

import { AuthProvider } from "@/context/AuthContext";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import InstallPWA from "@/components/InstallPWA";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${playfair.variable} font-sans antialiased text-gray-900`}>
        <NextAuthProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              {children}
              <InstallPWA />
            </CartProvider>
          </AuthProvider>
        </NextAuthProvider>

        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                const register = () => {
                  navigator.serviceWorker.register('/sw.js');
                };
                if (document.readyState === 'complete') {
                  register();
                } else {
                  window.addEventListener('load', register);
                }
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
