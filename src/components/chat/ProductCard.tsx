"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, ShoppingCart, ImageOff } from "lucide-react";
import Image from "next/image";

interface OGMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  price?: string;
}

interface ProductCardProps {
  title: string;
  url: string;
  price?: string;
  source?: string;
  description?: string;
}

export default function ProductCard({
  title,
  url,
  price,
  source,
  description,
}: ProductCardProps) {
  const [ogData, setOgData] = useState<OGMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Extract source from URL if not provided
  const displaySource = source || ogData?.siteName || (() => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "Shop";
    }
  })();

  // Fetch OG metadata
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

  // Use OG data if available, fallback to provided props
  const displayTitle = ogData?.title || title;
  const displayDescription = ogData?.description || description;
  const displayPrice = ogData?.price || price;
  const displayImage = ogData?.image;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="block rounded-xl border border-gray-200 bg-white hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
    >
      <div className="flex">
        {/* Product Image */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-100 relative">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : displayImage && !imageError ? (
            <Image
              src={displayImage}
              alt={displayTitle}
              fill
              className="object-contain p-2"
              onError={() => setImageError(true)}
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ImageOff className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-3 sm:p-4 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 text-sm sm:text-base">
              {displayTitle}
            </h4>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 flex-shrink-0 mt-0.5" />
          </div>

          {displayDescription && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2 flex-1">
              {displayDescription}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            {displayPrice && (
              <span className="text-sm font-bold text-emerald-600">{displayPrice}</span>
            )}
            <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded-full">
              {displaySource}
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

// Component to render a grid of product cards
interface ProductGridProps {
  products: ProductCardProps[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <div className="my-4 space-y-3">
      <p className="text-xs text-gray-500 flex items-center gap-1">
        <ShoppingCart className="w-3 h-3" />
        Available Products
      </p>
      <div className="grid gap-3">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
      <p className="text-xs text-gray-400 italic">
        These are external links. Always verify products before purchasing.
      </p>
    </div>
  );
}
