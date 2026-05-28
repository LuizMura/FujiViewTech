"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface PriceData {
  btc: number;
  eth: number;
  bnb: number;
  xrp: number;
  sol: number;
  usdt: number;
  usd: number;
  eur: number;
}

type PriceChange = PriceData;

type QuoteConfig = {
  key: keyof PriceData;
  label: string;
  kind: "crypto" | "fiat";
};

const quoteConfig: QuoteConfig[] = [
  { key: "btc", label: "Bitcoin", kind: "crypto" },
  { key: "eth", label: "Ethereum", kind: "crypto" },
  { key: "sol", label: "Solana", kind: "crypto" },
  { key: "bnb", label: "BNB", kind: "crypto" },
  { key: "xrp", label: "XRP", kind: "crypto" },
  { key: "usd", label: "Dolar", kind: "fiat" },
  { key: "eur", label: "Euro", kind: "fiat" },
  { key: "usdt", label: "USDT", kind: "fiat" },
];

type LivePricesProps = {
  clickable?: boolean;
};

export default function LivePrices({ clickable = true }: LivePricesProps) {
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [changes, setChanges] = useState<PriceChange | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const resp = await fetch("/api/prices");
        if (!resp.ok) throw new Error("API request failed");
        const { cgData, fiatData } = await resp.json();

        const fiatQuotes = fiatData as Record<
          string,
          { bid?: string; pctChange?: string }
        >;
        const parseFiatBid = (keys: string[]) => {
          for (const key of keys) {
            const value = parseFloat(fiatQuotes?.[key]?.bid ?? "");
            if (!Number.isNaN(value) && value > 0) return value;
          }
          return 0;
        };
        const parseFiatChange = (keys: string[]) => {
          for (const key of keys) {
            const value = parseFloat(fiatQuotes?.[key]?.pctChange ?? "");
            if (!Number.isNaN(value)) return value;
          }
          return 0;
        };

        const newPrices = {
          btc: parseFloat(cgData?.bitcoin?.brl) || 0,
          eth: parseFloat(cgData?.ethereum?.brl) || 0,
          bnb: parseFloat(cgData?.binancecoin?.brl) || 0,
          sol: parseFloat(cgData?.solana?.brl) || 0,
          xrp: parseFloat(cgData?.ripple?.brl) || 0,
          // Prioriza USDT da AwesomeAPI; se falhar, usa o valor da CoinGecko.
          usdt:
            parseFloat(fiatData?.USDTBRL?.bid) ||
            parseFloat(cgData?.tether?.brl) ||
            0,
          usd: parseFiatBid(["USDBRL", "USDBRLT", "usdbrl", "usdbrlt"]),
          eur: parseFiatBid(["EURBRL", "EURBRLT", "eurbrl", "eurbrlt"]),
        };

        // A variação de 24h da CoinGecko vem no campo brl_24h_change.
        const newChanges = {
          btc: parseFloat(cgData?.bitcoin?.brl_24h_change) || 0,
          eth: parseFloat(cgData?.ethereum?.brl_24h_change) || 0,
          bnb: parseFloat(cgData?.binancecoin?.brl_24h_change) || 0,
          sol: parseFloat(cgData?.solana?.brl_24h_change) || 0,
          xrp: parseFloat(cgData?.ripple?.brl_24h_change) || 0,
          usdt:
            parseFloat(fiatData?.USDTBRL?.pctChange) ||
            parseFloat(cgData?.tether?.brl_24h_change) ||
            0,
          // Para moedas fiat, usamos o pctChange retornado pela AwesomeAPI.
          usd: parseFiatChange(["USDBRL", "USDBRLT", "usdbrl", "usdbrlt"]),
          eur: parseFiatChange(["EURBRL", "EURBRLT", "eurbrl", "eurbrlt"]),
        };

        setPrices(newPrices);
        setChanges(newChanges);
        setLastUpdated(new Date());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prices:", error);
        // Mantém o componente renderizável mesmo em falha de API.
        setPrices({
          btc: 0,
          eth: 0,
          bnb: 0,
          xrp: 0,
          sol: 0,
          usdt: 0,
          usd: 0,
          eur: 0,
        });
        setChanges({
          btc: 0,
          eth: 0,
          bnb: 0,
          xrp: 0,
          sol: 0,
          usdt: 0,
          usd: 0,
          eur: 0,
        });
        setLastUpdated(new Date());
        setLoading(false);
      }
    };

    fetchPrices();
    // Atualiza os valores a cada 60 segundos.
    const interval = setInterval(fetchPrices, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-white/90 p-4 text-xs text-slate-600 shadow-sm">
        <span className="animate-pulse">Carregando cotações...</span>
      </div>
    );
  }

  if (!prices || !changes) {
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-white/90 p-4 text-xs text-slate-600 shadow-sm">
        <span>Cotações temporariamente indisponíveis</span>
      </div>
    );
  }

  const formatPrice = (value: number, isCrypto: boolean = false) => {
    if (isCrypto && value > 1000) {
      return `R$ ${value.toLocaleString("pt-BR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    }
    return `R$ ${value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getChangeTone = (change: number) => {
    if (change > 0) {
      return {
        text: "text-emerald-600",
        bg: "bg-emerald-50 border-emerald-200",
        icon: <ArrowUpRight size={14} className="text-emerald-600" />,
      };
    }
    if (change < 0) {
      return {
        text: "text-rose-600",
        bg: "bg-rose-50 border-rose-200",
        icon: <ArrowDownRight size={14} className="text-rose-600" />,
      };
    }
    return {
      text: "text-slate-600",
      bg: "bg-slate-100 border-slate-200",
      icon: <Activity size={14} className="text-slate-500" />,
    };
  };

  const getMobilePriceTone = (change: number) => {
    if (change > 0) {
      return {
        text: "text-emerald-600",
      };
    }
    if (change < 0) {
      return {
        text: "text-rose-600",
      };
    }
    return {
      text: "text-slate-700",
    };
  };

  const desktopQuotes = quoteConfig;
  const mobileQuotes = ["btc", "eth", "usd", "eur"] as Array<keyof PriceData>;

  const updatedLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

  const cardContent = (
    <>
      <div className="md:hidden flex items-center gap-1 overflow-x-auto whitespace-nowrap px-1 py-1 text-xs scrollbar-hide">
        {mobileQuotes.map((symbol, index) => {
          const change = changes[symbol];
          const mobileTone = getMobilePriceTone(change);
          const isCrypto =
            symbol !== "usd" && symbol !== "eur" && symbol !== "usdt";

          return (
            <div key={symbol} className="inline-flex items-center gap-1.5">
              <span className="font-bold uppercase text-slate-900">
                {symbol}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 font-semibold ${mobileTone.text}`}
              >
                {formatPrice(prices[symbol], isCrypto)}
              </span>
              {index < mobileQuotes.length - 1 && (
                <span className="text-slate-300">|</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="hidden md:block rounded-sm border border-slate-200 bg-[radial-gradient(circle_at_top_right,_#f0f9ff_0%,_#ffffff_45%,_#f8fafc_100%)] p-4 shadow-xl ring-1 ring-slate-900/5">
        <div className="mb-2">
          <div>
            <p className="text-[14px] uppercase tracking-[0.2em] text-slate-500">
              COTAÇÕES
            </p>
            <p className="text-[14px] text-slate-500 text-right pr-2">
              Atualizado as {updatedLabel}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {desktopQuotes.map((quote) => {
            const value = prices[quote.key];
            const change = changes[quote.key];
            const tone = getChangeTone(change);
            const isCrypto = quote.kind === "crypto";

            return (
              <div key={quote.key} className="rounded-sm bg-white/90 ">
                <div className="grid grid-cols-[1fr_auto_auto] border-b border-slate-300/80 p-1 items-center gap-4">
                  <p className="truncate text-[12px] font-bold uppercase tracking-wide text-slate-500">
                    {quote.label}
                  </p>
                  <p className="text-right text-sm font-semibold text-slate-900">
                    {formatPrice(value, isCrypto)}
                  </p>
                  <div
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tone.bg} ${tone.text}`}
                  >
                    {tone.icon}
                    {change.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );

  if (!clickable) {
    return cardContent;
  }

  return (
    <Link
      href="/cotacoes"
      aria-label="Abrir página completa de cotações"
      className="block transition hover:opacity-95"
    >
      {cardContent}
    </Link>
  );
}
