import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://eternalnriservices.com"),
  title: "Eternal NRI Services | Your India, Our Responsibility",
  description: "Eternal NRI Services helps NRIs with educational documentation, international shipping, property coordination, banking assistance, tax and compliance documentation, credential evaluation, and legal documentation assistance.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", title: "Eternal NRI Services", description: "Your India, Our Responsibility. Complete NRI Services, Made Simple.", url: "https://eternalnriservices.com" },
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
