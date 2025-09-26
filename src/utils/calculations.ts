import type { Prestation, Totaux, Conditions } from '../types/devis';

/**
 * Arrondit un montant à 2 décimales
 */
export const round = (amount: number): number => {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
};

/**
 * Calcule le total HT d'une prestation
 */
export const calculatePrestationTotal = (prestation: Partial<Prestation>): number => {
  const { quantite = 0, prixUnitaireHT = 0 } = prestation;
  return round(quantite * prixUnitaireHT);
};

/**
 * Calcule la TVA d'une prestation
 */
export const calculatePrestationTVA = (prestation: Prestation): number => {
  const totalHT = prestation.totalHT;
  const tauxTVA = prestation.tauxTVA / 100;
  return round(totalHT * tauxTVA);
};

/**
 * Calcule les totaux d'un devis
 */
export const calculateTotaux = (
  prestations: Prestation[],
  conditions?: Conditions
): Totaux => {
  // Calcul des totaux de base
  const totalHT = prestations.reduce((sum, p) => sum + p.totalHT, 0);
  
  // Calcul TVA par taux pour respecter les règles comptables
  const tvaParTaux = prestations.reduce((acc, p) => {
    const taux = p.tauxTVA;
    const tvaPrestation = calculatePrestationTVA(p);
    acc[taux] = (acc[taux] || 0) + tvaPrestation;
    return acc;
  }, {} as Record<number, number>);
  
  const totalTVA = Object.values(tvaParTaux).reduce((sum, tva) => sum + tva, 0);
  const totalTTC = round(totalHT + totalTVA);
  
  const totaux: Totaux = {
    totalHT: round(totalHT),
    totalTVA: round(totalTVA),
    totalTTC
  };
  
  // Calcul acompte si défini
  if (conditions?.acompte && conditions.acompte.pourcentage > 0) {
    const acompteHT = round(totalHT * (conditions.acompte.pourcentage / 100));
    const acompteTVA = round(totalTVA * (conditions.acompte.pourcentage / 100));
    const acompteTTC = round(acompteHT + acompteTVA);
    
    totaux.acompteHT = acompteHT;
    totaux.acompteTTC = acompteTTC;
    totaux.resteAPayer = round(totalTTC - acompteTTC);
  }
  
  return totaux;
};

/**
 * Met à jour le total d'une prestation
 */
export const updatePrestationTotal = (prestation: Prestation): Prestation => {
  return {
    ...prestation,
    totalHT: calculatePrestationTotal(prestation)
  };
};

/**
 * Valide qu'un montant est positif et dans les limites
 */
export const validateMontant = (montant: number): boolean => {
  return montant >= 0.01 && montant <= 999999.99;
};

/**
 * Formate un montant en euros
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formate un pourcentage
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value / 100);
};

/**
 * Génère un récapitulatif TVA par taux
 */
export const getTVABreakdown = (prestations: Prestation[]) => {
  const breakdown = prestations.reduce((acc, p) => {
    const taux = p.tauxTVA;
    if (!acc[taux]) {
      acc[taux] = {
        taux,
        baseHT: 0,
        montantTVA: 0
      };
    }
    
    acc[taux].baseHT += p.totalHT;
    acc[taux].montantTVA += calculatePrestationTVA(p);
    
    return acc;
  }, {} as Record<number, { taux: number; baseHT: number; montantTVA: number }>);
  
  // Arrondir et trier par taux
  return Object.values(breakdown)
    .map(item => ({
      ...item,
      baseHT: round(item.baseHT),
      montantTVA: round(item.montantTVA)
    }))
    .sort((a, b) => a.taux - b.taux);
};