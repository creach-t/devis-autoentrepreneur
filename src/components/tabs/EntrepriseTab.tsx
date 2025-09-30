import { Save } from 'lucide-react';
import React from 'react';
import type { Entreprise } from '../../../types/devis';

interface EntrepriseTabProps {
  entreprise: Partial<Entreprise>;
  setEntreprise: React.Dispatch<React.SetStateAction<Partial<Entreprise>>>;
  onSave: () => void;
}

export function EntrepriseTab({ entreprise, setEntreprise, onSave }: EntrepriseTabProps) {
  return (
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
          onClick={onSave}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Sauvegarder
        </button>
      </div>
    </div>
  );
}