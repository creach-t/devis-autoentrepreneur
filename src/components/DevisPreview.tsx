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
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg" id="devis-preview">
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
          <h2 className="text-xl font-semibold text-blue-600 mb-4 border-b border-blue-200 pb-2">
            Émetteur
          </h2>
          <div className="space-y-1">
            <div className="font-semibold text-lg">{data.entreprise.nom || '[Nom entreprise]'}</div>
            <div>{data.entreprise.adresse || '[Adresse]'}</div>
            <div>
              {data.entreprise.codePostal || '[CP]'} {data.entreprise.ville || '[Ville]'}
            </div>
            {data.entreprise.telephone && (
              <div>Tél: {data.entreprise.telephone}</div>
            )}
            {data.entreprise.email && (
              <div>Email: {data.entreprise.email}</div>
            )}
            {data.entreprise.siret && (
              <div className="text-sm text-gray-600 mt-2">
                SIRET: {data.entreprise.siret}
              </div>
            )}
            {data.entreprise.numeroTVA && (
              <div className="text-sm text-gray-600">
                N° TVA: {data.entreprise.numeroTVA}
              </div>
            )}
          </div>
        </div>

        {/* Client */}
        <div>
          <h2 className="text-xl font-semibold text-green-600 mb-4 border-b border-green-200 pb-2">
            Destinataire
          </h2>
          <div className="space-y-1">
            <div className="font-semibold text-lg">{data.client.nom || '[Nom client]'}</div>
            <div>{data.client.adresse || '[Adresse]'}</div>
            <div>
              {data.client.codePostal || '[CP]'} {data.client.ville || '[Ville]'}
            </div>
            {data.client.telephone && (
              <div>Tél: {data.client.telephone}</div>
            )}
            {data.client.email && (
              <div>Email: {data.client.email}</div>
            )}
            {data.client.siret && (
              <div className="text-sm text-gray-600 mt-2">
                SIRET: {data.client.siret}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Informations du devis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
        <div>
          <span className="text-sm text-gray-600">Date d'émission:</span>
          <div className="font-semibold">
            {data.dateCreation ? new Date(data.dateCreation).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>
        <div>
          <span className="text-sm text-gray-600">Date de validité:</span>
          <div className="font-semibold">
            {data.dateValidite ? new Date(data.dateValidite).toLocaleDateString('fr-FR') : 'À définir'}
          </div>
        </div>
        {data.objet && (
          <div className="md:col-span-1">
            <span className="text-sm text-gray-600">Objet:</span>
            <div className="font-semibold">{data.objet}</div>
          </div>
        )}
      </div>

      {/* Tableau des prestations */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-purple-600 mb-4">Détail des prestations</h2>
        
        {data.prestations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left">Désignation</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Qté</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Unité</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">P.U. HT</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">TVA</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Total HT</th>
                </tr>
              </thead>
              <tbody>
                {data.prestations.map((prestation, index) => (
                  <tr key={prestation.id || index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">
                      {prestation.designation || '[Désignation]'}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {prestation.quantite}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {prestation.uniteMesure}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right">
                      {formatCurrency(prestation.prixUnitaireHT)}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {prestation.tauxTVA}%
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
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
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Récapitulatif TVA</h3>
          <div className="overflow-x-auto">
            <table className="w-full max-w-md border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-center">Taux TVA</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Base HT</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Montant TVA</th>
                </tr>
              </thead>
              <tbody>
                {tvaBreakdown.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {item.taux}%
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {formatCurrency(item.baseHT)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
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
      <div className="mb-8">
        <div className="flex justify-end">
          <div className="w-full max-w-md">
            <div className="bg-gray-50 p-6 rounded-lg border">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total HT:</span>
                  <span className="font-semibold">{formatCurrency(data.totaux?.totalHT || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total TVA:</span>
                  <span className="font-semibold">{formatCurrency(data.totaux?.totalTVA || 0)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total TTC:</span>
                    <span className="text-blue-600">{formatCurrency(data.totaux?.totalTTC || 0)}</span>
                  </div>
                </div>
                
                {data.totaux?.acompteTTC && (
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-sm text-gray-600">
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
      {data.conditions && (
        <div className="mb-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">Conditions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {data.conditions.validite && (
              <div>
                <span className="font-medium">Validité du devis:</span>
                <div>{data.conditions.validite} jours</div>
              </div>
            )}
            {data.conditions.delaiExecution && (
              <div>
                <span className="font-medium">Délai d'exécution:</span>
                <div>{data.conditions.delaiExecution}</div>
              </div>
            )}
            {data.conditions.conditionsPaiement && (
              <div>
                <span className="font-medium">Conditions de paiement:</span>
                <div>{data.conditions.conditionsPaiement}</div>
              </div>
            )}
            {data.conditions.modalitesPaiement && data.conditions.modalitesPaiement.length > 0 && (
              <div>
                <span className="font-medium">Modalités de paiement:</span>
                <div>{data.conditions.modalitesPaiement.join(', ')}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Commentaires */}
      {data.commentaires && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Commentaires</h3>
          <div className="text-sm whitespace-pre-wrap">{data.commentaires}</div>
        </div>
      )}

      {/* Mentions légales */}
      <div className="border-t pt-6 text-xs text-gray-500 space-y-2">
        <p className="font-semibold text-gray-700">
          Mentions légales obligatoires:
        </p>
        
        {/* Mentions obligatoires */}
        <div className="space-y-1.5">
          <p>
            Ce devis est valable {data.conditions?.validite || 30} jours à compter de sa date d'émission.
            L'acceptation du présent devis implique l'adhésion entière aux conditions générales de vente.
          </p>
          {data.entreprise.formeJuridique === 'Auto-entrepreneur' && (
            <p>
              TVA non applicable, art. 293 B du CGI (régime micro-entrepreneur).
            </p>
          )}
          <p>
            En cas de retard de paiement, des pénalités de retard au taux de 3 fois le taux d'intérêt légal 
            seront applicables, ainsi qu'une indemnité forfaitaire de 40€ pour frais de recouvrement.
          </p>
        </div>

        {/* Mentions personnalisées */}
        {mentionsPersonnalisees.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-300">
            <p className="font-semibold text-gray-700 mb-2">
              Mentions complémentaires:
            </p>
            <div className="space-y-1.5">
              {mentionsPersonnalisees.map((mention, index) => (
                <p key={index}>{mention}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}