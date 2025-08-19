<div align="center">
  <img src="./public/logo.svg" alt="Logo PolyChat-AI" width="150" />
  <h1>PolyChat-AI</h1>
  <p><strong>Votre compagnon de conversation IA, personnalisable et stylé.</strong></p>
  <p>Une interface moderne et intuitive pour interagir avec les meilleurs modèles de langage via OpenRouter</p>
  
  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/version-0.0.0-blue.svg" alt="Version">
    <img src="https://img.shields.io/badge/licence-MIT-green.svg" alt="Licence">
    <img src="https://img.shields.io/badge/React-19.1.0-blue?logo=react" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Vite-7.0.4-purple?logo=vite" alt="Vite">
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.1.11-blue?logo=tailwind-css" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Zustand-5.0.7-orange" alt="Zustand">
  </p>

  <!-- Quick Links -->
  <p>
    <a href="#-fonctionnalités">🚀 Fonctionnalités</a> •
    <a href="#-installation">⚙️ Installation</a> •
    <a href="#-configuration">🔧 Configuration</a> •
    <a href="#-utilisation">📖 Utilisation</a> •
    <a href="#-contribution">🤝 Contribution</a>
  </p>
</div>

---

## 🌟 À propos du projet

**PolyChat-AI** est une application web de chat avec intelligence artificielle de nouvelle génération, conçue pour offrir une expérience utilisateur exceptionnelle, interactive et visuellement unique. Construite avec les technologies web les plus modernes, elle met l'accent sur la personnalisation, la performance et l'accessibilité.

### 🎯 Objectifs

- **🤖 Accès Multi-Modèles** : Connexion à l'API **OpenRouter** pour accéder à une multitude de modèles de langage (GPT-4, Claude, Gemini, et bien d'autres)
- **🎨 Interface Thématique** : Plusieurs thèmes visuels incluant un design moderne et un style pixel-art rétro
- **⚡ Performance Optimale** : Architecture React moderne avec Vite pour des temps de chargement ultra-rapides
- **🔒 Sécurité** : Gestion sécurisée des clés API avec stockage local chiffré
- **📱 Responsive** : Interface adaptée à tous les appareils (desktop, tablette, mobile)

### 🏗️ Architecture Technique

- **Frontend** : React 19 + TypeScript + Vite
- **Styling** : Tailwind CSS 4 avec thèmes personnalisés
- **State Management** : Zustand pour une gestion d'état performante
- **API** : OpenRouter pour l'accès aux modèles de langage
- **Build Tool** : Vite pour un développement et build ultra-rapides

---

## ✨ Fonctionnalités

### 🎨 Interface & Personnalisation
- **🎭 Thèmes Multiples** : 
  - Design moderne avec mode sombre/clair
  - Style pixel-art rétro avec animations
  - Interface hacker avec curseur personnalisé
- **🎛️ Personnalisation Avancée** :
  - Instructions système personnalisables
  - Ton de conversation configurable (neutre, formel, amical, professionnel, enthousiaste)
  - Notifications configurables
  - Sauvegarde automatique des préférences

### 🤖 Intelligence Artificielle
- **🔗 Intégration OpenRouter** : Accès à plus de 100+ modèles de langage
- **🔄 Changement Dynamique** : Basculement entre modèles en cours de conversation
- **📊 Modèles Populaires** :
  - GPT-4, GPT-5 Chat
  - Claude Sonnet 4, Claude Opus
  - Gemini 2.5 Pro
  - Et bien d'autres...
- **⚡ Streaming en Temps Réel** : Réponses fluides avec animation de chargement

### 💬 Chat & Conversations
- **📜 Historique Intelligent** : Sauvegarde et gestion des conversations
- **🔄 Sessions Multiples** : Plusieurs conversations simultanées
- **📝 Templates de Conversation** :
  - Programmation (debug, optimisation, explication)
  - Créativité (brainstorming, écriture créative)
  - Apprentissage (explication, tutoriel)
  - Analyse (analyse de données, résumé)
  - Business (planification, stratégie)
- **⚡ Actions Rapides** : Boutons d'action contextuels (expliquer, optimiser, traduire, etc.)

