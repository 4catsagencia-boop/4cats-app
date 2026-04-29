import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import ConditionalFooter from "./components/ConditionalFooter";
import FloatingContact from "./components/FloatingContact";
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
  title: "4cats — Estudio de Software · IA · Temuco",
  description: "Construimos software a medida con IA integrada. Sistemas de gestión, captación de leads y automatización para empresas del sur de Chile.",
  keywords: ["estudio de software", "inteligencia artificial", "desarrollo web", "sistemas a medida", "Temuco", "Chile", "Next.js", "Supabase"],
  authors: [{ name: "4cats" }],
  openGraph: {
    title: "4cats — Estudio de Software · IA · Temuco",
    description: "Construimos software a medida con IA integrada. Sistemas de gestión, captación de leads y automatización.",
    url: "https://4cats.cl",
    siteName: "4cats",
    locale: "es_CL",
    type: "website",
  },
  icons: {
    icon: "/logo.svg",
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
          <FloatingContact />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
