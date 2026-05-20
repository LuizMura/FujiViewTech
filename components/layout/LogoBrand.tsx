import Image from "next/image";

export default function LogoBrand({ size = 300 }: { size?: number }) {
  return (
    <span className="px-4 md:px-0 flex items-center gap-2 group">
      <Image
        src="/images/ft-logo.png"
        alt="FujiviewTech Logo"
        width={size}
        height={size}
        className="mt-1 transition-transform duration-300 group-hover:scale-110"
      />
    </span>
  );
}
