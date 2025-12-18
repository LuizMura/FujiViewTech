"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface HeroContent {
  imageUrl?: string;
  imageAlt?: string;
  badge?: string;
  mainTitle?: string;
  gradientTitle?: string;
  description?: string;
  buttonLink?: string;
  buttonText?: string;
}

interface HeroContextType {
  heroContent: HeroContent;
  setHeroContent: (data: HeroContent) => void;
  topCard: any;
  setTopCard: (data: any) => void;
  bottomCard: any;
  setBottomCard: (data: any) => void;
}

const HeroContext = createContext<HeroContextType | undefined>(undefined);


export const HeroProvider = ({ children }: { children: ReactNode }) => {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    imageUrl: '',
    imageAlt: '',
    badge: '',
    mainTitle: '',
    gradientTitle: '',
    description: '',
    buttonLink: '/',
    buttonText: '',
  });
  const [topCard, setTopCard] = useState<any>(null);
  const [bottomCard, setBottomCard] = useState<any>(null);

  return (
    <HeroContext.Provider value={{ heroContent, setHeroContent, topCard, setTopCard, bottomCard, setBottomCard }}>
      {children}
    </HeroContext.Provider>
  );
};

export const useHero = () => {
  const context = useContext(HeroContext);
  if (!context) {
    throw new Error("useHero deve ser usado dentro de um HeroProvider");
  }
  return context;
};
