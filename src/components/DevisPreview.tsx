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
    <div className="devis-preview-wrapper">
      <style>{`
        .devis-preview-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          background: #e5e7eb;
          padding: 20px;
          border-radius: 8px;
        }

        @media print {
          .devis-preview-wrapper {
            background: white;
            padding: 0;
            border-radius: 0;
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
