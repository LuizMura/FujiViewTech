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
    <div className="not-prose my-5 rounded-xl border border-slate-200 bg-slate-200 px-4 py-1">
      <div className="flex flex-col">
        <p className="inline-flex items-center text-sm font-semibold uppercase tracking-wide text-slate-700">
          {displayLabel}
        </p>

        <div className="flex flex- justify-center -mt-4 pb-2 items-center gap-4">
          {hasAmazonUrl && (
            <a
              href={amazonUrl}
              target="_blank"
              rel="nofollow noopener noreferrer sponsored"
              className="group inline-flex h-9 w-[132px] items-center justify-center gap-2 rounded-lg bg-white ring-1 ring-gray-300 shadow-lg transition-all hover:opacity-90"
            >
              <Image
                src="/images/amazon-logo.png"
                alt="Amazon"
                width={132}
                height={40}
                className="h-full w-full rounded-lg object-contain p-1 transition-transform duration-200 group-hover:scale-110"
              />
              <span className="sr-only">Ver na Amazon</span>
            </a>
          )}

          {hasMercadoLivreUrl && (
            <a
              href={mercadoLivreUrl}
              target="_blank"
              rel="nofollow noopener noreferrer sponsored"
              className="group inline-flex h-9 w-[132px] items-center justify-center gap-2 rounded-lg bg-[#ffe600] ring-1 ring-gray-300 shadow-lg transition-all hover:opacity-90"
            >
              <Image
                src="/images/mercadolivre-logo2.png"
                alt="Mercado Livre"
                width={132}
                height={40}
                className="h-full w-full rounded-lg object-contain py-1.5 transition-transform duration-200 group-hover:scale-110"
              />
              <span className="sr-only">Ver no Mercado Livre</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
