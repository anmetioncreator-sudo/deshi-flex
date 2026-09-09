import { Metadata } from "next";
import { BLOG_POSTS } from "@/data/blog";
import BlogPageClient from "./BlogPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    return {
      title: "Post Not Found",
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

  return {
    title: `${post.title} | Deshi Flex Journal`,
    description: post.excerpt,
    keywords: [...keywordList, ...post.tags, post.category.replace("-", " ")],
    openGraph: {
      title: `${post.title} | Deshi Flex Journal`,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishDate,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Deshi Flex Journal`,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostDetail({ params }: PageProps) {
  const resolvedParams = await params;
  return <BlogPageClient slug={resolvedParams.slug} />;
}
