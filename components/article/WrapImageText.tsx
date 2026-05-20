import React from "react";
import Image from "next/image";

type WrapImageTextProps = {
  src: string;
  url?: string;
  alt?: string;
  side?: "left" | "right";
  width?: number;
  height?: number;
  caption?: string;
  children?: React.ReactNode;
};

export default function WrapImageText({
  src,
  url,
  alt = "Imagem",
  side = "left",
  width = 320,
  height = 200,
  caption,
  children,
}: WrapImageTextProps) {
  const imageSource = url || src;
  const floatClass =
    side === "right" ? "md:float-right md:ml-4" : "md:float-left md:mr-4";

  const normalizedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child) || child.type !== "p") {
      return child;
    }

    const paragraphElement = child as React.ReactElement<{
      children?: React.ReactNode;
      className?: string;
    }>;
    const paragraphChildren = React.Children.toArray(
      paragraphElement.props.children,
    );
    const hasBlockDescendant = paragraphChildren.some((paragraphChild) => {
      if (!React.isValidElement(paragraphChild)) return false;
      if (typeof paragraphChild.type !== "string") return true;

      return [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "div",
        "figure",
        "section",
        "article",
        "ul",
        "ol",
        "p",
      ].includes(paragraphChild.type);
    });

    if (!hasBlockDescendant) {
      return child;
    }

    return (
      <div className={paragraphElement.props.className}>
        {paragraphElement.props.children}
      </div>
    );
  });

  return (
    <div className="my-6">
      <figure className={`${floatClass} mb-3 w-full max-w-[320px]`}>
        <Image
          src={imageSource}
          alt={alt}
          width={width}
          height={height}
          unoptimized
          className="h-auto w-full rounded-lg border border-slate-200 object-cover"
        />
        {caption && (
          <figcaption className="mt-1 text-xs text-slate-500">
            {caption}
          </figcaption>
        )}
      </figure>

      <div className="text-base leading-7 text-slate-800">
        {normalizedChildren}
      </div>
      <div className="clear-both" />
    </div>
  );
}
