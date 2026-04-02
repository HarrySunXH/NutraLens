import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import { HealthProfile } from "@/types/health-profile";

let groq: Groq | null = null;

function getGroqClient(): Groq {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

// Supplement product interface
interface SupplementProduct {
  title: string;
  url: string;
  description: string;
  source: string;
  price?: string;
}

const BASE_SYSTEM_PROMPT = `You are NutraLens AI, a concise and precise supplement expert. Provide actionable, evidence-based guidance.

CORE PRINCIPLES:
- Be BRIEF: Maximum 150 words for simple questions, 250 words for complex topics
- Be PRECISE: Answer the specific question asked, nothing more
- Be ACTIONABLE: Focus on what to take, when, why, and key considerations
- Personalize using the user's health profile when provided
- Always mention consulting healthcare providers for medical conditions

RESPONSE STRUCTURE (keep it minimal):
1. Direct answer (1-2 sentences)
2. Key recommendations (3-5 bullet points max)
3. Important considerations (1-2 sentences if needed)

FORMATTING:
- Use **bold** for supplement names and key terms
- Use "-" for bullet lists (max 5 items)
- Use "## Header" for sections (max 2-3 sections)
- NO horizontal rules, dividers, or excessive formatting
- NO introductory fluff or lengthy explanations

PRODUCTS:
- Products appear as cards below - don't mention them in text
- Focus on WHY supplements help, not where to buy
- Keep product-related text to 1 sentence if needed

ASKING QUESTIONS (IMPORTANT):
When you need more information to give personalized advice, OR when the user's health profile is incomplete, ask a follow-up question using this EXACT format:

[QUESTION]
Your question here?
- Option 1
- Option 2
- Option 3
- Option 4
[/QUESTION]

Rules for asking questions:
- Ask ONE question at a time
- Provide 3-5 relevant options
- Options should be clear and concise
- Place the question at the END of your response
- Only ask when information is genuinely needed for better recommendations
- Examples of when to ask: unclear health goals, missing age/conditions info, ambiguous supplement preferences

CRITICAL: If the response exceeds 250 words, you've written too much. Cut it down.`;

// Keywords that indicate user wants to buy/find supplements
const PURCHASE_INTENT_KEYWORDS = [
  "buy",
  "purchase",
  "order",
  "where to get",
  "where can i get",
  "where can i buy",
  "recommend a product",
  "recommend products",
  "product recommendation",
  "best brand",
  "which brand",
  "link",
  "shop",
  "store",
  "amazon",
  "iherb",
  "find me",
  "get me",
  "suggest a product",
  "suggest products",
];

// Keywords that indicate supplement recommendation request
const SUPPLEMENT_RECOMMENDATION_KEYWORDS = [
  "what supplement",
  "which supplement",
  "recommend supplement",
  "need supplement",
  "should i take",
  "what should i take",
  "best supplement for",
  "supplements for",
  "vitamin for",
  "help with energy",
  "help with sleep",
  "help with muscle",
  "improve my",
  "boost my",
  "increase my",
];

function detectPurchaseIntent(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return PURCHASE_INTENT_KEYWORDS.some((keyword) => lowerMessage.includes(keyword));
}

function detectSupplementRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return SUPPLEMENT_RECOMMENDATION_KEYWORDS.some((keyword) => lowerMessage.includes(keyword));
}

