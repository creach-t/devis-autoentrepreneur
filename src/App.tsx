import React, { useState } from 'react';
import { FileText, History, Eye, Settings } from 'lucide-react';
import { DevisForm } from './components/DevisForm';
import { DevisPreview } from './components/DevisPreview';
import { DevisHistory } from './components/DevisHistory';
import type { Devis } from './types/devis';

type AppView = 'form' | 'preview' | 'history' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('form');
  const [selectedDevis, setSelectedDevis] = useState<Devis | null>(null);

  const handleDevisCreated = (devis: Devis) => {
    setSelectedDevis(devis);
    setCurrentView('preview');
  };

  const handleViewDevis = (devis: Devis) => {
    setSelectedDevis(devis);
    setCurrentView('preview');
  };

  const handleEditDevis = (devis: Devis) => {
    // TODO: Implémenter l'édition d'un devis existant
    console.log('Edit devis:', devis.numero);
    setCurrentView('form');
  };

  const handleExportDevis = (devis: Devis) => {
    // TODO: Implémenter l'export PDF
    console.log('Export devis:', devis.numero);
    window.print();
  };

  const navigationItems = [
    { id: 'form', label: 'Nouveau Devis', icon: FileText },
    { id: 'history', label: 'Historique', icon: History },
    { id: 'preview', label: 'Aperçu', icon: Eye, disabled: !selectedDevis },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-blue-600">
                  📄 Devis Pro
                </h1>
              </div>
            </div>

            {/* Navigation principale */}
            <div className="flex space-x-8">
              {navigationItems.map(({ id, label, icon: Icon, disabled }) => (
                <button
                  key={id}
                  onClick={() => !disabled && setCurrentView(id as AppView)}
                  disabled={disabled}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    currentView === id
                      ? 'border-blue-500 text-blue-600'
                      : disabled
                      ? 'border-transparent text-gray-300 cursor-not-allowed'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="py-6">
        {currentView === 'form' && (
          <DevisForm onDevisCreated={handleDevisCreated} />
        )}
        
        {currentView === 'preview' && selectedDevis && (
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-4 flex justify-between items-center">
              <button
                onClick={() => setCurrentView('history')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ← Retour à l'historique
              </button>
              <div className="space-x-2">
                <button
                  onClick={() => handleExportDevis(selectedDevis)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Exporter PDF
                </button>
                <button
                  onClick={() => handleEditDevis(selectedDevis)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Modifier
                </button>
              </div>
            </div>
            <DevisPreview devis={selectedDevis} />
          </div>
        )}
        
        {currentView === 'history' && (
          <DevisHistory
            onViewDevis={handleViewDevis}
            onEditDevis={handleEditDevis}
            onExportDevis={handleExportDevis}
          />
        )}
        
        {currentView === 'settings' && (
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">Paramètres</h2>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Entreprise par défaut
                  </h3>
                  <p className="text-blue-700 text-sm mb-3">
                    Configurez les informations de votre entreprise pour les pré-remplir automatiquement.
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Configurer
                  </button>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Conditions par défaut
                  </h3>
                  <p className="text-green-700 text-sm mb-3">
                    Définissez vos conditions commerciales standard (validité, paiement, etc.).
                  </p>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    Configurer
                  </button>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    Sauvegarde des données
                  </h3>
                  <p className="text-yellow-700 text-sm mb-3">
                    Exportez ou importez vos données pour sauvegarder ou transférer vos devis.
                  </p>
                  <div className="space-x-2">
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
                      Exporter
                    </button>
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
                      Importer
                    </button>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    À propos
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Application de gestion de devis pour auto-entrepreneurs.
                    <br />
                    Version 1.0.0 - Toutes les données sont stockées localement dans votre navigateur.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2025 Devis Pro - Application pour auto-entrepreneurs
            </div>
            <div className="text-sm text-gray-500">
              Données stockées localement • Aucune connexion requise
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;