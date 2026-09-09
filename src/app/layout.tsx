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

    // Native Bengali
    "ড্রপ শোল্ডার টি শার্ট",
    "ছেলেদের ড্রপ শোল্ডার টি শার্ট",
    "কম দামে ড্রপ শোল্ডার",
    "ড্রপ শোল্ডার কালেকশন ঢাকা",
    "সুতি ড্রপ শোল্ডার টি শার্ট",
    "ছেলেদের জামাকাপড়",
    "মেয়েদের পোশাক",
    "বোরকা কালেকশন ঢাকা",

    // Brand & Community Tags
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
            "name": "Drop shoulder t shirt er dam koto (দাম কত)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Deshi Flex offers premium drop shoulder t-shirts starting from ৳850 BDT, with special discounts, combo offers (e.g. 3 ta drop shoulder offer), and buy 2 get 1 promotions on selected collections."
            }
          },
          {
            "@type": "Question",
            "name": "Cash on delivery te dress kinbo kivabe (Cash on Delivery in BD)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can easily order online and pay via Cash on Delivery (COD). We deliver across Dhaka, Chittagong, and all 64 districts in Bangladesh with safe door-to-door delivery."
            }
          },
          {
            "@type": "Question",
            "name": "Dhakar moddhe delivery koto druto pabo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Inside Dhaka (including Mirpur, Uttara, Dhanmondi, Gulshan), orders are delivered within 24 to 48 hours. Outside Dhaka, nationwide delivery takes 2 to 3 business days."
            }
          },
          {
            "@type": "Question",
            "name": "Fabric, GSM & Quality standards kemon?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We use 100% combed compact organic cotton in 180 GSM, 200 GSM, 220 GSM heavyweight, and 240 GSM vintage acid-wash. All garments feature bio-wash anti-shrink finish and reactive dye fastness."
            }
          },
          {
            "@type": "Question",
            "name": "Wholesale dame retail kapor & custom printing pawa jabe ki?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! We provide bulk wholesale supply for retailers and an interactive online custom apparel designer for custom anime, back print, and typography printing with no minimum order limit."
            }
          },
          {
            "@type": "Question",
            "name": "Kaporer return policy ki (What is the return policy)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Deshi Flex provides a 7-day hassle-free replacement and return policy for unworn, unwashed garments with original tags attached."
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
