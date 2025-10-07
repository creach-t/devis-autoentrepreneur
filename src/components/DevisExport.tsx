import React from 'react';
import { Download, Eye, Printer } from 'lucide-react';
import type { Devis } from '../types/devis';

interface DevisExportProps {
  devis: Devis;
  onClose?: () => void;
}

export function DevisExport({ devis, onClose }: DevisExportProps) {
  const generatePDF = async () => {
    try {
      // Import dynamique
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      // Récupérer l'élément de l'aperçu
      const element = document.getElementById('devis-preview');
      if (!element) {
        throw new Error('Élément devis-preview introuvable');
      }

      // Message de chargement
      const loadingEl = document.createElement('div');
      loadingEl.id = 'pdf-loading';
      loadingEl.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999;';
      loadingEl.innerHTML = '<div style="text-align: center;"><div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Génération du PDF...</div><div style="font-size: 14px; color: #666;">Veuillez patienter</div></div>';
      document.body.appendChild(loadingEl);

      // Capturer l'aperçu en canvas avec haute qualité
      const canvas = await html2canvas(element, {
        scale: 2, // Haute résolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Retirer le message de chargement
      document.body.removeChild(loadingEl);

      // Dimensions A4 en mm
      const imgWidth = 210; // A4 width en mm
      const pageHeight = 297; // A4 height en mm
      
      // Calculer les dimensions de l'image
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Créer le PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let heightLeft = imgHeight;
      let position = 0;

      // Ajouter la première page
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      );
      
      heightLeft -= pageHeight;

      // Ajouter des pages supplémentaires si nécessaire
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          'FAST'
        );
        heightLeft -= pageHeight;
      }

      // Sauvegarder
      pdf.save(`${devis.numero}.pdf`);
      
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    }
  };

  const printDevis = () => {
    window.print();
  };

  return (
    <div className="flex gap-4 items-center">
      <button
        onClick={generatePDF}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        title="Télécharger en PDF"
      >
        <Download className="w-4 h-4" />
        PDF
      </button>
      
      <button
        onClick={printDevis}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        title="Imprimer"
      >
        <Printer className="w-4 h-4" />
        Imprimer
      </button>
      
      {onClose && (
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          Aperçu
        </button>
      )}
    </div>
  );
}