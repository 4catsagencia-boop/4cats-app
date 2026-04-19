import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cats Control — Centro de Mando",
  manifest: "/manifest-app.json",
  icons: {
    icon: "/logo-app.png",
    apple: "/logo-app.png",
  },
};

export default function CatsControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
