import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-display",
  display: "swap",
});

const cursive = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["italic", "normal"],
  variable: "--font-cursive",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Top Headlines — Read. Discover. Download.",
    template: "%s — Top Headlines",
  },
  description:
    "Top Headlines is a modern digital document library where you can discover, read and download important PDF documents.",
  openGraph: {
    title: "Top Headlines — Read. Discover. Download.",
    description:
      "Top Headlines is a modern digital document library where you can discover, read and download important PDF documents.",
    url: siteUrl,
    siteName: "Top Headlines",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Headlines — Read. Discover. Download.",
    description:
      "Discover, read and download important PDF documents on Top Headlines.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${cursive.variable} ${body.variable}`}>
      <body className="font-body bg-ink text-white antialiased">
        {children}
      </body>
    </html>
  );
}
