import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mantenimiento Web Pro — 4cats | Temuco, Chile",
  description: "Planes de mantención y seguridad web profesional. Actualizaciones, backups diarios, monitoreo 24/7 y soporte por WhatsApp. Protege tu inversión digital.",
};

export default function MantenimientoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
