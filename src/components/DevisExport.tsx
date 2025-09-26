import React from 'react';
import { Download, Eye, Printer } from 'lucide-react';
import { formatCurrency, getTVABreakdown } from '../utils/calculations';
import type { Devis } from '../types/devis';

interface DevisExportProps {
  devis: Devis;
  onClose?: () => void;
}

export function DevisExport({ devis, onClose }: DevisExportProps) {
  const tvaBreakdown = getTVABreakdown(devis.prestations);

  const generatePDF = async () => {
    try {
      // Import dynamique de jsPDF
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      let y = 20;

      // Configuration des polices
      doc.setFont('helvetica');

      // En-tête
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 0);
      doc.text('DEVIS', pageWidth / 2, y, { align: 'center' });
      y += 10;
      
      doc.setFontSize(14);
      doc.text(`N° ${devis.numero}`, pageWidth / 2, y, { align: 'center' });
      y += 20;

      // Informations émetteur et destinataire
      doc.setFontSize(12);
      doc.setTextColor(0, 100, 200);
      doc.text('ÉMETTEUR', margin, y);
      doc.text('DESTINATAIRE', pageWidth / 2 + 10, y);
      y += 8;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);

      // Émetteur (colonne gauche)
      const emetteurLines = [
        devis.entreprise.nom,
        devis.entreprise.adresse,
        `${devis.entreprise.codePostal} ${devis.entreprise.ville}`,
        devis.entreprise.telephone && `Tél: ${devis.entreprise.telephone}`,
        devis.entreprise.email && `Email: ${devis.entreprise.email}`,
        devis.entreprise.siret && `SIRET: ${devis.entreprise.siret}`,
        devis.entreprise.numeroTVA && `N° TVA: ${devis.entreprise.numeroTVA}`
      ].filter(Boolean);

      emetteurLines.forEach(line => {
        if (line) {
          doc.text(line, margin, y);
          y += 5;
        }
      });

      // Reset y pour destinataire
      y = 48;

      // Destinataire (colonne droite)
      const destinataireLines = [
        devis.client.nom,
        devis.client.adresse,
        `${devis.client.codePostal} ${devis.client.ville}`,
        devis.client.telephone && `Tél: ${devis.client.telephone}`,
        devis.client.email && `Email: ${devis.client.email}`,
        devis.client.siret && `SIRET: ${devis.client.siret}`
      ].filter(Boolean);

      destinataireLines.forEach(line => {
        if (line) {
          doc.text(line, pageWidth / 2 + 10, y);
          y += 5;
        }
      });

      y = Math.max(y, 48 + emetteurLines.length * 5) + 15;

      // Informations du devis
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, y, pageWidth - 2 * margin, 20, 'F');
      
      doc.setTextColor(0, 0, 0);
      doc.text(`Date d'émission: ${new Date(devis.dateCreation).toLocaleDateString('fr-FR')}`, margin + 5, y + 7);
      doc.text(`Date de validité: ${new Date(devis.dateValidite).toLocaleDateString('fr-FR')}`, margin + 5, y + 14);
      
      if (devis.objet) {
        doc.text(`Objet: ${devis.objet}`, pageWidth / 2 + 10, y + 7);
      }
      
      y += 30;

      // Titre des prestations
      doc.setFontSize(12);
      doc.setTextColor(100, 0, 200);
      doc.text('DÉTAIL DES PRESTATIONS', margin, y);
      y += 10;

      // En-tête tableau
      doc.setFillColor(230, 230, 230);
      doc.rect(margin, y, pageWidth - 2 * margin, 8, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text('Désignation', margin + 2, y + 5);
      doc.text('Qté', margin + 80, y + 5);
      doc.text('Unité', margin + 95, y + 5);
      doc.text('P.U. HT', margin + 115, y + 5);
      doc.text('TVA', margin + 140, y + 5);
      doc.text('Total HT', margin + 155, y + 5);
      
      y += 12;

      // Lignes des prestations
      devis.prestations.forEach(prestation => {
        // Gestion du saut de page
        if (y > pageHeight - 50) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(9);
        
        // Désignation (avec troncature si trop long)
        const designation = prestation.designation.length > 35 
          ? prestation.designation.substring(0, 35) + '...' 
          : prestation.designation;
        
        doc.text(designation, margin + 2, y);
        doc.text(prestation.quantite.toString(), margin + 80, y);
        doc.text(prestation.uniteMesure, margin + 95, y);
        doc.text(formatCurrency(prestation.prixUnitaireHT).replace('€', '').trim() + ' €', margin + 115, y);
        doc.text(`${prestation.tauxTVA}%`, margin + 140, y);
        doc.text(formatCurrency(prestation.totalHT).replace('€', '').trim() + ' €', margin + 155, y);
        
        y += 8;
      });

      y += 10;

      // Récapitulatif TVA si nécessaire
      if (tvaBreakdown.length > 1) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('RÉCAPITULATIF TVA', margin, y);
        y += 8;

        tvaBreakdown.forEach(item => {
          doc.setFontSize(9);
          doc.text(`TVA ${item.taux}%: ${formatCurrency(item.baseHT)} => ${formatCurrency(item.montantTVA)}`, margin + 10, y);
          y += 6;
        });
        
        y += 10;
      }

      // Totaux dans un encadré
      const totalBoxY = y;
      const totalBoxHeight = 25;
      doc.setFillColor(250, 250, 250);
      doc.rect(pageWidth - 80, totalBoxY, 60, totalBoxHeight, 'FD');

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total HT: ${formatCurrency(devis.totaux.totalHT)}`, pageWidth - 75, totalBoxY + 8);
      doc.text(`Total TVA: ${formatCurrency(devis.totaux.totalTVA)}`, pageWidth - 75, totalBoxY + 15);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total TTC: ${formatCurrency(devis.totaux.totalTTC)}`, pageWidth - 75, totalBoxY + 22);
      doc.setFont('helvetica', 'normal');

      y = totalBoxY + totalBoxHeight + 15;

      // Acompte si défini
      if (devis.totaux.acompteTTC) {
        doc.setFontSize(10);
        doc.text(`Acompte demandé: ${formatCurrency(devis.totaux.acompteTTC)}`, pageWidth - 75, y);
        y += 6;
        doc.text(`Reste à payer: ${formatCurrency(devis.totaux.resteAPayer || 0)}`, pageWidth - 75, y);
        y += 10;
      }

      // Conditions
      if (devis.conditions) {
        y += 10;
        doc.setFontSize(11);
        doc.setTextColor(200, 150, 0);
        doc.text('CONDITIONS', margin, y);
        y += 8;

        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        
        const conditions = [
          `Validité du devis: ${devis.conditions.validite} jours`,
          `Délai d'exécution: ${devis.conditions.delaiExecution}`,
          `Conditions de paiement: ${devis.conditions.conditionsPaiement}`,
          devis.conditions.modalitesPaiement?.length > 0 && 
            `Modalités de paiement: ${devis.conditions.modalitesPaiement.join(', ')}`
        ].filter(Boolean);

        conditions.forEach(condition => {
          if (condition) {
            doc.text(condition, margin, y);
            y += 6;
          }
        });
      }

      // Commentaires
      if (devis.commentaires) {
        y += 10;
        doc.setFontSize(11);
        doc.setTextColor(0, 100, 150);
        doc.text('COMMENTAIRES', margin, y);
        y += 8;

        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        
        // Découper les commentaires en lignes
        const commentLines = doc.splitTextToSize(devis.commentaires, pageWidth - 2 * margin);
        commentLines.forEach((line: string) => {
          if (y > pageHeight - 30) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, margin, y);
          y += 5;
        });
      }

      // Mentions légales en bas de page
      const footerY = pageHeight - 30;
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      
      const mentions = [
        `Ce devis est valable ${devis.conditions?.validite || 30} jours à compter de sa date d'émission.`,
        `L'acceptation du présent devis implique l'adhésion entière aux conditions générales de vente.`,
        devis.entreprise.formeJuridique === 'Auto-entrepreneur' && 
          'TVA non applicable, art. 293 B du CGI (régime micro-entrepreneur).',
        'En cas de retard de paiement, des pénalités de retard au taux de 3 fois le taux d\'intérêt légal seront applicables.'
      ].filter(Boolean);

      mentions.forEach((mention, index) => {
        if (mention) {
          doc.text(mention, margin, footerY + index * 4);
        }
      });

      // Sauvegarder le PDF
      doc.save(`${devis.numero}.pdf`);
      
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