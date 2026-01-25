import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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

// Partner retailers to prioritize
const PARTNER_RETAILERS = ["cvs.com", "walgreens.com", "gnc.com"];
const PARTNER_NAMES = ["CVS", "Walgreens", "GNC"];

// Check if URL is from a partner retailer
function isPartnerRetailer(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return PARTNER_RETAILERS.some(partner => hostname.includes(partner));
  } catch {
    return false;
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

// Validate search results using AI
async function validateSearchResults(
  query: string,
  products: SupplementProduct[]
): Promise<{ isValid: boolean; improvedQuery?: string; reason?: string }> {
  if (!process.env.GROQ_API_KEY || products.length === 0) {
    return { isValid: true }; // Skip validation if no API key or no products
  }

  try {
    const productsSummary = products.map((p, i) => 
      `${i + 1}. ${p.title} (${p.source}) - ${p.description?.substring(0, 100) || 'No description'}`
    ).join('\n');

    const validationPrompt = `You are a supplement search validator. Analyze if these search results match the user's query.

User Query: "${query}"

Search Results:
${productsSummary}

Evaluate:
1. Are these results relevant supplements/products that match the query?
2. Are they from the correct retailers (CVS, Walgreens, GNC)?
3. Do they appear to be actual purchasable products (not articles, reviews, or unrelated pages)?

Respond in JSON format:
{
  "isValid": true/false,
  "reason": "brief explanation",
  "improvedQuery": "suggested improved search query if invalid, or null if valid"
}

Only mark as invalid if results are clearly wrong (wrong products, wrong retailers, not supplements, etc.).`;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a precise supplement search validator. Respond only with valid JSON.",
        },
        {
          role: "user",
          content: validationPrompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 200,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const validation = JSON.parse(content);
      return {
        isValid: validation.isValid === true,
        improvedQuery: validation.improvedQuery || undefined,
        reason: validation.reason,
      };
    }
  } catch (error) {
    console.error("Validation error:", error);
    // If validation fails, assume results are valid to avoid blocking
    return { isValid: true };
  }

  return { isValid: true };
}

