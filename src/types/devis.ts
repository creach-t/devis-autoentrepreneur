// Types pour l'application de devis auto-entrepreneur

export interface Entreprise {
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  telephone?: string;
  email?: string;
  siret: string;
  numeroTVA?: string;
  formeJuridique: 'Auto-entrepreneur' | 'EURL' | 'SASU' | 'SAS' | 'SARL';
  activite: string;
}

export interface Client {
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  telephone?: string;
  email?: string;
  siret?: string; // Optionnel pour les particuliers
}

export interface Prestation {
  id: string;
  designation: string;
  quantite: number;
  uniteMesure: 'Heure' | 'Jour' | 'Forfait' | 'Unité';
  prixUnitaireHT: number;
  tauxTVA: 0 | 5.5 | 10 | 20; // Taux principaux en France
  totalHT: number;
}

export interface Conditions {
  validite: number; // en jours
  delaiExecution: string;
  conditionsPaiement: string;
  modalitesPaiement: string[];
  acompte?: {
    pourcentage: number;
    montantHT: number;
  };

  // Mentions légales personnalisées
  mentionsPersonnalisees?: string[];

  // Propriété intellectuelle
  cessionDroitsAuteur?: boolean;
  conservationDroitsMoraux?: boolean;
  utilisationCommerciale?: boolean;
  territoireExploitation?: string;
  dureeExploitation?: string;

  // Clauses de protection
  clauseConfidentialite?: boolean;
  clauseNonConcurrence?: boolean;
  dureeNonConcurrence?: number;

  // Responsabilité et garanties
  limitationResponsabilite?: boolean;
  garantieProfessionnelle?: string;
  assuranceRC?: boolean;

  // Conditions spécifiques
  droitRetractation?: boolean;
  forceExclusive?: boolean;
  livraisonConformite?: string;

  // RGPD et données
  traitementDonnees?: boolean;
  dureeConservation?: string;

  // Résolution litiges
  droidApplicable?: string;
  juridictionCompetente?: string;
}

export interface Totaux {
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  acompteHT?: number;
  acompteTTC?: number;
  resteAPayer?: number;
}

export interface Devis {
  id: string;
  numero: string;
  dateCreation: Date;
  dateValidite: Date;
  statut: 'Brouillon' | 'Envoyé' | 'Accepté' | 'Refusé' | 'Expiré';

  entreprise: Entreprise;
  client: Client;
  prestations: Prestation[];
  conditions: Conditions;
  totaux: Totaux;

  // Champs optionnels
  objet?: string;
  commentaires?: string;

  // Métadonnées
  dateModification: Date;
  version: number;
}

export interface DevisFormData {
  entreprise: Partial<Entreprise>;
  client: Partial<Client>;
  prestations: Prestation[];
  conditions: Partial<Conditions>;
  objet?: string;
  commentaires?: string;
}

// Types pour le localStorage
export interface StorageData {
  devis: Devis[];
  brouillonCourant?: DevisFormData;
  entrepriseParDefaut?: Entreprise;
  conditionsParDefaut?: Conditions;
  mentionsPersonnalisees?: string[];
  dernierNumero: number;
}

// Types pour les hooks
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

// Constantes de validation
export const VALIDATION_RULES = {
  SIRET_LENGTH: 14,
  CODE_POSTAL_REGEX: /^\d{5}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TELEPHONE_REGEX: /^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/,
  MAX_PRESTATIONS: 50,
  MAX_COMMENTAIRES_LENGTH: 1000,
  MIN_PRIX_UNITAIRE: 0.01,
  MAX_PRIX_UNITAIRE: 999999.99
} as const;

// Types pour l'export
export interface ExportOptions {
  format: 'PDF' | 'HTML';
  inclureAcompte: boolean;
  afficherTarifs: boolean;
}

// Types utilitaires
export type DevisStatus = Devis['statut'];
export type UniteMesure = Prestation['uniteMesure'];
export type TauxTVA = Prestation['tauxTVA'];
export type FormeJuridique = Entreprise['formeJuridique'];

// Constantes pour les clauses légales par défaut
export const DEFAULT_CLAUSES_LEGALES: Partial<Conditions> = {
  cessionDroitsAuteur: false,
  conservationDroitsMoraux: true,
  utilisationCommerciale: true,
  territoireExploitation: 'France',
  dureeExploitation: 'Illimitée',
  clauseConfidentialite: true,
  clauseNonConcurrence: false,
  dureeNonConcurrence: 12,
  limitationResponsabilite: true,
  garantieProfessionnelle: '1 an',
  assuranceRC: true,
  droitRetractation: true,
  forceExclusive: false,
  livraisonConformite: '30 jours',
  traitementDonnees: true,
  dureeConservation: '3 ans',
  droidApplicable: 'Droit français',
  juridictionCompetente: 'Tribunaux français'
} as const;

// Types d'aide pour la validation
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Types pour les statistiques
export interface DevisStats {
  total: number;
  brouillons: number;
  envoyes: number;
  acceptes: number;
  refuses: number;
  expires: number;
  chiffreAffaires: number;
  tauxAcceptation: number;
}

// Interface pour la recherche et filtrage
export interface DevisFilters {
  statut?: DevisStatus | 'Tous';
  client?: string;
  dateDebut?: Date;
  dateFin?: Date;
  montantMin?: number;
  montantMax?: number;
}

export interface SearchOptions {
  query: string;
  filters: DevisFilters;
  sortBy: 'date' | 'numero' | 'client' | 'montant';
  sortOrder: 'asc' | 'desc';
}