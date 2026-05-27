"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDot,
  RefreshCcw,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { MarketIndex, PriceApiResponse } from "@/lib/markets/prices";

type MarketCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string | null;
  currentPrice: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
};

type FiatTickerQuote = {
  symbol: string;
  name: string;
  currentPrice: number;
  change24h: number;
};

type MarketBoardProps = {
  initialData?: PriceApiResponse;
  initialUpdatedAt?: string;
};

function formatIndexPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPrice(value: number) {
  return `R$ ${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatChange(change: number) {
  const signal = change > 0 ? "+" : "";
  return `${signal}${change.toFixed(2)}%`;
}

function formatMarketCap(value: number) {
  if (value >= 1_000_000_000_000) {
    return `R$ ${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000_000_000) {
    return `R$ ${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(2)}M`;
  }

  return `R$ ${value.toLocaleString("pt-BR")}`;
}

function buildFiatTickerQuotes(fiatData: unknown): FiatTickerQuote[] {
  const quotes = fiatData as Record<
    string,
    { bid?: string; pctChange?: string }
  >;

  const parseBid = (keys: string[]) => {
    for (const key of keys) {
      const value = parseFloat(quotes?.[key]?.bid ?? "");
      if (!Number.isNaN(value) && value > 0) {
        return value;
      }
    }
    return 0;
  };

  const parseChange = (keys: string[]) => {
    for (const key of keys) {
      const value = parseFloat(quotes?.[key]?.pctChange ?? "");
      if (!Number.isNaN(value)) {
        return value;
      }
    }
    return 0;
  };

  return [
    {
      symbol: "USD",
      name: "Dolar",
      currentPrice: parseBid(["USDBRL", "USDBRLT", "usdbrl", "usdbrlt"]),
      change24h: parseChange(["USDBRL", "USDBRLT", "usdbrl", "usdbrlt"]),
    },
    {
      symbol: "EUR",
      name: "Euro",
      currentPrice: parseBid(["EURBRL", "EURBRLT", "eurbrl", "eurbrlt"]),
      change24h: parseChange(["EURBRL", "EURBRLT", "eurbrl", "eurbrlt"]),
    },
    {
      symbol: "JPY",
      name: "Iene",
      currentPrice: parseBid(["JPYBRL", "JPYBRLT", "jpybrl", "jpybrlt"]),
      change24h: parseChange(["JPYBRL", "JPYBRLT", "jpybrl", "jpybrlt"]),
    },
    {
      symbol: "GBP",
      name: "Libra Esterlina",
      currentPrice: parseBid(["GBPBRL", "GBPBRLT", "gbpbrl", "gbpbrlt"]),
      change24h: parseChange(["GBPBRL", "GBPBRLT", "gbpbrl", "gbpbrlt"]),
    },
    {
      symbol: "CHF",
      name: "Franco Suico",
      currentPrice: parseBid(["CHFBRL", "CHFBRLT", "chfbrl", "chfbrlt"]),
      change24h: parseChange(["CHFBRL", "CHFBRLT", "chfbrl", "chfbrlt"]),
    },
  ].filter((quote) => quote.currentPrice > 0);
}

