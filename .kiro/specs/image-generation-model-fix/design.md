# Design Document

## Overview

Cette fonctionnalité corrige le problème de changement automatique de modèle lors de la génération d'images en implémentant un système de confirmation utilisateur et de gestion intelligente des modèles. Le design s'appuie sur l'architecture existante de PolyChat-AI et ajoute des mécanismes de contrôle utilisateur pour les changements de modèles.

L'objectif principal est de donner à l'utilisateur le contrôle total sur les changements de modèles tout en offrant une expérience fluide et informative.

## Architecture

### Composants Modifiés

1. **useChat Hook** - Logique de détection et gestion des changements de modèles
2. **ChatInputModern** - Détection des commandes d'images et suggestions
3. **ModelSwitcher** - Affichage des capacités et alertes de compatibilité
4. **SettingsModalModern** - Nouvelles options de comportement des modèles

### Nouveaux Composants

1. **ModelChangeConfirmationModal** - Modal de confirmation pour changements de modèles
2. **ModelCompatibilityWarning** - Composant d'alerte pour incompatibilités
3. **ModelPreferenceManager** - Gestionnaire des préférences utilisateur par type de tâche
4. **SmartModelSuggestion** - Suggestions intelligentes de modèles

## Components and Interfaces

### Interface de Configuration

```typescript
export interface ModelChangeSettings {
  imageGenerationBehavior: 'ask' | 'auto' | 'never';
  showCompatibilityWarnings: boolean;
  rememberPreferences: boolean;
  autoSuggestModels: boolean;
}

export interface ModelPreferences {
  imageGeneration: string[];
  textGeneration: string[];
  codeGeneration: string[];
  lastUsed: Record<string, string>; // task type -> model id
}

export interface ModelChangeRequest {
  currentModelId: string;
  suggestedModelId: string;
  reason: 'image_generation' | 'incompatible_feature' | 'user_preference';
  userPrompt: string;
  sessionId: string;
}
```

### Service de Gestion des Modèles

```typescript
// services/modelChangeManager.ts
export class ModelChangeManager {
  static shouldRequestConfirmation(
    request: ModelChangeRequest,
    settings: ModelChangeSettings
  ): boolean {
    // Logique de décision pour demander confirmation
  }
  
  static getSuggestedModel(
    taskType: string,
    preferences: ModelPreferences,
    availableModels: OpenRouterModel[]
  ): string | null {
    // Suggestion intelligente de modèle
  }
  
  static recordModelPreference(
    taskType: string,
    modelId: string,
    preferences: ModelPreferences
  ): ModelPreferences {
    // Enregistrement des préférences
  }
}
```

### Composants d'Interface

#### ModelChangeConfirmationModal
```typescript
interface ModelChangeConfirmationModalProps {
  isOpen: boolean;
  request: ModelChangeRequest;
  suggestedModels: OpenRouterModel[];
  onConfirm: (selectedModelId: string, rememberChoice: boolean) => void;
  onCancel: () => void;
  onNeverAskAgain: () => void;
}
```

#### ModelCompatibilityWarning
```typescript
interface ModelCompatibilityWarningProps {
  currentModel: OpenRouterModel;
  requestedFeature: string;
  suggestedModels: OpenRouterModel[];
  onModelSelect: (modelId: string) => void;
  onDismiss: () => void;
}
```

#### SmartModelSuggestion
```typescript
interface SmartModelSuggestionProps {
  userInput: string;
  currentModel: OpenRouterModel;
  onSuggestionAccept: (modelId: string) => void;
  onSuggestionDismiss: () => void;
}
```

## Data Models

### Détection des Types de Tâches

Le système analysera le contenu utilisateur pour détecter :

1. **Génération d'Images**
   - Mots-clés : "génère", "crée", "dessine", "image", "photo"
   - Patterns : "génère une image de...", "crée-moi..."

2. **Génération de Code**
   - Mots-clés : "code", "fonction", "classe", "script"
   - Patterns : "écris du code...", "crée une fonction..."

3. **Analyse de Documents**
   - Mots-clés : "analyse", "résume", "explique"
   - Patterns : "analyse ce document...", "résume..."

### Stockage des Préférences

```typescript
// localStorage pour préférences utilisateur
interface ModelPreferencesStorage {
  version: string;
  preferences: ModelPreferences;
  settings: ModelChangeSettings;
  lastUpdated: number;
}
```

## Error Handling

### Gestion des Conflits de Modèles

