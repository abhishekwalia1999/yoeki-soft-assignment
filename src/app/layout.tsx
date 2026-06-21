import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Yoeki Soft — Engineering Digital Transformation",
  description:
    "Yoeki builds scalable software, intelligent platforms, and enterprise solutions that help organizations innovate with confidence.",
  keywords: [
    "digital transformation",
    "enterprise software",
    "scalable engineering",
    "intelligent platforms",
    "Yoeki Soft",
  ],
  authors: [{ name: "Yoeki Soft Pvt. Ltd." }],
  openGraph: {
    title: "Yoeki Soft — Engineering Digital Transformation",
    description:
      "Building scalable software, intelligent platforms, and enterprise solutions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} ${playfair.variable}`}>
      <body className="antialiased bg-black text-white">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
