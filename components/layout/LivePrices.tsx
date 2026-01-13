"use client";
import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface PriceData {
  btc: number;
  eth: number;
  bnb: number;
  sol: number;
  usdt: number;
  usd: number;
  eur: number;
}

interface PriceChange {
  btc: number;
  eth: number;
  bnb: number;
  sol: number;
  usdt: number;
  usd: number;
  eur: number;
}

export default function LivePrices() {
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [changes, setChanges] = useState<PriceChange | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Fetch all prices from AwesomeAPI
        const response = await fetch(
          "https://economia.awesomeapi.com.br/last/BTC-BRL,ETH-BRL,BNB-BRL,SOL-BRL,USDT-BRL,USD-BRL,EUR-BRL",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();

        const newPrices = {
          btc: parseFloat(data.BTCBRL?.bid) || 0,
          eth: parseFloat(data.ETHBRL?.bid) || 0,
          bnb: parseFloat(data.BNBBRL?.bid) || 0,
          sol: parseFloat(data.SOLBRL?.bid) || 0,
          usdt: parseFloat(data.USDTBRL?.bid) || 0,
          usd: parseFloat(data.USDBRL?.bid) || 0,
          eur: parseFloat(data.EURBRL?.bid) || 0,
        };

        const newChanges = {
          btc: parseFloat(data.BTCBRL?.pctChange) || 0,
          eth: parseFloat(data.ETHBRL?.pctChange) || 0,
          bnb: parseFloat(data.BNBBRL?.pctChange) || 0,
          sol: parseFloat(data.SOLBRL?.pctChange) || 0,
          usdt: parseFloat(data.USDTBRL?.pctChange) || 0,
          usd: parseFloat(data.USDBRL?.pctChange) || 0,
          eur: parseFloat(data.EURBRL?.pctChange) || 0,
        };

        setPrices(newPrices);
        setChanges(newChanges);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prices:", error);
        // Set default values on error so component still renders
        setPrices({
          btc: 0,
          eth: 0,
          bnb: 0,
          sol: 0,
          usdt: 0,
          usd: 0,
          eur: 0,
        });
        setChanges({
          btc: 0,
          eth: 0,
          bnb: 0,
          sol: 0,
          usdt: 0,
          usd: 0,
          eur: 0,
        });
        setLoading(false);
      }
    };

    fetchPrices();
    // Update every 60 seconds
    const interval = setInterval(fetchPrices, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-4 text-xs text-slate-600">
        <span className="animate-pulse">Carregando cotações...</span>
      </div>
    );
  }

  if (!prices || !changes) {
    return (
      <div className="flex items-center gap-4 text-xs text-slate-600">
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

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-slate-600";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp size={14} className="text-green-600" />;
    if (change < 0) return <ArrowDown size={14} className="text-red-600" />;
    return null;
  };

  return (
    <div className="flex items-center gap-1 md:gap-2 text- md:text-sm overflow-x-auto scrollbar-hide px-1 md:px-0">
      <span className="hidden md:inline text-slate-300">|</span>

      {/* BTC */}
      <div className="flex items-center gap-1 whitespace-nowrap">
        <span className="font-bold text-slate-900 text-[12px] md:text-sm">
          BTC
        </span>
        <span
          className={`font-semibold text-[12px] md:text-sm ${getChangeColor(
            changes.btc
          )}`}
        >
          {formatPrice(prices.btc, true)}
        </span>
        <span className="hidden md:inline">{getChangeIcon(changes.btc)}</span>
      </div>

      <span className="hidden md:inline text-slate-300">|</span>

      {/* ETH */}
      <div className="flex items-center gap-1 whitespace-nowrap">
        <span className="font-bold text-slate-900 text-[12px] md:text-sm">
          ETH
        </span>
        <span
          className={`font-semibold text-[12px] md:text-sm ${getChangeColor(
            changes.eth
          )}`}
        >
          {formatPrice(prices.eth, true)}
        </span>
        <span className="hidden md:inline">{getChangeIcon(changes.eth)}</span>
      </div>

      <span className="hidden md:inline text-slate-300">|</span>
      <div className="hidden md:flex items-center gap-1 whitespace-nowrap">
        <span className="font-bold text-slate-900 text-sm">BNB</span>
        <span
          className={`font-semibold text-sm ${getChangeColor(changes.bnb)}`}
        >
          {formatPrice(prices.bnb, true)}
        </span>
        <span className="hidden md:inline">{getChangeIcon(changes.bnb)}</span>
      </div>

      <span className="hidden md:inline text-slate-300">|</span>

      {/* SOL */}
      <div className="hidden md:flex items-center gap-1 whitespace-nowrap">
        <span className="font-bold text-slate-900 text-sm">SOL</span>
        <span
          className={`font-semibold text-sm ${getChangeColor(changes.sol)}`}
        >
          {formatPrice(prices.sol, true)}
        </span>
        <span className="hidden md:inline">{getChangeIcon(changes.sol)}</span>
      </div>

      <span className="hidden md:inline text-slate-300">|</span>

      {/* USDT */}
      <div className="hidden md:flex items-center gap-1 whitespace-nowrap">
        <span className="font-bold text-slate-900 text-sm">USDT</span>
        <span
          className={`font-semibold text-sm ${getChangeColor(changes.usdt)}`}
        >
          {formatPrice(prices.usdt)}
        </span>
        <span className="hidden md:inline">{getChangeIcon(changes.usdt)}</span>
      </div>

      <span className="hidden md:inline text-slate-300">|</span>
      <div className="flex items-center gap-1 whitespace-nowrap">
        <span className="font-bold text-slate-900 text-[12px] md:text-sm">
          USD
        </span>
        <span
          className={`font-semibold text-[12px] md:text-sm ${getChangeColor(
            changes.usd
          )}`}
        >
          {formatPrice(prices.usd)}
        </span>
        {getChangeIcon(changes.usd)}
      </div>

      <span className="hidden md:inline text-slate-300">|</span>

      {/* EUR */}
      <div className="flex items-center gap-1 whitespace-nowrap">
        <span className="font-bold text-slate-900 text-[12px] md:text-sm">
          EUR
        </span>
        <span
          className={`font-semibold text-[12px] md:text-sm ${getChangeColor(
            changes.eur
          )}`}
        >
          {formatPrice(prices.eur)}
        </span>
        {getChangeIcon(changes.eur)}
      </div>

      <span className="hidden md:inline text-slate-300">|</span>

      {/* More Prices Link */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          window.open(
            "https://www.binance.com/referral/earn-together/refer2earn-usdc/claim?hl=pt-BR&ref=GRO_28502_CQT0Y&utm_source=default",
            "_blank"
          );
        }}
        className="hidden md:flex items-center gap-1 text-slate-900 hover:text-indigo-600 font-bold whitespace-nowrap transition-colors underline decoration-2 underline-offset-2 cursor-pointer bg-transparent border-0 p-0"
      >
        Ganhe USDC Grátis na Binance →
      </button>
    </div>
  );
}
