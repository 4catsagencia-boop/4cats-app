import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portafolio — 4cats Estudio Tecnológico | Casos de éxito reales",
  description: "Casos reales de empresas chilenas que transformaron su operación con plataformas Next.js + Supabase. Métricas de ROI, tiempos de carga y resultados medibles.",
};

export default function PortafolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
