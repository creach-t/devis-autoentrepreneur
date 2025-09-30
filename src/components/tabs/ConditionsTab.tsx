import { Plus, Save, Trash2 } from 'lucide-react';
import React from 'react';
import type { Conditions } from '../../../types/devis';

interface ConditionsTabProps {
  conditions: Partial<Conditions>;
  setConditions: React.Dispatch<React.SetStateAction<Partial<Conditions>>>;
  onSave: () => void;
}

export function ConditionsTab({ conditions, setConditions, onSave }: ConditionsTabProps) {
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
          onClick={onSave}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Sauvegarder
        </button>
      </div>
    </div>
  );
}