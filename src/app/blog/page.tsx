"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BLOG_POSTS } from "@/data/blog";
import { Search, Calendar, User, Clock, ArrowRight } from "lucide-react";

function BlogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("query") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
    setSearchQuery(searchParams.get("query") || "");
  }, [searchParams]);

  // Categories list
  const categories = [
    "all",
    "Fashion Trends",
    "Streetwear",
    "Style Guides",
    "Bangladeshi Fashion",
    "Clothing Care"
  ];

  // Filtering
  const filteredPosts = BLOG_POSTS.filter((post) => {
    if (selectedCategory !== "all" && post.category !== selectedCategory) {
      return false;
    }
    if (
      searchQuery.trim() !== "" &&
      !post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Feature the first post, rest in grid
  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      {/* Page Header */}
      <div className="border-b border-border pb-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-5xl md:text-6xl tracking-wider">DF JOURNAL</h1>
          <p className="text-xs text-muted-foreground font-light mt-1.5 uppercase tracking-widest">
            Streetwear guides, local fashion updates, and garment care
          </p>
        </div>

        {/* Blog Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="SEARCH ARTICLES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border focus:border-primary text-xs px-4 py-3 pr-10 focus:outline-none transition-colors uppercase tracking-wider font-light"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 border-b border-border/40 pb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 border text-[10px] tracking-wider transition-all rounded-none uppercase ${
              selectedCategory === cat
                ? "border-primary text-primary bg-primary/5 font-semibold"
                : "border-border text-foreground hover:border-muted-foreground font-light"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border flex flex-col items-center justify-center">
          <h3 className="font-heading text-lg tracking-wider mb-2">NO ARTICLES FOUND</h3>
          <p className="text-xs text-muted-foreground font-light max-w-xs leading-relaxed">
            We couldn't find any articles matching your search criteria. Try a different term or category.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* Highlighted Hero Post (if no filters are hiding it) */}
          {featuredPost && searchQuery === "" && selectedCategory === "all" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-border bg-card overflow-hidden group">
              <div className="lg:col-span-7 aspect-[16/9] lg:aspect-auto relative bg-neutral-950 overflow-hidden">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
              </div>
              <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-primary tracking-widest uppercase mb-4 block">
                    {featuredPost.category}
                  </span>
                  <Link href={`/blog/${featuredPost.slug}`} className="font-heading text-2xl md:text-3xl tracking-wide text-foreground group-hover:text-primary transition-colors block mb-4">
                    {featuredPost.title}
                  </Link>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed mb-6 line-clamp-4">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="border-t border-border/60 pt-6">
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {featuredPost.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {featuredPost.publishDate}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {featuredPost.readTime}</span>
                  </div>
                  <Link href={`/blog/${featuredPost.slug}`} className="text-xs font-heading tracking-widest text-primary flex items-center gap-1 hover:underline font-bold">
                    READ ARTICLE <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Grid Layout of other posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(searchQuery === "" && selectedCategory === "all" ? gridPosts : filteredPosts).map((post) => (
              <div key={post.id} className="border border-border bg-card flex flex-col group">
                <div className="aspect-[16/10] bg-neutral-950 overflow-hidden relative border-b border-border">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                  />
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-primary tracking-widest uppercase mb-2 block">
                      {post.category}
                    </span>
                    <Link href={`/blog/${post.slug}`} className="font-heading text-xl tracking-wide text-foreground group-hover:text-primary transition-colors block mb-3 line-clamp-2">
                      {post.title}
                    </Link>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="border-t border-border/40 pt-4">
                    <div className="flex items-center justify-between text-[9px] text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="text-xs font-heading tracking-widest text-primary flex items-center gap-1 hover:underline font-bold">
                      READ FULL POST <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

export default function Blog() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-background text-primary font-heading text-xl tracking-widest">
            LOADING ARTICLES...
          </div>
        }>
          <BlogContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