### 🛠️ Outils & Utilitaires
- **📊 Dashboard d'Usage** : Statistiques détaillées d'utilisation (Ctrl+U)
- **🔍 Recherche Avancée** : Filtrage des modèles par fournisseur, prix, contexte
- **📱 Onboarding Intuitif** : Guide d'installation et configuration
- **🔧 Paramètres Avancés** : Configuration fine de tous les aspects

### 🎯 Fonctionnalités Avancées
- **🎨 Syntax Highlighting** : Coloration syntaxique pour le code
- **📄 Markdown Support** : Rendu complet du markdown
- **🔔 Notifications** : Alertes pour les nouvelles réponses
- **⌨️ Raccourcis Clavier** : Navigation et actions rapides
- **💾 Persistance Locale** : Sauvegarde automatique des données

---

## 🛠️ Installation

### Prérequis
- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**
- **Clé API OpenRouter** (gratuite)

### Étapes d'installation

1. **Clonez le dépôt**
   ```bash
   git clone https://github.com/Teeflo/PolyChat-AI.git
   cd PolyChat-AI
   ```

2. **Installez les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Lancez le serveur de développement**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Ouvrez votre navigateur**
   L'application sera disponible à l'adresse `http://localhost:5173`

---

## ⚙️ Configuration

### 🔑 Configuration de l'API OpenRouter