export default function MarketBoard({
  initialData,
  initialUpdatedAt,
}: MarketBoardProps) {
  const [topGainers, setTopGainers] = useState<MarketCoin[]>(
    initialData?.topGainers ?? [],
  );
  const [topLosers, setTopLosers] = useState<MarketCoin[]>(
    initialData?.topLosers ?? [],
  );
  const [topMarketCap, setTopMarketCap] = useState<MarketCoin[]>(
    initialData?.topMarketCap ?? [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<MarketCoin[]>([]);
  const [indices, setIndices] = useState<MarketIndex[]>(
    initialData?.indices ?? [],
  );
  const [fiatTicker, setFiatTicker] = useState<FiatTickerQuote[]>(
    buildFiatTickerQuotes(initialData?.fiatData),
  );
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(!initialData);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    initialUpdatedAt ? new Date(initialUpdatedAt) : null,
  );

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/prices", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Falha ao obter cotacoes");
        }

        const { topGainers, topLosers, topMarketCap, fiatData, indices } =
          await response.json();

        setTopGainers(Array.isArray(topGainers) ? topGainers : []);
        setTopLosers(Array.isArray(topLosers) ? topLosers : []);
        setTopMarketCap(Array.isArray(topMarketCap) ? topMarketCap : []);
        setFiatTicker(buildFiatTickerQuotes(fiatData));
        setIndices(Array.isArray(indices) ? indices : []);
      } catch {
        // Mantém os últimos dados válidos para evitar tela vazia em falhas temporárias.
      } finally {
        setLastUpdated(new Date());
        setLoading(false);
      }
    };

    if (!initialData) {
      fetchPrices();
    }

    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [initialData]);

  useEffect(() => {
    const normalized = searchTerm.trim();

    if (normalized.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const response = await fetch(
          `/api/prices/search?q=${encodeURIComponent(normalized)}`,
          { signal: controller.signal, cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Falha ao buscar cripto");
        }

        const { results } = await response.json();
        setSearchResults(Array.isArray(results) ? results : []);
      } catch {
        if (!controller.signal.aborted) {
          setSearchResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearchLoading(false);
        }
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const topTenCoins = useMemo(() => topMarketCap.slice(0, 10), [topMarketCap]);

  const updatedLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--:--:--";

  return (
    <div className="-mt-1 md:-mt-3 relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.95)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_90%_5%,rgba(59,130,246,0.15),transparent_35%),linear-gradient(to_bottom,transparent,rgba(2,6,23,0.8))]" />

      <div className="relative border-b border-slate-800/90 px-2 py-4 md:px-6">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3 px-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
              Painel de mercado
            </p>
            <h2 className="text-2xl font-black tracking-tight md:text-3xl">
              Central de Cotações
            </h2>
          </div>

          <div className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-300">
            Atualizado as {updatedLabel}
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-200">
            Principais moedas fiat
          </p>
          {fiatTicker.length > 0 ? (
            <>
              <div className="md:hidden overflow-x-auto scrollbar-hide">
                <div className="flex snap-x snap-mandatory gap-2 ">
                  {fiatTicker.map((coin) => {
                    const positive = coin.change24h >= 0;

                    return (
                      <div
                        key={coin.symbol}
                        className="min-w-[122px] shrink-0 snap-start rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-1 "
                      >
                        {/* Nome */}
                        <p className="text-[9px] uppercase tracking-[0.1em] text-slate-500 truncate">
                          {coin.name}
                        </p>

                        {/* Símbolo + variação */}
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-sm font-black text-slate-100">
                            {coin.symbol}
                          </span>

                          <span
                            className={`flex items-center gap-0.5 text-[10px] font-semibold ${
                              positive ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {positive ? (
                              <ArrowUpRight size={12} />
                            ) : (
                              <ArrowDownRight size={12} />
                            )}
                            {formatChange(coin.change24h)}
                          </span>
                        </div>

                        {/* Preço */}
                        <p className="mt-1 text-xs font-semibold text-slate-200">
                          {formatPrice(coin.currentPrice)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="hidden md:flex md:flex-wrap md:items-center md:gap-3 md:px-4 md:py-2">
                {fiatTicker.map((coin) => {
                  const positive = coin.change24h >= 0;

                  return (
                    <div
                      key={coin.symbol}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-3 py-1"
                      title={coin.name}
                    >
                      <span className="text-[11px] font-bold uppercase text-slate-200">
                        {coin.symbol}
                      </span>
                      <span className="text-xs text-slate-300">
                        {formatPrice(coin.currentPrice)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs font-semibold ${positive ? "text-emerald-400" : "text-rose-400"}`}
                      >
                        {positive ? (
                          <ArrowUpRight size={12} />
                        ) : (
                          <ArrowDownRight size={12} />
                        )}
                        {formatChange(coin.change24h)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="px-4 py-2 text-xs text-slate-500">
              Cotações fiat temporariamente indisponíveis.
            </div>
          )}
        </div>

        <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-200">
            Principais bolsas
          </p>

          {indices.length > 0 ? (
            <>
              <div className="md:hidden -mx-1 overflow-x-auto scrollbar-hide">
                <div className="flex snap-x snap-mandatory gap-2 px-1 pb-1">
                  {indices.map((indexItem) => {
                    const positive = indexItem.change24h >= 0;

                    return (
                      <div
                        key={indexItem.symbol}
                        className="min-w-[136px] snap-start rounded-xl border border-slate-800 bg-slate-950/70 px-2.5 py-2"
                      >
                        <p className="truncate text-[11px] font-semibold text-slate-100">
                          {indexItem.name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {indexItem.symbol}
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-200">
                            {formatIndexPrice(indexItem.currentPrice)}
                          </p>
                          <p
                            className={`text-[11px] font-semibold ${positive ? "text-emerald-400" : "text-rose-400"}`}
                          >
                            {formatChange(indexItem.change24h)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="hidden md:grid md:grid-cols-1 md:gap-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {indices.map((indexItem) => {
                  const positive = indexItem.change24h >= 0;

                  return (
                    <div
                      key={indexItem.symbol}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/70 px-2 py-1.5"
                    >
                      <div>
                        <p
                          className="max-w-[92px] truncate text-[11px] font-semibold leading-tight text-slate-100"
                          title={indexItem.name}
                        >
                          {indexItem.name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {indexItem.symbol}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] font-semibold text-slate-200">
                          {formatIndexPrice(indexItem.currentPrice)}
                        </p>
                        <p
                          className={`text-[11px] font-semibold ${positive ? "text-emerald-400" : "text-rose-400"}`}
                        >
                          {formatChange(indexItem.change24h)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500">
              Índices temporariamente indisponíveis.
            </p>
          )}
        </div>
      </div>

      <div className="relative grid gap-4 p-2 md:grid-cols-12 md:gap-6 md:p-6">
        <aside className="md:col-span-5 md:order-2">
          <div className="grid grid-cols-2 gap-2 md:max-w-none md:gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 md:p-4">
              <div className="mb-2 flex items-center gap-1.5 text-slate-300 md:mb-3 md:gap-2">
                <TrendingUp size={14} className="text-emerald-400" />
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] md:text-xs md:tracking-[0.12em]">
                  Top altas
                </p>
              </div>
              <div className="space-y-1.5 md:space-y-2">
                {topGainers.slice(0, 10).map((coin) => (
                  <div
                    key={coin.id}
                    className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/70 px-2 py-1.5 md:gap-2 md:px-3 md:py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold md:text-sm">
                        {coin.symbol}
                      </span>
                      <p
                        className="truncate text-[10px] text-slate-500 md:text-[11px]"
                        title={coin.name}
                      >
                        {coin.name}
                      </p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap text-xs font-bold text-emerald-400 md:text-sm">
                      {formatChange(coin.change24h)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 md:p-4">
              <div className="mb-2 flex items-center gap-1.5 text-slate-300 md:mb-3 md:gap-2">
                <TrendingDown size={14} className="text-rose-400" />
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] md:text-xs md:tracking-[0.12em]">
                  Top baixas
                </p>
              </div>
              <div className="space-y-1.5 md:space-y-2">
                {topLosers.slice(0, 10).map((coin) => (
                  <div
                    key={coin.id}
                    className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/70 px-2 py-1.5 md:gap-2 md:px-3 md:py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold md:text-sm">
                        {coin.symbol}
                      </span>
                      <p
                        className="truncate text-[10px] text-slate-500 md:text-[11px]"
                        title={coin.name}
                      >
                        {coin.name}
                      </p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap text-xs font-bold text-rose-400 md:text-sm">
                      {formatChange(coin.change24h)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="md:col-span-7 md:order-1 rounded-xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate00">
              Top 10 Criptos
            </h3>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <RefreshCcw size={12} />
              por market cap
            </span>
          </div>

          <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <label className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
              <Search size={12} />
              Buscar criptos
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Digite nome ou simbolo"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-slate-500"
            />

            {(searchLoading ||
              searchResults.length > 0 ||
              searchTerm.trim().length >= 2) && (
              <div className="mt-3 space-y-2">
                {searchLoading && (
                  <p className="text-xs text-slate-500">Buscando ativos...</p>
                )}

                {!searchLoading &&
                  searchResults.length === 0 &&
                  searchTerm.trim().length >= 2 && (
                    <p className="text-xs text-slate-500">
                      Nenhum ativo encontrado.
                    </p>
                  )}

                {!searchLoading &&
                  searchResults.map((coin) => {
                    const positive = coin.change24h >= 0;

                    return (
                      <div
                        key={coin.id}
                        className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          {coin.image ? (
                            <img
                              src={coin.image}
                              alt={coin.symbol}
                              className="h-6 w-6 rounded-full border border-slate-700 bg-slate-950"
                              loading="lazy"
                            />
                          ) : (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-[10px] font-bold uppercase">
                              {coin.symbol.slice(0, 2)}
                            </span>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-slate-100">
                              {coin.symbol}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {coin.name}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-100">
                            {formatPrice(coin.currentPrice)}
                          </p>
                          <p
                            className={`text-xs font-semibold ${positive ? "text-emerald-400" : "text-rose-400"}`}
                          >
                            {formatChange(coin.change24h)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          <div className="space-y-2 md:hidden">
            {topTenCoins.map((coin) => {
              const positive = coin.change24h >= 0;

              return (
                <div
                  key={`mobile-${coin.id}`}
                  className="rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      {coin.image ? (
                        <img
                          src={coin.image}
                          alt={coin.symbol}
                          className="h-6 w-6 rounded-full border border-slate-700 bg-slate-950"
                          loading="lazy"
                        />
                      ) : (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-[10px] font-bold uppercase">
                          {coin.symbol.slice(0, 2)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-100">
                          {coin.symbol}
                        </p>
                        <p className="truncate text-[10px] text-slate-500">
                          {coin.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-100">
                        {formatPrice(coin.currentPrice)}
                      </p>
                      <p
                        className={`text-[11px] font-semibold ${positive ? "text-emerald-400" : "text-rose-400"}`}
                      >
                        {formatChange(coin.change24h)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Market Cap</span>
                    <span className="font-semibold text-slate-300">
                      {formatMarketCap(coin.marketCap)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-2 py-2 font-semibold">Ativo</th>
                  <th className="px-2 py-2 text-right font-semibold">
                    Market Cap
                  </th>
                  <th className="px-2 py-2 text-right font-semibold">Preço</th>
                  <th className="px-2 py-2 text-right font-semibold">24h</th>
                </tr>
              </thead>
              <tbody>
                {topTenCoins.map((coin) => {
                  const positive = coin.change24h >= 0;
                  const intensity = Math.min(Math.abs(coin.change24h) * 8, 100);

                  return (
                    <tr
                      key={coin.id}
                      className="border-b border-slate-900/80 text-sm hover:bg-slate-800/35"
                    >
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2">
                          {coin.image ? (
                            <img
                              src={coin.image}
                              alt={coin.symbol}
                              className="h-7 w-7 rounded-full border border-slate-700 bg-slate-950"
                              loading="lazy"
                            />
                          ) : (
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-[10px] font-bold uppercase">
                              {coin.symbol.slice(0, 2)}
                            </span>
                          )}
                          <div>
                            <p className="font-semibold text-slate-100">
                              {coin.symbol}
                            </p>
                            <p className="text-xs text-slate-400">
                              {coin.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-right font-semibold text-slate-100">
                        {formatMarketCap(coin.marketCap)}
                      </td>
                      <td className="px-2 py-3 text-right font-semibold text-slate-100">
                        {formatPrice(coin.currentPrice)}
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                              positive
                                ? "bg-emerald-500/15 text-emerald-300"
                                : "bg-rose-500/15 text-rose-300"
                            }`}
                          >
                            {positive ? (
                              <ArrowUpRight size={12} />
                            ) : (
                              <ArrowDownRight size={12} />
                            )}
                            {formatChange(coin.change24h)}
                          </span>
                          <span className="h-2 w-20 overflow-hidden rounded-full bg-slate-800">
                            <span
                              className={`block h-full ${positive ? "bg-emerald-400" : "bg-rose-400"}`}
                              style={{ width: `${Math.max(intensity, 4)}%` }}
                            />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="relative border-t border-slate-800 px-4 py-3 text-xs text-slate-400 md:px-6">
        <span className="inline-flex items-center gap-1">
          <CircleDot
            size={10}
            className={
              loading ? "animate-pulse text-amber-400" : "text-emerald-400"
            }
          />
          {loading ? "Sincronizando feed..." : "Feed conectado"}
        </span>
      </div>
    </div>
  );
}