function extractSearchQuery(message: string, profile?: HealthProfile): string {
  // Extract the main supplement/health topic from the message
  const phrasesToRemove = [
    "can you recommend",
    "please recommend",
    "i need",
    "i want",
    "where can i buy",
    "where to buy",
    "help me find",
    "find me",
    "get me",
    "what is the best",
    "what are the best",
    "suggest",
    "recommend",
  ];
  
  let cleanQuery = message.toLowerCase();
  phrasesToRemove.forEach((phrase) => {
    cleanQuery = cleanQuery.replace(phrase, "");
  });
  
  // Add context from health goals if available
  if (profile?.goals) {
    const goalKeywords: string[] = [];
    if (profile.goals.muscleMass) goalKeywords.push("muscle");
    if (profile.goals.strength) goalKeywords.push("strength");
    if (profile.goals.mentalPerformance) goalKeywords.push("cognitive focus");
    if (profile.goals.longevity) goalKeywords.push("anti-aging");
    if (profile.goals.painMitigation) goalKeywords.push("joint pain relief");
    if (profile.goals.fitness) goalKeywords.push("fitness");
    
    // Add goal context if query is generic
    if (cleanQuery.length < 20 && goalKeywords.length > 0) {
      cleanQuery = `${cleanQuery} for ${goalKeywords[0]}`;
    }
  }
  
  return cleanQuery.trim();
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
function isProductResult(result: { title: string; description: string }): boolean {
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
      )}&count=3&safesearch=moderate`,
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

    const data = await response.json();
    const webResults = data.web?.results || [];

    return webResults
      .filter(isProductResult)
      .map((result: { title: string; url: string; description: string }) => ({
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

    const response = await getGroqClient().chat.completions.create({
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

// Perform search with validation and retry logic
async function performValidatedSearch(
  apiKey: string,
  originalQuery: string,
  attempt: number = 1
): Promise<SupplementProduct[]> {
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
      } else {
        console.log(`Found validated products from all 3 partners for query: "${currentQuery}"`);
      }
      return partnerProducts.slice(0, 3);
    }

    // Invalid results and we can retry - use improved query if provided
    if (attempt < 3 && validation.improvedQuery) {
      console.log(`Validation failed (attempt ${attempt}): ${validation.reason}. Retrying with: ${validation.improvedQuery}`);
      return performValidatedSearch(apiKey, validation.improvedQuery, attempt + 1);
    }
  }

  // If we don't have all three, try to fill with additional products from partners
  const allPartnerProducts = partnerSearches.flat();
  const seenPartnerUrls = new Set(partnerProducts.map(p => p.url));
  const additionalPartnerProducts = allPartnerProducts
    .filter(p => !seenPartnerUrls.has(p.url))
    .slice(0, Math.max(0, 5 - partnerProducts.length));

  const finalPartnerProducts = [...partnerProducts, ...additionalPartnerProducts];

  // Validate partner products if we have enough
  if (finalPartnerProducts.length >= 3) {
    const validation = await validateSearchResults(currentQuery, finalPartnerProducts.slice(0, 3));
    
    if (!validation.isValid && attempt < 3 && validation.improvedQuery) {
      console.log(`Validation failed (attempt ${attempt}): ${validation.reason}. Retrying with: ${validation.improvedQuery}`);
      return performValidatedSearch(apiKey, validation.improvedQuery, attempt + 1);
    }
  }

  // If we have enough partner results (5+), return them
  if (finalPartnerProducts.length >= 5) {
    console.log(`Found ${finalPartnerProducts.length} partner products for query: "${currentQuery}"`);
    return finalPartnerProducts.slice(0, 5);
  }

  // Otherwise, do a general search and prioritize partner results
  const enhancedQuery = `${currentQuery} buy supplement online`;
  const response = await fetch(
    `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(
      enhancedQuery
    )}&count=15&safesearch=moderate`,
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
    console.log(`Found ${finalPartnerProducts.length} partner products (general search failed) for query: "${currentQuery}"`);
    return finalPartnerProducts.slice(0, 5);
  }

  const data = await response.json();
  const webResults = data.web?.results || [];

  // Filter and transform results
  const allProducts: SupplementProduct[] = webResults
    .filter(isProductResult)
    .map((result: { title: string; url: string; description: string }) => ({
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
    .slice(0, Math.max(0, 5 - finalPartnerProducts.length));

  const finalProducts = [...finalPartnerProducts, ...additionalProducts].slice(0, 5);

  // Validate final results
  if (finalProducts.length >= 3) {
    const validation = await validateSearchResults(currentQuery, finalProducts.slice(0, 3));
    
    if (!validation.isValid && attempt < 3 && validation.improvedQuery) {
      console.log(`Final validation failed (attempt ${attempt}): ${validation.reason}. Retrying with: ${validation.improvedQuery}`);
      return performValidatedSearch(apiKey, validation.improvedQuery, attempt + 1);
    }
  }

  console.log(`Found ${finalProducts.length} products (${finalPartnerProducts.length} from partners, ${partnerProducts.length >= 3 ? 'all 3 partners represented' : 'partial partner coverage'}) for query: "${currentQuery}"`);
  return finalProducts;
}

// Direct Brave Search API call - prioritizes partner retailers with validation
async function searchSupplements(query: string): Promise<SupplementProduct[]> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  
  if (!apiKey) {
    console.log("Brave Search API key not configured, skipping product search");
    return [];
  }

  try {
    return await performValidatedSearch(apiKey, query, 1);
  } catch (error) {
    console.error("Error searching supplements:", error);
    return [];
  }
}

function formatProductsForPrompt(products: SupplementProduct[]): string {
  if (products.length === 0) return "";
  
  let text = "\n\n---\nPRODUCT SEARCH RESULTS (Include these links in your response):\n";
  products.forEach((product, index) => {
    text += `${index + 1}. ${product.title}\n`;
    text += `   Source: ${product.source}\n`;
    text += `   URL: ${product.url}\n`;
    if (product.price) text += `   Price: ${product.price}\n`;
    text += `   Description: ${product.description}\n\n`;
  });
  text += "Include relevant products from above in your recommendation with clickable markdown links like [Product Name](URL).\nAdd a disclaimer that these are external purchase links.\n---";
  return text;
}

function formatProfileForPrompt(profile: HealthProfile): string {
  const parts: string[] = [];

  // Demographics
  const demographics: string[] = [];
  if (profile.age) demographics.push(`Age: ${profile.age}`);
  if (profile.sexAtBirth && profile.sexAtBirth !== 'prefer_not_to_say') {
    demographics.push(`Biological sex: ${profile.sexAtBirth}`);
  }
  if (profile.genderIdentity) demographics.push(`Gender: ${profile.genderIdentity}`);
  if (demographics.length > 0) {
    parts.push(demographics.join(", "));
  }

  // Medical conditions
  const conditions: string[] = [];
  if (profile.liverConditions.length > 0) {
    conditions.push(`Liver conditions: ${profile.liverConditions.join(", ")}`);
  }
  if (profile.kidneyConditions.length > 0) {
    conditions.push(`Kidney conditions: ${profile.kidneyConditions.join(", ")}`);
  }
  if (profile.digestiveConditions.length > 0) {
    conditions.push(`Digestive conditions: ${profile.digestiveConditions.join(", ")}`);
  }
  if (profile.otherConditions.length > 0) {
    conditions.push(`Other conditions: ${profile.otherConditions.join(", ")}`);
  }
  if (conditions.length > 0) {
    parts.push("Medical History: " + conditions.join("; "));
  } else {
    parts.push("Medical History: No conditions reported");
  }

  // Health goals
  const goalLabels: Record<string, string> = {
    fitness: "General Fitness",
    muscleMass: "Muscle Mass",
    strength: "Strength",
    mentalPerformance: "Mental Performance",
    longevity: "Longevity",
    painMitigation: "Pain Mitigation",
  };
  const activeGoals = Object.entries(profile.goals)
    .filter(([, active]) => active)
    .map(([goal]) => goalLabels[goal] || goal);
  if (activeGoals.length > 0) {
    parts.push(`Health Goals: ${activeGoals.join(", ")}`);
  }

  // Current supplements
  if (profile.currentSupplements.length > 0) {
    parts.push(`Currently Taking: ${profile.currentSupplements.join(", ")}`);
  }

  // Lab data
  const labValues: string[] = [];
  
  // Hormones
  const h = profile.labData.hormones;
  if (h.testosterone) labValues.push(`Testosterone: ${h.testosterone} ng/dL`);
  if (h.estrogen) labValues.push(`Estrogen: ${h.estrogen} pg/mL`);
  if (h.cortisol) labValues.push(`Cortisol: ${h.cortisol} μg/dL`);
  if (h.insulin) labValues.push(`Insulin: ${h.insulin} μIU/mL`);
  if (h.thyroidTSH) labValues.push(`TSH: ${h.thyroidTSH} mIU/L`);

  // Vitamins
  const v = profile.labData.vitamins;
  if (v.vitaminD) labValues.push(`Vitamin D: ${v.vitaminD} ng/mL`);
  if (v.vitaminB12) labValues.push(`Vitamin B12: ${v.vitaminB12} pg/mL`);
  if (v.vitaminB6) labValues.push(`Vitamin B6: ${v.vitaminB6} ng/mL`);
  if (v.iron) labValues.push(`Iron: ${v.iron} μg/dL`);
  if (v.ferritin) labValues.push(`Ferritin: ${v.ferritin} ng/mL`);

  // General health
  const g = profile.labData.generalHealth;
  if (g.glucose) labValues.push(`Fasting Glucose: ${g.glucose} mg/dL`);
  if (g.hba1c) labValues.push(`HbA1c: ${g.hba1c}%`);
  if (g.ldl) labValues.push(`LDL: ${g.ldl} mg/dL`);
  if (g.hdl) labValues.push(`HDL: ${g.hdl} mg/dL`);
  if (g.triglycerides) labValues.push(`Triglycerides: ${g.triglycerides} mg/dL`);

  if (labValues.length > 0) {
    parts.push(`Recent Lab Values: ${labValues.join(", ")}`);
  }

  return parts.join("\n");
}

function buildSystemPrompt(profile?: HealthProfile, productContext?: string): string {
  let prompt = BASE_SYSTEM_PROMPT;
  
  if (profile?.completedAt) {
    const profileSummary = formatProfileForPrompt(profile);
    prompt += `\n\n---\n\nUSER HEALTH PROFILE:\n${profileSummary}\n\nUse this profile information to personalize your recommendations. Consider any medical conditions when suggesting supplements, and reference lab values if relevant to the user's question.`;
  }
  
  if (productContext) {
    prompt += productContext;
  }
  
  return prompt;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, healthProfile } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Groq API key not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get the latest user message
    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage?.content || "";
    
    // Check if we should search for products
    let productContext = "";
    let products: SupplementProduct[] = [];
    const shouldSearch = detectPurchaseIntent(userMessage) || detectSupplementRequest(userMessage);
    
    if (shouldSearch) {
      const searchQuery = extractSearchQuery(userMessage, healthProfile);
      console.log("Searching for supplements:", searchQuery);
      
      products = await searchSupplements(searchQuery);
      if (products.length > 0) {
        productContext = formatProductsForPrompt(products);
      }
    }

    // Build system prompt with user's health profile and product context
    const systemPrompt = buildSystemPrompt(healthProfile, productContext);

    // Convert messages to Groq format
    const groqMessages = [
      {
        role: "system" as const,
        content: systemPrompt,
      },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.content,
      })),
    ];

    // Create streaming response
    const stream = await getGroqClient().chat.completions.create({
      messages: groqMessages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.6, // Slightly lower for more focused responses
      max_tokens: 1000, // Reduced to enforce concise responses
      top_p: 0.9,
      stream: true,
    });

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          // Send products first if available
          if (products.length > 0) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ products })}\n\n`)
            );
          }
          
          // Stream AI response
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Groq API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to get response from AI";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
