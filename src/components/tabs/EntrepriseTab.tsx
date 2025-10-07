import { Save, Upload, X, Image } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { Entreprise } from '../../types/devis';
import { saveLogo, getLogo, deleteLogo } from '../../utils/storage';

interface EntrepriseTabProps {
  entreprise: Partial<Entreprise>;
  setEntreprise: React.Dispatch<React.SetStateAction<Partial<Entreprise>>>;
  onSave: () => void;
}

export function EntrepriseTab({ entreprise, setEntreprise, onSave }: EntrepriseTabProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const logo = getLogo();
    setLogoUrl(logo);
  }, []);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Vérification type
    if (!file.type.startsWith('image/')) {
      setUploadError('Veuillez sélectionner une image (PNG, JPG, GIF)');
      return;
    }

    // Vérification taille (max 500KB)
    if (file.size > 500 * 1024) {
      setUploadError('L\'image est trop volumineuse. Taille maximale: 500KB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const base64 = e.target?.result as string;
        saveLogo(base64);
        setLogoUrl(base64);
        alert('Logo sauvegardé avec succès !');
      } catch (error) {
        setUploadError('Erreur lors de la sauvegarde du logo. Image trop volumineuse.');
      }
    };
    reader.readAsDataURL(file);

    // Reset input
    event.target.value = '';
  };

  const handleLogoDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer le logo ?')) {
      deleteLogo();
      setLogoUrl(null);
      alert('Logo supprimé !');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-blue-600">
        Informations par défaut de votre entreprise
      </h2>
      <p className="text-gray-600 mb-6">
        Ces informations seront automatiquement pré-remplies dans vos nouveaux devis.
      </p>

      {/* Section Logo */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <Image className="w-5 h-5" />
          Logo de l'entreprise
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Le logo apparaîtra en haut à gauche de vos devis. Format recommandé: PNG ou JPG (max 500KB)
        </p>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Prévisualisation */}
          <div className="flex-shrink-0">
            <div className="w-48 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-white">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo entreprise"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-400 p-4">
                  <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span className="text-xs">Aucun logo</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex-grow">
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                {logoUrl ? 'Changer le logo' : 'Ajouter un logo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>

              {logoUrl && (
                <button
                  onClick={handleLogoDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Supprimer
                </button>
              )}
            </div>

            {uploadError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                {uploadError}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-3">
              💡 Pour un meilleur rendu, utilisez une image avec fond transparent (PNG) aux dimensions approximatives de 200x80 pixels
            </p>
          </div>
        </div>
      </div>

      {/* Informations entreprise */}
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
