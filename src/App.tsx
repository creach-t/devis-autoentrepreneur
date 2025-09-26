import React, { useState } from 'react';
import { FileText, History, Eye, Settings as SettingsIcon } from 'lucide-react';
import { DevisForm } from './components/DevisForm';
import { DevisPreview } from './components/DevisPreview';
import { DevisHistory } from './components/DevisHistory';
import { DevisExport } from './components/DevisExport';
import { Settings } from './components/Settings';
import type { Devis } from './types/devis';

type AppView = 'form' | 'preview' | 'history' | 'settings' | 'edit';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('form');
  const [selectedDevis, setSelectedDevis] = useState<Devis | null>(null);
  const [editingDevis, setEditingDevis] = useState<Devis | null>(null);

  const handleDevisCreated = (devis: Devis) => {
    setSelectedDevis(devis);
    setEditingDevis(null);
    setCurrentView('preview');
  };

  const handleViewDevis = (devis: Devis) => {
    setSelectedDevis(devis);
    setEditingDevis(null);
    setCurrentView('preview');
  };

  const handleEditDevis = (devis: Devis) => {
    setEditingDevis(devis);
    setSelectedDevis(null);
    setCurrentView('edit');
  };

  const handleExportDevis = (devis: Devis) => {
    setSelectedDevis(devis);
    setCurrentView('preview');
    // L'export PDF sera déclenché depuis le composant DevisExport
  };

  const handleCancelEdit = () => {
    setEditingDevis(null);
    setCurrentView('history');
  };

  const handleBackToHistory = () => {
    setSelectedDevis(null);
    setCurrentView('history');
  };

  const navigationItems = [
    { id: 'form', label: 'Nouveau Devis', icon: FileText },
    { id: 'history', label: 'Historique', icon: History },
    { id: 'preview', label: 'Aperçu', icon: Eye, disabled: !selectedDevis && currentView !== 'preview' },
    { id: 'settings', label: 'Paramètres', icon: SettingsIcon }
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
                    currentView === id || (currentView === 'edit' && id === 'form')
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
        {(currentView === 'form' || currentView === 'edit') && (
          <DevisForm 
            onDevisCreated={handleDevisCreated}
            onCancel={currentView === 'edit' ? handleCancelEdit : undefined}
            editingDevis={editingDevis || undefined}
          />
        )}
        
        {currentView === 'preview' && selectedDevis && (
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-4 flex justify-between items-center">
              <button
                onClick={handleBackToHistory}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ← Retour à l'historique
              </button>
              <div className="flex items-center space-x-4">
                <DevisExport devis={selectedDevis} />
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
          <Settings />
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