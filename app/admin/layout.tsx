import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | 4cats",
  description: "Panel de administración",
  manifest: "/manifest-app.json",
  icons: {
    icon: "/logo-app.png",
    apple: "/logo-app.png",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
