import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cotizar gratis — 4cats Agencia Digital | Temuco, Chile",
  description: "Cuéntanos tu proyecto y te enviamos una propuesta a medida en menos de 24 horas. Sin compromiso. Diseño web, desarrollo y mantención profesional.",
};

export default function CotizarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
