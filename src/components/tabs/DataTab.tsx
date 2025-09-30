import { AlertCircle, Download, Trash2, Upload } from 'lucide-react';
import React from 'react';

interface StorageInfo {
  used: number;
  percentage: number;
}

interface DataTabProps {
  storageInfo: StorageInfo;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCleanOldDevis: () => void;
}

export function DataTab({ storageInfo, onExport, onImport, onCleanOldDevis }: DataTabProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
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
              onClick={onExport}
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
                onChange={onImport}
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
          onClick={onCleanOldDevis}
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
          <p><strong>Conformité:</strong> Réglementation française 2025</p>
          <p><strong>Stockage:</strong> Local (dans votre navigateur)</p>
          <p><strong>Confidentialité:</strong> Aucune donnée n'est envoyée vers un serveur</p>
          <p><strong>Support:</strong> <a href="https://github.com/creach-t/devis-autoentrepreneur" className="text-blue-600 hover:underline">GitHub</a></p>
        </div>
      </div>
    </div>
  );
}