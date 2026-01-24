import { NextRequest, NextResponse } from "next/server";

interface OGMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  url?: string;
  price?: string;
}

// Extract meta content from HTML
function extractMetaContent(html: string, property: string): string | undefined {
  // Try og: prefix
  const ogRegex = new RegExp(
    `<meta[^>]*property=["']og:${property}["'][^>]*content=["']([^"']+)["']`,
    "i"
  );
  let match = html.match(ogRegex);
  if (match) return match[1];

  // Try reverse order (content before property)
  const ogRegexReverse = new RegExp(
    `<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:${property}["']`,
    "i"
  );
  match = html.match(ogRegexReverse);
  if (match) return match[1];

  // Try twitter: prefix
  const twitterRegex = new RegExp(
    `<meta[^>]*name=["']twitter:${property}["'][^>]*content=["']([^"']+)["']`,
    "i"
  );
  match = html.match(twitterRegex);
  if (match) return match[1];

  // Try name attribute for description
  if (property === "description") {
    const nameRegex = /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i;
    match = html.match(nameRegex);
    if (match) return match[1];
  }

  return undefined;
}

// Extract title from HTML
function extractTitle(html: string): string | undefined {
  const ogTitle = extractMetaContent(html, "title");
  if (ogTitle) return ogTitle;

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : undefined;
}

// Extract price from page content
function extractPrice(html: string): string | undefined {
  // Common price patterns
  const pricePatterns = [
    /<[^>]*class="[^"]*price[^"]*"[^>]*>\s*\$?([\d,]+\.?\d*)/i,
    /\$(\d+\.?\d*)/,
    /<span[^>]*itemprop="price"[^>]*content="([^"]+)"/i,
  ];

  for (const pattern of pricePatterns) {
    const match = html.match(pattern);
    if (match) {
      const price = match[1];
      if (!price.startsWith("$")) {
        return `$${price}`;
      }
      return price;
    }
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch the page with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch URL" },
        { status: response.status }
      );
    }

    const html = await response.text();

    // Extract OG metadata
    const metadata: OGMetadata = {
      title: extractTitle(html),
      description: extractMetaContent(html, "description"),
      image: extractMetaContent(html, "image"),
      siteName: extractMetaContent(html, "site_name"),
      url: extractMetaContent(html, "url") || url,
      price: extractPrice(html),
    };

    // Clean up and validate image URL
    if (metadata.image) {
      // Handle relative URLs
      if (metadata.image.startsWith("/")) {
        try {
          const urlObj = new URL(url);
          metadata.image = `${urlObj.protocol}//${urlObj.host}${metadata.image}`;
        } catch {
          // Keep as is if URL parsing fails
        }
      }
      // Handle protocol-relative URLs
      if (metadata.image.startsWith("//")) {
        metadata.image = `https:${metadata.image}`;
      }
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("OG metadata fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 500 }
    );
  }
}
