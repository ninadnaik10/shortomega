import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Shortomega",
  description: "Simple URL shortener",
  metadataBase: new URL("https://shortomega.ninadnaik.xyz"),
  openGraph: {
    title: "Shortomega",
    description: "Simple URL shortener",
    images: [
      {
        url: "/screenshots/metadata-image.png",
        width: 1200,
        height: 630,
        alt: "Shortomega",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>{children}</body>
    </html>
  );
}
