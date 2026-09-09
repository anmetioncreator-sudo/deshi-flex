import type { Metadata } from "next";
import { Inter, Bebas_Neue, Montserrat, Playfair_Display, Cinzel_Decorative } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Deshi Flex | Premium & Affordable Oversized Streetwear Bangladesh",
    template: "%s | Deshi Flex",
  },
  description:
    "Shop premium, budget-friendly Bangladeshi streetwear. We offer the best deals on drop-shoulder, oversized, minimalist, and graphic cotton tees. Quality fashion at low prices.",
  keywords: [
    "Deshi Flex",
    "Drop-shoulder",
    "Oversized",
    "Streetwear",
    "Cotton",
    "Trendy",
    "Minimalist",
    "Graphic",
    "Premium",
    "Casual",
    "Fashion",
    "Budget-friendly",
    "Discount",
    "Low-price",
    "Best-deals",
    "Wholesale",
    "Value-for-money",
    "Cheap-price",
    "Clearance",
    "Budget-fashion",
    "Affordable-tee",
    "dropsoulder low price",
    "Bangladesh Streetwear"
  ],
  metadataBase: new URL("https://deshiflex.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Deshi Flex | Premium Drop-Shoulder & Streetwear BD",
    description:
      "Shop premium, budget-friendly Bangladeshi streetwear. Best deals on drop-shoulder and oversized tees. Wholesale and clearance available.",
    url: "https://deshiflex.vercel.app",
    siteName: "Deshi Flex",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Deshi Flex Streetwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Deshi Flex | Premium Drop-Shoulder & Streetwear BD",
    description:
      "Shop premium, budget-friendly Bangladeshi streetwear. Best deals on drop-shoulder and oversized tees.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import PreviewWrapper from "@/components/layout/PreviewWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} ${montserrat.variable} ${playfair.variable} ${cinzelDecorative.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <PreviewWrapper>
          {children}
        </PreviewWrapper>
      </body>
    </html>
  );
}
