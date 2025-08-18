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
    ```markdown
    <div align="center">
      <img src="./public/logo.svg" alt="Logo PolyChat-AI" width="160" />
      <h1>PolyChat-AI</h1>
      <p><em>Votre compagnon de conversation IA — personnalisable, léger et élégant.</em></p>

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

    ## Aperçu

    PolyChat-AI est une application web de chat alimentée par des modèles LLM via l'API OpenRouter. Elle propose une interface moderne et stylisée (avec un thème pixel-art optionnel), un sélecteur de modèles, un historique de conversations et des réglages persistants côté client.

    Demo rapide

    - Démarrage local : lancez `npm run dev` et ouvrez `http://localhost:5173`.
    - Configuration : entrez votre clé API OpenRouter dans la modal de configuration au premier démarrage.

    <div align="center">
      <img src="./public/logo.svg" alt="Logo PolyChat-AI" width="160" />
      <h1>PolyChat-AI</h1>
      <p><em>Votre compagnon de conversation IA — personnalisable, léger et élégant.</em></p>

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

    ## Aperçu

    PolyChat-AI est une application web de chat alimentée par des modèles LLM via l'API OpenRouter. Elle propose une interface moderne et stylisée (avec un thème pixel-art optionnel), un sélecteur de modèles, un historique de conversations et des réglages persistants côté client.

    Demo rapide

    - Démarrage local : lancez `npm run dev` et ouvrez `http://localhost:5173`.
    - Configuration : entrez votre clé API OpenRouter dans la modal de configuration au premier démarrage.

    ## Principales fonctionnalités

    - Interface thématique (moderne / pixel) avec bascule de thème.
    - Sélectionnaire de modèles via OpenRouter.
    - Historique local des conversations (persisté en localStorage).
    - Entrée et rendu des messages optimisés (suggestions, animations, etc.).
    - Architecture React + TypeScript, état géré avec Zustand.

    ## Contrat minimal (inputs/outputs)

    - Input : clé API OpenRouter (string), messages utilisateur (string), option de modèle.
    - Output : réponses du modèle LLM en texte (string), historique de conversation stocké localement.
    - Erreurs : affichage de l'état réseau / erreurs d'API dans l'UI.

    ## Cas limites à considérer

    1. Clé API manquante ou invalide — l'application doit demander la clé et afficher une erreur claire.
    2. Modèle indisponible / rate limit — afficher message et proposer d'essayer un autre modèle.
    3. Historique vide — afficher un état vide et une invite pour commencer une nouvelle conversation.
    ## Installation

    Pour lancer une instance locale de PolyChat-AI, suivez ces étapes simples.


    1. **Clonez le dépôt**

    ```powershell
    git clone https://github.com/Teeflo/PolyChat-AI.git
    cd PolyChat-AI
    ```

    1. **Installez les dépendances**

    ```powershell
    npm install
    ```

    1. **Démarrage en développement**

    ```powershell
    npm run dev
    ```

    L'application sera accessible sur `http://localhost:5173` par défaut.

    ## Configuration

    1. Obtenez une clé API gratuite sur [OpenRouter](https://openrouter.ai/).
    1. Lancez l'application (`npm run dev`).
    1. À la première utilisation, la modal demandera votre clé OpenRouter ; entrez-la pour l'enregistrer dans `localStorage`.

    Notes de sécurité

    - La clé est stockée côté client dans `localStorage` pour faciliter l'usage local — évitez de partager cette clé.
    - Pour un usage en production, il est recommandé de proxyfier les appels via un backend pour garder la clé secrète.

    ## Scripts utiles

    - `npm run dev` — démarre le serveur de développement Vite.
    - `npm run build` — crée le build de production dans `dist/`.
    - `npm run preview` — prévisualise le build de production localement.
    - `npm run lint` — lance ESLint selon la configuration du projet.

    ## Structure du projet (extrait)

    La structure principale du dépôt :

    ```text
    public/              # ressources statiques (logo, icônes, manifest)
    src/
      ├─ assets/         # images, svgs
      ├─ components/     # UI découpée par feature (Chat, Layout, Settings...)
      ├─ context/        # providers (ChatProvider)
      ├─ hooks/          # useChat, useModels, useSettings, useUsageStats
      ├─ services/       # appels API, stockage local
      ├─ styles/         # thèmes et CSS globaux
      ├─ types/          # types TypeScript
      └─ utils/          # helpers

    package.json         # scripts & dépendances
    vite.config.ts       # configuration Vite
    tsconfig*.json       # TypeScript config
    ```

    ## Développement et tests rapides

    - Ouvrez le projet dans VS Code.
    - Installez les dépendances (`npm install`).
    - Démarrez en dev (`npm run dev`).

    Quality gates rapides (local)

    1. Build : `npm run build` — doit compléter sans erreurs.
    1. Lint : `npm run lint` — corrigez les erreurs signalées.

    ## Contribution

    Contributions bienvenues — suivez ce workflow simple :

    1. Forkez le dépôt et clonez votre fork.
    1. Créez une branche : `git checkout -b feature/ma-fonctionnalite`.
    1. Faites vos changements et committez.
    1. Poussez et ouvrez une Pull Request décrivant les changements.

    Guides rapides

    - Respectez la configuration TypeScript et ESLint existante.
    - Ajoutez des tests ou vérifications minimales pour les nouvelles fonctionnalités quand c'est possible.

    ## Roadmap (idées)

    - Ajouter proxy backend pour garder la clé API côté serveur.
    - Support multi-utilisateurs et sauvegarde distante.
    - Intégration de nouveaux fournisseurs LLM.
    - Amélioration des tests unitaires et e2e.

    ## Licence

    Ce projet est distribué sous la licence MIT — voir le fichier `LICENSE`.

    ---

    Créé avec ❤️ par Teeflo — contributions bienvenues.

