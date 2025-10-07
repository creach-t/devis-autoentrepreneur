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

      // Palette sobre : gris foncé + bleu discret
      const PRIMARY = [70, 130, 180];    // Bleu acier
      const DARK = [50, 50, 50];         // Gris très foncé
      const MEDIUM = [100, 100, 100];    // Gris moyen
      const LIGHT = [180, 180, 180];     // Gris clair
      const BG = [245, 245, 245];        // Fond gris très clair

      doc.setFont('helvetica');

      // === EN-TÊTE ===
      doc.setFontSize(26);
      doc.setTextColor(...DARK);
      doc.setFont('helvetica', 'bold');
      doc.text('DEVIS', pageWidth / 2, y, { align: 'center' });
      y += 8;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...MEDIUM);
      doc.text(`N° ${devis.numero}`, pageWidth / 2, y, { align: 'center' });
      y += 18;

      // === ÉMETTEUR ET DESTINATAIRE ===
      const startY = y;
      
      // Titres
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...PRIMARY);
      doc.text('ÉMETTEUR', margin, y);
      doc.text('DESTINATAIRE', pageWidth / 2 + 5, y);
      y += 1;
      
      // Lignes sous les titres
      doc.setDrawColor(...PRIMARY);
      doc.setLineWidth(0.5);
      doc.line(margin, y, margin + 40, y);
      doc.line(pageWidth / 2 + 5, y, pageWidth / 2 + 55, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...DARK);
      
      // Émetteur
      const emetteurLines = [
        devis.entreprise.nom,
        devis.entreprise.adresse,
        `${devis.entreprise.codePostal} ${devis.entreprise.ville}`,
        devis.entreprise.telephone && `Tél: ${devis.entreprise.telephone}`,
        devis.entreprise.email,
        devis.entreprise.siret && `SIRET: ${devis.entreprise.siret}`,
      ].filter(Boolean);

      emetteurLines.forEach(line => {
        doc.text(line || '', margin, y);
        y += 4.5;
      });

      // Destinataire
      y = startY + 6;
      const destinataireLines = [
        devis.client.nom,
        devis.client.adresse,
        `${devis.client.codePostal} ${devis.client.ville}`,
        devis.client.telephone && `Tél: ${devis.client.telephone}`,
        devis.client.email,
        devis.client.siret && `SIRET: ${devis.client.siret}`
      ].filter(Boolean);

      destinataireLines.forEach(line => {
        doc.text(line || '', pageWidth / 2 + 5, y);
        y += 4.5;
      });

      y = startY + Math.max(emetteurLines.length, destinataireLines.length) * 4.5 + 12;

      // === INFORMATIONS DU DEVIS ===
      doc.setFillColor(...BG);
      doc.rect(margin, y, contentWidth, 16, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(...DARK);
      doc.text(`Date d'émission: ${new Date(devis.dateCreation).toLocaleDateString('fr-FR')}`, margin + 4, y + 6);
      doc.text(`Date de validité: ${new Date(devis.dateValidite).toLocaleDateString('fr-FR')}`, margin + 4, y + 11);
      
      if (devis.objet) {
        const objetText = devis.objet.length > 45 ? devis.objet.substring(0, 45) + '...' : devis.objet;
        doc.text(`Objet: ${objetText}`, pageWidth / 2 + 5, y + 8);
      }
      
      y += 22;

      // === PRESTATIONS ===
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...DARK);
      doc.text('Détail des prestations', margin, y);
      y += 7;

      // En-tête tableau
      doc.setFillColor(...DARK);
      doc.rect(margin, y, contentWidth, 7, 'F');
      
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('Désignation', margin + 2, y + 4.5);
      doc.text('Qté', margin + 95, y + 4.5);
      doc.text('Unité', margin + 108, y + 4.5);
      doc.text('P.U. HT', margin + 128, y + 4.5);
      doc.text('TVA', margin + 148, y + 4.5);
      doc.text('Total HT', pageWidth - margin - 2, y + 4.5, { align: 'right' });
      
      y += 9;
      doc.setFont('helvetica', 'normal');

      // Lignes prestations
      let alternate = false;
      devis.prestations.forEach((prestation) => {
        if (y > pageHeight - 50) {
          doc.addPage();
          y = 20;
          alternate = false;
        }

        if (alternate) {
          doc.setFillColor(...BG);
          doc.rect(margin, y - 3, contentWidth, 7, 'F');
        }

        doc.setFontSize(8);
        doc.setTextColor(...DARK);
        
        const designation = prestation.designation.length > 38 
          ? prestation.designation.substring(0, 38) + '...' 
          : prestation.designation;
        
        doc.text(designation, margin + 2, y + 1);
        doc.text(prestation.quantite.toString(), margin + 97, y + 1);
        doc.text(prestation.uniteMesure, margin + 110, y + 1);
        doc.text(formatCurrency(prestation.prixUnitaireHT), margin + 130, y + 1, { align: 'left' });
        doc.text(`${prestation.tauxTVA}%`, margin + 150, y + 1);
        doc.text(formatCurrency(prestation.totalHT), pageWidth - margin - 2, y + 1, { align: 'right' });
        
        y += 7;
        alternate = !alternate;
      });

      y += 3;

      // === RÉCAPITULATIF TVA ===
      if (tvaBreakdown.length > 0) {
        if (y > pageHeight - 70) {
          doc.addPage();
          y = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...DARK);
        doc.text('Récapitulatif TVA', margin, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        
        tvaBreakdown.forEach(item => {
          doc.setTextColor(...MEDIUM);
          doc.text(`TVA ${item.taux}%`, margin + 2, y);
          doc.setTextColor(...DARK);
          doc.text(`Base HT: ${formatCurrency(item.baseHT)}`, margin + 25, y);
          doc.text(`Montant: ${formatCurrency(item.montantTVA)}`, margin + 70, y);
          y += 5;
        });
        
        y += 5;
      }

      // === TOTAUX ===
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 20;
      }

      const totalBoxX = pageWidth - 70;
      const totalBoxY = y;
      const totalBoxHeight = devis.totaux.acompteTTC ? 32 : 25;

      doc.setFillColor(...BG);
      doc.rect(totalBoxX, totalBoxY, 50, totalBoxHeight, 'F');
      doc.setDrawColor(...LIGHT);
      doc.rect(totalBoxX, totalBoxY, 50, totalBoxHeight);

      doc.setFontSize(9);
      doc.setTextColor(...DARK);
      doc.text('Total HT:', totalBoxX + 3, totalBoxY + 6);
      doc.text(formatCurrency(devis.totaux.totalHT), totalBoxX + 47, totalBoxY + 6, { align: 'right' });
      
      doc.text('Total TVA:', totalBoxX + 3, totalBoxY + 12);
      doc.text(formatCurrency(devis.totaux.totalTVA), totalBoxX + 47, totalBoxY + 12, { align: 'right' });
      
      doc.setDrawColor(...DARK);
      doc.line(totalBoxX + 3, totalBoxY + 14, totalBoxX + 47, totalBoxY + 14);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...PRIMARY);
      doc.text('Total TTC:', totalBoxX + 3, totalBoxY + 20);
      doc.text(formatCurrency(devis.totaux.totalTTC), totalBoxX + 47, totalBoxY + 20, { align: 'right' });
      doc.setFont('helvetica', 'normal');

      if (devis.totaux.acompteTTC) {
        doc.setFontSize(8);
        doc.setTextColor(...DARK);
        doc.text(`Acompte: ${formatCurrency(devis.totaux.acompteTTC)}`, totalBoxX + 3, totalBoxY + 26);
        doc.text(`Reste: ${formatCurrency(devis.totaux.resteAPayer || 0)}`, totalBoxX + 3, totalBoxY + 30);
      }

      y = totalBoxY + totalBoxHeight + 10;

      // === CONDITIONS ===
      if (devis.conditions && (devis.conditions.delaiExecution || devis.conditions.conditionsPaiement)) {
        if (y > pageHeight - 45) {
          doc.addPage();
          y = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...DARK);
        doc.text('Conditions', margin, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...DARK);

        if (devis.conditions.delaiExecution) {
          doc.text(`Délai d'exécution: ${devis.conditions.delaiExecution}`, margin + 2, y);
          y += 5;
        }
        if (devis.conditions.conditionsPaiement) {
          doc.text(`Conditions de paiement: ${devis.conditions.conditionsPaiement}`, margin + 2, y);
          y += 5;
        }
        if (devis.conditions.modalitesPaiement?.length) {
          doc.text(`Modalités: ${devis.conditions.modalitesPaiement.join(', ')}`, margin + 2, y);
          y += 5;
        }
        
        y += 5;
      }

      // === COMMENTAIRES ===
      if (devis.commentaires) {
        if (y > pageHeight - 35) {
          doc.addPage();
          y = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...DARK);
        doc.text('Commentaires', margin, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...DARK);
        
        const commentLines = doc.splitTextToSize(devis.commentaires, contentWidth);
        commentLines.forEach((line: string) => {
          if (y > pageHeight - 25) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, margin, y);
          y += 4;
        });
        
        y += 6;
      }

      // === MENTIONS LÉGALES ===
      const mentionsPersonnalisees = getMentionsPersonnalisees();
      const nbLignesMentions = 3 + mentionsPersonnalisees.length;
      const espaceMentions = nbLignesMentions * 4 + 15;
      
      if (y > pageHeight - espaceMentions) {
        doc.addPage();
        y = 20;
      }

      doc.setDrawColor(...LIGHT);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...DARK);
      doc.text('Mentions légales', margin, y);
      y += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...MEDIUM);
      
      // Mentions obligatoires
      const mentionsObligatoires = [
        `Ce devis est valable ${devis.conditions?.validite || 30} jours. L'acceptation implique l'adhésion aux CGV.`,
        devis.entreprise.formeJuridique === 'Auto-entrepreneur' && 
          'TVA non applicable, art. 293 B du CGI (régime micro-entrepreneur).',
        'Pénalités de retard: 3x le taux d\'intérêt légal + indemnité forfaitaire de 40€.'
      ].filter(Boolean);

      mentionsObligatoires.forEach((mention) => {
        if (mention) {
          const lines = doc.splitTextToSize(mention, contentWidth - 3);
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
        y += 1;
        mentionsPersonnalisees.forEach((mention) => {
          const lines = doc.splitTextToSize(mention, contentWidth - 3);
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

      // Numéro de page
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(...LIGHT);
        doc.text(
          `Page ${i} / ${totalPages}`, 
          pageWidth / 2, 
          pageHeight - 8, 
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