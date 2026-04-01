import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | 4cats",
  description: "Panel de administración",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
