import type { Metadata } from "next";
import { Outfit, Inter, Montserrat, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Omkar Enterprises | Mimaki JFX600-2513 UV Flatbed Printer",
  description: "Omkar Enterprises - Authorized dealer of Mimaki JFX600-2513 UV Flatbed Printer. Experience next-generation industrial printing technology.",
};

// Next.js 15 uses a special LayoutProps type for the children
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${montserrat.variable} ${playfair.variable} ${dancing.variable}`}
    >
      <body className="antialiased min-h-full flex flex-col">{children}</body>
    </html>
  );
}
