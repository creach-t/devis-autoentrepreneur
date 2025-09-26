import { useState, useEffect, useCallback } from 'react';
import type { UseLocalStorageReturn } from '../types/devis';

/**
 * Hook personnalisé pour gérer localStorage avec React
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  // State pour stocker la valeur
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Erreur lecture localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Fonction pour mettre à jour la valeur
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erreur sauvegarde localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Fonction pour supprimer la valeur
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Erreur suppression localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue
  };
}

/**
 * Hook pour auto-sauvegarder un formulaire
 */
export function useAutoSave<T>(
  key: string,
  data: T,
  delay: number = 1000
): void {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.warn(`Auto-save failed for key "${key}":`, error);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [key, data, delay]);
}

/**
 * Hook pour détecter les changements localStorage d'autres onglets
 */
export function useStorageListener(
  key: string,
  callback: (newValue: string | null) => void
): void {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        callback(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, callback]);
}