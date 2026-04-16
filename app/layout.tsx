import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import ConditionalFooter from "./components/ConditionalFooter";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#7C5CBF",
};

export const metadata: Metadata = {
  title: "4cats — Agencia digital Chile",
  description: "Diseñamos, desarrollamos y posicionamos tu presencia digital. Planes claros, sin costos ocultos, con resultados medibles.",
  keywords: ["agencia digital", "Chile", "diseño web", "desarrollo web", "SEO", "marketing digital"],
  authors: [{ name: "4cats" }],
  openGraph: {
    title: "4cats — Agencia digital Chile",
    description: "Diseñamos, desarrollamos y posicionamos tu presencia digital.",
    url: "https://4cats.cl",
    siteName: "4cats",
    locale: "es_CL",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "4cats",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
          <ConditionalFooter />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
