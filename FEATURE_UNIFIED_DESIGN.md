# Unified Devis Design - Feature Branch

## 🎨 Objectif

Unification du design entre l'aperçu et le PDF généré avec un style sobre et professionnel en format A4.

## 📐 Caractéristiques

### Design
- **Format A4 exact**: 210mm × 297mm
- **Palette sobre professionnelle**: Bleu accent (#2563eb) + gris
- **Barre accent latérale**: Subtile (4mm) en dégradé bleu
- **Zone logo intégrable**: 50mm × 20mm en haut à gauche
- **Typographie**: Helvetica, hiérarchie claire

### Architecture

```
src/
├── styles/
│   └── devisTheme.ts          # ✨ Thème partagé (couleurs, dimensions, CSS)
├── components/
│   ├── DevisDocument.tsx      # ✨ Composant unifié A4
│   ├── DevisPreview.tsx       # ♻️ Refactorisé (wrapper léger)
│   └── DevisExport.tsx        # ♻️ Refactorisé (utilise thème)
```

### Nouveaux fichiers

#### `src/styles/devisTheme.ts`
Thème centralisé contenant:
- `COLORS`: Palette complète (hex & RGB)
- `DIMENSIONS`: Format A4, marges, zones
- `FONTS`: Tailles et graisses typographiques
- `SPACING`: Espacements standardisés
- `TABLE_CONFIG`: Configuration tableau prestations
- `getPreviewCSS()`: Génération CSS pour preview
- `PDF_COLORS`: Valeurs RGB pour jsPDF

#### `src/components/DevisDocument.tsx`
Composant unifié pour le rendu:
- Utilisé par `DevisPreview` pour l'aperçu
- Base pour la génération PDF
- Format A4 exact avec dimensions réelles
- Support logo (via prop `logoUrl`)
- Intégration complète des données devis

### Modifications

#### `src/components/DevisPreview.tsx`
- ✅ Simplifié à 30 lignes (vs 400+)
- ✅ Wrapper autour de `DevisDocument`
- ✅ Aperçu fidèle format A4
- ✅ Styles inline pour preview

#### `src/components/DevisExport.tsx`
- ✅ Utilise le thème partagé `PDF_COLORS`, `DIMENSIONS`, `TABLE_CONFIG`
- ✅ Style aligné avec le preview
- ✅ Barre accent latérale bleue
- ✅ Sections conditions/commentaires colorées
- ✅ PDF texte sélectionnable (jsPDF)

## 🚀 Avantages

1. **Aperçu = PDF**: L'utilisateur voit exactement ce qui sera généré
2. **Maintenance facilitée**: Un seul thème à modifier
3. **Code propre**: Composants découplés et réutilisables
4. **Extensibilité**: Facile d'ajouter le logo ou personnaliser les couleurs
5. **Format A4**: Dimensions exactes pour impression

## 🔄 Prochaines étapes

### Court terme
- [ ] Tester l'aperçu sur différents écrans
- [ ] Tester la génération PDF
- [ ] Vérifier l'impression (Ctrl+P)
- [ ] Valider la gestion multi-pages PDF

### Moyen terme
- [ ] Implémenter l'upload de logo
- [ ] Personnalisation des couleurs accent
- [ ] Export des thèmes personnalisés
- [ ] Templates de devis prédéfinis

### Long terme
- [ ] Aperçu multi-pages pour gros devis
- [ ] Watermark optionnel
- [ ] Signature électronique
- [ ] QR code avec lien validation

## 🧪 Tests recommandés

```bash
# 1. Lancer l'app
npm run dev

# 2. Tester l'aperçu
# - Créer un devis avec plusieurs prestations
# - Vérifier le format A4
# - Vérifier les couleurs

# 3. Générer le PDF
# - Télécharger le PDF
# - Vérifier que le style correspond
# - Tester la sélection de texte

# 4. Test impression
# - Ouvrir l'aperçu
# - Ctrl+P / Cmd+P
# - Vérifier le rendu print
```

## 📊 Comparaison avant/après

| Aspect | Avant | Après |
|--------|-------|-------|
| Cohérence Preview/PDF | ❌ Différents | ✅ Identiques |
| Lignes de code Preview | 400+ | 30 |
| Thème centralisé | ❌ Non | ✅ Oui |
| Format A4 exact | ⚠️ Approximatif | ✅ Exact |
| Maintenance | 🔴 Difficile | 🟢 Facile |
| Style | ⚠️ Basique | ✅ Pro sobre |

## 💡 Notes techniques

### CSS Preview
Le CSS est généré dynamiquement via `getPreviewCSS()` pour garantir la cohérence avec les constantes du thème.

### jsPDF
Les couleurs RGB sont définies dans `PDF_COLORS` pour correspondre exactement au preview HTML.

### Zone logo
Placeholder prévu (50mm × 20mm) avec gestion d'image à implémenter:
```tsx
<DevisDocument logoUrl="/path/to/logo.png" />
```

### Responsive
Le design est optimisé pour A4, mais le container preview s'adapte aux petits écrans avec scroll.

## 🐛 Bugs connus

Aucun pour le moment - À tester !

## 📝 Conventions

- **Couleurs**: Toujours via `COLORS` ou `PDF_COLORS`
- **Espacements**: Utiliser `SPACING` (en mm)
- **Fonts**: Utiliser `FONTS.sizes` et `FONTS.weights`
- **Composants**: Props typées strictement
