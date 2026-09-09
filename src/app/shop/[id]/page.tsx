import { Metadata } from "next";
import { PRODUCTS } from "@/data/products";
import ProductPageClient from "./ProductPageClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = PRODUCTS.find((p) => p.id === resolvedParams.id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const keywordList = [
    "Drop-shoulder", "Oversized", "Streetwear", "Cotton", "Trendy", 
    "Minimalist", "Graphic", "Premium", "Casual", "Fashion", 
    "Budget-friendly", "Discount", "Low-price", "Best-deals", 
    "Wholesale", "Value-for-money", "Cheap-price", "Clearance", 
    "Budget-fashion", "Affordable-tee", "dropsoulder low price",
    "Bangladesh Streetwear"
  ];

  const primaryImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : (product.photoUrl || "/og-image.jpg");

  return {
    title: `${product.name} | Affordable Premium Streetwear BD`,
    description: `Buy ${product.name} at the best price in Bangladesh. Premium cotton, oversized drop-shoulder fit. ${product.description?.substring(0, 100) || ""}...`,
    keywords: [...keywordList, product.name, product.category.replace("-", " ")],
    openGraph: {
      title: `${product.name} | Deshi Flex BD`,
      description: `Buy ${product.name} at the best price in Bangladesh. High-quality oversized streetwear.`,
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Deshi Flex BD`,
      description: `Buy ${product.name} at the best price in Bangladesh. High-quality oversized streetwear.`,
      images: [primaryImage],
    },
  };
}

export default async function ProductDetail({ params }: PageProps) {
  const resolvedParams = await params;
  return <ProductPageClient id={resolvedParams.id} />;
}
