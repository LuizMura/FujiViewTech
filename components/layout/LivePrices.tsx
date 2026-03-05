"use client";
import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

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

interface PriceChange {
  btc: number;
  eth: number;
  bnb: number;
  xrp: number;
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
        // Busca criptoativos na CoinGecko (em BRL) e câmbio na AwesomeAPI.
        const cgUrl =
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,tether,ripple&vs_currencies=brl&include_24hr_change=true";
        const fiatUrl =
          "https://economia.awesomeapi.com.br/last/USDT-BRL,USD-BRL,EUR-BRL";

        const [cgResp, fiatResp] = await Promise.all([
          fetch(cgUrl, { headers: { Accept: "application/json" } }),
          fetch(fiatUrl, { headers: { Accept: "application/json" } }),
        ]);

        if (!cgResp.ok || !fiatResp.ok) {
          throw new Error("API request failed");
        }

        const cgData = await cgResp.json();
        const fiatData = await fiatResp.json();

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
          usd: parseFloat(fiatData?.USDBRL?.bid) || 0,
          eur: parseFloat(fiatData?.EURBRL?.bid) || 0,
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
          usd: parseFloat(fiatData?.USDBRL?.pctChange) || 0,
          eur: parseFloat(fiatData?.EURBRL?.pctChange) || 0,
        };

        setPrices(newPrices);
        setChanges(newChanges);
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

      {/* Bitcoin */}
      <div className="flex items-center gap-1 whitespace-nowrap">
        <span className="font-bold text-slate-900 text-[12px] md:text-sm">
          BTC
        </span>
        <span
          className={`font-semibold text-[12px] md:text-sm ${getChangeColor(
            changes.btc,
          )}`}
        >
          {formatPrice(prices.btc, true)}
        </span>
        <span className="hidden md:inline">{getChangeIcon(changes.btc)}</span>
      </div>

      <span className="hidden md:inline text-slate-300">|</span>

      {/* Ethereum */}
      <div className="flex items-center gap-1 whitespace-nowrap">
        <span className="font-bold text-slate-900 text-[12px] md:text-sm">
          ETH
        </span>
        <span
          className={`font-semibold text-[12px] md:text-sm ${getChangeColor(
            changes.eth,
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

      {/* Solana */}
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

      {/* Tether */}
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
      <div className="hidden lg:flex items-center gap-1 whitespace-nowrap">
        <span className="font-bold text-slate-900 text-sm">XRP</span>
        <span
          className={`font-semibold text-sm ${getChangeColor(changes.xrp)}`}
        >
          {formatPrice(prices.xrp, true)}
        </span>
        <span className="hidden md:inline">{getChangeIcon(changes.xrp)}</span>
      </div>

      <span className="hidden md:inline text-slate-300">|</span>
      <div className="flex items-center gap-1 whitespace-nowrap">
        <span className="font-bold text-slate-900 text-[12px] md:text-sm">
          USD
        </span>
        <span
          className={`font-semibold text-[12px] md:text-sm ${getChangeColor(
            changes.usd,
          )}`}
        >
          {formatPrice(prices.usd)}
        </span>
        {getChangeIcon(changes.usd)}
      </div>

      <span className="hidden md:inline text-slate-300">|</span>

      {/* Euro */}
      <div className="flex items-center gap-1 whitespace-nowrap">
        <span className="font-bold text-slate-900 text-[12px] md:text-sm">
          EUR
        </span>
        <span
          className={`font-semibold text-[12px] md:text-sm ${getChangeColor(
            changes.eur,
          )}`}
        >
          {formatPrice(prices.eur)}
        </span>
        {getChangeIcon(changes.eur)}
      </div>

      <span className="hidden md:inline text-slate-300">|</span>

      {/* Atalho para oferta da Binance */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          window.open(
            "https://www.binance.com/referral/earn-together/refer2earn-usdc/claim?hl=pt-BR&ref=GRO_28502_CQT0Y&utm_source=default",
            "_blank",
          );
        }}
        className="hidden md:flex items-center gap-1 text-slate-900 hover:text-indigo-600 font-bold whitespace-nowrap transition-colors underline decoration-2 underline-offset-2 cursor-pointer bg-transparent border-0 p-0"
      >
        Ganhe USDC Grátis na Binance →
      </button>
    </div>
  );
}
