import React, { useState, useEffect } from 'react';
import { Save, Info, Plus, Trash2 } from 'lucide-react';
import { getMentionsPersonnalisees, saveMentionsPersonnalisees } from '../../utils/storage';

interface ClausesLegalesTabProps {
  onSave: () => void;
}

export function ClausesLegalesTab({ onSave }: ClausesLegalesTabProps) {
  const [mentions, setMentions] = useState<string[]>([]);
  const [nouvelleMention, setNouvelleMention] = useState('');

  useEffect(() => {
    // Charger les mentions sauvegardées
    const mentionsSauvegardees = getMentionsPersonnalisees();
    setMentions(mentionsSauvegardees);
  }, []);

  const handleAjouterMention = () => {
    if (nouvelleMention.trim()) {
      setMentions([...mentions, nouvelleMention.trim()]);
      setNouvelleMention('');
    }
  };

  const handleSupprimerMention = (index: number) => {
    setMentions(mentions.filter((_, i) => i !== index));
  };

  const handleSauvegarder = () => {
    saveMentionsPersonnalisees(mentions);
    alert('Mentions légales sauvegardées !');
    onSave();
  };

  return (
    <div className="space-y-6">
      {/* Avertissement */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-800">Information importante</h3>
            <p className="text-sm text-amber-700 mt-1">
              Les mentions obligatoires sont automatiquement ajoutées à tous vos devis. 
              Vous pouvez ajouter vos propres mentions personnalisées ci-dessous.
            </p>
          </div>
        </div>
      </div>

      {/* Mentions obligatoires (non modifiables) */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-green-600 flex items-center gap-2">
          <span>✅</span> Mentions légales obligatoires
        </h2>
        <p className="text-gray-600 mb-4">
          Ces mentions sont automatiquement ajoutées à tous vos devis (non modifiable)
        </p>

        <div className="bg-gray-50 p-4 rounded-lg">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span><strong>Validité du devis :</strong> Durée de validité selon vos paramètres (ex: 30 jours)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span><strong>Acceptation :</strong> L'acceptation du devis implique l'adhésion aux conditions générales de vente</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span><strong>TVA :</strong> "TVA non applicable, art. 293 B du CGI" (pour les auto-entrepreneurs en franchise de TVA)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span><strong>Pénalités de retard :</strong> Taux de 3 fois le taux d'intérêt légal en cas de retard de paiement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span><strong>Frais de recouvrement :</strong> Indemnité forfaitaire de 40€ pour frais de recouvrement</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Mentions personnalisées (modifiables) */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-purple-600 flex items-center gap-2">
          <span>📝</span> Mes mentions personnalisées
        </h2>
        <p className="text-gray-600 mb-6">
          Ajoutez vos propres mentions légales spécifiques à votre activité (garanties, assurances, conditions particulières...)
        </p>

        {/* Liste des mentions existantes */}
        {mentions.length > 0 && (
          <div className="mb-6 space-y-3">
            {mentions.map((mention, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
              >
                <span className="text-purple-600 mt-1">•</span>
                <div className="flex-1 text-sm text-gray-700 whitespace-pre-wrap">
                  {mention}
                </div>
                <button
                  onClick={() => handleSupprimerMention(index)}
                  className="flex-shrink-0 p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {mentions.length === 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
            Aucune mention personnalisée. Ajoutez-en une ci-dessous.
          </div>
        )}

        {/* Formulaire d'ajout */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Ajouter une nouvelle mention
          </label>
          <textarea
            value={nouvelleMention}
            onChange={(e) => setNouvelleMention(e.target.value)}
            placeholder="Ex: Assurance responsabilité civile professionnelle auprès de [Nom assureur], police n° [Numéro]"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={3}
          />
          <button
            onClick={handleAjouterMention}
            disabled={!nouvelleMention.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Ajouter cette mention
          </button>
        </div>
      </div>

      {/* Exemples de mentions courantes */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-3 text-blue-800 flex items-center gap-2">
          <span>💡</span> Exemples de mentions personnalisées courantes
        </h3>
        <ul className="space-y-2 text-sm text-blue-900">
          <li>• Assurance responsabilité civile professionnelle auprès de [Nom], police n° [Numéro]</li>
          <li>• Garantie légale de conformité de 2 ans à compter de la livraison</li>
          <li>• Les prestations sont réalisées dans un délai de [X] jours ouvrés</li>
          <li>• Clause de confidentialité : les informations échangées restent confidentielles</li>
          <li>• Propriété intellectuelle : les droits d'auteur sont cédés après paiement intégral</li>
          <li>• En cas de litige, les parties s'engagent à rechercher une solution amiable</li>
        </ul>
      </div>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSauvegarder}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors shadow-md"
        >
          <Save className="w-4 h-4" />
          Sauvegarder mes mentions personnalisées
        </button>
      </div>
    </div>
  );
}