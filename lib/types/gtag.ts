// Tipo global para Google Analytics
type GtagCommand = "config" | "event" | "js" | "set" | "consent";

declare global {
  interface Window {
    gtag?: (command: GtagCommand, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type GTagEventParams = {
  page_category?: string;
  article_category?: string;
  article_slug?: string;
  author?: string;
  content_type?: string;
  afiliado_id?: string;
  product_name?: string;
  value?: number;
  [key: string]: unknown;
};

export {};
