import React from 'react';
import { formatCurrency, getTVABreakdown } from '../utils/calculations';
import { getMentionsPersonnalisees } from '../utils/storage';
import type { Devis, DevisFormData } from '../types/devis';

interface DevisPreviewProps {
  devis?: Devis;
  formData?: DevisFormData;
  showHeader?: boolean;
}

export function DevisPreview({ devis, formData, showHeader = true }: DevisPreviewProps) {
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
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg print:shadow-none" id="devis-preview">
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          #devis-preview { 
            box-shadow: none !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20mm !important;
          }
          .print\\:shadow-none { box-shadow: none !important; }
        }
      `}</style>

      {/* En-tête */}
      {showHeader && (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">DEVIS</h1>
          <div className="text-lg text-gray-600">
            N° {data.numero}
          </div>
        </div>
      )}

      {/* Informations entreprise et client */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Entreprise */}
        <div>
          <h2 className="text-lg font-semibold text-blue-600 mb-3 border-b border-blue-200 pb-2">
            Émetteur
          </h2>
          <div className="space-y-1 text-sm">
            <div className="font-semibold">{data.entreprise.nom || '[Nom entreprise]'}</div>
            <div>{data.entreprise.adresse || '[Adresse]'}</div>
            <div>
              {data.entreprise.codePostal || '[CP]'} {data.entreprise.ville || '[Ville]'}
            </div>
            {data.entreprise.telephone && (
              <div>Tél: {data.entreprise.telephone}</div>
            )}
            {data.entreprise.email && (
              <div>{data.entreprise.email}</div>
            )}
            {data.entreprise.siret && (
              <div className="text-xs text-gray-600 mt-2">
                SIRET: {data.entreprise.siret}
              </div>
            )}
            {data.entreprise.numeroTVA && (
              <div className="text-xs text-gray-600">
                N° TVA: {data.entreprise.numeroTVA}
              </div>
            )}
          </div>
        </div>

        {/* Client */}
        <div>
          <h2 className="text-lg font-semibold text-blue-600 mb-3 border-b border-blue-200 pb-2">
            Destinataire
          </h2>
          <div className="space-y-1 text-sm">
            <div className="font-semibold">{data.client.nom || '[Nom client]'}</div>
            <div>{data.client.adresse || '[Adresse]'}</div>
            <div>
              {data.client.codePostal || '[CP]'} {data.client.ville || '[Ville]'}
            </div>
            {data.client.telephone && (
              <div>Tél: {data.client.telephone}</div>
            )}
            {data.client.email && (
              <div>{data.client.email}</div>
            )}
            {data.client.siret && (
              <div className="text-xs text-gray-600 mt-2">
                SIRET: {data.client.siret}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Informations du devis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
        <div>
          <span className="text-xs text-gray-600">Date d'émission:</span>
          <div className="font-semibold text-sm">
            {data.dateCreation ? new Date(data.dateCreation).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-600">Date de validité:</span>
          <div className="font-semibold text-sm">
            {data.dateValidite ? new Date(data.dateValidite).toLocaleDateString('fr-FR') : 'À définir'}
          </div>
        </div>
        {data.objet && (
          <div className="md:col-span-1">
            <span className="text-xs text-gray-600">Objet:</span>
            <div className="font-semibold text-sm">{data.objet}</div>
          </div>
        )}
      </div>

      {/* Tableau des prestations */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Détail des prestations</h2>
        
        {data.prestations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border border-gray-300 px-3 py-2 text-left">Désignation</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Qté</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Unité</th>
                  <th className="border border-gray-300 px-3 py-2 text-right">P.U. HT</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">TVA</th>
                  <th className="border border-gray-300 px-3 py-2 text-right">Total HT</th>
                </tr>
              </thead>
              <tbody>
                {data.prestations.map((prestation, index) => (
                  <tr key={prestation.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-3 py-2">
                      {prestation.designation || '[Désignation]'}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {prestation.quantite}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {prestation.uniteMesure}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      {formatCurrency(prestation.prixUnitaireHT)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {prestation.tauxTVA}%
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-semibold">
                      {formatCurrency(prestation.totalHT)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 border border-gray-300 rounded-lg">
            Aucune prestation ajoutée
          </div>
        )}
      </div>

      {/* Récapitulatif TVA */}
      {tvaBreakdown.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Récapitulatif TVA</h3>
          <div className="overflow-x-auto">
            <table className="w-full max-w-md border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-center">Taux TVA</th>
                  <th className="border border-gray-300 px-3 py-2 text-right">Base HT</th>
                  <th className="border border-gray-300 px-3 py-2 text-right">Montant TVA</th>
                </tr>
              </thead>
              <tbody>
                {tvaBreakdown.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {item.taux}%
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      {formatCurrency(item.baseHT)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      {formatCurrency(item.montantTVA)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Totaux */}
      <div className="mb-6">
        <div className="flex justify-end">
          <div className="w-full max-w-md">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total HT:</span>
                  <span className="font-semibold">{formatCurrency(data.totaux?.totalHT || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total TVA:</span>
                  <span className="font-semibold">{formatCurrency(data.totaux?.totalTVA || 0)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total TTC:</span>
                    <span className="text-blue-600">{formatCurrency(data.totaux?.totalTTC || 0)}</span>
                  </div>
                </div>
                
                {data.totaux?.acompteTTC && (
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Acompte demandé:</span>
                      <span>{formatCurrency(data.totaux.acompteTTC)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Reste à payer:</span>
                      <span>{formatCurrency(data.totaux.resteAPayer || 0)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conditions */}
      {data.conditions && (data.conditions.delaiExecution || data.conditions.conditionsPaiement) && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-sm font-semibold text-yellow-800 mb-3">Conditions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
            {data.conditions.delaiExecution && (
              <div>
                <span className="font-medium text-gray-700">Délai d'exécution:</span>
                <span className="ml-2 text-gray-600">{data.conditions.delaiExecution}</span>
              </div>
            )}
            {data.conditions.conditionsPaiement && (
              <div>
                <span className="font-medium text-gray-700">Conditions de paiement:</span>
                <span className="ml-2 text-gray-600">{data.conditions.conditionsPaiement}</span>
              </div>
            )}
            {data.conditions.modalitesPaiement && data.conditions.modalitesPaiement.length > 0 && (
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Modalités acceptées:</span>
                <span className="ml-2 text-gray-600">{data.conditions.modalitesPaiement.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Commentaires */}
      {data.commentaires && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Commentaires</h3>
          <div className="text-xs whitespace-pre-wrap text-gray-700">{data.commentaires}</div>
        </div>
      )}

      {/* Mentions légales */}
      <div className="border-t border-gray-300 pt-4 text-xs text-gray-600 space-y-2">
        <p className="font-semibold text-gray-800 text-sm mb-2">
          Mentions légales
        </p>
        
        {/* Mentions obligatoires */}
        <div className="space-y-1">
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
        </div>

        {/* Mentions personnalisées */}
        {mentionsPersonnalisees.length > 0 && (
          <div className="mt-3 pt-2 border-t border-gray-200">
            <div className="space-y-1">
              {mentionsPersonnalisees.map((mention, index) => (
                <p key={index}>• {mention}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}