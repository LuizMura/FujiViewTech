import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 60;

type SearchCoin = {
  id: string;
  symbol: string;
  name: string;
  image?: { small?: string };
};

type MarketCoin = {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price?: number;
  market_cap?: number;
  total_volume?: number;
  price_change_percentage_24h_in_currency?: number | null;
};

type SearchResult = {
  id: string;
  symbol: string;
  name: string;
  image: string | null;
  currentPrice: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
};

async function fetchJson<T>(url: string): Promise<T | null> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "fujiviewtech-liveprices/1.0",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as T;
}

function toSearchResult(coin: MarketCoin): SearchResult {
  return {
    id: coin.id,
    symbol: (coin.symbol || "").toUpperCase(),
    name: coin.name || "",
    image: coin.image || null,
    currentPrice: coin.current_price || 0,
    marketCap: coin.market_cap || 0,
    volume24h: coin.total_volume || 0,
    change24h: coin.price_change_percentage_24h_in_currency || 0,
  };
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() || "";

  if (query.length < 2) {
    return NextResponse.json({ results: [] }, { status: 200 });
  }

  try {
    const searchUrl = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`;
    const searchData = await fetchJson<{ coins?: SearchCoin[] }>(searchUrl);

    const selectedCoins = (searchData?.coins || []).slice(0, 10);
    if (selectedCoins.length === 0) {
      return NextResponse.json({ results: [] }, { status: 200 });
    }

    const ids = selectedCoins.map((coin) => coin.id).join(",");
    const marketsUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&ids=${encodeURIComponent(ids)}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;
    const marketData = await fetchJson<MarketCoin[]>(marketsUrl);

    const results = Array.isArray(marketData)
      ? marketData.map(toSearchResult)
      : [];

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error("Error searching coins:", error);
    return NextResponse.json({ results: [] }, { status: 503 });
  }
}
