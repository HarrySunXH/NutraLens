interface TrendsWidget {
  id?: string;
  token?: string;
  request?: unknown;
}

interface TimelinePoint {
  time: string;
  formattedTime?: string;
  formattedAxisTime?: string;
  value: Array<number | string>;
}

interface ExploreResponse {
  widgets?: TrendsWidget[];
}

interface MultilineResponse {
  default?: {
    timelineData?: TimelinePoint[];
  };
}

export interface SupplementTrend {
  keyword: string;
  currentScore: number;
  previousScore: number;
  growthPercent: number;
  peakScore: number;
}

const GOOGLE_TRENDS_BASE_URL = "https://trends.google.com";
const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  Accept: "application/json,text/plain,*/*",
};

function stripJsonPrefix(payload: string): string {
  return payload.replace(/^\)\]\}',?\n?/, "").trim();
}

async function fetchGoogleTrendsText(path: string): Promise<string> {
  const requestUrl = `${GOOGLE_TRENDS_BASE_URL}${path}`;

  let response = await fetch(requestUrl, {
    headers: DEFAULT_HEADERS,
    cache: "no-store",
  });

  const retryCookie = response.headers.get("set-cookie")?.split(";")[0];

  if ((response.status === 429 || response.status === 400) && retryCookie) {
    response = await fetch(requestUrl, {
      headers: {
        ...DEFAULT_HEADERS,
        Cookie: retryCookie,
      },
      cache: "no-store",
    });
  }

  if (!response.ok) {
    throw new Error(`Google Trends request failed with status ${response.status}`);
  }

  return response.text();
}

async function fetchExploreWidget(
  keywords: string[],
  geo: string,
  timeRange: string
): Promise<TrendsWidget> {
  const req = {
    comparisonItem: keywords.map((keyword) => ({
      keyword,
      geo,
      time: timeRange,
    })),
    category: 0,
    property: "",
  };

  const payload = await fetchGoogleTrendsText(
    `/trends/api/explore?hl=en-US&tz=240&req=${encodeURIComponent(
      JSON.stringify(req)
    )}`
  );

  const data = JSON.parse(stripJsonPrefix(payload)) as ExploreResponse;
  const widget = data.widgets?.find((item) =>
    String(item.id || "").includes("TIMESERIES")
  );

  if (!widget?.token || !widget.request) {
    throw new Error("Google Trends timeseries widget was not found");
  }

  return widget;
}

async function fetchTimelineData(
  widget: TrendsWidget
): Promise<TimelinePoint[]> {
  const payload = await fetchGoogleTrendsText(
    `/trends/api/widgetdata/multiline?hl=en-US&tz=240&token=${encodeURIComponent(
      widget.token || ""
    )}&req=${encodeURIComponent(JSON.stringify(widget.request))}`
  );

  const data = JSON.parse(stripJsonPrefix(payload)) as MultilineResponse;
  return data.default?.timelineData || [];
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function toNumber(value: number | string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildTrendScores(
  keywords: string[],
  timelineData: TimelinePoint[]
): SupplementTrend[] {
  return keywords.map((keyword, index) => {
    const values = timelineData.map((point) => toNumber(point.value?.[index]));
    const recentWindow = values.slice(-7);
    const previousWindow = values.slice(-14, -7);
    const currentScore = average(recentWindow);
    const previousScore = average(previousWindow);
    const rawGrowth =
      previousScore > 0
        ? ((currentScore - previousScore) / previousScore) * 100
        : currentScore > 0
        ? 100
        : 0;

    return {
      keyword,
      currentScore: Number(currentScore.toFixed(1)),
      previousScore: Number(previousScore.toFixed(1)),
      growthPercent: Math.round(rawGrowth),
      peakScore: Math.max(...values, 0),
    };
  });
}

export async function getSupplementTrendSnapshot(
  keywords: string[],
  options?: {
    geo?: string;
    timeRange?: string;
  }
): Promise<SupplementTrend[]> {
  const geo = options?.geo || "US";
  const timeRange = options?.timeRange || "today 3-m";
  const widget = await fetchExploreWidget(keywords, geo, timeRange);
  const timelineData = await fetchTimelineData(widget);
  return buildTrendScores(keywords, timelineData);
}
