import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, FileText } from 'lucide-react';
import { useAutoSave } from '../hooks/useLocalStorage';
import { 
  calculateTotaux, 
  calculatePrestationTotal, 
  updatePrestationTotal,
  formatCurrency 
} from '../utils/calculations';
import { 
  saveBrouillon, 
  getBrouillon, 
  clearBrouillon,
  saveDevis,
  generateNumeroDevis,
  getEntrepriseDefaut,
  getConditionsDefaut
} from '../utils/storage';
import type { 
  DevisFormData, 
  Prestation, 
  Devis, 
  Entreprise, 
  Client, 
  Conditions 
} from '../types/devis';

interface DevisFormProps {
  onDevisCreated?: (devis: Devis) => void;
  initialData?: Partial<DevisFormData>;
}

export function DevisForm({ onDevisCreated, initialData }: DevisFormProps) {
  // État du formulaire
  const [formData, setFormData] = useState<DevisFormData>(() => {
    const brouillon = getBrouillon();
    const entrepriseDefaut = getEntrepriseDefaut();
    const conditionsDefaut = getConditionsDefaut();
    
    return {
      entreprise: brouillon?.entreprise || entrepriseDefaut || {},
      client: brouillon?.client || {},
      prestations: brouillon?.prestations || [],
      conditions: brouillon?.conditions || conditionsDefaut || {},
      objet: brouillon?.objet || '',
      commentaires: brouillon?.commentaires || '',
      ...initialData
    };
  });

  // Auto-sauvegarde toutes les 2 secondes
  useAutoSave('devis-brouillon', formData, 2000);

  // Calculs automatiques
  const totaux = calculateTotaux(formData.prestations, formData.conditions as Conditions);

  // Gestionnaires d'événements
  const updateEntreprise = (field: keyof Entreprise, value: string) => {
    setFormData(prev => ({
      ...prev,
      entreprise: { ...prev.entreprise, [field]: value }
    }));
  };

  const updateClient = (field: keyof Client, value: string) => {
    setFormData(prev => ({
      ...prev,
      client: { ...prev.client, [field]: value }
    }));
  };

  const updateConditions = (field: keyof Conditions, value: any) => {
    setFormData(prev => ({
      ...prev,
      conditions: { ...prev.conditions, [field]: value }
    }));
  };

  const addPrestation = () => {
    const newPrestation: Prestation = {
      id: crypto.randomUUID(),
      designation: '',
      quantite: 1,
      uniteMesure: 'Heure',
      prixUnitaireHT: 0,
      tauxTVA: 20,
      totalHT: 0
    };

    setFormData(prev => ({
      ...prev,
      prestations: [...prev.prestations, newPrestation]
    }));
  };

  const updatePrestation = (index: number, field: keyof Prestation, value: any) => {
    setFormData(prev => {
      const newPrestations = [...prev.prestations];
      newPrestations[index] = { ...newPrestations[index], [field]: value };
      
      // Recalcul automatique du total
      if (field === 'quantite' || field === 'prixUnitaireHT') {
        newPrestations[index] = updatePrestationTotal(newPrestations[index]);
      }
      
      return { ...prev, prestations: newPrestations };
    });
  };

  const removePrestation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prestations: prev.prestations.filter((_, i) => i !== index)
    }));
  };

  const saveAsDevis = () => {
    // Validation basique
    if (!formData.entreprise.nom || !formData.client.nom || formData.prestations.length === 0) {
      alert('Veuillez remplir au minimum les informations entreprise, client et ajouter une prestation.');
      return;
    }

    const devis: Devis = {
      id: crypto.randomUUID(),
      numero: generateNumeroDevis(),
      dateCreation: new Date(),
      dateValidite: new Date(Date.now() + (formData.conditions?.validite || 30) * 24 * 60 * 60 * 1000),
      statut: 'Brouillon',
      entreprise: formData.entreprise as Entreprise,
      client: formData.client as Client,
      prestations: formData.prestations,
      conditions: formData.conditions as Conditions,
      totaux,
      objet: formData.objet,
      commentaires: formData.commentaires,
      dateModification: new Date(),
      version: 1
    };

    saveDevis(devis);
    clearBrouillon();
    onDevisCreated?.(devis);
    
    // Reset du formulaire
    setFormData({
      entreprise: getEntrepriseDefaut() || {},
      client: {},
      prestations: [],
      conditions: getConditionsDefaut() || {},
      objet: '',
      commentaires: ''
    });

    alert(`Devis ${devis.numero} sauvegardé !`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Nouveau Devis</h1>
        <p className="text-gray-600">Créez votre devis en quelques clics</p>
      </div>

      {/* Section Entreprise */}
      <section className="mb-8 p-6 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Informations Entreprise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'entreprise *
            </label>
            <input
              type="text"
              value={formData.entreprise.nom || ''}
              onChange={(e) => updateEntreprise('nom', e.target.value)}
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
              value={formData.entreprise.siret || ''}
              onChange={(e) => updateEntreprise('siret', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="12345678901234"
              maxLength={14}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse *
            </label>
            <input
              type="text"
              value={formData.entreprise.adresse || ''}
              onChange={(e) => updateEntreprise('adresse', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 rue de la République"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code Postal *
            </label>
            <input
              type="text"
              value={formData.entreprise.codePostal || ''}
              onChange={(e) => updateEntreprise('codePostal', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="75001"
              maxLength={5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville *
            </label>
            <input
              type="text"
              value={formData.entreprise.ville || ''}
              onChange={(e) => updateEntreprise('ville', e.target.value)}
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
              value={formData.entreprise.email || ''}
              onChange={(e) => updateEntreprise('email', e.target.value)}
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
              value={formData.entreprise.telephone || ''}
              onChange={(e) => updateEntreprise('telephone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="01 23 45 67 89"
            />
          </div>
        </div>
      </section>

      {/* Section Client */}
      <section className="mb-8 p-6 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-green-600">Informations Client</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du client *
            </label>
            <input
              type="text"
              value={formData.client.nom || ''}
              onChange={(e) => updateClient('nom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Nom du client"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.client.email || ''}
              onChange={(e) => updateClient('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="client@email.fr"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse *
            </label>
            <input
              type="text"
              value={formData.client.adresse || ''}
              onChange={(e) => updateClient('adresse', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Adresse du client"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code Postal *
            </label>
            <input
              type="text"
              value={formData.client.codePostal || ''}
              onChange={(e) => updateClient('codePostal', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="75001"
              maxLength={5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville *
            </label>
            <input
              type="text"
              value={formData.client.ville || ''}
              onChange={(e) => updateClient('ville', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ville"
            />
          </div>
        </div>
      </section>

      {/* Section Prestations */}
      <section className="mb-8 p-6 border border-gray-200 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-purple-600">Prestations</h2>
          <button
            onClick={addPrestation}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>

        {formData.prestations.map((prestation, index) => (
          <div key={prestation.id} className="grid grid-cols-12 gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="col-span-12 md:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Désignation
              </label>
              <input
                type="text"
                value={prestation.designation}
                onChange={(e) => updatePrestation(index, 'designation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Description de la prestation"
              />
            </div>

            <div className="col-span-6 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantité
              </label>
              <input
                type="number"
                value={prestation.quantite}
                onChange={(e) => updatePrestation(index, 'quantite', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
                step="0.5"
              />
            </div>

            <div className="col-span-6 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unité
              </label>
              <select
                value={prestation.uniteMesure}
                onChange={(e) => updatePrestation(index, 'uniteMesure', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Heure">Heure</option>
                <option value="Jour">Jour</option>
                <option value="Forfait">Forfait</option>
                <option value="Unité">Unité</option>
              </select>
            </div>

            <div className="col-span-6 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix unitaire HT
              </label>
              <input
                type="number"
                value={prestation.prixUnitaireHT}
                onChange={(e) => updatePrestation(index, 'prixUnitaireHT', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
                step="0.01"
              />
            </div>

            <div className="col-span-4 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                TVA
              </label>
              <select
                value={prestation.tauxTVA}
                onChange={(e) => updatePrestation(index, 'tauxTVA', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={0}>0%</option>
                <option value={5.5}>5,5%</option>
                <option value={10}>10%</option>
                <option value={20}>20%</option>
              </select>
            </div>

            <div className="col-span-12 md:col-span-1 flex items-end">
              <button
                onClick={() => removePrestation(index)}
                className="w-full md:w-auto px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="col-span-12 text-right">
              <span className="text-sm text-gray-600">
                Total HT: <strong>{formatCurrency(prestation.totalHT)}</strong>
              </span>
            </div>
          </div>
        ))}

        {formData.prestations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune prestation ajoutée. Cliquez sur "Ajouter" pour commencer.
          </div>
        )}
      </section>

      {/* Récapitulatif */}
      <section className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4 text-orange-600">Récapitulatif</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
          <div>
            <span className="text-gray-600">Total HT:</span>
            <div className="font-semibold">{formatCurrency(totaux.totalHT)}</div>
          </div>
          <div>
            <span className="text-gray-600">TVA:</span>
            <div className="font-semibold">{formatCurrency(totaux.totalTVA)}</div>
          </div>
          <div>
            <span className="text-gray-600">Total TTC:</span>
            <div className="font-bold text-xl text-orange-600">{formatCurrency(totaux.totalTTC)}</div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={() => saveBrouillon(formData)}
          className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Sauvegarder brouillon
        </button>
        
        <button
          onClick={saveAsDevis}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Créer le devis
        </button>
      </div>
    </div>
  );
}