// Search a specific retailer
async function searchRetailer(
  apiKey: string,
  query: string,
  retailer: string,
  retailerDomain: string
): Promise<SupplementProduct[]> {
  try {
    const retailerQuery = `${query} site:${retailerDomain}`;
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(
        retailerQuery
      )}&count=5&safesearch=moderate`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": apiKey,
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data: BraveWebSearchResponse = await response.json();
    const webResults = data.web?.results || [];

    return webResults
      .filter(isProductResult)
      .map((result) => ({
        title: result.title,
        url: result.url,
        description: result.description,
        source: retailer,
        price: extractPrice(`${result.title} ${result.description}`),
      }));
  } catch (error) {
    console.error(`Error searching ${retailer}:`, error);
    return [];
  }
}

// Perform search with validation and retry logic
async function performValidatedSearch(
  apiKey: string,
  originalQuery: string,
  count: number,
  attempt: number = 1
): Promise<{ products: SupplementProduct[]; query: string }> {
  const currentQuery = attempt === 1 ? originalQuery : originalQuery;

  // First, search each partner retailer specifically
  const partnerSearches = await Promise.all([
    searchRetailer(apiKey, currentQuery, "CVS", "cvs.com"),
    searchRetailer(apiKey, currentQuery, "Walgreens", "walgreens.com"),
    searchRetailer(apiKey, currentQuery, "GNC", "gnc.com"),
  ]);

  // Get at least one product from each partner
  const cvsProducts = partnerSearches[0];
  const walgreensProducts = partnerSearches[1];
  const gncProducts = partnerSearches[2];

  // Build result array: one from each partner
  const partnerProducts: SupplementProduct[] = [];
  if (cvsProducts.length > 0) partnerProducts.push(cvsProducts[0]);
  if (walgreensProducts.length > 0) partnerProducts.push(walgreensProducts[0]);
  if (gncProducts.length > 0) partnerProducts.push(gncProducts[0]);

  // If we have products from all three partners, validate them
  if (partnerProducts.length >= 3) {
    const validation = await validateSearchResults(currentQuery, partnerProducts);
    
    if (validation.isValid || attempt >= 3) {
      // Valid results or max attempts reached
      if (!validation.isValid && attempt >= 3) {
        console.log(`Validation failed after ${attempt} attempts, returning results anyway`);
      }
      return {
        products: partnerProducts.slice(0, 3),
        query: currentQuery,
      };
    }

    // Invalid results and we can retry - use improved query if provided
    if (attempt < 3 && validation.improvedQuery) {
      console.log(`Validation failed (attempt ${attempt}): ${validation.reason}. Retrying with: ${validation.improvedQuery}`);
      return performValidatedSearch(apiKey, validation.improvedQuery, count, attempt + 1);
    }
  }

  // If we don't have all three, try to fill with additional products from partners
  const allPartnerProducts = partnerSearches.flat();
  const seenPartnerUrls = new Set(partnerProducts.map(p => p.url));
  const additionalPartnerProducts = allPartnerProducts
    .filter(p => !seenPartnerUrls.has(p.url))
    .slice(0, Math.max(0, count - partnerProducts.length));

  const finalPartnerProducts = [...partnerProducts, ...additionalPartnerProducts];

  // Validate partner products if we have enough
  if (finalPartnerProducts.length >= 3) {
    const validation = await validateSearchResults(currentQuery, finalPartnerProducts.slice(0, 3));
    
    if (!validation.isValid && attempt < 3 && validation.improvedQuery) {
      console.log(`Validation failed (attempt ${attempt}): ${validation.reason}. Retrying with: ${validation.improvedQuery}`);
      return performValidatedSearch(apiKey, validation.improvedQuery, count, attempt + 1);
    }
  }

  // If we have enough partner results, return them
  if (finalPartnerProducts.length >= count) {
    return {
      products: finalPartnerProducts.slice(0, count),
      query: currentQuery,
    };
  }

  // Otherwise, do a general search and prioritize partner results
  const enhancedQuery = `${currentQuery} buy supplement`;
  const response = await fetch(
    `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(
      enhancedQuery
    )}&count=${count * 3}&safesearch=moderate`,
    {
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": apiKey,
      },
    }
  );

  if (!response.ok) {
    // If general search fails, return partner results we have
    return {
      products: finalPartnerProducts.slice(0, count),
      query: currentQuery,
    };
  }

  const data: BraveWebSearchResponse = await response.json();
  const webResults = data.web?.results || [];

  // Filter and transform results
  const allProducts: SupplementProduct[] = webResults
    .filter(isProductResult)
    .map((result) => ({
      title: result.title,
      url: result.url,
      description: result.description,
      source: extractSource(result.url),
      price: extractPrice(`${result.title} ${result.description}`),
    }));

  // Separate partner and non-partner products
  const partnerResults = allProducts.filter(p => isPartnerRetailer(p.url));
  const otherResults = allProducts.filter(p => !isPartnerRetailer(p.url));

  // Combine: partner results first, then others, avoiding duplicates
  const seenAllUrls = new Set(finalPartnerProducts.map(p => p.url));
  const additionalProducts = [...partnerResults, ...otherResults]
    .filter(p => !seenAllUrls.has(p.url))
    .slice(0, Math.max(0, count - finalPartnerProducts.length));

  const finalProducts = [...finalPartnerProducts, ...additionalProducts].slice(0, count);

  // Validate final results
  if (finalProducts.length >= 3) {
    const validation = await validateSearchResults(currentQuery, finalProducts.slice(0, 3));
    
    if (!validation.isValid && attempt < 3 && validation.improvedQuery) {
      console.log(`Final validation failed (attempt ${attempt}): ${validation.reason}. Retrying with: ${validation.improvedQuery}`);
      return performValidatedSearch(apiKey, validation.improvedQuery, count, attempt + 1);
    }
  }

  return {
    products: finalProducts,
    query: data.query?.original || currentQuery,
  };
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

    // Perform validated search with retry logic (max 3 attempts)
    const result = await performValidatedSearch(apiKey, query, count, 1);

    return NextResponse.json({
      products: result.products,
      query: result.query,
    });
  } catch (error) {
    console.error("Search supplements error:", error);
    return NextResponse.json(
      { error: "Failed to search for supplements" },
      { status: 500 }
    );
  }
}
