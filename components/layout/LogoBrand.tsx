import Image from "next/image";

export default function LogoBrand({ invert = false }: { invert?: boolean }) {
  return (
    <span className="px-4 md:px-0 flex items-center gap-2 group">
      <Image
        src="/images/fujiviewtech-logo.svg"
        alt="FujiviewTech Logo"
        width={60}
        height={60}
        className={`mt-1 transition-transform duration-300 group-hover:scale-110 ${
          invert ? "brightness-0 invert" : ""
        }`}
      />

      <span className="font-black md:font-extrabold text-3xl md:text-4xl tracking-tight text-neutral-900 transition-colors group-hover:text-[#4a7c59]">
        Fujiview<span className="text-[#ac3e3e]">Tech</span>
      </span>
    </span>
  );
}
