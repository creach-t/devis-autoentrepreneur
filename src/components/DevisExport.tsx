import React from 'react';
import { Download, Eye, Printer } from 'lucide-react';
import { formatCurrency, getTVABreakdown } from '../utils/calculations';
import { getMentionsPersonnalisees } from '../utils/storage';
import type { Devis } from '../types/devis';

interface DevisExportProps {
  devis: Devis;
  onClose?: () => void;
}

export function DevisExport({ devis, onClose }: DevisExportProps) {
  const tvaBreakdown = getTVABreakdown(devis.prestations);

  const generatePDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const contentWidth = pageWidth - (2 * margin);
      let y = 20;

      // Palette de couleurs sobre
      const colors = {
        primary: [41, 128, 185],      // Bleu sobre
        dark: [44, 62, 80],            // Gris foncé
        light: [149, 165, 166],        // Gris clair
        background: [236, 240, 241],   // Fond très clair
      };

      doc.setFont('helvetica');

      // === EN-TÊTE ===
      doc.setFontSize(28);
      doc.setTextColor(...colors.dark);
      doc.setFont('helvetica', 'bold');
      doc.text('DEVIS', pageWidth / 2, y, { align: 'center' });
      y += 8;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.light);
      doc.text(`N° ${devis.numero}`, pageWidth / 2, y, { align: 'center' });
      y += 20;

      // === ÉMETTEUR ET DESTINATAIRE ===
      const startY = y;
      const colWidth = contentWidth / 2 - 5;

      // Émetteur
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('ÉMETTEUR', margin, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...colors.dark);
      
      const emetteurLines = [
        devis.entreprise.nom,
        devis.entreprise.adresse,
        `${devis.entreprise.codePostal} ${devis.entreprise.ville}`,
        devis.entreprise.telephone && `Tél: ${devis.entreprise.telephone}`,
        devis.entreprise.email,
        devis.entreprise.siret && `SIRET: ${devis.entreprise.siret}`,
        devis.entreprise.numeroTVA && `N° TVA: ${devis.entreprise.numeroTVA}`
      ].filter(Boolean);

      emetteurLines.forEach(line => {
        doc.text(line || '', margin, y);
        y += 5;
      });

      // Destinataire
      y = startY;
      const destX = pageWidth / 2 + 5;
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...colors.primary);
      doc.text('DESTINATAIRE', destX, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...colors.dark);
      
      const destinataireLines = [
        devis.client.nom,
        devis.client.adresse,
        `${devis.client.codePostal} ${devis.client.ville}`,
        devis.client.telephone && `Tél: ${devis.client.telephone}`,
        devis.client.email,
        devis.client.siret && `SIRET: ${devis.client.siret}`
      ].filter(Boolean);

      destinataireLines.forEach(line => {
        doc.text(line || '', destX, y);
        y += 5;
      });

      y = startY + Math.max(emetteurLines.length, destinataireLines.length) * 5 + 15;

      // === INFORMATIONS DU DEVIS ===
      doc.setFillColor(...colors.background);
      doc.rect(margin, y, contentWidth, 18, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(...colors.dark);
      doc.text(`Date d'émission: ${new Date(devis.dateCreation).toLocaleDateString('fr-FR')}`, margin + 5, y + 6);
      doc.text(`Date de validité: ${new Date(devis.dateValidite).toLocaleDateString('fr-FR')}`, margin + 5, y + 12);
      
      if (devis.objet) {
        const objetText = devis.objet.length > 40 ? devis.objet.substring(0, 40) + '...' : devis.objet;
        doc.text(`Objet: ${objetText}`, margin + 80, y + 9);
      }
      
      y += 28;

      // === PRESTATIONS ===
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...colors.dark);
      doc.text('Détail des prestations', margin, y);
      y += 8;

      // En-tête tableau
      doc.setFillColor(...colors.dark);
      doc.rect(margin, y, contentWidth, 7, 'F');
      
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('Désignation', margin + 2, y + 5);
      doc.text('Qté', margin + 100, y + 5);
      doc.text('Unité', margin + 115, y + 5);
      doc.text('P.U. HT', margin + 132, y + 5);
      doc.text('TVA', margin + 152, y + 5);
      doc.text('Total HT', margin + 165, y + 5);
      
      y += 10;
      doc.setFont('helvetica', 'normal');

      // Lignes prestations
      let alternate = false;
      devis.prestations.forEach((prestation, index) => {
        if (y > pageHeight - 60) {
          doc.addPage();
          y = 20;
          alternate = false;
        }

        // Ligne alternée
        if (alternate) {
          doc.setFillColor(...colors.background);
          doc.rect(margin, y - 4, contentWidth, 8, 'F');
        }

        doc.setFontSize(8);
        doc.setTextColor(...colors.dark);
        
        const designation = prestation.designation.length > 40 
          ? prestation.designation.substring(0, 40) + '...' 
          : prestation.designation;
        
        doc.text(designation, margin + 2, y + 2);
        doc.text(prestation.quantite.toString(), margin + 102, y + 2);
        doc.text(prestation.uniteMesure, margin + 117, y + 2);
        doc.text(formatCurrency(prestation.prixUnitaireHT), margin + 132, y + 2, { align: 'right' });
        doc.text(`${prestation.tauxTVA}%`, margin + 154, y + 2);
        doc.text(formatCurrency(prestation.totalHT), pageWidth - margin - 2, y + 2, { align: 'right' });
        
        y += 8;
        alternate = !alternate;
      });

      y += 5;

      // === RÉCAPITULATIF TVA ===
      if (tvaBreakdown.length > 0) {
        if (y > pageHeight - 80) {
          doc.addPage();
          y = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...colors.dark);
        doc.text('Récapitulatif TVA', margin, y);
        y += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        
        tvaBreakdown.forEach(item => {
          doc.setTextColor(...colors.light);
          doc.text(`TVA ${item.taux}%`, margin + 5, y);
          doc.setTextColor(...colors.dark);
          doc.text(`Base HT: ${formatCurrency(item.baseHT)}`, margin + 30, y);
          doc.text(`Montant TVA: ${formatCurrency(item.montantTVA)}`, margin + 80, y);
          y += 5;
        });
        
        y += 10;
      }

      // === TOTAUX ===
      if (y > pageHeight - 70) {
        doc.addPage();
        y = 20;
      }

      const totalBoxX = pageWidth - 80;
      const totalBoxY = y;
      const totalBoxHeight = devis.totaux.acompteTTC ? 35 : 28;

      doc.setFillColor(...colors.background);
      doc.rect(totalBoxX, totalBoxY, 60, totalBoxHeight, 'F');
      doc.setDrawColor(...colors.light);
      doc.rect(totalBoxX, totalBoxY, 60, totalBoxHeight);

      doc.setFontSize(9);
      doc.setTextColor(...colors.dark);
      doc.text('Total HT:', totalBoxX + 3, totalBoxY + 7);
      doc.text(formatCurrency(devis.totaux.totalHT), totalBoxX + 57, totalBoxY + 7, { align: 'right' });
      
      doc.text('Total TVA:', totalBoxX + 3, totalBoxY + 14);
      doc.text(formatCurrency(devis.totaux.totalTVA), totalBoxX + 57, totalBoxY + 14, { align: 'right' });
      
      doc.setDrawColor(...colors.dark);
      doc.line(totalBoxX + 3, totalBoxY + 16, totalBoxX + 57, totalBoxY + 16);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...colors.primary);
      doc.text('Total TTC:', totalBoxX + 3, totalBoxY + 23);
      doc.text(formatCurrency(devis.totaux.totalTTC), totalBoxX + 57, totalBoxY + 23, { align: 'right' });
      doc.setFont('helvetica', 'normal');

      if (devis.totaux.acompteTTC) {
        doc.setFontSize(8);
        doc.setTextColor(...colors.dark);
        doc.text(`Acompte: ${formatCurrency(devis.totaux.acompteTTC)}`, totalBoxX + 3, totalBoxY + 29);
        doc.text(`Reste à payer: ${formatCurrency(devis.totaux.resteAPayer || 0)}`, totalBoxX + 3, totalBoxY + 33);
      }

      y = totalBoxY + totalBoxHeight + 15;

      // === CONDITIONS ===
      if (devis.conditions && (devis.conditions.delaiExecution || devis.conditions.conditionsPaiement)) {
        if (y > pageHeight - 50) {
          doc.addPage();
          y = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...colors.dark);
        doc.text('Conditions', margin, y);
        y += 7;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...colors.dark);

        if (devis.conditions.delaiExecution) {
          doc.text(`• Délai d'exécution: ${devis.conditions.delaiExecution}`, margin + 2, y);
          y += 5;
        }
        if (devis.conditions.conditionsPaiement) {
          doc.text(`• Conditions de paiement: ${devis.conditions.conditionsPaiement}`, margin + 2, y);
          y += 5;
        }
        if (devis.conditions.modalitesPaiement?.length) {
          doc.text(`• Modalités: ${devis.conditions.modalitesPaiement.join(', ')}`, margin + 2, y);
          y += 5;
        }
        
        y += 8;
      }

      // === COMMENTAIRES ===
      if (devis.commentaires) {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...colors.dark);
        doc.text('Commentaires', margin, y);
        y += 7;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...colors.dark);
        
        const commentLines = doc.splitTextToSize(devis.commentaires, contentWidth);
        commentLines.forEach((line: string) => {
          if (y > pageHeight - 30) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, margin, y);
          y += 4;
        });
        
        y += 8;
      }

      // === MENTIONS LÉGALES ===
      const mentionsPersonnalisees = getMentionsPersonnalisees();
      const nbLignesMentions = 4 + mentionsPersonnalisees.length;
      const espaceMentions = nbLignesMentions * 4 + 20;
      
      if (y > pageHeight - espaceMentions) {
        doc.addPage();
        y = 20;
      }

      // Ligne de séparation
      doc.setDrawColor(...colors.light);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...colors.dark);
      doc.text('Mentions légales', margin, y);
      y += 6;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...colors.light);
      
      // Mentions obligatoires
      const mentionsObligatoires = [
        `• Ce devis est valable ${devis.conditions?.validite || 30} jours. L'acceptation implique l'adhésion aux CGV.`,
        devis.entreprise.formeJuridique === 'Auto-entrepreneur' && 
          '• TVA non applicable, art. 293 B du CGI (régime micro-entrepreneur).',
        '• Pénalités de retard: 3x le taux d\'intérêt légal + indemnité forfaitaire de 40€.'
      ].filter(Boolean);

      mentionsObligatoires.forEach((mention) => {
        if (mention) {
          const lines = doc.splitTextToSize(mention, contentWidth - 5);
          lines.forEach((line: string) => {
            if (y > pageHeight - 10) {
              doc.addPage();
              y = 20;
            }
            doc.text(line, margin, y);
            y += 3.5;
          });
        }
      });

      // Mentions personnalisées
      if (mentionsPersonnalisees.length > 0) {
        y += 2;
        mentionsPersonnalisees.forEach((mention) => {
          const lines = doc.splitTextToSize(`• ${mention}`, contentWidth - 5);
          lines.forEach((line: string) => {
            if (y > pageHeight - 10) {
              doc.addPage();
              y = 20;
            }
            doc.text(line, margin, y);
            y += 3.5;
          });
        });
      }

      // Numéro de page en pied de page
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(...colors.light);
        doc.text(
          `Page ${i} / ${totalPages}`, 
          pageWidth / 2, 
          pageHeight - 10, 
          { align: 'center' }
        );
      }

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