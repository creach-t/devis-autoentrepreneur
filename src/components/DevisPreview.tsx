import React from 'react';
import { DevisDocument } from './DevisDocument';
import type { Devis, DevisFormData } from '../types/devis';

interface DevisPreviewProps {
  devis?: Devis;
  formData?: DevisFormData;
  logoUrl?: string;
}

/**
 * Aperçu du devis en format A4 fidèle au PDF
 * Wrapper autour de DevisDocument pour intégration dans l'interface
 */
export function DevisPreview({ devis, formData, logoUrl }: DevisPreviewProps) {
  return (
    <div className="devis-preview-container">
      <style>{`
        .devis-preview-container {
          width: 100%;
          display: flex;
          justify-content: center;
          background: #e5e7eb;
          padding: 20px;
          min-height: 100vh;
        }

        @media print {
          .devis-preview-container {
            background: white;
            padding: 0;
            min-height: auto;
          }
        }
      `}</style>
      
      <DevisDocument 
        devis={devis} 
        formData={formData}
        logoUrl={logoUrl}
        showPageNumber={true}
      />
    </div>
  );
}
