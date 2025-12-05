"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface HeroContent {
  badge: string;
  mainTitle: string;
  gradientTitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  imageAlt: string;
}

export interface CardContent {
  category: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  link: string;
  categoryColor: "sky" | "emerald";
}

interface HeroContextType {
  heroContent: HeroContent;
  topCard: CardContent;
  bottomCard: CardContent;
  updateHeroContent: (content: Partial<HeroContent>) => void;
  updateTopCard: (content: Partial<CardContent>) => void;
  updateBottomCard: (content: Partial<CardContent>) => void;
  saveAll: (
    hero: HeroContent,
    top: CardContent,
    bottom: CardContent
  ) => Promise<void>;
  refreshData: () => Promise<void>;
  isSaving: boolean;
  saveError: string | null;
}

const defaultHeroContent: HeroContent = {
  badge: "Destaque da Semana",
  mainTitle: "Os 10 celulares mais vendidos",
  gradientTitle: "no Brasil em 2025",
  description:
    "Descubra quais smartphones dominam as vendas e nossa análise honesta sobre quais REALMENTE valem a pena comprar.",
  buttonText: "Ver Matéria Completa",
  buttonLink: "/reviews/celulares-mais-vendidos-brasil-2025",
  imageUrl: "/images/bestselling-phones-brazil.jpg",
  imageAlt: "Celulares Mais Vendidos Brasil 2025",
};

const defaultTopCard: CardContent = {
  category: "Notícia",
  title: "Apple Vision Pro 2 é lançado — o que mudou?",
  imageUrl: "/images/posts/visionpro2.jpg",
  imageAlt: "Apple Vision Pro 2",
  link: "/noticias/apple-vision-pro-2-lancamento",
  categoryColor: "sky",
};

const defaultBottomCard: CardContent = {
  category: "Tutorial",
  title: "10 dicas para aumentar a vida útil do seu smartphone",
  imageUrl: "/images/posts/dicas-smartphone.jpg",
  imageAlt: "Dicas Smartphone",
  link: "/tutoriais/como-aumentar-vida-util-do-seu-smartphone",
  categoryColor: "emerald",
};

const HeroContext = createContext<HeroContextType | undefined>(undefined);

export function HeroProvider({ children }: { children: React.ReactNode }) {
  const [heroContent, setHeroContent] =
    useState<HeroContent>(defaultHeroContent);
  const [topCard, setTopCard] = useState<CardContent>(defaultTopCard);
  const [bottomCard, setBottomCard] = useState<CardContent>(defaultBottomCard);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega dados salvos ao montar o componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch("/api/hero");
      const data = await response.json();

      if (data.heroContent) setHeroContent(data.heroContent);
      if (data.topCard) setTopCard(data.topCard);
      if (data.bottomCard) setBottomCard(data.bottomCard);

      setIsLoaded(true);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setIsLoaded(true);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const saveToServer = async (
    newHeroContent: HeroContent,
    newTopCard: CardContent,
    newBottomCard: CardContent
  ) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch("/api/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroContent: newHeroContent,
          topCard: newTopCard,
          bottomCard: newBottomCard,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar dados");
      }

      console.log("✅ Dados salvos com sucesso!");
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Erro desconhecido";
      setSaveError(errorMsg);
      console.error("❌ Erro ao salvar:", errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const updateHeroContent = (content: Partial<HeroContent>) => {
    setHeroContent((prev) => {
      const updated = { ...prev, ...content };
      saveToServer(updated, topCard, bottomCard);
      return updated;
    });
  };

  const updateTopCard = (content: Partial<CardContent>) => {
    setTopCard((prev) => {
      const updated = { ...prev, ...content };
      saveToServer(heroContent, updated, bottomCard);
      return updated;
    });
  };

  const updateBottomCard = (content: Partial<CardContent>) => {
    setBottomCard((prev) => {
      const updated = { ...prev, ...content };
      saveToServer(heroContent, topCard, updated);
      return updated;
    });
  };

  const saveAll = async (
    hero: HeroContent,
    top: CardContent,
    bottom: CardContent
  ) => {
    setHeroContent(hero);
    setTopCard(top);
    setBottomCard(bottom);
    await saveToServer(hero, top, bottom);
  };

  return (
    <HeroContext.Provider
      value={{
        heroContent,
        topCard,
        bottomCard,
        updateHeroContent,
        updateTopCard,
        updateBottomCard,
        saveAll,
        refreshData,
        isSaving,
        saveError,
      }}
    >
      {children}
    </HeroContext.Provider>
  );
}

export function useHero() {
  const context = useContext(HeroContext);
  if (!context) {
    throw new Error("useHero must be used within HeroProvider");
  }
  return context;
}
