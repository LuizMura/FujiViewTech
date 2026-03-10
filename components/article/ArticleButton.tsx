import React from "react";

type ArticleButtonProps = {
  text?: string;
  url: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
};

export default function ArticleButton({
  text = "",
  url,
  bgColor = "#0284c7",
  textColor = "#ffffff",
  className = "",
}: ArticleButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="nofollow noopener noreferrer sponsored"
      style={{ backgroundColor: bgColor, color: textColor }}
      className={`not-prose inline-flex items-center justify-center px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity ${className}`.trim()}
    >
      {text}
    </a>
  );
}
