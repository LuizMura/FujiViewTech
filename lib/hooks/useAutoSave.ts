"use client";

import { useEffect, useRef } from "react";

interface UseAutoSaveOptions {
  key: string;
  data: unknown;
  delay?: number; // ms para debounce (padrão: 1000ms)
  enabled?: boolean; // permite desabilitar autosave
}

/**
 * Hook para autosave em localStorage com debounce
 * @param key - chave única no localStorage
 * @param data - dados a serem salvos
 * @param delay - delay do debounce em ms (padrão: 1000)
 * @param enabled - habilita/desabilita o autosave (padrão: true)
 */
export function useAutoSave({
  key,
  data,
  delay = 1000,
  enabled = true,
}: UseAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Limpa timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Cria novo timeout para salvar após delay
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`✅ Autosave: ${key}`);
      } catch (error) {
        console.error("Erro ao salvar no localStorage:", error);
      }
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [key, data, delay, enabled]);
}

/**
 * Restaura dados salvos do localStorage
 * @param key - chave no localStorage
 * @returns dados salvos ou null
 */
export function restoreAutoSave<T = unknown>(key: string): T | null {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      console.log(`📦 Restaurando autosave: ${key}`);
      return JSON.parse(saved) as T;
    }
  } catch (error) {
    console.error("Erro ao restaurar do localStorage:", error);
  }
  return null;
}

/**
 * Limpa autosave do localStorage
 * @param key - chave no localStorage
 */
export function clearAutoSave(key: string): void {
  try {
    localStorage.removeItem(key);
    console.log(`🗑️ Autosave limpo: ${key}`);
  } catch (error) {
    console.error("Erro ao limpar localStorage:", error);
  }
}
