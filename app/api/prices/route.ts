import { NextResponse } from "next/server";

export const revalidate = 60; // cache por 60 segundos
export const runtime = "nodejs";

type JsonObject = Record<string, unknown>;

type FrankfurterResponse = {
  date?: string;
  rates?: Record<string, number>;
};

function getPreviousDateIso(baseDateIso: string) {
  const previousDate = new Date(`${baseDateIso}T12:00:00Z`);
  previousDate.setDate(previousDate.getDate() - 1);
  return previousDate.toISOString().slice(0, 10);
}

async function fetchJson(url: string): Promise<JsonObject | null> {
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

  return (await response.json()) as JsonObject;
}

async function fetchFrankfurterRate(base: "USD" | "EUR") {
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

export async function GET() {
  try {
    const cgUrl =
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,tether,ripple&vs_currencies=brl&include_24hr_change=true";
    const fiatUrl =
      "https://economia.awesomeapi.com.br/last/USDT-BRL,USD-BRL,EUR-BRL";

    const [cgResult, fiatResult, usdFallbackResult, eurFallbackResult] =
      await Promise.allSettled([
        fetchJson(cgUrl),
        fetchJson(fiatUrl),
        fetchFrankfurterRate("USD"),
        fetchFrankfurterRate("EUR"),
      ]);

    const cgData =
      cgResult.status === "fulfilled" && cgResult.value ? cgResult.value : {};
    const fiatData =
      fiatResult.status === "fulfilled" && fiatResult.value
        ? fiatResult.value
        : {};

    const usdFallback =
      usdFallbackResult.status === "fulfilled" ? usdFallbackResult.value : null;
    const eurFallback =
      eurFallbackResult.status === "fulfilled" ? eurFallbackResult.value : null;

    const normalizedFiatData = {
      ...fiatData,
      ...(Object.keys(fiatData).length === 0 && usdFallback
        ? { USDBRL: usdFallback }
        : {}),
      ...(Object.keys(fiatData).length === 0 && eurFallback
        ? { EURBRL: eurFallback }
        : {}),
    };

    const hasAnyData =
      Object.keys(cgData).length > 0 ||
      Object.keys(normalizedFiatData).length > 0;

    if (!hasAnyData) {
      return NextResponse.json(
        { error: "Price providers unavailable", cgData: {}, fiatData: {} },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { cgData, fiatData: normalizedFiatData },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch prices", cgData: {}, fiatData: {} },
      { status: 503 },
    );
  }
}
