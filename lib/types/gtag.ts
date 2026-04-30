// Tipo global para Google Analytics
declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
    dataLayer?: any[];
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
  [key: string]: any;
};

export {};
