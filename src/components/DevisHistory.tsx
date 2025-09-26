import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Download, Search, Filter } from 'lucide-react';
import { getAllDevis, deleteDevis, getStorageUsage } from '../utils/storage';
import { formatCurrency } from '../utils/calculations';
import type { Devis, DevisStatus } from '../types/devis';

interface DevisHistoryProps {
  onViewDevis?: (devis: Devis) => void;
  onEditDevis?: (devis: Devis) => void;
  onExportDevis?: (devis: Devis) => void;
}

export function DevisHistory({ onViewDevis, onEditDevis, onExportDevis }: DevisHistoryProps) {
  const [devisList, setDevisList] = useState<Devis[]>([]);
  const [filteredDevis, setFilteredDevis] = useState<Devis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DevisStatus | 'Tous'>('Tous');
  const [storageInfo, setStorageInfo] = useState({ used: 0, percentage: 0 });

  // Chargement des devis
  useEffect(() => {
    loadDevis();
    updateStorageInfo();
  }, []);

  // Filtrage des devis
  useEffect(() => {
    let filtered = devisList;

    // Filtre par statut
    if (statusFilter !== 'Tous') {
      filtered = filtered.filter(devis => devis.statut === statusFilter);
    }

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(devis => 
        devis.numero.toLowerCase().includes(term) ||
        devis.client.nom.toLowerCase().includes(term) ||
        devis.objet?.toLowerCase().includes(term) ||
        devis.entreprise.nom.toLowerCase().includes(term)
      );
    }

    setFilteredDevis(filtered);
  }, [devisList, searchTerm, statusFilter]);

  const loadDevis = () => {
    const devis = getAllDevis();
    setDevisList(devis);
  };

  const updateStorageInfo = () => {
    const info = getStorageUsage();
    setStorageInfo(info);
  };

  const handleDeleteDevis = (devisId: string, devisNumero: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le devis ${devisNumero} ?`)) {
      deleteDevis(devisId);
      loadDevis();
      updateStorageInfo();
    }
  };

  const getStatusColor = (statut: DevisStatus): string => {
    switch (statut) {
      case 'Brouillon': return 'bg-gray-100 text-gray-800';
      case 'Envoyé': return 'bg-blue-100 text-blue-800';
      case 'Accepté': return 'bg-green-100 text-green-800';
      case 'Refusé': return 'bg-red-100 text-red-800';
      case 'Expiré': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isDevisExpired = (devis: Devis): boolean => {
    return new Date(devis.dateValidite) < new Date() && devis.statut === 'Envoyé';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Historique des Devis</h1>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Gérez vos devis existants</p>
          <div className="text-sm text-gray-500">
            Stockage: {formatFileSize(storageInfo.used)} ({storageInfo.percentage}%)
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher (numéro, client, objet...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtre par statut */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as DevisStatus | 'Tous')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="Tous">Tous les statuts</option>
              <option value="Brouillon">Brouillon</option>
              <option value="Envoyé">Envoyé</option>
              <option value="Accepté">Accepté</option>
              <option value="Refusé">Refusé</option>
              <option value="Expiré">Expiré</option>
            </select>
          </div>

          {/* Statistiques */}
          <div className="flex items-center justify-end text-sm text-gray-600">
            <span>
              {filteredDevis.length} devis 
              {filteredDevis.length !== devisList.length && ` sur ${devisList.length}`}
            </span>
          </div>
        </div>
      </div>

      {/* Liste des devis */}
      {filteredDevis.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Objet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date création
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date validité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant TTC
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDevis.map((devis) => {
                  const expired = isDevisExpired(devis);
                  const rowClass = expired ? 'bg-red-50' : 'hover:bg-gray-50';
                  
                  return (
                    <tr key={devis.id} className={rowClass}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {devis.numero}
                        </div>
                        <div className="text-xs text-gray-500">
                          v{devis.version}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{devis.client.nom}</div>
                        <div className="text-xs text-gray-500">{devis.client.ville}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {devis.objet || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(devis.dateCreation).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className={expired ? 'text-red-600 font-medium' : ''}>
                          {new Date(devis.dateValidite).toLocaleDateString('fr-FR')}
                        </div>
                        {expired && (
                          <div className="text-xs text-red-500">Expiré</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(devis.totaux.totalTTC)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          expired ? 'bg-red-100 text-red-800' : getStatusColor(devis.statut)
                        }`}>
                          {expired ? 'Expiré' : devis.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {/* Voir */}
                          <button
                            onClick={() => onViewDevis?.(devis)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Voir le devis"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {/* Modifier */}
                          <button
                            onClick={() => onEditDevis?.(devis)}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Modifier le devis"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          {/* Exporter */}
                          <button
                            onClick={() => onExportDevis?.(devis)}
                            className="text-purple-600 hover:text-purple-900 p-1 rounded"
                            title="Exporter en PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          
                          {/* Supprimer */}
                          <button
                            onClick={() => handleDeleteDevis(devis.id, devis.numero)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Supprimer le devis"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'Tous' 
              ? 'Aucun devis trouvé' 
              : 'Aucun devis créé'}
          </h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'Tous'
              ? 'Essayez de modifier vos critères de recherche'
              : 'Créez votre premier devis pour commencer'}
          </p>
        </div>
      )}

      {/* Alerte stockage */}
      {storageInfo.percentage > 80 && (
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center">
            <div className="text-orange-800">
              <strong>Attention:</strong> Vous utilisez {storageInfo.percentage}% de l'espace de stockage local.
              Pensez à exporter et supprimer les anciens devis si nécessaire.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}