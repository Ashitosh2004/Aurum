import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aurum Coffee | Luxury Artisan Café",
  description: "Experience the art of coffee at Aurum Coffee. Premium handcrafted beverages, artisan pastries, and an unforgettable café experience. Where every cup tells a story.",
  keywords: ["luxury café", "artisan coffee", "premium coffee", "handcrafted beverages", "café experience"],
  icons: {
    icon: "/images/cafe/logo.png",
  },
  openGraph: {
    title: "Aurum Coffee | Luxury Artisan Café",
    description: "Where every cup tells a story. Premium handcrafted coffee and artisan café experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-cream text-espresso`}>
        {children}
      </body>
    </html>
  );
}
