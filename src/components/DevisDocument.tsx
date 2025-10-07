import React from 'react';
import { formatCurrency, getTVABreakdown } from '../utils/calculations';
import { getMentionsPersonnalisees } from '../utils/storage';
import { getPreviewCSS } from '../styles/devisTheme';
import type { Devis, DevisFormData } from '../types/devis';

interface DevisDocumentProps {
  devis?: Devis;
  formData?: DevisFormData;
  logoUrl?: string;
  showPageNumber?: boolean;
}

/**
 * Composant unifié pour le rendu des devis
 * Utilisé pour l'aperçu et comme base pour la génération PDF
 * Format A4: 210mm x 297mm
 */
export function DevisDocument({ 
  devis, 
  formData, 
  logoUrl,
  showPageNumber = true 
}: DevisDocumentProps) {
  // Utilise soit un devis complet soit les données du formulaire
  const data = devis || {
    numero: 'APERÇU',
    dateCreation: new Date(),
    dateValidite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    entreprise: formData?.entreprise || {},
    client: formData?.client || {},
    prestations: formData?.prestations || [],
    conditions: formData?.conditions || {},
    objet: formData?.objet || '',
    commentaires: formData?.commentaires || '',
    totaux: {
      totalHT: 0,
      totalTVA: 0,
      totalTTC: 0
    }
  };

  const tvaBreakdown = getTVABreakdown(data.prestations);
  const mentionsPersonnalisees = getMentionsPersonnalisees();

  return (
    <>
      <style>{getPreviewCSS()}</style>
      
      <div className="a4-page">
        {/* Barre accent */}
        <div className="accent-bar"></div>

        {/* Zone logo - affichée uniquement si un logo est configuré */}
        {logoUrl && (
          <div className="logo-zone">
            <img src={logoUrl} alt="Logo entreprise" />
          </div>
        )}

        {/* En-tête */}
        <div className="header">
          <h1>DEVIS</h1>
          <div className="numero">N° {data.numero}</div>
        </div>

        {/* Émetteur / Destinataire */}
        <div className="info-grid">
          <div className="info-block">
            <div className="section-title">Émetteur</div>
            <div className="company-name">
              {data.entreprise.nom || '[Nom entreprise]'}
            </div>
            <div className="detail">{data.entreprise.adresse || '[Adresse]'}</div>
            <div className="detail">
              {data.entreprise.codePostal || '[CP]'} {data.entreprise.ville || '[Ville]'}
            </div>
            {data.entreprise.telephone && (
              <div className="detail">Tél: {data.entreprise.telephone}</div>
            )}
            {data.entreprise.email && (
              <div className="detail">{data.entreprise.email}</div>
            )}
            {data.entreprise.siret && (
              <div className="legal">SIRET: {data.entreprise.siret}</div>
            )}
            {data.entreprise.numeroTVA && (
              <div className="legal">N° TVA: {data.entreprise.numeroTVA}</div>
            )}
          </div>

          <div className="info-block">
            <div className="section-title">Destinataire</div>
            <div className="company-name">
              {data.client.nom || '[Nom client]'}
            </div>
            <div className="detail">{data.client.adresse || '[Adresse]'}</div>
            <div className="detail">
              {data.client.codePostal || '[CP]'} {data.client.ville || '[Ville]'}
            </div>
            {data.client.telephone && (
              <div className="detail">Tél: {data.client.telephone}</div>
            )}
            {data.client.email && (
              <div className="detail">{data.client.email}</div>
            )}
            {data.client.siret && (
              <div className="legal">SIRET: {data.client.siret}</div>
            )}
          </div>
        </div>

        {/* Bande infos devis */}
        <div className="devis-info-bar">
          <div className="devis-info-item">
            <div className="label">Date d'émission</div>
            <div className="value">
              {data.dateCreation 
                ? new Date(data.dateCreation).toLocaleDateString('fr-FR') 
                : new Date().toLocaleDateString('fr-FR')}
            </div>
          </div>
          <div className="devis-info-item">
            <div className="label">Validité</div>
            <div className="value">
              {data.dateValidite 
                ? new Date(data.dateValidite).toLocaleDateString('fr-FR') 
                : 'À définir'}
            </div>
          </div>
          {data.objet && (
            <div className="devis-info-item">
              <div className="label">Objet</div>
              <div className="value">{data.objet}</div>
            </div>
          )}
        </div>

        {/* Prestations */}
        <div className="prestations-section">
          <div className="section-title">Détail des prestations</div>
          
          {data.prestations.length > 0 ? (
            <table className="prestations-table">
              <thead>
                <tr>
                  <th style={{ width: '45%' }}>Désignation</th>
                  <th className="center" style={{ width: '8%' }}>Qté</th>
                  <th className="center" style={{ width: '10%' }}>Unité</th>
                  <th className="right" style={{ width: '12%' }}>P.U. HT</th>
                  <th className="center" style={{ width: '8%' }}>TVA</th>
                  <th className="right" style={{ width: '17%' }}>Total HT</th>
                </tr>
              </thead>
              <tbody>
                {data.prestations.map((prestation, index) => (
                  <tr key={prestation.id || index}>
                    <td>{prestation.designation || '[Désignation]'}</td>
                    <td className="center">{prestation.quantite}</td>
                    <td className="center">{prestation.uniteMesure}</td>
                    <td className="right">{formatCurrency(prestation.prixUnitaireHT)}</td>
                    <td className="center">{prestation.tauxTVA}%</td>
                    <td className="right">{formatCurrency(prestation.totalHT)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '20mm 0', 
              color: '#94a3b8',
              border: '1px solid #e2e8f0',
              borderRadius: '2mm'
            }}>
              Aucune prestation ajoutée
            </div>
          )}
        </div>

        {/* Récapitulatif TVA */}
        {tvaBreakdown.length > 0 && (
          <div style={{ marginBottom: '8mm' }}>
            <div className="section-title" style={{ fontSize: '9pt' }}>
              Récapitulatif TVA
            </div>
            <table className="prestations-table" style={{ maxWidth: '250px' }}>
              <thead>
                <tr>
                  <th className="center">Taux TVA</th>
                  <th className="right">Base HT</th>
                  <th className="right">Montant TVA</th>
                </tr>
              </thead>
              <tbody>
                {tvaBreakdown.map((item, index) => (
                  <tr key={index}>
                    <td className="center">{item.taux}%</td>
                    <td className="right">{formatCurrency(item.baseHT)}</td>
                    <td className="right">{formatCurrency(item.montantTVA)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Totaux */}
        <div className="totaux-section">
          <div className="totaux-box">
            <div className="totaux-line">
              <span>Total HT</span>
              <span>{formatCurrency(data.totaux?.totalHT || 0)}</span>
            </div>
            <div className="totaux-line">
              <span>TVA</span>
              <span>{formatCurrency(data.totaux?.totalTVA || 0)}</span>
            </div>
            <div className="totaux-line total">
              <span>Total TTC</span>
              <span className="value">{formatCurrency(data.totaux?.totalTTC || 0)}</span>
            </div>
            {data.totaux?.acompteTTC && (
              <>
                <div className="totaux-line" style={{ 
                  fontSize: '8pt', 
                  marginTop: '4mm',
                  paddingTop: '4mm',
                  borderTop: '1px solid #e2e8f0'
                }}>
                  <span>Acompte demandé</span>
                  <span>{formatCurrency(data.totaux.acompteTTC)}</span>
                </div>
                <div className="totaux-line" style={{ fontWeight: 600 }}>
                  <span>Reste à payer</span>
                  <span>{formatCurrency(data.totaux.resteAPayer || 0)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Conditions */}
        {data.conditions && (
          data.conditions.delaiExecution || 
          data.conditions.conditionsPaiement || 
          data.conditions.modalitesPaiement?.length
        ) && (
          <div className="conditions-box">
            <div className="box-title">Conditions</div>
            {data.conditions.delaiExecution && (
              <div>
                <strong>Délai d'exécution:</strong> {data.conditions.delaiExecution}
              </div>
            )}
            {data.conditions.conditionsPaiement && (
              <div>
                <strong>Conditions de paiement:</strong> {data.conditions.conditionsPaiement}
              </div>
            )}
            {data.conditions.modalitesPaiement && data.conditions.modalitesPaiement.length > 0 && (
              <div>
                <strong>Modalités:</strong> {data.conditions.modalitesPaiement.join(', ')}
              </div>
            )}
          </div>
        )}

        {/* Commentaires */}
        {data.commentaires && (
          <div className="comments-box">
            <div className="box-title">Commentaires</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{data.commentaires}</div>
          </div>
        )}

        {/* Mentions légales */}
        <div className="mentions-legales">
          <div className="title">Mentions légales</div>
          
          <p>
            • Ce devis est valable {data.conditions?.validite || 30} jours à compter de sa date d'émission. 
            L'acceptation du présent devis implique l'adhésion entière aux conditions générales de vente.
          </p>
          
          {data.entreprise.formeJuridique === 'Auto-entrepreneur' && (
            <p>
              • TVA non applicable, art. 293 B du CGI (régime micro-entrepreneur).
            </p>
          )}
          
          <p>
            • En cas de retard de paiement, des pénalités de retard au taux de 3 fois le taux d'intérêt légal 
            seront applicables, ainsi qu'une indemnité forfaitaire de 40€ pour frais de recouvrement.
          </p>

          {mentionsPersonnalisees.length > 0 && (
            <div style={{ marginTop: '4mm', paddingTop: '4mm', borderTop: '1px solid #e2e8f0' }}>
              {mentionsPersonnalisees.map((mention, index) => (
                <p key={index}>• {mention}</p>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {showPageNumber && (
          <div className="page-footer">
            Page 1/1
          </div>
        )}
      </div>
    </>
  );
}
