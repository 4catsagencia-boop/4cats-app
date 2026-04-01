import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planes y precios — 4cats Agencia Digital | Temuco, Chile",
  description: "Planes de desarrollo web claros y sin letra chica. Diseño profesional, hosting gestionado y mantención incluida. Desde Temuco para todo Chile.",
};

export default function PlanesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
