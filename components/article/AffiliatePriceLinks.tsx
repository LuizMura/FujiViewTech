import Image from "next/image";

type AffiliatePriceLinksProps = {
  label?: string;
  amazonUrl: string;
  mercadoLivreUrl: string;
};

export default function AffiliatePriceLinks({
  label = "Ver Preço",
  amazonUrl,
  mercadoLivreUrl,
}: AffiliatePriceLinksProps) {
  const displayLabel = label === "Ver preco" ? "Ver preço:" : label;
  const hasAmazonUrl = Boolean(amazonUrl?.trim());
  const hasMercadoLivreUrl = Boolean(mercadoLivreUrl?.trim());

  return (
    <div className="not-prose my-5 rounded-xl border border-slate-200 bg-slate-200 px-4 py-2">
      <div className="flex flex-wrap items-center gap-6">
        <p className="inline-flex items-center text-sm font-semibold uppercase tracking-wide text-slate-700">
          {displayLabel}
        </p>

        {hasAmazonUrl && (
          <a
            href={amazonUrl}
            target="_blank"
            rel="nofollow noopener noreferrer sponsored"
            className="inline-flex h-12 w-[132px] items-center justify-center overflow-hidden rounded-xl bg-white shadow-md transition-all hover:opacity-90 hover:shadow-lg"
          >
            <Image
              src="/images/amazon-logo.png"
              alt="Amazon"
              width={132}
              height={40}
              className="h-full w-full rounded-xl object-fill p-1"
            />
          </a>
        )}

        {hasMercadoLivreUrl && (
          <a
            href={mercadoLivreUrl}
            target="_blank"
            rel="nofollow noopener noreferrer sponsored"
            className="inline-flex h-12 w-[132px] items-center justify-center overflow-hidden rounded-xl bg-white shadow-md transition-all hover:opacity-90 hover:shadow-lg"
          >
            <Image
              src="/images/mercadolivre-logo2.png"
              alt="Mercado Livre"
              width={132}
              height={40}
              className="h-full w-full rounded-xl object-fill"
            />
          </a>
        )}
      </div>
    </div>
  );
}
