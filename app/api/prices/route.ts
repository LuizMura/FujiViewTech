import { NextResponse } from "next/server";
import { getPriceApiData } from "@/lib/markets/prices";

export const revalidate = 60; // cache por 60 segundos
export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await getPriceApiData();

    const hasAnyData =
      Object.keys(data.cgData).length > 0 ||
      Object.keys(data.fiatData).length > 0 ||
      data.indices.length > 0 ||
      data.topGainers.length > 0 ||
      data.topLosers.length > 0 ||
      data.topMarketCap.length > 0;

    if (!hasAnyData) {
      return NextResponse.json(
        {
          error: "Price providers unavailable",
          cgData: {},
          fiatData: {},
          indices: [],
          topGainers: [],
          topLosers: [],
          topMarketCap: [],
        },
        { status: 503 },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching prices:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch prices",
        cgData: {},
        fiatData: {},
        indices: [],
        topGainers: [],
        topLosers: [],
        topMarketCap: [],
      },
      { status: 503 },
    );
  }
}
