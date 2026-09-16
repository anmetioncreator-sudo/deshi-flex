import type { Metadata } from "next";
import { Inter, Bebas_Neue, Montserrat, Playfair_Display, Cinzel_Decorative, Cinzel } from "next/font/google";
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

const cinzel = Cinzel({
  variable: "--font-cinzel-roman",
  weight: ["400", "600", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Deshiflex — Crafting a Legacy from Bangladesh to the World | Official Store (দেশিফ্লেক্স)",
    template: "%s | Deshiflex — Crafting a Legacy from Bangladesh to the World",
  },
  description:
    "Deshiflex (দেশিফ্লেক্স) — Crafting a legacy from Bangladesh to the world. Official streetwear store for authentic 180 to 240 GSM combed compact cotton drop shoulder T-shirts, oversized streetwear, polo shirts & custom printing in Bangladesh. Cash on Delivery nationwide.",
  keywords: [
    // Brand & Core Identity (ব্র্যান্ড ও অফিসিয়াল কিওয়ার্ড)
    "Deshiflex",
    "Deshi Flex",
    "Deshiflex BD",
    "Deshiflex Bangladesh",
    "Deshiflex clothing",
    "Deshiflex clothing brand",
    "Deshiflex shop",
    "Deshiflex online shop",
    "Deshiflex official store",
    "Deshiflex website",

    // Product-Specific (T-Shirts & Streetwear)
    "Deshiflex drop shoulder",
    "Deshiflex oversized t shirt",
    "Deshiflex t shirt",
    "Deshiflex t shirt price in BD",
    "Deshiflex polo shirt",
    "Deshiflex hoodie",
    "Deshiflex collection",
    "Deshiflex new arrival",
    "Deshiflex streetwear",
    "Deshiflex export quality",

    // Transactional & Buyer Intent
    "Buy Deshiflex online",
    "Deshiflex shop online order",
    "Deshiflex price in Bangladesh",
    "Deshiflex discount offer",
    "Deshiflex coupon code",
    "Deshiflex cash on delivery",
    "Deshiflex home delivery BD",
    "Deshiflex delivery charge",
    "Deshiflex review Bangladesh",
    "Deshiflex customer care number",

    // Banglish Search Terms
    "Deshiflex kaporer dokan",
    "Deshiflex t shirt er dam koto",
    "Deshiflex theke kapor kinbo",
    "Deshiflex drop shoulder dam",
    "Deshiflex bhalo quality kina",
    "Deshiflex online order kivabe kore",
    "Deshiflex page BD",
    "Deshiflex er notun collection",
    "Deshiflex sosta t shirt",
    "Deshiflex delivery koto din lage",

    // Native Bengali (বাংলা কিওয়ার্ড)
    "দেশিফ্লেক্স",
    "দেশিফ্লেক্স বিডি",
    "দেশিফ্লেক্স অনলাইন শপ",
    "দেশিফ্লেক্স টি শার্ট",
    "দেশিফ্লেক্স ড্রপ শোল্ডার",
    "দেশিফ্লেক্স জামাকাপড়",
    "দেশিফ্লেক্স টি শার্টের দাম কত",

    // Buying Intent & Price Queries (ক্রয় ও দাম সংক্রান্ত)
    "kom dame bhalo kapor",
    "kaporer dam koto",
    "sobcheye kom dame t shirt",
    "drop shoulder t shirt er dam koto",
    "panjabi kinbo online",
    "online kapor er dokan",
    "bhalo kapor kothay pabo",
    "kapor kinte chai",
    "sosta kaporer dokan dhaka",
    "bhalo quality panjabi dam",
    "cheap rate e kapor",
    "discount offer kaporer dokan",
    "eid collection dress kinbo",
    "cash on delivery dress kinbo",
    "delivery charge chara kapor",
    "home delivery kaporer dokan",
    "return policy bhalo kaporer page",
    "original export quality kapor kinbo",
    "brand er kapor kom dame",
    "wholesale dame retail kapor",

    // Men’s Clothing (ছেলেদের জামাকাপড়)
    "cheleder notun t shirt",
    "cheleder drop shoulder t shirt",
    "bhalo cotton panjabi kinbo",
    "semi long panjabi design",
    "kabli set er dam koto",
    "cheleder formal shirt price",
    "cheleder casual shirt bhalo quality",
    "jeans pant kom dame",
    "baggy jeans cheleder",
    "cargo pant 6 pocket",
    "chino pant kom dame",
    "cheleder polo t shirt online",
    "cheleder winter hoodie",
    "cheleder jacket dam koto",
    "sweat shirt bhalo quality",
    "cotton boxer cheleder",
    "bhalo lungi online",
    "cheleder pajamas panjabi set",
    "blazer price cheleder",
    "gym t shirt bhalo cotton",

    // Women’s Clothing & Traditional (মেয়েদের পোশাক)
    "meyeder sundor dress",
    "three piece kom dame",
    "sunder kurti collection",
    "pakistani three piece original",
    "indian three piece bhalo quality",
    "jamdani sharee online kinbo",
    "katan sharee er dam koto",
    "cotton sharee daily wear",
    "georgette three piece design",
    "anarkali dress meyeder",
    "lehenga collection dhaka",
    "bridal sharee kom dame",
    "party dress meyeder",
    "lawn dress original",
    "stitched salwar kameez kinbo",
    "unstitched three piece dokan",
    "meyeder palazzo pant",
    "leggings bhalo cotton",
    "duplicate chara original pakistani dress",
    "boutique collection three piece",

    // Modest Fashion & Borka (বোরকা ও হিজাব)
    "borka collection dhaka",
    "borka kinbo online",
    "borka er dam koto",
    "dubai borka design",
    "abaya collection bd",
    "kaporer borka kom dame",
    "simple borka design",
    "party wear borka",
    "front open abaya kinbo",
    "hijab collection kom dame",
    "georgette hijab price",
    "crinkle hijab bhalo quality",
    "khimar collection online",
    "namaj er chadar kinbo",
    "jilbab collection bd",
    "modest wear meyeder",
    "stylish abaya design",
    "two piece borka set",
    "kaftan borka price",
    "daily wear borka dokan",

    // Dropshoulder & Streetwear Specifics (ড্রপ শোল্ডার ও ট্রেন্ড)
    "drop shoulder t shirt kinbo",
    "oversized t shirt meyeder",
    "oversized t shirt cheleder",
    "drop shoulder cotton bhalo gsm",
    "220 gsm drop shoulder dam",
    "aesthetic drop shoulder t shirt",
    "streetwear t shirt bd",
    "back print drop shoulder kinbo",
    "anime drop shoulder t shirt",
    "typography print t shirt",
    "plain black drop shoulder",
    "white drop shoulder bhalo quality",
    "loose fit t shirt online",
    "boxy fit tee bd",
    "combo offer drop shoulder",
    "3 ta drop shoulder offer",
    "export drop shoulder wholesale",

    // Location & Trust Signals (লোকেশন ও ট্রাস্ট)
    "dhakar moddhe delivery",
    "chittagong e kapor delivery",
    "ghor boshe kapor kinun",
    "trusted clothing page bd",
    "facebook kaporer page",
    "verified clothing shop bd",
    "dhaka shopping online",
    "mirpur e kaporer dokan",
    "uttara clothing shop",
    "islampur wholesale cloth market",
    "bongo bazar online shopping",
    "new market dress collection",
    "chawkbazar wholesale kapor",
    "gazipur export cloth shop",
    "narayanganj knit clothing wholesale",

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

    // Brand & Community Tags
    "Jamalpur Heritage",
    "Oversized Tee BD",
    "Streetwear Brand Dhaka"
  ],
  metadataBase: new URL("https://www.deshiflex.shop"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Deshiflex — Crafting a Legacy from Bangladesh to the World | Official Store BD (দেশিফ্লেক্স)",
    description:
      "Deshiflex (দেশিফ্লেক্স) — Crafting a legacy from Bangladesh to the world. Shop authentic 180-240 GSM drop shoulder tees, oversized boxy streetwear & custom apparel in Bangladesh. Cash on Delivery nationwide.",
    url: "https://www.deshiflex.shop",
    siteName: "Deshiflex",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Deshiflex — Crafting a Legacy from Bangladesh to the World (দেশিফ্লেক্স)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Deshiflex — Crafting a Legacy from Bangladesh to the World | Official Store BD (দেশিফ্লেক্স)",
    description:
      "Deshiflex (দেশিফ্লেক্স) — Crafting a legacy from Bangladesh to the world. Authentic 180-240 GSM drop shoulder tees, oversized boxy fits & custom streetwear.",
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
  icons: {
    icon: [
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
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
        "@type": ["ClothingStore", "OnlineStore", "Brand"],
        "@id": "https://www.deshiflex.shop/#store",
        "name": "Deshiflex",
        "legalName": "Deshiflex (দেশিফ্লেক্স) Official Clothing Brand",
        "alternateName": [
          "Deshi Flex",
          "Deshiflex BD",
          "Deshiflex Bangladesh",
          "Deshiflex Clothing",
          "Deshiflex Clothing Brand",
          "Deshiflex Shop",
          "Deshiflex Online Shop",
          "Deshiflex Official Store",
          "Deshiflex Website",
          "দেশিফ্লেক্স",
          "দেশিফ্লেক্স বিডি",
          "দেশিফ্লেক্স অনলাইন শপ",
          "দেশিফ্লেক্স টি শার্ট",
          "দেশিফ্লেক্স ড্রপ শোল্ডার",
          "দেশিফ্লেক্স জামাকাপড়"
        ],
        "url": "https://www.deshiflex.shop",
        "logo": "https://www.deshiflex.shop/df-logo.png",
        "image": "https://www.deshiflex.shop/og-image.jpg",
        "description": "Deshiflex (দেশিফ্লেক্স) is Bangladesh's premier official streetwear clothing brand specializing in 180-240 GSM drop-shoulder tees, oversized streetwear, boxy cotton shirts, and custom apparel printing with Cash on Delivery across Bangladesh.",
        "slogan": "Crafting a legacy from Bangladesh to the world.",
        "priceRange": "৳850 - ৳1500 BDT",
        "currenciesAccepted": "BDT",
        "paymentAccepted": "Cash, bKash, Nagad",
        "telephone": "+8801852786645",
        "email": "anmetioncreator@gmail.com",
        "areaServed": [
          { "@type": "AdministrativeArea", "name": "Dhaka" },
          { "@type": "AdministrativeArea", "name": "Chittagong" },
          { "@type": "AdministrativeArea", "name": "Sylhet" },
          { "@type": "AdministrativeArea", "name": "Gazipur" },
          { "@type": "AdministrativeArea", "name": "Narayanganj" },
          { "@type": "AdministrativeArea", "name": "Mirpur" },
          { "@type": "AdministrativeArea", "name": "Uttara" },
          { "@type": "Country", "name": "Bangladesh" }
        ],
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Dhaka",
          "addressCountry": "BD"
        },
        "sameAs": [
          "https://facebook.com",
          "https://instagram.com",
          "https://youtube.com"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.deshiflex.shop/#website",
        "url": "https://www.deshiflex.shop",
        "name": "Deshiflex — Crafting a Legacy from Bangladesh to the World",
        "alternateName": [
          "Deshiflex",
          "Deshi Flex",
          "দেশিফ্লেক্স",
          "Deshiflex Official Store",
          "Deshiflex BD"
        ],
        "description": "Deshiflex (দেশিফ্লেক্স) — Crafting a legacy from Bangladesh to the world. Drop shoulder T-shirt BD, Oversized Streetwear & Custom Apparel",
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
            "name": "Deshiflex official website konta (Which is the official Deshiflex store)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "https://www.deshiflex.shop is the official Deshiflex website and online store in Bangladesh (দেশিফ্লেক্স অফিসিয়াল স্টোর). Here you can buy authentic Deshiflex drop shoulder t-shirts and streetwear directly with Cash on Delivery."
            }
          },
          {
            "@type": "Question",
            "name": "Deshiflex t shirt er dam koto (Deshiflex price in Bangladesh)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Deshiflex premium drop shoulder t-shirts start from ৳850 BDT. We also offer exclusive discount offers, combo offers (3 ta drop shoulder offer), and buy 2 get 1 deals."
            }
          },
          {
            "@type": "Question",
            "name": "Deshiflex theke online order kivabe kore (How to order from Deshiflex)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "To order from Deshiflex, visit https://www.deshiflex.shop/shop, choose your favorite drop shoulder or oversized tee, select your size, and proceed to checkout with Cash on Delivery (COD)."
            }
          },
          {
            "@type": "Question",
            "name": "Deshiflex customer care number & delivery charge koto?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Deshiflex customer service hotline is 01852786645 or 01710793841. Delivery charge is ৳70 inside Dhaka (delivery within 24-48 hours) and ৳130 outside Dhaka across all 64 districts."
            }
          },
          {
            "@type": "Question",
            "name": "Deshiflex bhalo quality kina (Are Deshiflex products high quality)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Deshiflex uses 100% combed compact organic cotton in 180 GSM, 200 GSM, 220 GSM heavyweight, and 240 GSM vintage acid-wash, bio-washed for anti-shrinkage and maximum comfort."
            }
          },
          {
            "@type": "Question",
            "name": "দেশিফ্লেক্স (Deshiflex) টি শার্টের দাম কত ও হোম ডেলিভারি দেয় কি?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "দেশিফ্লেক্সের প্রিমিয়াম ড্রপ শোল্ডার টি-শার্টের দাম মাত্র ৮৫০ টাকা থেকে শুরু। সমগ্র বাংলাদেশে ক্যাশ অন ডেলিভারিতে দ্রুত হোম ডেলিভারি দেওয়া হয়।"
            }
          }
        ]
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} ${montserrat.variable} ${playfair.variable} ${cinzelDecorative.variable} ${cinzel.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/icon-48.png" sizes="48x48" type="image/png" />
        <link rel="icon" href="/icon-96.png" sizes="96x96" type="image/png" />
        <link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/icon-512.png" sizes="512x512" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <meta name="theme-color" content="#ffffff" />
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
