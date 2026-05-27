type JsonObject = Record<string, unknown>;

type FrankfurterResponse = {
  date?: string;
  rates?: Record<string, number>;
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

export type TopMover = {
  id: string;
  symbol: string;
  name: string;
  image: string | null;
  currentPrice: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
};

export type MarketIndex = {
  symbol: string;
  name: string;
  currentPrice: number;
  change24h: number;
};

export type PriceApiResponse = {
  cgData: JsonObject;
  fiatData: JsonObject;
  indices: MarketIndex[];
  topGainers: TopMover[];
  topLosers: TopMover[];
  topMarketCap: TopMover[];
};

const INDEX_META: Record<string, { symbol: string; name: string }> = {
  "^DAX": { symbol: "DAX", name: "Europa (DAX)" },
  "^SPX": { symbol: "SPX", name: "S&P 500 (SPX)" },
  "^NDQ": { symbol: "NDQ", name: "NASDAQ" },
  "^DJI": { symbol: "DJI", name: "Dow Jones" },
  "^BVP": { symbol: "IBOV", name: "Ibovespa" },
  "^NKX": { symbol: "NIKKEI", name: "Nikkei" },
};

async function fetchMarketIndices(): Promise<MarketIndex[]> {
  try {
    const symbols = Object.keys(INDEX_META);

    const results = await Promise.allSettled(
      symbols.map(async (rawSymbol) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const url = `https://stooq.com/q/l/?s=${encodeURIComponent(rawSymbol)}&f=sd2t2ohlcv&h&e=csv`;

        const response = await fetch(url, {
          headers: {
            Accept: "text/csv",
            "User-Agent": "fujiviewtech-liveprices/1.0",
          },
          next: { revalidate: 60 },
          signal: controller.signal,
        }).finally(() => clearTimeout(timeoutId));

        if (!response.ok) {
          return null;
        }

        const csv = await response.text();
        const lines = csv
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean);

        if (lines.length < 2) {
          return null;
        }

        const [symbol, , , rawOpen, , , rawClose] = lines[1].split(",");
        const symbolKey = (symbol || "").trim().toUpperCase();
        const meta = INDEX_META[symbolKey];

        if (!meta) {
          return null;
        }

        const open = Number.parseFloat(rawOpen || "");
        const close = Number.parseFloat(rawClose || "");

        if (!Number.isFinite(close) || close <= 0) {
          return null;
        }

        const change24h =
          Number.isFinite(open) && open > 0 ? ((close - open) / open) * 100 : 0;

        return {
          symbol: meta.symbol,
          name: meta.name,
          currentPrice: close,
          change24h,
        } satisfies MarketIndex;
      }),
    );

    const parsed = results.flatMap((result) =>
      result.status === "fulfilled" && result.value ? [result.value] : [],
    );

    const order = ["IBOV", "DJI", "SPX", "NDQ", "DAX", "NIKKEI"];
    return parsed.sort(
      (a, b) => order.indexOf(a.symbol) - order.indexOf(b.symbol),
    );
  } catch {
    return [];
  }
}

const CACHE_TTL_MS = 60_000;

let cachedData: PriceApiResponse | null = null;
let cachedAt = 0;
let pendingRequest: Promise<PriceApiResponse> | null = null;

function getPreviousDateIso(baseDateIso: string) {
  const previousDate = new Date(`${baseDateIso}T12:00:00Z`);
  previousDate.setDate(previousDate.getDate() - 1);
  return previousDate.toISOString().slice(0, 10);
}

async function fetchJson<T = JsonObject>(url: string): Promise<T | null> {
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

function toTopMover(coin: MarketCoin): TopMover {
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

async function fetchFrankfurterRate(
  base: "USD" | "EUR" | "JPY" | "GBP" | "CHF",
) {
  const latestResponse = await fetch(
    `https://api.frankfurter.app/latest?from=${base}&to=BRL`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "fujiviewtech-liveprices/1.0",
      },
      next: { revalidate: 60 },
    },
  );

  if (!latestResponse.ok) {
    return null;
  }

  const latestData = (await latestResponse.json()) as FrankfurterResponse;
  const bid = latestData.rates?.BRL;

  if (!bid || !latestData.date) {
    return null;
  }

  const previousDateIso = getPreviousDateIso(latestData.date);
  const previousResponse = await fetch(
    `https://api.frankfurter.app/${previousDateIso}?from=${base}&to=BRL`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "fujiviewtech-liveprices/1.0",
      },
      next: { revalidate: 60 },
    },
  );

  if (!previousResponse.ok) {
    return {
      bid: String(bid),
      pctChange: "0",
    };
  }

  const previousData = (await previousResponse.json()) as FrankfurterResponse;
  const previousBid = previousData.rates?.BRL;

  const pctChange =
    previousBid && previousBid > 0
      ? ((bid - previousBid) / previousBid) * 100
      : 0;

  return {
    bid: String(bid),
    pctChange: pctChange.toFixed(6),
  };
}

