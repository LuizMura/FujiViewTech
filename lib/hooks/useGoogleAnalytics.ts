"use client";

import { useCallback } from "react";
import type { GTagEventParams } from "@/lib/types/gtag";

/**
 * Hook para rastreamento de eventos no Google Analytics
 * Reutilizável em qualquer componente cliente
 */
export function useGoogleAnalytics() {
  const trackEvent = useCallback(
    (eventName: string, eventParams: GTagEventParams = {}) => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", eventName, eventParams);
      }
    },
    [],
  );

  // Eventos específicos pré-configurados
  const trackArticleClick = useCallback(
    (articleSlug: string, articleCategory: string, author: string) => {
      trackEvent("article_click", {
        content_type: "artigo",
        article_slug: articleSlug,
        article_category: articleCategory,
        author: author,
      });
    },
    [trackEvent],
  );

  const trackArticleReadComplete = useCallback(
    (articleSlug: string, readTime: number) => {
      trackEvent("article_read_complete", {
        article_slug: articleSlug,
        read_time: readTime,
        content_type: "artigo",
      });
    },
    [trackEvent],
  );

  const trackAfiliadoClick = useCallback(
    (afiliadoId: string, productName: string, afiliadoName?: string) => {
      trackEvent("afiliado_click", {
        afiliado_id: afiliadoId,
        product_name: productName,
        afiliado_name: afiliadoName,
        value: 1,
      });
    },
    [trackEvent],
  );

  const trackSearch = useCallback(
    (searchTerm: string) => {
      trackEvent("search", {
        search_term: searchTerm,
      });
    },
    [trackEvent],
  );

  const trackShare = useCallback(
    (articleSlug: string, platform: string) => {
      trackEvent("share_article", {
        article_slug: articleSlug,
        platform: platform,
      });
    },
    [trackEvent],
  );

  const trackCategoryView = useCallback(
    (categorySlug: string, categoryName: string) => {
      trackEvent("category_view", {
        page_category: categorySlug,
        category_name: categoryName,
      });
    },
    [trackEvent],
  );

  const trackScroll = useCallback(
    (scrollPercent: number, articleSlug?: string) => {
      trackEvent("scroll_depth", {
        scroll_percent: Math.round(scrollPercent),
        article_slug: articleSlug,
      });
    },
    [trackEvent],
  );

  return {
    trackEvent,
    trackArticleClick,
    trackArticleReadComplete,
    trackAfiliadoClick,
    trackSearch,
    trackShare,
    trackCategoryView,
    trackScroll,
  };
}
