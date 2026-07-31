import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel",
  // Panel arama motorlarına asla düşmesin
  robots: { index: false, follow: false, nocache: true },
};

export default function PanelRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
