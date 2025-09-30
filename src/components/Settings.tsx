import React, { useState, useEffect } from 'react';
import {
  getEntrepriseDefaut,
  saveEntrepriseDefaut,
  getConditionsDefaut,
  saveConditionsDefaut,
  exportData,
  importData,
  getStorageUsage,
  cleanOldDevis
} from '../utils/storage';
import type { Entreprise, Conditions } from '../../types/devis';
import { TabNavigation, type TabId } from './shared/TabNavigation';
import { EntrepriseTab } from './tabs/EntrepriseTab';
import { ConditionsTab } from './tabs/ConditionsTab';
import { ClausesLegalesTab } from './tabs/ClausesLegalesTab';
import { DataTab } from './tabs/DataTab';

// Types étendus pour les nouvelles clauses légales
interface ConditionsEtendues extends Conditions {
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

export function Settings() {
  const [activeTab, setActiveTab] = useState<TabId>('entreprise');
  const [entreprise, setEntreprise] = useState<Partial<Entreprise>>({});
  const [conditions, setConditions] = useState<Partial<ConditionsEtendues>>({});
  const [storageInfo, setStorageInfo] = useState({ used: 0, percentage: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const entrepriseDefaut = getEntrepriseDefaut();
    const conditionsDefaut = getConditionsDefaut();
    const storage = getStorageUsage();

    setEntreprise(entrepriseDefaut || {});
    setConditions(conditionsDefaut || getDefaultConditions());
    setStorageInfo(storage);
  };

  const getDefaultConditions = (): Partial<ConditionsEtendues> => ({
    validite: 30,
    delaiExecution: '2 semaines',
    conditionsPaiement: 'Paiement à 30 jours',
    modalitesPaiement: ['Virement bancaire', 'Chèque'],
    // Valeurs par défaut pour les nouvelles clauses
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
  });

  const saveEntreprise = () => {
    if (!entreprise.nom || !entreprise.siret) {
      alert('Veuillez remplir au minimum le nom et le SIRET.');
      return;
    }

    saveEntrepriseDefaut(entreprise as Entreprise);
    alert('Informations entreprise sauvegardées !');
  };

  const saveConditions = () => {
    if (!conditions.validite || !conditions.delaiExecution) {
      alert('Veuillez remplir au minimum la validité et le délai d\'exécution.');
      return;
    }

    saveConditionsDefaut(conditions as Conditions);
    alert('Conditions par défaut sauvegardées !');
  };

  const handleExportData = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `devis-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Données exportées avec succès !');
    } catch (error) {
      console.error('Erreur export:', error);
      alert('Erreur lors de l\'export des données.');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = importData(content);

        if (success) {
          alert('Données importées avec succès !');
          loadData();
        } else {
          alert('Erreur: fichier de sauvegarde invalide.');
        }
      } catch (error) {
        console.error('Erreur import:', error);
        alert('Erreur lors de l\'import des données.');
      }
    };
    reader.readAsText(file);

    // Reset input
    event.target.value = '';
  };

  const handleCleanOldDevis = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer les anciens devis ? Cette action est irréversible.')) {
      cleanOldDevis();
      loadData();
      alert('Anciens devis supprimés !');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Paramètres</h1>
        <p className="text-gray-600">Configurez vos préférences et données par défaut</p>
      </div>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'entreprise' && (
        <EntrepriseTab
          entreprise={entreprise}
          setEntreprise={setEntreprise}
          onSave={saveEntreprise}
        />
      )}

      {activeTab === 'conditions' && (
        <ConditionsTab
          conditions={conditions}
          setConditions={setConditions}
          onSave={saveConditions}
        />
      )}

      {activeTab === 'clauses' && (
        <ClausesLegalesTab
          conditions={conditions}
          setConditions={setConditions}
          onSave={saveConditions}
        />
      )}

      {activeTab === 'data' && (
        <DataTab
          storageInfo={storageInfo}
          onExport={handleExportData}
          onImport={handleImportData}
          onCleanOldDevis={handleCleanOldDevis}
        />
      )}
    </div>
  );
}