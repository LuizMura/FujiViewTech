import MarketBoard from "@/components/markets/MarketBoard";
import { getPriceApiData } from "@/lib/markets/prices";

export const metadata = {
  title: "Cotações ao Vivo | FujiViewTech",
  description:
    "Painel completo de mercado com cotações ao vivo, variações de 24h e visão de ativos no FujiViewTech.",
};

export default async function CotacoesPage() {
  const initialData = await getPriceApiData();

  return (
    <main className="container-custom pb-2 md:py-2">
      <section className="mx-auto max-w-6xl -mt-[3rem] md:mt-0">
        <MarketBoard
          initialData={initialData}
          initialUpdatedAt={new Date().toISOString()}
        />
      </section>
    </main>
  );
}
