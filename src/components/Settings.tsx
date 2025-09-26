import React, { useState, useEffect } from 'react';
import { Save, Download, Upload, Trash2, AlertCircle, Plus } from 'lucide-react';
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
import type { Entreprise, Conditions } from '../types/devis';

export function Settings() {
  const [activeTab, setActiveTab] = useState<'entreprise' | 'conditions' | 'data'>('entreprise');
  const [entreprise, setEntreprise] = useState<Partial<Entreprise>>({});
  const [conditions, setConditions] = useState<Partial<Conditions>>({});
  const [storageInfo, setStorageInfo] = useState({ used: 0, percentage: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const entrepriseDefaut = getEntrepriseDefaut();
    const conditionsDefaut = getConditionsDefaut();
    const storage = getStorageUsage();

    setEntreprise(entrepriseDefaut || {});
    setConditions(conditionsDefaut || {
      validite: 30,
      delaiExecution: '2 semaines',
      conditionsPaiement: 'Paiement à 30 jours',
      modalitesPaiement: ['Virement bancaire', 'Chèque']
    });
    setStorageInfo(storage);
  };

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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const updateModalitesPaiement = (index: number, value: string) => {
    const newModalites = [...(conditions.modalitesPaiement || [])];
    newModalites[index] = value;
    setConditions(prev => ({ ...prev, modalitesPaiement: newModalites }));
  };

  const addModalitePaiement = () => {
    const newModalites = [...(conditions.modalitesPaiement || []), ''];
    setConditions(prev => ({ ...prev, modalitesPaiement: newModalites }));
  };

  const removeModalitePaiement = (index: number) => {
    const newModalites = (conditions.modalitesPaiement || []).filter((_, i) => i !== index);
    setConditions(prev => ({ ...prev, modalitesPaiement: newModalites }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Paramètres</h1>
        <p className="text-gray-600">Configurez vos préférences et données par défaut</p>
      </div>

      {/* Onglets */}
      <div className="mb-6">
        <nav className="flex space-x-8 border-b border-gray-200">
          {[
            { id: 'entreprise', label: 'Entreprise', icon: '🏢' },
            { id: 'conditions', label: 'Conditions', icon: '📋' },
            { id: 'data', label: 'Données', icon: '💾' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'entreprise' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            Informations par défaut de votre entreprise
          </h2>
          <p className="text-gray-600 mb-6">
            Ces informations seront automatiquement pré-remplies dans vos nouveaux devis.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'entreprise *
              </label>
              <input
                type="text"
                value={entreprise.nom || ''}
                onChange={(e) => setEntreprise(prev => ({ ...prev, nom: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Votre entreprise"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SIRET *
              </label>
              <input
                type="text"
                value={entreprise.siret || ''}
                onChange={(e) => setEntreprise(prev => ({ ...prev, siret: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12345678901234"
                maxLength={14}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Forme juridique
              </label>
              <select
                value={entreprise.formeJuridique || 'Auto-entrepreneur'}
                onChange={(e) => setEntreprise(prev => ({ ...prev, formeJuridique: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Auto-entrepreneur">Auto-entrepreneur</option>
                <option value="EURL">EURL</option>
                <option value="SASU">SASU</option>
                <option value="SAS">SAS</option>
                <option value="SARL">SARL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activité
              </label>
              <input
                type="text"
                value={entreprise.activite || ''}
                onChange={(e) => setEntreprise(prev => ({ ...prev, activite: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Développement web, Conseil..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                value={entreprise.adresse || ''}
                onChange={(e) => setEntreprise(prev => ({ ...prev, adresse: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123 rue de la République"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code Postal
              </label>
              <input
                type="text"
                value={entreprise.codePostal || ''}
                onChange={(e) => setEntreprise(prev => ({ ...prev, codePostal: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="75001"
                maxLength={5}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                value={entreprise.ville || ''}
                onChange={(e) => setEntreprise(prev => ({ ...prev, ville: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paris"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={entreprise.email || ''}
                onChange={(e) => setEntreprise(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="contact@entreprise.fr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={entreprise.telephone || ''}
                onChange={(e) => setEntreprise(prev => ({ ...prev, telephone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="01 23 45 67 89"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro TVA (optionnel)
              </label>
              <input
                type="text"
                value={entreprise.numeroTVA || ''}
                onChange={(e) => setEntreprise(prev => ({ ...prev, numeroTVA: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="FR12345678901"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={saveEntreprise}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Sauvegarder
            </button>
          </div>
        </div>
      )}

      {activeTab === 'conditions' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-green-600">
            Conditions commerciales par défaut
          </h2>
          <p className="text-gray-600 mb-6">
            Définissez vos conditions standard qui seront pré-remplies dans vos devis.
          </p>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Validité du devis (jours) *
                </label>
                <input
                  type="number"
                  value={conditions.validite || ''}
                  onChange={(e) => setConditions(prev => ({ ...prev, validite: parseInt(e.target.value) || 30 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="1"
                  max="365"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Délai d'exécution *
                </label>
                <input
                  type="text"
                  value={conditions.delaiExecution || ''}
                  onChange={(e) => setConditions(prev => ({ ...prev, delaiExecution: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="2 semaines, 1 mois..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conditions de paiement *
              </label>
              <input
                type="text"
                value={conditions.conditionsPaiement || ''}
                onChange={(e) => setConditions(prev => ({ ...prev, conditionsPaiement: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Paiement à 30 jours, À réception..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Modalités de paiement
              </label>
              {(conditions.modalitesPaiement || []).map((modalite, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={modalite}
                    onChange={(e) => updateModalitesPaiement(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Virement bancaire, Chèque..."
                  />
                  <button
                    onClick={() => removeModalitePaiement(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addModalitePaiement}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter une modalité
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={saveConditions}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Sauvegarder
            </button>
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="space-y-6">
          {/* Informations de stockage */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">
              Informations de stockage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatFileSize(storageInfo.used)}
                </div>
                <div className="text-sm text-gray-600">Espace utilisé</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {storageInfo.percentage}%
                </div>
                <div className="text-sm text-gray-600">Pourcentage d'utilisation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ~5MB
                </div>
                <div className="text-sm text-gray-600">Limite estimée</div>
              </div>
            </div>
            
            {storageInfo.percentage > 80 && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 text-orange-800">
                  <AlertCircle className="w-5 h-5" />
                  <strong>Attention:</strong> Vous approchez de la limite de stockage.
                  Pensez à nettoyer vos anciens devis.
                </div>
              </div>
            )}
          </div>

          {/* Export/Import */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              Sauvegarde et restauration
            </h2>
            <p className="text-gray-600 mb-6">
              Exportez vos données pour les sauvegarder ou les transférer vers un autre navigateur.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Exporter les données</h3>
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full justify-center"
                >
                  <Download className="w-4 h-4" />
                  Télécharger la sauvegarde
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Fichier JSON avec tous vos devis et paramètres
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Importer les données</h3>
                <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Choisir un fichier de sauvegarde
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Remplace toutes les données actuelles
                </p>
              </div>
            </div>
          </div>

          {/* Nettoyage */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Nettoyage des données
            </h2>
            <p className="text-gray-600 mb-6">
              Libérez de l'espace en supprimant les anciens devis (plus de 6 mois ou au-delà des 50 plus récents).
            </p>
            
            <button
              onClick={handleCleanOldDevis}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer les anciens devis
            </button>
            
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <strong>Attention:</strong> Cette action est irréversible. 
                Exportez vos données avant si vous souhaitez les conserver.
              </div>
            </div>
          </div>

          {/* À propos */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-600">
              À propos de l'application
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>Développée pour:</strong> Auto-entrepreneurs français</p>
              <p><strong>Stockage:</strong> Local (dans votre navigateur)</p>
              <p><strong>Confidentialité:</strong> Aucune donnée n'est envoyée vers un serveur</p>
              <p><strong>Support:</strong> <a href="https://github.com/creach-t/devis-autoentrepreneur" className="text-blue-600 hover:underline">GitHub</a></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}