async function fetchPriceDataUncached(): Promise<PriceApiResponse> {
  const cgUrl =
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,tether,ripple&vs_currencies=brl&include_24hr_change=true";
  const fiatUrl =
    "https://economia.awesomeapi.com.br/last/USDT-BRL,USD-BRL,EUR-BRL,JPY-BRL,GBP-BRL,CHF-BRL";
  const buildMarketsUrl = (page: number) =>
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&order=market_cap_desc&per_page=250&page=${page}&sparkline=false&price_change_percentage=24h`;

  const [
    cgResult,
    fiatResult,
    marketsPage1Result,
    marketsPage2Result,
    marketsPage3Result,
    marketsPage4Result,
    indicesResult,
  ] = await Promise.allSettled([
    fetchJson(cgUrl),
    fetchJson(fiatUrl),
    fetchJson<MarketCoin[]>(buildMarketsUrl(1)),
    fetchJson<MarketCoin[]>(buildMarketsUrl(2)),
    fetchJson<MarketCoin[]>(buildMarketsUrl(3)),
    fetchJson<MarketCoin[]>(buildMarketsUrl(4)),
    fetchMarketIndices(),
  ]);

  const cgData =
    cgResult.status === "fulfilled" && cgResult.value ? cgResult.value : {};

  let fiatData =
    fiatResult.status === "fulfilled" && fiatResult.value
      ? fiatResult.value
      : {};

  const [usdFallback, eurFallback, jpyFallback, gbpFallback, chfFallback] =
    await Promise.allSettled([
      fetchFrankfurterRate("USD"),
      fetchFrankfurterRate("EUR"),
      fetchFrankfurterRate("JPY"),
      fetchFrankfurterRate("GBP"),
      fetchFrankfurterRate("CHF"),
    ]);

  const hasBid = (keys: string[]) =>
    keys.some((key) => {
      const value = parseFloat(
        ((fiatData as Record<string, { bid?: string }>)?.[key]
          ?.bid as string) || "",
      );
      return !Number.isNaN(value) && value > 0;
    });

  fiatData = {
    ...fiatData,
    ...(!hasBid(["USDBRL", "USDBRLT", "usdbrl", "usdbrlt"]) &&
    usdFallback.status === "fulfilled" &&
    usdFallback.value
      ? { USDBRL: usdFallback.value }
      : {}),
    ...(!hasBid(["EURBRL", "EURBRLT", "eurbrl", "eurbrlt"]) &&
    eurFallback.status === "fulfilled" &&
    eurFallback.value
      ? { EURBRL: eurFallback.value }
      : {}),
    ...(!hasBid(["JPYBRL", "JPYBRLT", "jpybrl", "jpybrlt"]) &&
    jpyFallback.status === "fulfilled" &&
    jpyFallback.value
      ? { JPYBRL: jpyFallback.value }
      : {}),
    ...(!hasBid(["GBPBRL", "GBPBRLT", "gbpbrl", "gbpbrlt"]) &&
    gbpFallback.status === "fulfilled" &&
    gbpFallback.value
      ? { GBPBRL: gbpFallback.value }
      : {}),
    ...(!hasBid(["CHFBRL", "CHFBRLT", "chfbrl", "chfbrlt"]) &&
    chfFallback.status === "fulfilled" &&
    chfFallback.value
      ? { CHFBRL: chfFallback.value }
      : {}),
  };

  const marketsPagesResults = [
    marketsPage1Result,
    marketsPage2Result,
    marketsPage3Result,
    marketsPage4Result,
  ];

  const marketCoins = marketsPagesResults.flatMap((result) =>
    result.status === "fulfilled" && Array.isArray(result.value)
      ? result.value
      : [],
  );

  const rankedMovers = marketCoins
    .filter(
      (coin) =>
        typeof coin.price_change_percentage_24h_in_currency === "number" &&
        Number.isFinite(coin.price_change_percentage_24h_in_currency),
    )
    .map(toTopMover)
    .sort((a, b) => b.change24h - a.change24h);

  const cryptoMarket = Array.from(
    new Map(
      marketCoins.map(toTopMover).map((coin) => [coin.id, coin] as const),
    ).values(),
  ).sort((a, b) => b.marketCap - a.marketCap);

  const indices =
    indicesResult.status === "fulfilled" && Array.isArray(indicesResult.value)
      ? indicesResult.value
      : [];

  return {
    cgData,
    fiatData,
    indices,
    topGainers: rankedMovers.slice(0, 10),
    topLosers: [...rankedMovers].reverse().slice(0, 10),
    topMarketCap: cryptoMarket.slice(0, 10),
  };
}

export async function getPriceApiData(
  forceRefresh = false,
): Promise<PriceApiResponse> {
  const now = Date.now();

  if (!forceRefresh && cachedData && now - cachedAt < CACHE_TTL_MS) {
    return cachedData;
  }

  if (!forceRefresh && pendingRequest) {
    return pendingRequest;
  }

  pendingRequest = fetchPriceDataUncached()
    .then((data) => {
      cachedData = data;
      cachedAt = Date.now();
      return data;
    })
    .finally(() => {
      pendingRequest = null;
    });

  return pendingRequest;
}
