import React from 'react';
import { Save, Info } from 'lucide-react';
import type { Conditions } from '../../../types/devis';

interface ClausesLegalesTabProps {
  conditions: Partial<Conditions>;
  setConditions: React.Dispatch<React.SetStateAction<Partial<Conditions>>>;
  onSave: () => void;
}

export function ClausesLegalesTab({ conditions, setConditions, onSave }: ClausesLegalesTabProps) {
  return (
    <div className="space-y-6">
      {/* Avertissement */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Information importante</h3>
            <p className="text-sm text-amber-700 mt-1">
              Ces clauses légales sont des modèles génériques basés sur la réglementation française 2025.
              Consultez un professionnel du droit pour adapter ces clauses à votre situation spécifique.
            </p>
          </div>
        </div>
      </div>

      {/* Propriété intellectuelle et droits d'auteur */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-purple-600 flex items-center gap-2">
          <span>🎨</span> Propriété intellectuelle et droits d'auteur
        </h2>
        <p className="text-gray-600 mb-6">
          Clauses essentielles pour les créations originales (sites web, logos, contenus, développements...)
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={conditions.cessionDroitsAuteur || false}
              onChange={(e) => setConditions(prev => ({ ...prev, cessionDroitsAuteur: e.target.checked }))}
              className="w-4 h-4 text-purple-600"
            />
            <label className="text-sm font-medium text-gray-700">
              Cession des droits d'auteur au client
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={conditions.conservationDroitsMoraux || false}
              onChange={(e) => setConditions(prev => ({ ...prev, conservationDroitsMoraux: e.target.checked }))}
              className="w-4 h-4 text-purple-600"
            />
            <label className="text-sm font-medium text-gray-700">
              Conservation des droits moraux (paternité de l'œuvre)
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={conditions.utilisationCommerciale || false}
              onChange={(e) => setConditions(prev => ({ ...prev, utilisationCommerciale: e.target.checked }))}
              className="w-4 h-4 text-purple-600"
            />
            <label className="text-sm font-medium text-gray-700">
              Autorisation d'utilisation commerciale
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Territoire d'exploitation
              </label>
              <select
                value={conditions.territoireExploitation || 'France'}
                onChange={(e) => setConditions(prev => ({ ...prev, territoireExploitation: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="France">France</option>
                <option value="Union Européenne">Union Européenne</option>
                <option value="Monde entier">Monde entier</option>
                <option value="Territoire spécifique">Territoire spécifique</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée d'exploitation
              </label>
              <select
                value={conditions.dureeExploitation || 'Illimitée'}
                onChange={(e) => setConditions(prev => ({ ...prev, dureeExploitation: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Illimitée">Illimitée</option>
                <option value="1 an">1 an</option>
                <option value="3 ans">3 ans</option>
                <option value="5 ans">5 ans</option>
                <option value="10 ans">10 ans</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Clauses de protection */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-red-600 flex items-center gap-2">
          <span>🛡️</span> Clauses de protection
        </h2>
        <p className="text-gray-600 mb-6">
          Protégez vos intérêts et ceux de votre client
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={conditions.clauseConfidentialite || false}
              onChange={(e) => setConditions(prev => ({ ...prev, clauseConfidentialite: e.target.checked }))}
              className="w-4 h-4 text-red-600"
            />
            <label className="text-sm font-medium text-gray-700">
              Clause de confidentialité
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={conditions.clauseNonConcurrence || false}
              onChange={(e) => setConditions(prev => ({ ...prev, clauseNonConcurrence: e.target.checked }))}
              className="w-4 h-4 text-red-600"
            />
            <label className="text-sm font-medium text-gray-700">
              Clause de non-concurrence (limitée dans le temps et l'espace)
            </label>
          </div>

          {conditions.clauseNonConcurrence && (
            <div className="ml-7">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée de non-concurrence (mois)
              </label>
              <input
                type="number"
                value={conditions.dureeNonConcurrence || 12}
                onChange={(e) => setConditions(prev => ({ ...prev, dureeNonConcurrence: parseInt(e.target.value) || 12 }))}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                min="1"
                max="24"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum recommandé: 18 mois</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={conditions.limitationResponsabilite || false}
              onChange={(e) => setConditions(prev => ({ ...prev, limitationResponsabilite: e.target.checked }))}
              className="w-4 h-4 text-red-600"
            />
            <label className="text-sm font-medium text-gray-700">
              Limitation de responsabilité au montant du devis
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={conditions.assuranceRC || false}
              onChange={(e) => setConditions(prev => ({ ...prev, assuranceRC: e.target.checked }))}
              className="w-4 h-4 text-red-600"
            />
            <label className="text-sm font-medium text-gray-700">
              Couverture assurance responsabilité civile professionnelle
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Période de garantie professionnelle
            </label>
            <select
              value={conditions.garantieProfessionnelle || '1 an'}
              onChange={(e) => setConditions(prev => ({ ...prev, garantieProfessionnelle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="3 mois">3 mois</option>
              <option value="6 mois">6 mois</option>
              <option value="1 an">1 an</option>
              <option value="2 ans">2 ans</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conditions spécifiques */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-blue-600 flex items-center gap-2">
          <span>📜</span> Conditions spécifiques
        </h2>
        <p className="text-gray-600 mb-6">
          Conditions particulières selon le type de client et de prestation
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={conditions.droitRetractation || false}
              onChange={(e) => setConditions(prev => ({ ...prev, droitRetractation: e.target.checked }))}
              className="w-4 h-4 text-blue-600"
            />
            <label className="text-sm font-medium text-gray-700">
              Droit de rétractation de 14 jours (clients particuliers uniquement)
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={conditions.forceExclusive || false}
              onChange={(e) => setConditions(prev => ({ ...prev, forceExclusive: e.target.checked }))}
              className="w-4 h-4 text-blue-600"
            />
            <label className="text-sm font-medium text-gray-700">
              Clause de force majeure
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Délai de conformité et réclamations
            </label>
            <select
              value={conditions.livraisonConformite || '30 jours'}
              onChange={(e) => setConditions(prev => ({ ...prev, livraisonConformite: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7 jours">7 jours</option>
              <option value="15 jours">15 jours</option>
              <option value="30 jours">30 jours</option>
              <option value="60 jours">60 jours</option>
            </select>
          </div>
        </div>
      </div>

      {/* RGPD et données personnelles */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600 flex items-center gap-2">
          <span>🔐</span> RGPD et protection des données
        </h2>
        <p className="text-gray-600 mb-6">
          Conformité avec le règlement général sur la protection des données
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={conditions.traitementDonnees || false}
              onChange={(e) => setConditions(prev => ({ ...prev, traitementDonnees: e.target.checked }))}
              className="w-4 h-4 text-indigo-600"
            />
            <label className="text-sm font-medium text-gray-700">
              Engagement de traitement conforme RGPD
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durée de conservation des données
            </label>
            <select
              value={conditions.dureeConservation || '3 ans'}
              onChange={(e) => setConditions(prev => ({ ...prev, dureeConservation: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1 an">1 an</option>
              <option value="3 ans">3 ans</option>
              <option value="5 ans">5 ans</option>
              <option value="10 ans">10 ans (obligations comptables)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Résolution des litiges */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-orange-600 flex items-center gap-2">
          <span>⚖️</span> Résolution des litiges
        </h2>
        <p className="text-gray-600 mb-6">
          Définition du droit applicable et des juridictions compétentes
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Droit applicable
            </label>
            <select
              value={conditions.droidApplicable || 'Droit français'}
              onChange={(e) => setConditions(prev => ({ ...prev, droidApplicable: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Droit français">Droit français</option>
              <option value="Droit européen">Droit européen</option>
              <option value="Convention internationale">Convention internationale</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Juridiction compétente
            </label>
            <select
              value={conditions.juridictionCompetente || 'Tribunaux français'}
              onChange={(e) => setConditions(prev => ({ ...prev, juridictionCompetente: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Tribunaux français">Tribunaux français</option>
              <option value="Tribunal du siège social">Tribunal du siège social</option>
              <option value="Tribunal du domicile client">Tribunal du domicile client</option>
              <option value="Médiation préalable">Médiation préalable obligatoire</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mentions légales spécifiques auto-entrepreneur */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-green-600 flex items-center gap-2">
          <span>📋</span> Mentions légales auto-entrepreneur
        </h2>
        <p className="text-gray-600 mb-6">
          Mentions obligatoires selon la réglementation 2025
        </p>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-3 text-sm">
            <div className="font-medium text-gray-800">
              Mentions automatiquement ajoutées aux devis :
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>TVA :</strong> "TVA non applicable, article 293 B du CGI" (si non assujetti)</li>
              <li>• <strong>Validité :</strong> Durée de validité du devis en jours</li>
              <li>• <strong>Pénalités :</strong> Taux d'intérêt légal en cas de retard (6,65% pour 2025)</li>
              <li>• <strong>Recouvrement :</strong> Indemnité forfaitaire de 40€ pour frais de recouvrement</li>
              <li>• <strong>Médiation :</strong> Référence au médiateur de la consommation (si applicable)</li>
              <li>• <strong>Assurance :</strong> Références de l'assurance RC professionnelle</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Sauvegarder les clauses légales
        </button>
      </div>
    </div>
  );
}