import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cats Control — Centro de Mando",
  manifest: "/manifest-app.json",
  icons: {
    icon: "/logo-4cats.png",
    apple: "/logo-4cats.png",
  },
};

export default function CatsControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
