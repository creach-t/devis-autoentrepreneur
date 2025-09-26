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
              onClick={saveConditions}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Sauvegarder les clauses légales
            </button>
          </div>
        </div>
      )}

      {/* Contenu des onglets - DONNÉES */}
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
              <p><strong>Conformité:</strong> Réglementation française 2025</p>
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