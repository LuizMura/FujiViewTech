import React from "react";
import Image from "next/image";

const phones = [
  {
    id: 1,
    name: "Samsung Galaxy S25 Ultra",
    image: "/images/phones/galaxy-s25-ultra.png",
    price: "R$ 9.999",
    specs: {
      screen: "6.9' AMOLED 2x 144Hz",
      processor: "Snapdragon 8 Elite for Galaxy",
      camera: "200MP + 50MP + 50MP + 50MP",
      battery: "5500 mAh",
    },
    verdict:
      "O rei do Android retorna com design refinado em titânio e o chip mais rápido do mercado. A S Pen continua sendo um diferencial único.",
  },
  {
    id: 2,
    name: "Apple iPhone 17 Pro Max",
    image: "/images/phones/iphone-17-pro-max.png",
    price: "R$ 11.499",
    specs: {
      screen: "6.9' Super Retina XDR 120Hz",
      processor: "A19 Pro",
      camera: "48MP + 48MP + 48MP",
      battery: "4800 mAh",
    },
    verdict:
      "A Apple finalmente reduz a ilha dinâmica e entrega câmeras de 48MP em todas as lentes. O desempenho do A19 Pro é inigualável.",
  },
  {
    id: 3,
    name: "Xiaomi 15 Ultra",
    image: "/images/phones/xiaomi-15-ultra.png",
    price: "R$ 8.599",
    specs: {
      screen: "6.73' AMOLED LTPO 120Hz",
      processor: "Snapdragon 8 Elite",
      camera: "50MP (1-inch) + 200MP Tele",
      battery: "6000 mAh",
    },
    verdict:
      "Uma besta fotográfica com lentes Leica e um sensor principal de 1 polegada. A bateria de 6000 mAh é um monstro de autonomia.",
  },
  {
    id: 4,
    name: "Google Pixel 10 Pro",
    image: "/images/phones/pixel-10-pro.png",
    price: "R$ 7.999",
    specs: {
      screen: "6.7' OLED LTPO 120Hz",
      processor: "Google Tensor G5",
      camera: "50MP + 48MP + 48MP",
      battery: "5100 mAh",
    },
    verdict:
      "O Pixel mais maduro já feito, com o novo chip Tensor G5 fabricado pela TSMC, resolvendo problemas de aquecimento e bateria.",
  },
  {
    id: 5,
    name: "Samsung Galaxy Z Fold 7",
    image: "/images/phones/galaxy-z-fold-7.png",
    price: "R$ 13.999",
    specs: {
      screen: "7.6' Foldable AMOLED 120Hz",
      processor: "Snapdragon 8 Elite",
      camera: "50MP + 12MP + 10MP",
      battery: "4600 mAh",
    },
    verdict:
      "Mais fino, mais leve e com vinco quase invisível. O Z Fold 7 finalmente entrega a experiência dobrável definitiva.",
  },
  {
    id: 6,
    name: "OnePlus 15",
    image: "/images/phones/oneplus-15.png",
    price: "R$ 6.999",
    specs: {
      screen: "6.82' AMOLED 120Hz",
      processor: "Snapdragon 8 Elite",
      camera: "50MP + 50MP + 64MP",
      battery: "5400 mAh",
    },
    verdict:
      "O matador de flagships voltou. Desempenho de ponta, carregamento ultra-rápido e câmeras Hasselblad por um preço competitivo.",
  },
  {
    id: 7,
    name: "Oppo Find X8 Ultra",
    image: "/images/phones/oppo-find-x8-ultra.png",
    price: "R$ 8.999",
    specs: {
      screen: "6.82' AMOLED 120Hz",
      processor: "Dimensity 9400",
      camera: "Quádrupla 50MP (duas periscópicas)",
      battery: "5500 mAh",
    },
    verdict:
      "O único com duas lentes periscópicas para zoom de qualidade insana em qualquer distância. Construção premium e tela brilhante.",
  },
  {
    id: 8,
    name: "Vivo X200 Pro",
    image: "/images/phones/oppo-find-x8-ultra.png", // Reusing similar image
    price: "R$ 8.299",
    specs: {
      screen: "6.78' AMOLED 120Hz",
      processor: "Dimensity 9400",
      camera: "50MP (1-inch) + 200MP Tele",
      battery: "5600 mAh",
    },
    verdict:
      "A Vivo continua impressionando com suas lentes Zeiss. O modo retrato é possivelmente o melhor do mercado em 2025.",
  },
  {
    id: 9,
    name: "Motorola Edge 60 Ultra",
    image: "/images/phones/xiaomi-15-ultra.png", // Reusing similar image
    price: "R$ 5.999",
    specs: {
      screen: "6.7' pOLED 144Hz",
      processor: "Snapdragon 8s Gen 4",
      camera: "50MP + 50MP + 64MP",
      battery: "5000 mAh",
    },
    verdict:
      "Design elegante com acabamento em madeira ou couro vegano. O carregamento de 150W enche a bateria em minutos.",
  },
  {
    id: 10,
    name: "Sony Xperia 1 VII",
    image: "/images/phones/galaxy-s25-ultra.png", // Reusing similar image
    price: "R$ 8.999",
    specs: {
      screen: "6.5' 4K OLED 120Hz",
      processor: "Snapdragon 8 Elite",
      camera: "48MP + 48MP + 48MP",
      battery: "5000 mAh",
    },
    verdict:
      "Para puristas: tela 4K sem notch, entrada para fone de ouvido e botão dedicado para câmera. Uma ferramenta profissional.",
  },
];

export default function BestPhones2025() {
  return (
    <section className="py-12 bg-slate-50 rounded-3xl mb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 text-sm font-bold uppercase tracking-wider rounded-full mb-4">
            Guia de Compras 2025
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Os 10 Melhores Celulares <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Para Comprar em 2025
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Analisamos os principais lançamentos do ano para ajudar você a
            escolher o smartphone ideal. Confira nossa seleção definitiva.
          </p>
        </div>

        <div className="grid gap-12">
          {phones.map((phone, index) => (
            <div
              key={phone.id}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-8 lg:gap-16 bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-100`}
            >
              {/* Image Section */}
              <div className="w-full lg:w-1/2 relative group">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={phone.image}
                    alt={phone.name}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-lg font-bold text-lg">
                    #{index + 1}
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full lg:w-1/2">
                <div className="flex flex-col h-full justify-center">
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">
                    {phone.name}
                  </h3>
                  <div className="text-2xl font-bold text-indigo-600 mb-6">
                    {phone.price}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                        Tela
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {phone.specs.screen}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                        Processador
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {phone.specs.processor}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                        Câmeras
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {phone.specs.camera}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                        Bateria
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {phone.specs.battery}
                      </p>
                    </div>
                  </div>

                  <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                    <p className="text-slate-700 italic leading-relaxed">
                      &quot;{phone.verdict}&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
