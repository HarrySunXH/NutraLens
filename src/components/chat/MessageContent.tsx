"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ComponentPropsWithoutRef } from "react";
import { ExternalLink, ShoppingCart, ImageOff, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import DietitianSlider from "./DietitianCard";
import QuestionCard from "./QuestionCard";
import { parseQuestions, ParsedQuestion } from "@/utils/parseQuestions";

interface SupplementProduct {
  title: string;
  url: string;
  description?: string;
  source?: string;
  price?: string;
}

interface MessageContentProps {
  content: string;
  products?: SupplementProduct[];
  isStreaming?: boolean;
  onQuestionAnswer?: (answer: string) => void;
  answeredQuestion?: string;
}

interface OGMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  price?: string;
}

// Shopping domains to detect product links
const SHOPPING_DOMAINS = [
  "amazon.com",
  "amazon.co",
  "iherb.com",
  "vitacost.com",
  "walmart.com",
  "costco.com",
  "cvs.com",
  "walgreens.com",
  "gnc.com",
  "vitaminshoppe.com",
  "swansonvitamins.com",
  "puritan.com",
  "bodybuilding.com",
  "target.com",
  "ebay.com",
  "thorne.com",
  "lifeextension.com",
  "nowfoods.com",
  "gardenoflife.com",
];

function isShoppingLink(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return SHOPPING_DOMAINS.some((domain) => hostname.includes(domain));
  } catch {
    return false;
  }
}

function extractSource(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    const sourceMap: Record<string, string> = {
      "amazon.com": "Amazon",
      "iherb.com": "iHerb",
      "vitacost.com": "Vitacost",
      "walmart.com": "Walmart",
      "costco.com": "Costco",
      "cvs.com": "CVS",
      "walgreens.com": "Walgreens",
      "gnc.com": "GNC",
      "vitaminshoppe.com": "Vitamin Shoppe",
      "swansonvitamins.com": "Swanson",
      "puritan.com": "Puritan's Pride",
      "bodybuilding.com": "Bodybuilding.com",
      "target.com": "Target",
      "ebay.com": "eBay",
      "thorne.com": "Thorne",
      "lifeextension.com": "Life Extension",
      "nowfoods.com": "NOW Foods",
      "gardenoflife.com": "Garden of Life",
    };
    for (const [domain, name] of Object.entries(sourceMap)) {
      if (hostname.includes(domain)) return name;
    }
    return hostname;
  } catch {
    return "Shop";
  }
}

// Extract all URLs from markdown content
function extractUrls(content: string): { url: string; title: string }[] {
  const urlRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const urls: { url: string; title: string }[] = [];
  let match;
  
  while ((match = urlRegex.exec(content)) !== null) {
    const title = match[1];
    const url = match[2];
    if (isShoppingLink(url)) {
      urls.push({ url, title });
    }
  }
  
  return urls;
}

// Product Card with OG data fetching - Larger card for slider
function ProductCard({ url, title }: { url: string; title: string }) {
  const [ogData, setOgData] = useState<OGMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchOGData = async () => {
      try {
        const response = await fetch("/api/og-metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (response.ok) {
          const data = await response.json();
          setOgData(data);
        }
      } catch (error) {
        console.error("Failed to fetch OG data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOGData();
  }, [url]);

  const displayTitle = ogData?.title || title;
  const displayDescription = ogData?.description;
  const displayImage = ogData?.image;
  const displayPrice = ogData?.price;
  const source = ogData?.siteName || extractSource(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-64 bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-emerald-300 hover:shadow-xl transition-all cursor-pointer group"
    >
      {/* Product Image - Larger */}
      <div className="relative h-36 bg-gradient-to-br from-gray-50 to-gray-100">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : displayImage && !imageError ? (
          <Image
            src={displayImage}
            alt={displayTitle}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
            <ShoppingCart className="w-10 h-10" />
          </div>
        )}
        {/* Source Badge */}
        <div className="absolute top-2 left-2">
          <span className="text-xs font-medium px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full shadow-sm">
            {source}
          </span>
        </div>
        {/* External Link Icon */}
        <div className="absolute top-2 right-2">
          <span className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm group-hover:bg-emerald-500 transition-colors">
            <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 text-sm leading-snug min-h-[2.5rem]">
          {displayTitle}
        </h4>

        {displayDescription && (
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
            {displayDescription}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
          {displayPrice ? (
            <span className="text-base font-bold text-emerald-600">{displayPrice}</span>
          ) : (
            <span className="text-xs text-gray-400">View price</span>
          )}
          <span className="text-xs font-medium text-emerald-600 group-hover:text-emerald-700">
            Shop Now →
          </span>
        </div>
      </div>
    </a>
  );
}

// Products Section - Horizontal slider with larger cards
function ProductsSection({ products }: { products: { url: string; title: string }[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (products.length === 0) return null;

  const checkScrollability = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 280;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollability, 300);
    }
  };

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Recommended Products</h3>
            <p className="text-xs text-gray-500">Click to view and purchase</p>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        {products.length > 2 && (
          <div className="flex gap-1">
            <button
              onClick={() => scroll("left")}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                canScrollLeft
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  : "bg-gray-50 text-gray-300"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                canScrollRight
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  : "bg-gray-50 text-gray-300"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Slider */}
      <div
        ref={sliderRef}
        onScroll={checkScrollability}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product, index) => (
          <ProductCard key={`${product.url}-${index}`} url={product.url} title={product.title} />
        ))}
      </div>

      <p className="text-xs text-gray-400 italic mt-3">
        External links. Always verify products before purchasing.
      </p>
    </div>
  );
}

