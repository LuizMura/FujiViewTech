"use client";

import { useEffect, useState, useRef } from "react";
import { useGoogleAnalytics } from "./useGoogleAnalytics";

interface UseArticleTrackingOptions {
  articleSlug: string;
  readTime?: number;
}

/**
 * Hook para rastreamento completo de artigos
 * - Scroll depth
 * - Tempo de permanência
 * - Leitura completa (>90% scroll)
 */
export function useArticleTracking({
  articleSlug,
  readTime = 5,
}: UseArticleTrackingOptions) {
  const { trackScroll, trackArticleReadComplete } = useGoogleAnalytics();
  const [hasTrackedComplete, setHasTrackedComplete] = useState(false);
  const [lastScrollPercent, setLastScrollPercent] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        // Calcular porcentagem de scroll
        const scrollHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent =
          scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;

        // Rastrear scroll depth em intervalos (a cada 25%)
        const roundedPercent = Math.round(scrollPercent / 25) * 25;
        if (roundedPercent > lastScrollPercent && roundedPercent <= 100) {
          trackScroll(roundedPercent, articleSlug);
          setLastScrollPercent(roundedPercent);
        }

        // Rastrear leitura completa quando passar de 90%
        if (scrollPercent > 90 && !hasTrackedComplete) {
          trackArticleReadComplete(articleSlug, readTime);
          setHasTrackedComplete(true);
        }
      }, 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [
    articleSlug,
    hasTrackedComplete,
    lastScrollPercent,
    trackScroll,
    trackArticleReadComplete,
    readTime,
  ]);

  // Rastrear tempo de permanência no artigo
  useEffect(() => {
    return () => {
      if (startTimeRef.current) {
        const timeOnPage = (Date.now() - startTimeRef.current) / 1000; // em segundos
        window.gtag?.("event", "page_time", {
          article_slug: articleSlug,
          time_on_page: Math.round(timeOnPage),
        });
      }
    };
  }, [articleSlug]);
}
