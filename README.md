<div align="center">
  <img src="./public/logo.svg" alt="Logo PolyChat-AI" width="150" />
  <h1>PolyChat-AI</h1>
  <p>Votre compagnon de conversation IA, personnalisable et stylé.</p>
  
  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
    <img src="https://img.shields.io/badge/licence-MIT-green.svg" alt="Licence">
    <img src="https://img.shields.io/badge/React-18.2.0-blue?logo=react" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.2.2-blue?logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Vite-5.2.0-purple?logo=vite" alt="Vite">
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.3-blue?logo=tailwind-css" alt="Tailwind CSS">
  </p>
</div>

---

## 🚀 À propos du projet

PolyChat-AI est une application web de chat avec intelligence artificielle, conçue pour offrir une expérience utilisateur riche, interactive et visuellement unique. Construite avec les technologies web les plus modernes, elle met l'accent sur la personnalisation et la performance.

L'application se connecte à l'API **OpenRouter** pour donner accès à une multitude de modèles de langage, permettant aux utilisateurs de choisir celui qui correspond le mieux à leurs besoins. L'état de l'application est géré efficacement avec **Zustand**, garantissant une expérience fluide et réactive.

L'interface, inspirée par une esthétique pixel-art moderne, est entièrement stylée avec **Tailwind CSS** pour une personnalisation et une maintenance aisées.


## ✨ Fonctionnalités

-   **🎨 Interface Thématique :** Choisissez entre plusieurs thèmes, dont un design moderne et un style pixel-art rétro.
-   **🤖 Sélection de Modèles IA :** Accédez à une large gamme de modèles via OpenRouter et changez-les à la volée.
-   **📜 Historique des Conversations :** Sauvegarde et accès facile à vos discussions précédentes.
-   **⚙️ Configuration Simplifiée :** Entrez votre clé API OpenRouter une seule fois, elle est sauvegardée localement et en toute sécurité.
-   **🚀 Performance Optimale :** Une expérience rapide et fluide grâce à Vite et React.
-   **💅 Design Élégant :** Une interface soignée et entièrement responsive, réalisée avec Tailwind CSS.

## 🛠️ Installation

Pour lancer une instance locale de PolyChat-AI, suivez ces étapes simples.

1.  **Clonez le dépôt**
    ```bash
    git clone https://github.com/Teeflo/PolyChat-AI.git
    ```
2.  **Naviguez vers le répertoire du projet**
    ```bash
    cd PolyChat-AI
    ```
3.  **Installez les dépendances**
    ```bash
    npm install
    ```

## ⚙️ Configuration

Pour que l'application puisse communiquer avec les modèles de langage, une clé API **OpenRouter** est nécessaire.

1.  Rendez-vous sur [OpenRouter.ai](https://openrouter.ai/) pour obtenir votre clé API gratuite.
2.  Lancez l'application (`npm run dev`).
3.  Une fenêtre modale apparaîtra vous invitant à entrer votre clé API.
4.  Votre clé sera stockée de manière sécurisée dans le `localStorage` de votre navigateur pour les utilisations futures.

## ▶️ Commandes disponibles

Ce projet utilise `npm` pour la gestion des scripts. Voici les commandes principales :

-   **Lancer le serveur de développement :**
    ```bash
    npm run dev
    ```
    L'application sera disponible à l'adresse `http://localhost:5173`.

-   **Compiler pour la production :**
    ```bash
    npm run build
    ```
    Les fichiers optimisés seront générés dans le dossier `dist/`.

-   **Linter le code :**
    ```bash
    npm run lint
    ```
    Vérifie la qualité du code avec ESLint selon les règles configurées.

-   **Prévisualiser la version de production :**
    ```bash
    npm run preview
    ```
    Lance un serveur local pour tester le build de production.

## 📂 Structure du projet

Le projet est organisé de manière modulaire pour faciliter la maintenance et l'évolution.

```
/
├── public/          # Fichiers statiques (logos, polices)
├── src/
│   ├── assets/      # Ressources (images, svgs)
│   ├── components/  # Composants React réutilisables
│   │   ├── Chat/
│   │   ├── Layout/
│   │   └── Settings/
│   ├── context/     # Contexte React (ChatProvider)
│   ├── hooks/       # Hooks personnalisés (useChat, useModels)
│   ├── services/    # Logique métier et appels API
│   ├── styles/      # Fichiers CSS globaux et thèmes
│   ├── types/       # Définitions de types TypeScript
│   └── utils/       # Fonctions utilitaires
├── .gitignore       # Fichiers ignorés par Git
├── eslint.config.js # Configuration ESLint
├── package.json     # Dépendances et scripts
├── tsconfig.json    # Configuration TypeScript
└── vite.config.ts   # Configuration Vite
```

## 🤝 Contribution

Les contributions sont ce qui fait vivre la communauté open-source. Toute contribution que vous apporterez sera **grandement appréciée**.

Si vous avez une suggestion pour améliorer ce projet, n'hésitez pas à forker le dépôt et à créer une pull request. Vous pouvez aussi simplement ouvrir une issue avec le tag "enhancement".

1.  **Forkez le Projet**
2.  Créez votre branche de fonctionnalité (`git checkout -b feature/NouvelleFonctionnalite`)
3.  Commitez vos changements (`git commit -m 'Ajout de NouvelleFonctionnalite'`)
4.  Pushez vers la branche (`git push origin feature/NouvelleFonctionnalite`)
5.  Ouvrez une **Pull Request**

## 📄 Licence


Distribué sous la licence MIT. Voir `LICENSE.txt` pour plus d'informations.

---

<div align="center">
  <p>Créé avec ❤️ par Teeflo</p>
</div>