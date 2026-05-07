import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | 4cats",
  description: "Panel de administración",
  manifest: "/manifest-app.json",
  icons: {
    icon: "/logo-4cats.png",
    apple: "/logo-4cats.png",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
