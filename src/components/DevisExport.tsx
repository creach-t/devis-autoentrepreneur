import React from 'react';
import { Download, Eye, Printer } from 'lucide-react';
import { formatCurrency, getTVABreakdown } from '../utils/calculations';
import { getMentionsPersonnalisees, getLogo } from '../utils/storage';
import { PDF_COLORS, DIMENSIONS, TABLE_CONFIG, FONTS, SPACING } from '../styles/devisTheme';
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
      const margin = DIMENSIONS.margin;
      const contentWidth = pageWidth - (2 * margin);
      let y = margin;

      doc.setFont('helvetica');

      // === BARRE ACCENT LATÉRALE ===
      doc.setFillColor(...PDF_COLORS.accent);
      doc.rect(0, 0, DIMENSIONS.accentBarWidth, pageHeight, 'F');

      // === ZONE LOGO ===
      const logoUrl = getLogo();
      if (logoUrl) {
        try {
          // Ajouter le logo
          doc.addImage(
            logoUrl,
            'PNG',
            margin,
            y,
            DIMENSIONS.logoWidth,
            DIMENSIONS.logoHeight,
            undefined,
            'FAST'
          );
          y += DIMENSIONS.logoHeight + SPACING.xxl;
        } catch (logoError) {
          console.warn('Erreur ajout logo au PDF:', logoError);
          y += SPACING.xxl;
        }
      } else {
        y += SPACING.xxl;
      }

      // === EN-TÊTE ===
      doc.setFontSize(FONTS.sizes.title);
      doc.setTextColor(...PDF_COLORS.textPrimary);
      doc.setFont('helvetica', 'normal');
      doc.text('DEVIS', pageWidth / 2, y, { align: 'center' });
      y += 8;
      
      doc.setFontSize(FONTS.sizes.subtitle);
      doc.setTextColor(...PDF_COLORS.textMuted);
      doc.text(`N° ${devis.numero}`, pageWidth / 2, y, { align: 'center' });
      y += 18;

      // === ÉMETTEUR ET DESTINATAIRE ===
      const startY = y;
      
      // Titres
      doc.setFontSize(FONTS.sizes.sectionTitle);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...PDF_COLORS.accent);
      doc.text('ÉMETTEUR', margin, y);
      doc.text('DESTINATAIRE', pageWidth / 2 + 5, y);
      y += 1;
      
      // Lignes sous les titres
      doc.setDrawColor(...PDF_COLORS.accent);
      doc.setLineWidth(0.5);
      doc.line(margin, y, margin + 40, y);
      doc.line(pageWidth / 2 + 5, y, pageWidth / 2 + 55, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(FONTS.sizes.normal);
      doc.setTextColor(...PDF_COLORS.textPrimary);
      
      // Émetteur
      const emetteurLines = [
        devis.entreprise.nom,
        devis.entreprise.adresse,
        `${devis.entreprise.codePostal} ${devis.entreprise.ville}`,
        devis.entreprise.telephone && `Tél: ${devis.entreprise.telephone}`,
        devis.entreprise.email,
      ].filter(Boolean);

      emetteurLines.forEach(line => {
        doc.text(line || '', margin, y);
        y += 4.5;
      });

      // Infos légales entreprise
      doc.setFontSize(FONTS.sizes.small);
      doc.setTextColor(...PDF_COLORS.textLight);
      if (devis.entreprise.siret) {
        doc.text(`SIRET: ${devis.entreprise.siret}`, margin, y);
        y += 4;
      }
      if (devis.entreprise.numeroTVA) {
        doc.text(`N° TVA: ${devis.entreprise.numeroTVA}`, margin, y);
      }

      // Destinataire
      y = startY + 6;
      doc.setFontSize(FONTS.sizes.normal);
      doc.setTextColor(...PDF_COLORS.textPrimary);
      
      const destinataireLines = [
        devis.client.nom,
        devis.client.adresse,
        `${devis.client.codePostal} ${devis.client.ville}`,
        devis.client.telephone && `Tél: ${devis.client.telephone}`,
        devis.client.email,
      ].filter(Boolean);

      destinataireLines.forEach(line => {
        doc.text(line || '', pageWidth / 2 + 5, y);
        y += 4.5;
      });

      // Infos légales client
      doc.setFontSize(FONTS.sizes.small);
      doc.setTextColor(...PDF_COLORS.textLight);
      if (devis.client.siret) {
        doc.text(`SIRET: ${devis.client.siret}`, pageWidth / 2 + 5, y);
      }

      y = startY + Math.max(emetteurLines.length, destinataireLines.length) * 4.5 + 18;

      // === BANDE INFORMATIONS DU DEVIS ===
      doc.setFillColor(...PDF_COLORS.bgGray);
      doc.rect(margin, y, contentWidth, 16, 'F');
      
      doc.setFontSize(FONTS.sizes.small);
      doc.setTextColor(...PDF_COLORS.textMuted);
      doc.text("DATE D'ÉMISSION", margin + 4, y + 4);
      doc.text("VALIDITÉ", margin + 65, y + 4);
      if (devis.objet) {
        doc.text("OBJET", margin + 125, y + 4);
      }
      
      doc.setFontSize(FONTS.sizes.normal);
      doc.setTextColor(...PDF_COLORS.textPrimary);
      doc.setFont('helvetica', 'bold');
      doc.text(new Date(devis.dateCreation).toLocaleDateString('fr-FR'), margin + 4, y + 9);
      doc.text(new Date(devis.dateValidite).toLocaleDateString('fr-FR'), margin + 65, y + 9);
      
      if (devis.objet) {
        const objetText = devis.objet.length > 25 ? devis.objet.substring(0, 25) + '...' : devis.objet;
        doc.text(objetText, margin + 125, y + 9);
      }
      
      doc.setFont('helvetica', 'normal');
      y += 22;

      // === PRESTATIONS ===
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(FONTS.sizes.sectionTitle);
      doc.setTextColor(...PDF_COLORS.accent);
      doc.text('DÉTAIL DES PRESTATIONS', margin, y);
      y += 1;
      doc.setDrawColor(...PDF_COLORS.accent);
      doc.setLineWidth(0.5);
      doc.line(margin, y, margin + 70, y);
      y += 6;

      // En-tête tableau
      doc.setFillColor(...TABLE_CONFIG.header.fillColor);
      doc.rect(margin, y, contentWidth, TABLE_CONFIG.header.height, 'F');
      
      doc.setFontSize(TABLE_CONFIG.header.fontSize);
      doc.setTextColor(...TABLE_CONFIG.header.textColor);
      doc.setFont('helvetica', 'bold');
      doc.text('DÉSIGNATION', margin + 2, y + 4.5);
      doc.text('QTÉ', margin + 95, y + 4.5);
      doc.text('UNITÉ', margin + 108, y + 4.5);
      doc.text('P.U. HT', margin + 128, y + 4.5);
      doc.text('TVA', margin + 148, y + 4.5);
      doc.text('TOTAL HT', pageWidth - margin - 2, y + 4.5, { align: 'right' });
      
      y += TABLE_CONFIG.header.height + 2;
      doc.setFont('helvetica', 'normal');

      // Lignes prestations avec désignation multi-lignes
      let alternate = false;
      devis.prestations.forEach((prestation) => {
        doc.setFontSize(TABLE_CONFIG.body.fontSize);
        
        // Calculer les lignes de désignation
        const designationLines = doc.splitTextToSize(prestation.designation, 85);
        const lineCount = Math.min(designationLines.length, 3); // Max 3 lignes par prestation
        const rowHeight = Math.max(TABLE_CONFIG.body.rowHeight, lineCount * 4.5);
        
        // Vérifier si on doit changer de page
        if (y + rowHeight > pageHeight - 50) {
          doc.addPage();
          y = 20;
          alternate = false;
        }

        // Fond alterné
        if (alternate) {
          doc.setFillColor(...TABLE_CONFIG.body.altRowColor);
          doc.rect(margin, y - 3, contentWidth, rowHeight, 'F');
        }

        doc.setTextColor(...TABLE_CONFIG.body.textColor);
        
        // Désignation multi-lignes (max 3 lignes)
        const displayLines = designationLines.slice(0, 3);
        let lineY = y + 1;
        displayLines.forEach((line: string, idx: number) => {
          if (idx === 2 && designationLines.length > 3) {
            // Si tronqué, ajouter "..."
            doc.text(line.substring(0, line.length - 3) + '...', margin + 2, lineY);
          } else {
            doc.text(line, margin + 2, lineY);
          }
          lineY += 4;
        });
        
        // Autres colonnes centrées verticalement
        const centerY = y + (rowHeight / 2) + 1;
        doc.text(prestation.quantite.toString(), margin + 97, centerY);
        doc.text(prestation.uniteMesure, margin + 110, centerY);
        doc.text(formatCurrency(prestation.prixUnitaireHT), margin + 130, centerY);
        doc.text(`${prestation.tauxTVA}%`, margin + 150, centerY);
        
        doc.setTextColor(...PDF_COLORS.textPrimary);
        doc.setFont('helvetica', 'bold');
        doc.text(formatCurrency(prestation.totalHT), pageWidth - margin - 2, centerY, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        
        y += rowHeight;
        alternate = !alternate;
      });

      y += 5;

      // === RÉCAPITULATIF TVA ===
      if (tvaBreakdown.length > 0) {
        if (y > pageHeight - 70) {
          doc.addPage();
          y = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(FONTS.sizes.normal);
        doc.setTextColor(...PDF_COLORS.accent);
        doc.text('RÉCAPITULATIF TVA', margin, y);
        y += 1;
        doc.setDrawColor(...PDF_COLORS.accent);
        doc.line(margin, y, margin + 50, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(FONTS.sizes.small);
        
        tvaBreakdown.forEach(item => {
          doc.setTextColor(...PDF_COLORS.textMuted);
          doc.text(`TVA ${item.taux}%`, margin + 2, y);
          doc.setTextColor(...PDF_COLORS.textPrimary);
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

      doc.setFillColor(...PDF_COLORS.bgLight);
      doc.rect(totalBoxX, totalBoxY, 50, totalBoxHeight, 'F');
      doc.setDrawColor(...PDF_COLORS.borderLight);
      doc.rect(totalBoxX, totalBoxY, 50, totalBoxHeight);

      doc.setFontSize(FONTS.sizes.normal);
      doc.setTextColor(...PDF_COLORS.textSecondary);
      doc.text('Total HT', totalBoxX + 3, totalBoxY + 6);
      doc.text(formatCurrency(devis.totaux.totalHT), totalBoxX + 47, totalBoxY + 6, { align: 'right' });
      
      doc.text('TVA', totalBoxX + 3, totalBoxY + 12);
      doc.text(formatCurrency(devis.totaux.totalTVA), totalBoxX + 47, totalBoxY + 12, { align: 'right' });
      
      doc.setDrawColor(...PDF_COLORS.textPrimary);
      doc.setLineWidth(0.7);
      doc.line(totalBoxX + 3, totalBoxY + 14, totalBoxX + 47, totalBoxY + 14);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(FONTS.sizes.subtitle);
      doc.setTextColor(...PDF_COLORS.textPrimary);
      doc.text('Total TTC', totalBoxX + 3, totalBoxY + 20);
      
      doc.setTextColor(...PDF_COLORS.accent);
      doc.text(formatCurrency(devis.totaux.totalTTC), totalBoxX + 47, totalBoxY + 20, { align: 'right' });
      
      doc.setFont('helvetica', 'normal');

      if (devis.totaux.acompteTTC) {
        doc.setFontSize(FONTS.sizes.small);
        doc.setTextColor(...PDF_COLORS.textSecondary);
        doc.text(`Acompte: ${formatCurrency(devis.totaux.acompteTTC)}`, totalBoxX + 3, totalBoxY + 26);
        doc.setFont('helvetica', 'bold');
        doc.text(`Reste: ${formatCurrency(devis.totaux.resteAPayer || 0)}`, totalBoxX + 3, totalBoxY + 30);
        doc.setFont('helvetica', 'normal');
      }

      y = totalBoxY + totalBoxHeight + 10;

      // === CONDITIONS ===
      if (devis.conditions && (devis.conditions.delaiExecution || devis.conditions.conditionsPaiement)) {
        if (y > pageHeight - 45) {
          doc.addPage();
          y = 20;
        }

        let conditionsCount = 0;
        if (devis.conditions.delaiExecution) conditionsCount++;
        if (devis.conditions.conditionsPaiement) conditionsCount++;
        if (devis.conditions.modalitesPaiement?.length) conditionsCount++;
        
        const conditionsHeight = 5 + (conditionsCount * 4) + 8;
        const conditionsBoxY = y;

        doc.setFillColor(254, 243, 199);
        doc.rect(margin, conditionsBoxY, contentWidth, conditionsHeight, 'F');
        
        doc.setDrawColor(245, 158, 11);
        doc.setLineWidth(1);
        doc.line(margin, conditionsBoxY, margin, conditionsBoxY + conditionsHeight);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(FONTS.sizes.small);
        doc.setTextColor(120, 53, 15);
        doc.text('CONDITIONS', margin + 4, y + 5);
        y += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(FONTS.sizes.small);

        if (devis.conditions.delaiExecution) {
          const text = `Délai d'exécution: ${devis.conditions.delaiExecution}`;
          doc.text(text, margin + 4, y);
          y += 4;
        }
        if (devis.conditions.conditionsPaiement) {
          const text = `Conditions de paiement: ${devis.conditions.conditionsPaiement}`;
          doc.text(text, margin + 4, y);
          y += 4;
        }
        if (devis.conditions.modalitesPaiement?.length) {
          const text = `Modalités: ${devis.conditions.modalitesPaiement.join(', ')}`;
          doc.text(text, margin + 4, y);
          y += 4;
        }
        
        y += 8;
      }

      // === COMMENTAIRES ===
      if (devis.commentaires) {
        if (y > pageHeight - 35) {
          doc.addPage();
          y = 20;
        }

        const commentsBoxY = y;
        
        doc.setFontSize(FONTS.sizes.small);
        const commentsLines = doc.splitTextToSize(devis.commentaires, contentWidth - 8);
        const commentsHeight = 5 + (commentsLines.length * 4) + 8;

        doc.setFillColor(219, 234, 254);
        doc.rect(margin, commentsBoxY, contentWidth, commentsHeight, 'F');
        
        doc.setDrawColor(37, 99, 235);
        doc.setLineWidth(1);
        doc.line(margin, commentsBoxY, margin, commentsBoxY + commentsHeight);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(FONTS.sizes.small);
        doc.setTextColor(30, 58, 138);
        doc.text('COMMENTAIRES', margin + 4, y + 5);
        y += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(FONTS.sizes.small);
        
        commentsLines.forEach((line: string) => {
          if (y > pageHeight - 25) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, margin + 4, y);
          y += 4;
        });
        
        y += 8;
      }

      // === MENTIONS LÉGALES ===
      const mentionsPersonnalisees = getMentionsPersonnalisees();
      const nbLignesMentions = 3 + mentionsPersonnalisees.length;
      const espaceMentions = nbLignesMentions * 4 + 15;
      
      if (y > pageHeight - espaceMentions) {
        doc.addPage();
        y = 20;
      }

      doc.setDrawColor(...PDF_COLORS.borderLight);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(FONTS.sizes.small);
      doc.setTextColor(...PDF_COLORS.textPrimary);
      doc.text('MENTIONS LÉGALES', margin, y);
      y += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(FONTS.sizes.tiny);
      doc.setTextColor(...PDF_COLORS.textMuted);
      
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
        doc.setFontSize(FONTS.sizes.tiny);
        doc.setTextColor(...PDF_COLORS.textLight);
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
