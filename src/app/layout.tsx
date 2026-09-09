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
    default: "Deshi Flex | Drop Shoulder T-Shirt BD, Oversized Streetwear & Custom Printing",
    template: "%s | Deshi Flex",
  },
  description:
    "Shop premium Drop Shoulder T-shirts in Bangladesh (BD). 180 to 240 GSM 100% combed compact cotton, boxy oversized tees, anime & back print graphics, custom printing & wholesale in Dhaka with Cash on Delivery (ড্রপ শোল্ডার টি শার্ট).",
  keywords: [
    // Core Product & Variations
    "Drop shoulder T-shirt BD",
    "Oversized drop shoulder T-shirt",
    "Men's drop shoulder tee",
    "Women's drop shoulder T-shirt",
    "Unisex drop shoulder shirt",
    "Plain drop shoulder T-shirt",
    "Solid color drop shoulder tee",
    "Graphic drop shoulder T-shirt",
    "Typography drop shoulder T-shirt",
    "Back print drop shoulder T-shirt",
    "Minimal drop shoulder tee",
    "Anime drop shoulder T-shirt BD",
    "Vintage drop shoulder T-shirt",
    "Streetwear drop shoulder BD",
    "Heavyweight drop shoulder tee",
    "Boxy fit drop shoulder T-shirt",
    "Loose fit drop shoulder shirt",
    "Crew neck drop shoulder tee",
    "Ribbed neck drop shoulder T-shirt",
    "Drop shoulder polo shirt",

    // Fabric, GSM & Quality
    "180 GSM drop shoulder T-shirt",
    "200 GSM drop shoulder tee",
    "220 GSM heavy drop shoulder",
    "240 GSM drop shoulder BD",
    "100% cotton drop shoulder T-shirt",
    "Organic cotton drop shoulder",
    "Combed compact cotton drop shoulder",
    "Bio-wash drop shoulder T-shirt",
    "Drop shoulder export quality BD",
    "Premium drop shoulder collection",

    // Commercial & Buyer Intent
    "Buy drop shoulder T-shirt online BD",
    "Drop shoulder T-shirt price in Bangladesh",
    "Cheap drop shoulder T-shirt Dhaka",
    "Drop shoulder offer BD",
    "Best drop shoulder brand in Bangladesh",
    "Drop shoulder cash on delivery",
    "Custom drop shoulder printing BD",
    "Blank drop shoulder T-shirt for printing",
    "Drop shoulder wholesale market Dhaka",
    "Buy 2 get 1 drop shoulder T-shirt",

    // Banglish & Native Bengali
    "Drop shoulder t shirt dam koto",
    "Kom dame drop shoulder t shirt",
    "Bhalo quality drop shoulder",
    "Drop shoulder t shirt kinbo",
    "Natun design drop shoulder",
    "ড্রপ শোল্ডার টি শার্ট",
    "ছেলেদের ড্রপ শোল্ডার টি শার্ট",
    "কম দামে ড্রপ শোল্ডার",
    "ড্রপ শোল্ডার কালেকশন ঢাকা",
    "সুতি ড্রপ শোল্ডার টি শার্ট",

    // General Brand & Category Tags
    "Deshi Flex",
    "Bangladeshi Streetwear",
    "Jamalpur Heritage",
    "Oversized Tee BD",
    "Streetwear Brand Dhaka"
  ],
  metadataBase: new URL("https://www.deshiflex.shop"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Deshi Flex | Premium Drop Shoulder T-Shirts & Streetwear BD",
    description:
      "Buy 180-240 GSM 100% combed cotton Drop Shoulder and Oversized T-shirts in Bangladesh. Custom back-print printing, fast delivery, and COD available nationwide.",
    url: "https://www.deshiflex.shop",
    siteName: "Deshi Flex",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Deshi Flex Drop Shoulder Streetwear Bangladesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Deshi Flex | Drop Shoulder T-Shirt BD & Streetwear",
    description:
      "Best deals on 180-240 GSM drop shoulder tees, oversized boxy fits & custom print streetwear in Bangladesh.",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ClothingStore",
        "@id": "https://www.deshiflex.shop/#store",
        "name": "Deshi Flex",
        "alternateName": ["দেশি ফ্লেক্স", "DeshiFlex", "Deshi Flex BD"],
        "url": "https://www.deshiflex.shop",
        "logo": "https://www.deshiflex.shop/df-logo.png",
        "image": "https://www.deshiflex.shop/og-image.jpg",
        "description": "Premier Bangladeshi streetwear brand specializing in 180-240 GSM drop-shoulder tees, oversized streetwear, boxy cotton shirts, and custom apparel printing with Cash on Delivery across Bangladesh.",
        "priceRange": "৳850 - ৳1500 BDT",
        "currenciesAccepted": "BDT",
        "paymentAccepted": "Cash, bKash, Nagad",
        "areaServed": {
          "@type": "Country",
          "name": "Bangladesh"
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Dhaka",
          "addressCountry": "BD"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://www.deshiflex.shop/#website",
        "url": "https://www.deshiflex.shop",
        "name": "Deshi Flex",
        "description": "Drop shoulder T-shirt BD, Oversized Streetwear & Custom Apparel",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.deshiflex.shop/shop?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.deshiflex.shop/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Drop shoulder t shirt price in Bangladesh (দাম কত)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Deshi Flex offers premium drop shoulder t-shirts starting from ৳850 BDT, with original pricing at ৳1,000 BDT. Special seasonal sales, clearance discounts, and buy 2 get 1 promotions are available on selected streetwear pieces."
            }
          },
          {
            "@type": "Question",
            "name": "What fabric & GSM are used in Deshi Flex drop shoulder tees?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Deshi Flex crafts tees in 180 GSM, 200 GSM, 220 GSM heavyweight combed cotton, and 240 GSM acid-wash vintage fades. All tees are 100% compact organic cotton with bio-wash treatment for anti-shrinkage and ultra-soft feel."
            }
          },
          {
            "@type": "Question",
            "name": "Do you offer Cash on Delivery (COD) and Custom Printing in Dhaka & BD?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! We provide Cash on Delivery (COD) across Dhaka (24-48 hours delivery) and all 64 districts in Bangladesh. We also offer interactive custom drop-shoulder apparel printing with live front and back image positioning."
            }
          }
        ]
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} ${montserrat.variable} ${playfair.variable} ${cinzelDecorative.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <PreviewWrapper>
          {children}
        </PreviewWrapper>
      </body>
    </html>
  );
}
