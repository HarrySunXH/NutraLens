import { NextRequest, NextResponse } from "next/server";

interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
  age?: string;
  extra_snippets?: string[];
}

interface BraveWebSearchResponse {
  web?: {
    results: BraveSearchResult[];
  };
  query?: {
    original: string;
  };
}

export interface SupplementProduct {
  title: string;
  url: string;
  description: string;
  source: string;
  price?: string;
}

// Extract price from text if present
function extractPrice(text: string): string | undefined {
  const priceMatch = text.match(/\$[\d,]+\.?\d*/);
  return priceMatch ? priceMatch[0] : undefined;
}

// Extract source domain from URL
function extractSource(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    // Map common domains to friendly names
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
    };
    return sourceMap[hostname] || hostname;
  } catch {
    return "Web";
  }
}

// Filter results to prioritize shopping/product pages
function isProductResult(result: BraveSearchResult): boolean {
  const productIndicators = [
    "buy",
    "shop",
    "price",
    "$",
    "add to cart",
    "purchase",
    "order",
    "product",
    "supplement",
    "vitamin",
    "capsule",
    "tablet",
    "powder",
  ];
  const text = `${result.title} ${result.description}`.toLowerCase();
  return productIndicators.some((indicator) => text.includes(indicator));
}

export async function POST(req: NextRequest) {
  try {
    const { query, count = 5 } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.BRAVE_SEARCH_API_KEY;
    
    if (!apiKey) {
      console.warn("Brave Search API key not configured, returning empty results");
      return NextResponse.json({ products: [], query });
    }

    // Add supplement/buy keywords to improve product results
    const enhancedQuery = `${query} buy supplement`;

    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(
        enhancedQuery
      )}&count=${count * 2}&safesearch=moderate`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brave Search API error:", errorText);
      return NextResponse.json(
        { error: "Search failed", details: errorText },
        { status: response.status }
      );
    }

    const data: BraveWebSearchResponse = await response.json();
    const webResults = data.web?.results || [];

    // Filter and transform results
    const products: SupplementProduct[] = webResults
      .filter(isProductResult)
      .slice(0, count)
      .map((result) => ({
        title: result.title,
        url: result.url,
        description: result.description,
        source: extractSource(result.url),
        price: extractPrice(`${result.title} ${result.description}`),
      }));

    return NextResponse.json({
      products,
      query: data.query?.original || query,
    });
  } catch (error) {
    console.error("Search supplements error:", error);
    return NextResponse.json(
      { error: "Failed to search for supplements" },
      { status: 500 }
    );
  }
}