1. **Obtenez votre clé API gratuite** :
   - Rendez-vous sur [OpenRouter.ai](https://openrouter.ai/)
   - Créez un compte gratuit
   - Générez votre clé API

2. **Configuration automatique** :
   - Au premier lancement, une fenêtre modale apparaîtra
   - Entrez votre clé API OpenRouter
   - La clé sera stockée de manière sécurisée dans le `localStorage`

3. **Configuration manuelle** :
   - Ouvrez les paramètres (icône ⚙️)
   - Allez dans l'onglet "API"
   - Entrez votre clé API

### 🎨 Personnalisation

#### Thèmes Disponibles
- **🌙 Mode Sombre** : Interface élégante avec fond sombre
- **☀️ Mode Clair** : Interface claire et moderne
- **🎮 Pixel Art** : Style rétro avec animations pixel
- **👨‍💻 Hacker** : Interface avec curseur personnalisé

#### Paramètres Avancés
- **Instructions Système** : Personnalisez le comportement de l'IA
- **Ton de Conversation** : Choisissez le style de communication
- **Notifications** : Activez/désactivez les alertes
- **Modèle par Défaut** : Sélectionnez votre modèle préféré

---

## 📖 Utilisation

### 🚀 Premiers Pas

1. **Configuration Initiale** :
   - Suivez l'onboarding automatique
   - Entrez votre clé API OpenRouter
   - Choisissez votre modèle préféré

2. **Démarrage d'une Conversation** :
   - Cliquez sur "Nouvelle Conversation"
   - Sélectionnez un modèle (optionnel)
   - Commencez à taper votre message

### 💬 Fonctionnalités de Chat

#### Templates de Conversation
- **Programmation** : Debug, optimisation, explication de code
- **Créativité** : Brainstorming, écriture créative, génération d'idées
- **Apprentissage** : Explications, tutoriels, résumés
- **Analyse** : Analyse de données, recherche, synthèse
- **Business** : Planification, stratégie, conseils

#### Actions Rapides
- **🔍 Expliquer** : Demander une explication détaillée
- **⚡ Optimiser** : Améliorer le code ou le contenu
- **🐛 Debug** : Identifier et corriger les problèmes
- **💬 Commenter** : Ajouter des commentaires explicatifs
- **🌐 Traduire** : Traduire dans différentes langues
- **📝 Résumer** : Créer un résumé concis
- **✅ Réviser** : Revoir et améliorer le contenu

### 🎛️ Raccourcis Clavier

| Raccourci | Action |
|-----------|--------|
| `Ctrl/Cmd + U` | Ouvrir le dashboard d'usage |
| `Ctrl/Cmd + K` | Ouvrir les paramètres |
| `Ctrl/Cmd + N` | Nouvelle conversation |
| `Ctrl/Cmd + S` | Sauvegarder la conversation |
| `Ctrl/Cmd + /` | Afficher l'aide |

### 📊 Dashboard d'Usage

Accédez aux statistiques détaillées avec `Ctrl + U` :
- **Conversations totales** : Nombre de conversations créées
- **Messages échangés** : Statistiques des messages utilisateur/assistant
- **Temps de réponse moyen** : Performance des modèles
- **Utilisation par modèle** : Répartition de l'usage

---

## 🏗️ Structure du Projet

```
PolyChat-AI/
├── 📁 public/                 # Fichiers statiques (logo, icônes)
├── 📁 src/
│   ├── 📁 assets/            # Ressources (images, etc.)
│   ├── 📁 components/        # Composants React
│   │   ├── 📁 Chat/          # Composants de la fenêtre de chat
│   │   ├── 📁 Layout/        # Composants de mise en page (Header, Sidebar)
│   │   ├── 📁 Settings/      # Composants des paramètres
│   │   └── 📁 Onboarding/    # Composants pour le premier lancement
│   ├── 📁 context/           # Contexte React (ChatProvider)
│   ├── 📁 data/              # Données statiques (templates)
│   ├── 📁 hooks/             # Hooks personnalisés (useChat, useSettings)
│   ├── 📁 services/          # Logique métier et appels API (OpenRouter)
│   ├── 📁 styles/            # Fichiers CSS et thèmes
│   ├── 📁 types/             # Définitions de types TypeScript
│   ├── 📁 utils/             # Fonctions utilitaires
│   ├── App.tsx               # Composant Racine de l'application
│   └── main.tsx              # Point d'entrée de l'application
├── .gitignore                # Fichiers ignorés par Git
├── eslint.config.js          # Configuration ESLint
├── package.json              # Dépendances et scripts du projet
├── README.md                 # Ce fichier
├── tsconfig.json             # Configuration TypeScript
└── vite.config.ts            # Configuration Vite
```

---

## 🚀 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile pour la production |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Vérifie la qualité du code |

### 🎯 Développement

```bash
# Installation des dépendances
npm install

# Lancement en mode développement
npm run dev

# Build de production
npm run build

# Vérification du code
npm run lint
```

---

## 🤝 Contribution

Les contributions sont ce qui fait vivre la communauté open-source. Toute contribution que vous apporterez sera **grandement appréciée**.

### 🎯 Comment Contribuer

1. **🔍 Signaler un Bug**
   - Ouvrez une issue avec le tag "bug"
   - Décrivez le problème de manière détaillée
   - Incluez les étapes pour reproduire le bug

2. **💡 Proposer une Amélioration**
   - Ouvrez une issue avec le tag "enhancement"
   - Expliquez votre idée et ses bénéfices
   - Discutez de l'implémentation

3. **🔧 Soumettre du Code**
   - Forkez le projet
   - Créez une branche de fonctionnalité
   - Committez vos changements
   - Ouvrez une Pull Request

### 📋 Processus de Contribution

1. **Forkez le Projet**
   ```bash
   git clone https://github.com/VOTRE_USERNAME/PolyChat-AI.git
   cd PolyChat-AI
   ```

2. **Créez votre branche de fonctionnalité**
   ```bash
   git checkout -b feature/NouvelleFonctionnalite
   ```

3. **Commitez vos changements**
   ```bash
   git commit -m 'feat: Ajout de NouvelleFonctionnalite'
   ```

4. **Pushez vers la branche**
   ```bash
   git push origin feature/NouvelleFonctionnalite
   ```

5. **Ouvrez une Pull Request**

### 📝 Standards de Code

- **TypeScript** : Utilisez TypeScript pour tout nouveau code
- **ESLint** : Respectez les règles de linting configurées
- **Commits** : Utilisez des messages de commit conventionnels
- **Tests** : Ajoutez des tests pour les nouvelles fonctionnalités

---

## 🐛 Problèmes Connus

### Limitations Actuelles
- **Taille des Messages** : Limitation basée sur le contexte du modèle sélectionné
- **Historique** : Stockage local uniquement (pas de synchronisation cloud)
- **Modèles** : Dépendance à l'API OpenRouter pour la disponibilité

### Solutions de Contournement
- **Messages Longs** : Divisez les messages volumineux en plusieurs parties
- **Sauvegarde** : Exportez régulièrement vos conversations importantes
- **Modèles Indisponibles** : L'application propose automatiquement des alternatives

---

## 📄 Licence

Ce projet est distribué sous la licence **MIT**. Voir le fichier `LICENSE` pour plus d'informations.

### 📋 Conditions de la Licence MIT

- ✅ **Utilisation Commerciale** : Autorisée
- ✅ **Modification** : Autorisée
- ✅ **Distribution** : Autorisée
- ✅ **Utilisation Privée** : Autorisée
- ❌ **Responsabilité** : Non garantie
- ❌ **Garantie** : Aucune garantie

---

## 🙏 Remerciements

- **OpenRouter** pour l'accès aux modèles de langage
- **React Team** pour l'excellent framework
- **Vite Team** pour l'outil de build ultra-rapide
- **Tailwind CSS** pour le framework CSS utilitaire
- **Zustand** pour la gestion d'état simple et performante

---

## 📞 Support

### 🆘 Besoin d'Aide ?

- **📖 Documentation** : Consultez ce README
- **🐛 Bug Report** : [Ouvrir une issue](https://github.com/Teeflo/PolyChat-AI/issues)
- **💬 Discussions** : [Forum GitHub](https://github.com/Teeflo/PolyChat-AI/discussions)
- **📧 Contact** : [Créer une issue](https://github.com/Teeflo/PolyChat-AI/issues/new)

### 🔗 Liens Utiles

- **🌐 Site Web** : [PolyChat-AI](https://github.com/Teeflo/PolyChat-AI)
- **📚 Documentation** : [Wiki du projet](https://github.com/Teeflo/PolyChat-AI/wiki)
- **🚀 Releases** : [Versions](https://github.com/Teeflo/PolyChat-AI/releases)
- **📊 Analytics** : [Statistiques](https://github.com/Teeflo/PolyChat-AI/graphs/contributors)

---

<div align="center">
  <p><strong>Créé avec ❤️ par <a href="https://github.com/Teeflo">Teeflo</a></strong></p>
  <p>
    <a href="https://github.com/Teeflo/PolyChat-AI/stargazers">
      <img src="https://img.shields.io/github/stars/Teeflo/PolyChat-AI?style=social" alt="Stars">
    </a>
    <a href="https://github.com/Teeflo/PolyChat-AI/forks">
      <img src="https://img.shields.io/github/forks/Teeflo/PolyChat-AI?style=social" alt="Forks">
    </a>
    <a href="https://github.com/Teeflo/PolyChat-AI/issues">
      <img src="https://img.shields.io/github/issues/Teeflo/PolyChat-AI" alt="Issues">
    </a>
  </p>
</div>


---

## 🌟 À propos du projet

**PolyChat-AI** est une application web de chat avec intelligence artificielle de nouvelle génération, conçue pour offrir une expérience utilisateur exceptionnelle, interactive et visuellement unique. Construite avec les technologies web les plus modernes, elle met l'accent sur la personnalisation, la performance et l'accessibilité.

### 🎯 Objectifs

- **🤖 Accès Multi-Modèles** : Connexion à l'API **OpenRouter** pour accéder à une multitude de modèles de langage (GPT-4, Claude, Gemini, et bien d'autres)
- **🎨 Interface Thématique** : Plusieurs thèmes visuels incluant un design moderne et un style pixel-art rétro
- **⚡ Performance Optimale** : Architecture React moderne avec Vite pour des temps de chargement ultra-rapides
- **🔒 Sécurité** : Gestion sécurisée des clés API avec stockage local chiffré
- **📱 Responsive** : Interface adaptée à tous les appareils (desktop, tablette, mobile)

### 🏗️ Architecture Technique

- **Frontend** : React 19 + TypeScript + Vite
- **Styling** : Tailwind CSS 4 avec thèmes personnalisés
- **State Management** : Zustand pour une gestion d'état performante
- **API** : OpenRouter pour l'accès aux modèles de langage
- **Build Tool** : Vite pour un développement et build ultra-rapides

---

## ✨ Fonctionnalités

### 🎨 Interface & Personnalisation
- **🎭 Thèmes Multiples** : 
  - Design moderne avec mode sombre/clair
  - Style pixel-art rétro avec animations
  - Interface hacker avec curseur personnalisé
- **🎛️ Personnalisation Avancée** :
  - Instructions système personnalisables
  - Ton de conversation configurable (neutre, formel, amical, professionnel, enthousiaste)
  - Notifications configurables
  - Sauvegarde automatique des préférences

### 🤖 Intelligence Artificielle
- **🔗 Intégration OpenRouter** : Accès à plus de 100+ modèles de langage
- **🔄 Changement Dynamique** : Basculement entre modèles en cours de conversation
- **📊 Modèles Populaires** :
  - GPT-4, GPT-5 Chat
  - Claude Sonnet 4, Claude Opus
  - Gemini 2.5 Pro
  - Et bien d'autres...
- **⚡ Streaming en Temps Réel** : Réponses fluides avec animation de chargement

### 💬 Chat & Conversations
- **📜 Historique Intelligent** : Sauvegarde et gestion des conversations
- **🔄 Sessions Multiples** : Plusieurs conversations simultanées
- **📝 Templates de Conversation** :
  - Programmation (debug, optimisation, explication)
  - Créativité (brainstorming, écriture créative)
  - Apprentissage (explication, tutoriel)
  - Analyse (analyse de données, résumé)
  - Business (planification, stratégie)
- **⚡ Actions Rapides** : Boutons d'action contextuels (expliquer, optimiser, traduire, etc.)

### 🛠️ Outils & Utilitaires
- **📊 Dashboard d'Usage** : Statistiques détaillées d'utilisation (Ctrl+U)
- **🔍 Recherche Avancée** : Filtrage des modèles par fournisseur, prix, contexte
- **📱 Onboarding Intuitif** : Guide d'installation et configuration
- **🔧 Paramètres Avancés** : Configuration fine de tous les aspects

### 🎯 Fonctionnalités Avancées
- **🎨 Syntax Highlighting** : Coloration syntaxique pour le code
- **📄 Markdown Support** : Rendu complet du markdown
- **🔔 Notifications** : Alertes pour les nouvelles réponses
- **⌨️ Raccourcis Clavier** : Navigation et actions rapides
- **💾 Persistance Locale** : Sauvegarde automatique des données

---

## 🛠️ Installation

### Prérequis
- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**
- **Clé API OpenRouter** (gratuite)

### Étapes d'installation

1. **Clonez le dépôt**
   ```bash
   git clone https://github.com/Teeflo/PolyChat-AI.git
   cd PolyChat-AI
   ```

2. **Installez les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Lancez le serveur de développement**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Ouvrez votre navigateur**
   L'application sera disponible à l'adresse `http://localhost:5173`

---

## ⚙️ Configuration

### 🔑 Configuration de l'API OpenRouter

1. **Obtenez votre clé API gratuite** :
   - Rendez-vous sur [OpenRouter.ai](https://openrouter.ai/)
   - Créez un compte gratuit
   - Générez votre clé API

2. **Configuration automatique** :
   - Au premier lancement, une fenêtre modale apparaîtra
   - Entrez votre clé API OpenRouter
   - La clé sera stockée de manière sécurisée dans le `localStorage`

3. **Configuration manuelle** :
   - Ouvrez les paramètres (icône ⚙️)
   - Allez dans l'onglet "API"
   - Entrez votre clé API

### 🎨 Personnalisation

#### Thèmes Disponibles
- **🌙 Mode Sombre** : Interface élégante avec fond sombre
- **☀️ Mode Clair** : Interface claire et moderne
- **🎮 Pixel Art** : Style rétro avec animations pixel
- **👨‍💻 Hacker** : Interface avec curseur personnalisé

#### Paramètres Avancés
- **Instructions Système** : Personnalisez le comportement de l'IA
- **Ton de Conversation** : Choisissez le style de communication
- **Notifications** : Activez/désactivez les alertes
- **Modèle par Défaut** : Sélectionnez votre modèle préféré

---

## 📖 Utilisation

### 🚀 Premiers Pas

1. **Configuration Initiale** :
   - Suivez l'onboarding automatique
   - Entrez votre clé API OpenRouter
   - Choisissez votre modèle préféré

2. **Démarrage d'une Conversation** :
   - Cliquez sur "Nouvelle Conversation"
   - Sélectionnez un modèle (optionnel)
   - Commencez à taper votre message

### 💬 Fonctionnalités de Chat

#### Templates de Conversation
- **Programmation** : Debug, optimisation, explication de code
- **Créativité** : Brainstorming, écriture créative, génération d'idées
- **Apprentissage** : Explications, tutoriels, résumés
- **Analyse** : Analyse de données, recherche, synthèse
- **Business** : Planification, stratégie, conseils

#### Actions Rapides
- **🔍 Expliquer** : Demander une explication détaillée
- **⚡ Optimiser** : Améliorer le code ou le contenu
- **🐛 Debug** : Identifier et corriger les problèmes
- **💬 Commenter** : Ajouter des commentaires explicatifs
- **🌐 Traduire** : Traduire dans différentes langues
- **📝 Résumer** : Créer un résumé concis
- **✅ Réviser** : Revoir et améliorer le contenu

### 🎛️ Raccourcis Clavier

| Raccourci | Action |
|-----------|--------|
| `Ctrl/Cmd + U` | Ouvrir le dashboard d'usage |
| `Ctrl/Cmd + K` | Ouvrir les paramètres |
| `Ctrl/Cmd + N` | Nouvelle conversation |
| `Ctrl/Cmd + S` | Sauvegarder la conversation |
| `Ctrl/Cmd + /` | Afficher l'aide |

### 📊 Dashboard d'Usage

Accédez aux statistiques détaillées avec `Ctrl + U` :
- **Conversations totales** : Nombre de conversations créées
- **Messages échangés** : Statistiques des messages utilisateur/assistant
- **Temps de réponse moyen** : Performance des modèles
- **Utilisation par modèle** : Répartition de l'usage

---

## 🏗️ Structure du Projet

```
PolyChat-AI/
├── 📁 public/                 # Fichiers statiques
│   ├── logo.svg              # Logo de l'application
│   ├── favicon.ico           # Icône du site
│   └── site.webmanifest      # Manifeste PWA
├── 📁 src/
│   ├── 📁 components/        # Composants React
│   │   ├── 📁 Chat/          # Composants de chat
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   └── ModelSelector.tsx
│   │   ├── 📁 Layout/        # Composants de mise en page
│   │   │   ├── Header.tsx
│   │   │   └── ChatHistorySidebar.tsx
│   │   ├── 📁 Settings/      # Composants de paramètres
│   │   │   ├── SettingsModal.tsx
│   │   │   └── ApiKeyInput.tsx
│   │   └── 📁 Onboarding/    # Composants d'onboarding
│   │       └── OnboardingModal.tsx
│   ├── 📁 hooks/             # Hooks personnalisés
│   │   ├── useChat.ts        # Gestion du chat
│   │   ├── useModels.ts      # Gestion des modèles
│   │   └── useSettings.ts    # Gestion des paramètres
│   ├── 📁 services/          # Services API
│   │   ├── openRouter.ts     # Service OpenRouter
│   │   └── modelsApi.ts      # API des modèles
│   ├── 📁 styles/            # Styles et thèmes
│   │   ├── modern-pixel.css  # Thème pixel moderne
│   │   └── hacker-cursor.css # Curseur hacker
│   ├── 📁 types/             # Types TypeScript
│   │   └── index.ts          # Définitions de types
│   ├── 📁 utils/             # Utilitaires
│   │   └── notify.ts         # Système de notifications
│   ├── App.tsx               # Composant principal
│   └── main.tsx              # Point d'entrée
├── 📄 package.json           # Dépendances et scripts
├── 📄 vite.config.ts         # Configuration Vite
├── 📄 tsconfig.json          # Configuration TypeScript
└── 📄 README.md              # Documentation
```

---

## 🚀 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile pour la production |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Vérifie la qualité du code |

### 🎯 Développement

```bash
# Installation des dépendances
npm install

# Lancement en mode développement
npm run dev

# Build de production
npm run build

# Vérification du code
npm run lint
```

---

## 🤝 Contribution

Les contributions sont ce qui fait vivre la communauté open-source. Toute contribution que vous apporterez sera **grandement appréciée**.

### 🎯 Comment Contribuer

1. **🔍 Signaler un Bug**
   - Ouvrez une issue avec le tag "bug"
   - Décrivez le problème de manière détaillée
   - Incluez les étapes pour reproduire le bug

2. **💡 Proposer une Amélioration**
   - Ouvrez une issue avec le tag "enhancement"
   - Expliquez votre idée et ses bénéfices
   - Discutez de l'implémentation

3. **🔧 Soumettre du Code**
   - Forkez le projet
   - Créez une branche de fonctionnalité
   - Committez vos changements
   - Ouvrez une Pull Request

### 📋 Processus de Contribution

1. **Forkez le Projet**
   ```bash
   git clone https://github.com/VOTRE_USERNAME/PolyChat-AI.git
   cd PolyChat-AI
   ```

2. **Créez votre branche de fonctionnalité**
   ```bash
   git checkout -b feature/NouvelleFonctionnalite
   ```

3. **Commitez vos changements**
   ```bash
   git commit -m 'feat: Ajout de NouvelleFonctionnalite'
   ```

4. **Pushez vers la branche**
   ```bash
   git push origin feature/NouvelleFonctionnalite
   ```

5. **Ouvrez une Pull Request**

### 📝 Standards de Code

- **TypeScript** : Utilisez TypeScript pour tout nouveau code
- **ESLint** : Respectez les règles de linting configurées
- **Commits** : Utilisez des messages de commit conventionnels
- **Tests** : Ajoutez des tests pour les nouvelles fonctionnalités

---

## 🐛 Problèmes Connus

### Limitations Actuelles
- **Taille des Messages** : Limitation basée sur le contexte du modèle sélectionné
- **Historique** : Stockage local uniquement (pas de synchronisation cloud)
- **Modèles** : Dépendance à l'API OpenRouter pour la disponibilité

### Solutions de Contournement
- **Messages Longs** : Divisez les messages volumineux en plusieurs parties
- **Sauvegarde** : Exportez régulièrement vos conversations importantes
- **Modèles Indisponibles** : L'application propose automatiquement des alternatives

---

## 📄 Licence

Ce projet est distribué sous la licence **MIT**. Voir le fichier `LICENSE` pour plus d'informations.

### 📋 Conditions de la Licence MIT

- ✅ **Utilisation Commerciale** : Autorisée
- ✅ **Modification** : Autorisée
- ✅ **Distribution** : Autorisée
- ✅ **Utilisation Privée** : Autorisée
- ❌ **Responsabilité** : Non garantie
- ❌ **Garantie** : Aucune garantie

---

## 🙏 Remerciements

- **OpenRouter** pour l'accès aux modèles de langage
- **React Team** pour l'excellent framework
- **Vite Team** pour l'outil de build ultra-rapide
- **Tailwind CSS** pour le framework CSS utilitaire
- **Zustand** pour la gestion d'état simple et performante

---

## 📞 Support

### 🆘 Besoin d'Aide ?

- **📖 Documentation** : Consultez ce README
- **🐛 Bug Report** : [Ouvrir une issue](https://github.com/Teeflo/PolyChat-AI/issues)
- **💬 Discussions** : [Forum GitHub](https://github.com/Teeflo/PolyChat-AI/discussions)
- **📧 Contact** : [Créer une issue](https://github.com/Teeflo/PolyChat-AI/issues/new)

### 🔗 Liens Utiles

- **🌐 Site Web** : [PolyChat-AI](https://github.com/Teeflo/PolyChat-AI)
- **📚 Documentation** : [Wiki du projet](https://github.com/Teeflo/PolyChat-AI/wiki)
- **🚀 Releases** : [Versions](https://github.com/Teeflo/PolyChat-AI/releases)
- **📊 Analytics** : [Statistiques](https://github.com/Teeflo/PolyChat-AI/graphs/contributors)

---

<div align="center">
  <p><strong>Créé avec ❤️ par <a href="https://github.com/Teeflo">Teeflo</a></strong></p>
  <p>
    <a href="https://github.com/Teeflo/PolyChat-AI/stargazers">
      <img src="https://img.shields.io/github/stars/Teeflo/PolyChat-AI?style=social" alt="Stars">
    </a>
    <a href="https://github.com/Teeflo/PolyChat-AI/forks">
      <img src="https://img.shields.io/github/forks/Teeflo/PolyChat-AI?style=social" alt="Forks">
    </a>
    <a href="https://github.com/Teeflo/PolyChat-AI/issues">
      <img src="https://img.shields.io/github/issues/Teeflo/PolyChat-AI" alt="Issues">
    </a>
  </p>
</div>