1. **Modèle incompatible** : Affichage d'un avertissement avec suggestions
2. **Modèle indisponible** : Fallback vers modèles alternatifs
3. **Échec de changement** : Maintien du modèle actuel avec message d'erreur

### Fallbacks

1. **Préférences corrompues** : Réinitialisation aux valeurs par défaut
2. **Modèles suggérés indisponibles** : Utilisation de la liste de fallback
3. **Échec de détection** : Mode manuel avec confirmation utilisateur

## Testing Strategy

### Tests Unitaires

1. **ModelChangeManager**
   - Test de détection des types de tâches
   - Test de logique de suggestion de modèles
   - Test de gestion des préférences

2. **Composants de Confirmation**
   - Test des interactions utilisateur
   - Test de sauvegarde des préférences
   - Test des cas d'annulation

### Tests d'Intégration

1. **Flux complet** de changement de modèle avec confirmation
2. **Persistance** des préférences utilisateur
3. **Compatibilité** avec l'interface existante

### Tests E2E

1. **Scénario de génération d'image** avec modèle incompatible
2. **Configuration des préférences** et application
3. **Suggestions intelligentes** basées sur l'historique

## Implementation Phases

### Phase 1 : Détection et Confirmation
- Implémentation de la détection des types de tâches
- Création de la modal de confirmation
- Intégration dans le flux de chat existant

### Phase 2 : Préférences et Suggestions
- Système de préférences utilisateur
- Suggestions intelligentes de modèles
- Interface de configuration dans les paramètres

### Phase 3 : Optimisations Avancées
- Apprentissage des préférences utilisateur
- Suggestions contextuelles améliorées
- Analytics sur l'utilisation des modèles

## Visual Design

### Modal de Confirmation

```
┌─────────────────────────────────────┐
│ 🔄 Changement de Modèle Requis     │
├─────────────────────────────────────┤
│                                     │
│ Le modèle actuel (GPT-4) ne peut   │
│ pas générer d'images.               │
│                                     │
│ Modèles suggérés :                 │
│ ○ DALL-E 3 (Recommandé)            │
│ ○ Midjourney                       │
│ ○ Stable Diffusion                 │
│                                     │
│ ☐ Se souvenir de ce choix          │
│                                     │
│ [Annuler] [Changer de Modèle]      │
└─────────────────────────────────────┘
```

### Avertissement de Compatibilité

```
┌─────────────────────────────────────┐
│ ⚠️  Fonctionnalité Non Supportée    │
├─────────────────────────────────────┤
│ Ce modèle ne supporte pas la        │
│ génération d'images.                │
│                                     │
│ [Changer de Modèle] [Ignorer]       │
└─────────────────────────────────────┘
```

### Suggestion Intelligente

```
┌─────────────────────────────────────┐
│ 💡 Suggestion                       │
├─────────────────────────────────────┤
│ Pour générer des images, utilisez   │
│ DALL-E 3 (votre préféré)           │
│                                     │
│ [Utiliser] [Pas maintenant]        │
└─────────────────────────────────────┘
```

## Behavioral Logic

### Arbre de Décision pour Changement de Modèle

```
Demande utilisateur
├── Compatible avec modèle actuel?
│   ├── Oui → Continuer normalement
│   └── Non → Vérifier préférences
│       ├── Mode "Jamais changer"
│       │   └── Afficher erreur explicative
│       ├── Mode "Toujours demander"
│       │   └── Afficher modal de confirmation
│       └── Mode "Changement automatique"
│           ├── Préférence sauvegardée?
│           │   ├── Oui → Changer automatiquement
│           │   └── Non → Suggérer et demander
│           └── Notifier changement
```

### Logique de Suggestion de Modèles

1. **Priorité 1** : Modèle préféré de l'utilisateur pour ce type de tâche
2. **Priorité 2** : Modèle le plus récemment utilisé pour ce type
3. **Priorité 3** : Modèle le plus populaire/performant pour ce type
4. **Priorité 4** : Modèle par défaut du système

## Performance Considerations

### Optimisations

1. **Cache des préférences** en mémoire pour éviter les accès localStorage répétés
2. **Debouncing** des suggestions pour éviter les suggestions trop fréquentes
3. **Lazy loading** des modèles suggérés pour améliorer les performances

### Métriques à Surveiller

1. **Temps de réponse** des suggestions de modèles
2. **Taux d'acceptation** des suggestions automatiques
3. **Fréquence** des changements de modèles par session