export default function MessageContent({ 
  content, 
  products = [], 
  isStreaming = false,
  onQuestionAnswer,
  answeredQuestion,
}: MessageContentProps) {
  // Parse questions from content
  const { cleanContent: contentWithoutQuestions, questions } = useMemo(
    () => parseQuestions(content),
    [content]
  );
  
  // Also extract any product URLs from content as fallback
  const contentProducts = useMemo(() => extractUrls(contentWithoutQuestions), [contentWithoutQuestions]);
  
  // Combine passed products with any extracted from content
  const allProducts = useMemo(() => {
    if (products.length > 0) return products.map(p => ({ url: p.url, title: p.title }));
    return contentProducts;
  }, [products, contentProducts]);
  
  // Remove product links from content for cleaner display
  const cleanedContent = useMemo(() => {
    if (contentProducts.length === 0) return contentWithoutQuestions;
    
    let cleaned = contentWithoutQuestions;
    // Remove markdown links that are shopping links
    contentProducts.forEach(({ url, title }) => {
      // Remove the full markdown link
      cleaned = cleaned.replace(`[${title}](${url})`, "");
    });
    
    // Clean up any leftover empty lines or bullet points
    cleaned = cleaned
      .replace(/^\s*[-*]\s*$/gm, "") // Empty bullet points
      .replace(/\n{3,}/g, "\n\n") // Multiple newlines
      .trim();
    
    return cleaned;
  }, [contentWithoutQuestions, contentProducts]);

  return (
    <div className="prose prose-gray max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Headings
          h1: ({ children, ...props }) => (
            <h1
              className="text-xl font-bold text-gray-900 mt-6 mb-3 pb-2 border-b border-gray-200 first:mt-0"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="text-lg font-semibold text-gray-900 mt-5 mb-2 first:mt-0"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="text-base font-semibold text-gray-900 mt-4 mb-2 first:mt-0"
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className="text-sm font-semibold text-gray-900 mt-3 mb-1 first:mt-0"
              {...props}
            >
              {children}
            </h4>
          ),

          // Paragraphs
          p: ({ children, ...props }) => (
            <p className="text-gray-700 leading-7 mb-3 last:mb-0" {...props}>
              {children}
            </p>
          ),

          // Lists
          ul: ({ children, ...props }) => (
            <ul className="list-disc pl-6 space-y-1.5 my-3 text-gray-700" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal pl-6 space-y-1.5 my-3 text-gray-700" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-7 pl-1" {...props}>
              {children}
            </li>
          ),

          // Inline code
          code: ({ className, children, ...props }: ComponentPropsWithoutRef<"code">) => {
            const isCodeBlock = className?.includes("hljs") || className?.includes("language-");
            
            if (isCodeBlock) {
              return (
                <code className={`${className} text-sm`} {...props}>
                  {children}
                </code>
              );
            }

            return (
              <code
                className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Code blocks
          pre: ({ children, ...props }) => (
            <pre
              className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-4 text-sm"
              {...props}
            >
              {children}
            </pre>
          ),

          // Links - render inline, products shown separately
          a: ({ href, children, ...props }) => {
            // Skip shopping links (they'll be rendered in ProductsSection)
            if (href && isShoppingLink(href)) {
              return null;
            }

            // Regular link
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2 cursor-pointer"
                {...props}
              >
                {children}
              </a>
            );
          },

          // Blockquotes
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-emerald-500 pl-4 py-1 my-4 bg-emerald-50/50 rounded-r-lg text-gray-700 italic"
              {...props}
            >
              {children}
            </blockquote>
          ),

          // Strong/Bold
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-gray-900" {...props}>
              {children}
            </strong>
          ),

          // Emphasis/Italic
          em: ({ children, ...props }) => (
            <em className="italic text-gray-700" {...props}>
              {children}
            </em>
          ),

          // Horizontal rule
          hr: ({ ...props }) => (
            <hr className="my-6 border-gray-200" {...props} />
          ),

          // Tables
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4 -mx-2 px-2">
              <table
                className="w-full text-sm border-collapse"
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="border-b border-gray-300" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody className="divide-y divide-gray-200" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr className="hover:bg-gray-50/50 transition-colors" {...props}>{children}</tr>
          ),
          th: ({ children, ...props }) => (
            <th
              className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="px-3 py-2 text-sm text-gray-700" {...props}>
              {children}
            </td>
          ),

          // Images
          img: ({ src, alt, ...props }) => (
            <img
              src={src}
              alt={alt}
              className="rounded-lg max-w-full h-auto my-4"
              {...props}
            />
          ),
        }}
      >
        {cleanedContent}
      </ReactMarkdown>
      
      {/* Product cards and dietitians - only show after streaming is complete with fade-in */}
      {!isStreaming && allProducts.length > 0 && (
        <div className="animate-fade-in">
          <ProductsSection products={allProducts} />
          <DietitianSlider />
        </div>
      )}
      
      {/* Interactive questions - only show after streaming is complete */}
      {!isStreaming && questions.length > 0 && onQuestionAnswer && (
        <div className="animate-fade-in">
          {questions.map((question, index) => (
            <QuestionCard
              key={index}
              question={question}
              onAnswer={onQuestionAnswer}
              answered={!!answeredQuestion}
              selectedAnswer={answeredQuestion}
            />
          ))}
        </div>
      )}
    </div>
  );
}
