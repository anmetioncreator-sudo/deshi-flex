"use client";

import { use, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BLOG_POSTS } from "@/data/blog";
import { User, Calendar, Clock, ChevronRight, Share2, Link as LinkIcon, ArrowLeft } from "lucide-react";

interface PageProps {
  slug: string;
}

export default function BlogPageClient({ slug }: PageProps) {
  // Find article
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Related articles (excl current)
  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 2);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Article link copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-32">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-[10px] tracking-widest text-muted-foreground uppercase mb-8">
            <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog" className="hover:text-primary transition-colors">JOURNAL</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground truncate max-w-[200px] sm:max-w-none">{post.title}</span>
          </nav>

          {/* Article Header */}
          <header className="mb-10 text-center sm:text-left">
            <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] tracking-widest font-bold px-3 py-1.5 uppercase inline-block mb-4">
              {post.category}
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-wide leading-tight text-foreground light-mode:text-foreground">
              {post.title}
            </h1>
            
            {/* Meta details */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5 text-[10px] text-muted-foreground mt-6 border-y border-border/60 py-4">
              <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-primary" /> BY {post.author.toUpperCase()}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> PUBLISHED ON {post.publishDate}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> {post.readTime.toUpperCase()}</span>
            </div>
          </header>

          {/* Cover Image Frame */}
          <div className="aspect-[16/9] w-full bg-neutral-950 border border-border overflow-hidden mb-12">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body Content */}
          <article className="prose prose-invert max-w-none font-body font-light text-sm md:text-base leading-relaxed text-muted-foreground space-y-6">
            {post.content.split("\n\n").map((block: string, idx: number) => {
              const trimmed = block.trim();
              if (!trimmed) return null;

              // Headers
              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={idx} className="font-heading text-2xl tracking-wide text-foreground light-mode:text-foreground pt-4 mb-2">
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }

              // Bold bullet list items
              if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
                return (
                  <ul key={idx} className="list-disc list-inside space-y-2 pl-4">
                    {trimmed.split("\n").map((li, lIdx) => (
                      <li key={lIdx} className="text-muted-foreground font-light">
                        {li.replace(/^[\*\-]\s+/, "")}
                      </li>
                    ))}
                  </ul>
                );
              }

              // Numbered list items
              if (/^\d+\.\s+/.test(trimmed)) {
                return (
                  <ol key={idx} className="list-decimal list-inside space-y-2 pl-4">
                    {trimmed.split("\n").map((li, lIdx) => (
                      <li key={lIdx} className="text-muted-foreground font-light">
                        {li.replace(/^\d+\.\s+/, "")}
                      </li>
                    ))}
                  </ol>
                );
              }

              // Blockquotes
              if (trimmed.startsWith("> ")) {
                return (
                  <blockquote key={idx} className="border-l-2 border-primary pl-4 italic text-primary bg-primary/5 py-3 font-normal my-6">
                    {trimmed.replace(/^>\s+/, "").replace(/['"]/g, "")}
                  </blockquote>
                );
              }

              // Fallback paragraphs
              // Parsing basic markdown bold tags `**text**`
              const parts = trimmed.split(/(\*\*.*?\*\*)/g);
              return (
                <p key={idx}>
                  {parts.map((part, pIdx) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return (
                        <strong key={pIdx} className="font-semibold text-foreground light-mode:text-foreground">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    }
                    return part;
                  })}
                </p>
              );
            })}
          </article>

          {/* Social Share mock panel */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-y border-border/60 py-6 mt-12 gap-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span key={tag} className="text-[9px] tracking-wider border border-border/80 px-2.5 py-1 text-muted-foreground font-light">
                  #{tag.toUpperCase()}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Share2 className="h-3 w-3" /> SHARE:</span>
              <button onClick={handleCopyLink} className="p-2 border border-border hover:border-primary hover:text-primary transition-all rounded-full" title="Copy Link">
                <LinkIcon className="h-3.5 w-3.5" />
              </button>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 border border-border hover:border-primary hover:text-primary transition-all rounded-full" title="Share on Facebook">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 border border-border hover:border-primary hover:text-primary transition-all rounded-full" title="Share on Twitter">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Back button */}
          <div className="mt-10">
            <Link href="/blog" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 underline font-light py-2">
              <ArrowLeft className="h-4 w-4" /> BACK TO JOURNAL
            </Link>
          </div>

          {/* Related Articles Section */}
          <section className="mt-20 border-t border-border pt-16">
            <h3 className="font-heading text-3xl tracking-wider mb-8">RELATED POSTS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {relatedPosts.map((rPost) => (
                <div key={rPost.id} className="border border-border bg-card group flex flex-col justify-between">
                  <div>
                    <div className="aspect-[16/10] bg-neutral-950 overflow-hidden relative">
                      <img src={rPost.coverImage} alt={rPost.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5">
                      <span className="text-[9px] font-bold text-primary tracking-widest uppercase mb-2 block">{rPost.category}</span>
                      <Link href={`/blog/${rPost.slug}`} className="font-heading text-lg tracking-wide text-foreground group-hover:text-primary transition-colors block mb-2">{rPost.title}</Link>
                      <p className="text-xs text-muted-foreground font-light line-clamp-2">{rPost.excerpt}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <Link href={`/blog/${rPost.slug}`} className="text-xs font-heading tracking-widest text-primary hover:underline font-bold">READ ARTICLE &rarr;</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
