# 📄 Devis Pro - Auto-entrepreneur

Application web moderne pour la création et gestion de devis destinée aux auto-entrepreneurs. Simple, rapide et conforme à la réglementation française.

## ✨ Fonctionnalités

### 🎯 Core Features
- ✅ **Création de devis rapide** - Formulaire intuitif avec calculs automatiques
- ✅ **Aperçu temps réel** - Visualisation immédiate du devis
- ✅ **Stockage local** - Aucune connexion requise, données sauvées dans le navigateur
- ✅ **Auto-sauvegarde** - Protection contre la perte de données
- ✅ **Numérotation automatique** - Séquence conforme (DEVIS-ANNÉE-XXXX)
- ✅ **Gestion historique** - Recherche, filtres et actions sur les devis
- ✅ **Export/Impression** - Optimisé pour l'impression PDF

### 🧮 Calculs Métier
- ✅ **Calculs TVA automatiques** - Support multi-taux (0%, 5.5%, 10%, 20%)
- ✅ **Récapitulatif TVA** - Par taux pour conformité comptable
- ✅ **Gestion acomptes** - Calcul automatique du reste à payer
- ✅ **Totaux temps réel** - HT, TVA, TTC mis à jour instantanément

### 📋 Conformité Légale
- ✅ **Mentions obligatoires** - Auto-entrepreneur et entreprises classiques
- ✅ **Conditions standard** - Délais, paiement, validité
- ✅ **Format français** - Dates, devises, taux TVA

### 🎨 Interface Utilisateur
- ✅ **Design moderne** - Interface clean avec Tailwind CSS
- ✅ **Responsive** - Optimisé mobile et desktop
- ✅ **Icônes Lucide** - Interface claire et intuitive
- ✅ **Navigation fluide** - Workflow logique pour l'utilisateur

## 🚀 Installation & Lancement

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Commandes
```bash
# Cloner le repository
git clone https://github.com/creach-t/devis-autoentrepreneur.git
cd devis-autoentrepreneur

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build

# Tests
npm run test
```

L'application sera accessible sur `http://localhost:3000`

## 🏗️ Architecture Technique

### Stack Technologique
- **Frontend**: React 18 + TypeScript
- **Build**: Vite pour des performances optimales  
- **Styles**: Tailwind CSS + styles personnalisés
- **Icons**: Lucide React
- **Storage**: localStorage avec hooks custom
- **Export**: jsPDF + html2canvas (à implémenter)

### Structure du Projet
```
src/
├── components/          # Composants React
│   ├── DevisForm.tsx   # Formulaire principal
│   ├── DevisPreview.tsx # Aperçu du devis
│   └── DevisHistory.tsx # Historique et gestion
├── hooks/              # Hooks personnalisés
│   └── useLocalStorage.tsx
├── types/              # Types TypeScript
│   └── devis.ts
├── utils/              # Utilitaires métier
│   ├── calculations.ts # Logique de calcul
│   └── storage.ts     # Gestion localStorage
└── App.tsx            # Composant racine
```

### Fonctionnalités Techniques
- **Auto-save**: Sauvegarde automatique du brouillon toutes les 2 secondes
- **Validation**: Règles métier intégrées (SIRET, email, etc.)
- **Calculs**: Logique comptable conforme avec arrondi à 2 décimales
- **Storage**: Gestion intelligente de l'espace avec nettoyage automatique
- **Performance**: Lazy loading et optimisations Vite

## 📊 Gestion des Données

### Stockage Local
- Toutes les données restent dans le navigateur
- Pas de serveur, pas de cookies, pas de tracking
- Sauvegarde/restauration via export/import JSON
- Nettoyage automatique des anciens devis

### Format des Données
```typescript
interface Devis {
  id: string;
  numero: string;           // DEVIS-2025-0001
  dateCreation: Date;
  dateValidite: Date;
  statut: 'Brouillon' | 'Envoyé' | 'Accepté' | 'Refusé' | 'Expiré';
  entreprise: Entreprise;
  client: Client;
  prestations: Prestation[];
  conditions: Conditions;
  totaux: Totaux;
}
```

## 🎯 Utilisation

### Workflow Standard
1. **Configurer** ses informations d'entreprise (première utilisation)
2. **Créer** un nouveau devis via le formulaire
3. **Ajouter** des prestations avec calculs automatiques
4. **Prévisualiser** le rendu final
5. **Sauvegarder** le devis
6. **Exporter** en PDF ou imprimer

### Fonctionnalités Avancées
- **Entreprise par défaut**: Pré-remplissage automatique
- **Conditions standard**: Templates réutilisables
- **Recherche**: Filtres dans l'historique
- **Gestion d'espace**: Monitoring du localStorage

## 🛠️ Développement

### Scripts Disponibles
- `npm run dev` - Serveur de développement avec hot reload
- `npm run build` - Build optimisé pour production
- `npm run preview` - Aperçu du build de production
- `npm run test` - Lancement des tests Vitest
- `npm run lint` - Vérification ESLint

### Contribution
Les contributions sont bienvenues ! Merci de :
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/ma-feature`)
3. Commit les changements (`git commit -m 'Ajout ma feature'`)
4. Push vers la branche (`git push origin feature/ma-feature`)
5. Ouvrir une Pull Request

## 📝 TODO / Roadmap

### v1.1 (Prochaine version)
- [ ] Export PDF natif avec jsPDF
- [ ] Templates de devis personnalisables
- [ ] Import/export CSV pour prestations
- [ ] Mode sombre
- [ ] PWA complète avec cache offline

### v1.2 (Future)
- [ ] Gestion multi-entreprises
- [ ] Statistiques et tableaux de bord
- [ ] Synchronisation cloud optionnelle
- [ ] API pour intégrations externes

## 📄 Licence

MIT License - Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Support

- **Issues**: [GitHub Issues](https://github.com/creach-t/devis-autoentrepreneur/issues)
- **Discussions**: [GitHub Discussions](https://github.com/creach-t/devis-autoentrepreneur/discussions)

---

**Développé avec ❤️ pour les auto-entrepreneurs français**