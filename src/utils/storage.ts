import type { Devis, DevisFormData, StorageData, Entreprise, Conditions } from '../types/devis';

const STORAGE_KEY = 'devis-app-data';

/**
 * Données par défaut du localStorage
 */
const getDefaultStorageData = (): StorageData => ({
  devis: [],
  dernierNumero: 0,
  brouillonCourant: undefined,
  entrepriseParDefaut: undefined,
  conditionsParDefaut: {
    validite: 30,
    delaiExecution: '2 semaines',
    conditionsPaiement: 'Paiement à 30 jours',
    modalitesPaiement: ['Virement bancaire', 'Chèque'],
  },
  mentionsPersonnalisees: []
});

/**
 * Lecture des données du localStorage
 */
export const getStorageData = (): StorageData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return getDefaultStorageData();
    
    const parsed = JSON.parse(data);
    
    // Conversion des dates string en Date objects
    if (parsed.devis) {
      parsed.devis = parsed.devis.map((devis: any) => ({
        ...devis,
        dateCreation: new Date(devis.dateCreation),
        dateValidite: new Date(devis.dateValidite),
        dateModification: new Date(devis.dateModification)
      }));
    }
    
    return { ...getDefaultStorageData(), ...parsed };
  } catch (error) {
    console.warn('Erreur lecture localStorage:', error);
    return getDefaultStorageData();
  }
};

/**
 * Sauvegarde des données dans localStorage
 */
export const setStorageData = (data: Partial<StorageData>): void => {
  try {
    const current = getStorageData();
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Erreur sauvegarde localStorage:', error);
    // Tentative de nettoyage si quota dépassé
    if (error instanceof DOMException && error.code === 22) {
      cleanOldDevis();
      try {
        const current = getStorageData();
        const updated = { ...current, ...data };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (retryError) {
        console.error('Impossible de sauvegarder même après nettoyage:', retryError);
      }
    }
  }
};

/**
 * Génère le prochain numéro de devis
 */
export const generateNumeroDevis = (): string => {
  const data = getStorageData();
  const nouveauNumero = data.dernierNumero + 1;
  const annee = new Date().getFullYear();
  
  setStorageData({ dernierNumero: nouveauNumero });
  
  return `DEVIS-${annee}-${nouveauNumero.toString().padStart(4, '0')}`;
};

/**
 * Sauvegarde un devis
 */
export const saveDevis = (devis: Devis): void => {
  const data = getStorageData();
  const existingIndex = data.devis.findIndex(d => d.id === devis.id);
  
  if (existingIndex >= 0) {
    data.devis[existingIndex] = devis;
  } else {
    data.devis.push(devis);
  }
  
  setStorageData({ devis: data.devis });
};

/**
 * Supprime un devis
 */
export const deleteDevis = (devisId: string): void => {
  const data = getStorageData();
  const filteredDevis = data.devis.filter(d => d.id !== devisId);
  setStorageData({ devis: filteredDevis });
};

/**
 * Récupère un devis par ID
 */
export const getDevisById = (devisId: string): Devis | undefined => {
  const data = getStorageData();
  return data.devis.find(d => d.id === devisId);
};

/**
 * Récupère tous les devis triés par date
 */
export const getAllDevis = (): Devis[] => {
  const data = getStorageData();
  return data.devis.sort((a, b) => 
    new Date(b.dateModification).getTime() - new Date(a.dateModification).getTime()
  );
};

/**
 * Sauvegarde le brouillon courant
 */
export const saveBrouillon = (brouillon: DevisFormData): void => {
  setStorageData({ brouillonCourant: brouillon });
};

/**
 * Récupère le brouillon courant
 */
export const getBrouillon = (): DevisFormData | undefined => {
  const data = getStorageData();
  return data.brouillonCourant;
};

/**
 * Supprime le brouillon courant
 */
export const clearBrouillon = (): void => {
  setStorageData({ brouillonCourant: undefined });
};

/**
 * Sauvegarde l'entreprise par défaut
 */
export const saveEntrepriseDefaut = (entreprise: Entreprise): void => {
  setStorageData({ entrepriseParDefaut: entreprise });
};

/**
 * Récupère l'entreprise par défaut
 */
export const getEntrepriseDefaut = (): Entreprise | undefined => {
  const data = getStorageData();
  return data.entrepriseParDefaut;
};

/**
 * Sauvegarde les conditions par défaut
 */
export const saveConditionsDefaut = (conditions: Conditions): void => {
  setStorageData({ conditionsParDefaut: conditions });
};

/**
 * Récupère les conditions par défaut
 */
export const getConditionsDefaut = (): Conditions | undefined => {
  const data = getStorageData();
  return data.conditionsParDefaut;
};

/**
 * Sauvegarde les mentions personnalisées
 */
export const saveMentionsPersonnalisees = (mentions: string[]): void => {
  setStorageData({ mentionsPersonnalisees: mentions });
};

/**
 * Récupère les mentions personnalisées
 */
export const getMentionsPersonnalisees = (): string[] => {
  const data = getStorageData();
  return data.mentionsPersonnalisees || [];
};

/**
 * Nettoie les anciens devis pour libérer de l'espace
 */
export const cleanOldDevis = (): void => {
  const data = getStorageData();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  // Garde les 50 plus récents ou ceux de moins de 6 mois
  const recentDevis = data.devis
    .sort((a, b) => new Date(b.dateModification).getTime() - new Date(a.dateModification).getTime())
    .filter((devis, index) => 
      index < 50 || new Date(devis.dateModification) > sixMonthsAgo
    );
  
  setStorageData({ devis: recentDevis });
};

/**
 * Exporte toutes les données en JSON
 */
export const exportData = (): string => {
  const data = getStorageData();
  return JSON.stringify(data, null, 2);
};

/**
 * Importe des données depuis JSON
 */
export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData) as StorageData;
    
    // Validation basique de la structure
    if (!data.devis || !Array.isArray(data.devis)) {
      throw new Error('Structure de données invalide');
    }
    
    setStorageData(data);
    return true;
  } catch (error) {
    console.error('Erreur import données:', error);
    return false;
  }
};

/**
 * Calcule l'espace utilisé dans localStorage
 */
export const getStorageUsage = (): { used: number; percentage: number } => {
  const data = localStorage.getItem(STORAGE_KEY) || '';
  const used = new Blob([data]).size;
  const maxSize = 5 * 1024 * 1024; // 5MB approximatif
  
  return {
    used,
    percentage: Math.round((used / maxSize) * 100)
  };
};