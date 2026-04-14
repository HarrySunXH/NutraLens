import { NextResponse } from "next/server";
import {
  getSupplementTrendSnapshot,
  type SupplementTrend,
} from "@/lib/googleTrends";

const SUPPLEMENT_KEYWORDS = [
  "Creatine",
  "Magnesium glycinate",
  "Ashwagandha",
  "Berberine",
  "Vitamin D3",
  "Lion's Mane",
  "Omega-3",
  "Collagen peptides",
  "NMN",
  "Electrolytes",
];

const BATCH_SIZE = 5;
const CACHE_TTL_MS = 1000 * 60 * 60;

let cachedResponse:
  | {
      expiresAt: number;
      data: {
        updatedAt: string;
        source: string;
        geo: string;
        period: string;
        items: SupplementTrend[];
      };
    }
  | undefined;

async function loadTrendData() {
  const batches: string[][] = [];

  for (let index = 0; index < SUPPLEMENT_KEYWORDS.length; index += BATCH_SIZE) {
    batches.push(SUPPLEMENT_KEYWORDS.slice(index, index + BATCH_SIZE));
  }

  const batchResults = await Promise.all(
    batches.map((batch) =>
      getSupplementTrendSnapshot(batch, {
        geo: "US",
        timeRange: "today 3-m",
      })
    )
  );

  const items = batchResults
    .flat()
    .sort((left, right) => {
      if (right.growthPercent !== left.growthPercent) {
        return right.growthPercent - left.growthPercent;
      }

      return right.currentScore - left.currentScore;
    })
    .slice(0, 5);

  return {
    updatedAt: new Date().toISOString(),
    source: "Google Trends",
    geo: "US",
    period: "today 3-m",
    items,
  };
}

export async function GET() {
  const now = Date.now();

  if (cachedResponse && cachedResponse.expiresAt > now) {
    return NextResponse.json(cachedResponse.data);
  }

  try {
    const data = await loadTrendData();

    cachedResponse = {
      expiresAt: now + CACHE_TTL_MS,
      data,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Community trends error:", error);

    return NextResponse.json(
      { error: "Failed to load live Google Trends data" },
      { status: 500 }
    );
  }
}
