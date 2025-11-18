# Design Document

## Overview

Cette fonctionnalité enrichit l'interface de sélection de modèles en ajoutant un système d'affichage des capacités. L'objectif est de permettre aux utilisateurs de comprendre rapidement quels modèles sont adaptés à leurs besoins spécifiques (génération d'images, analyse de code, raisonnement mathématique, etc.) sans avoir à tester chaque modèle individuellement.

Le design s'appuie sur l'architecture existante de PolyChat-AI et étend les composants `ModelSwitcher`, `ModelSelector` et les services `modelsApi` pour intégrer les informations de capacités.

## Architecture

### Composants Modifiés

1. **ModelSwitcher** - Affichage compact des capacités dans le sélecteur principal
2. **ModelSelectorModern** - Interface détaillée avec filtrage par capacités
3. **modelsApi** - Extension pour récupérer et analyser les capacités des modèles
4. **Types** - Nouvelles interfaces pour les capacités et métadonnées

### Nouveaux Composants

1. **ModelCapabilityBadge** - Badge individuel pour une capacité
2. **ModelCapabilityTooltip** - Tooltip détaillée avec informations complètes
3. **ModelCapabilityFilter** - Composant de filtrage par capacités
4. **ModelComparisonModal** - Modal de comparaison entre modèles

## Components and Interfaces

### Interface de Données

```typescript
export interface ModelCapability {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: CapabilityCategory;
  priority: number; // Pour l'ordre d'affichage
}

export type CapabilityCategory = 
  | 'input' 
  | 'output' 
  | 'reasoning' 
  | 'specialized';

export interface ModelCapabilities {
  modelId: string;
  capabilities: ModelCapability[];
  limitations: string[];
  performance: {
    speed: 'slow' | 'medium' | 'fast';
    accuracy: 'low' | 'medium' | 'high';
    cost: 'free' | 'cheap' | 'moderate' | 'premium';
  };
  contextWindow: number;
  lastUpdated: Date;
}

export interface EnhancedOpenRouterModel extends OpenRouterModel {
  capabilities: ModelCapabilities;
  displayName: string;
  providerName: string;
}
```

### Service d'Analyse des Capacités

```typescript
// services/modelCapabilities.ts
export class ModelCapabilityAnalyzer {
  static analyzeModel(model: OpenRouterModel): ModelCapabilities {
    // Analyse des modalités d'entrée/sortie
    // Détection des capacités spécialisées
    // Calcul des métriques de performance
  }
  
  static getCapabilityDefinitions(): ModelCapability[] {
    // Retourne la liste des capacités supportées
  }
  
  static filterModelsByCapability(
    models: OpenRouterModel[], 
    capabilityId: string
  ): OpenRouterModel[] {
    // Filtre les modèles par capacité
  }
}
```

### Composants d'Interface

#### ModelCapabilityBadge
```typescript
interface ModelCapabilityBadgeProps {
  capability: ModelCapability;
  size: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  onClick?: () => void;
}
```

#### ModelCapabilityTooltip
```typescript
interface ModelCapabilityTooltipProps {
  model: EnhancedOpenRouterModel;
  children: React.ReactNode;
  position: 'top' | 'bottom' | 'left' | 'right';
}
```

#### ModelCapabilityFilter
```typescript
interface ModelCapabilityFilterProps {
  availableCapabilities: ModelCapability[];
  selectedCapabilities: string[];
  onCapabilityToggle: (capabilityId: string) => void;
  onClearAll: () => void;
}
```

## Data Models

### Capacités Détectées Automatiquement

Le système analysera les données OpenRouter pour détecter :

1. **Modalités d'Entrée**
   - Texte (`text`)
   - Images (`image`)
   - Audio (`audio`) 
   - Vidéo (`video`)

2. **Modalités de Sortie**
   - Texte (`text`)
   - Images (`image`)
   - Audio (`audio`)
   - Code (`code`)

3. **Capacités Spécialisées** (basées sur le nom/description)
   - Raisonnement mathématique (`math`)
   - Analyse de code (`code-analysis`)
   - Traduction (`translation`)
   - Résumé (`summarization`)
   - Créativité (`creative`)
   - Analyse de données (`data-analysis`)

4. **Métriques de Performance**
   - Vitesse (basée sur `max_completion_tokens`)
   - Coût (basé sur `pricing`)
   - Contexte (basé sur `context_length`)

### Stockage et Cache

```typescript
// localStorage pour cache des capacités
interface CapabilitiesCache {
  [modelId: string]: {
    capabilities: ModelCapabilities;
    cachedAt: number;
    version: string;
  };
}
```

## Error Handling

### Gestion des Erreurs d'Analyse

1. **Modèle sans métadonnées** : Capacités par défaut basées sur le nom
2. **API indisponible** : Cache local avec données de fallback
3. **Analyse échouée** : Marquage comme "capacités inconnues"

### Fallbacks

1. **Capacités par défaut** pour les modèles populaires
2. **Détection basique** sur le nom du modèle
3. **Mode dégradé** sans filtrage par capacités

## Testing Strategy

### Tests Unitaires

1. **ModelCapabilityAnalyzer**
   - Test d'analyse de différents types de modèles
   - Test de détection des capacités spécialisées
   - Test de calcul des métriques

2. **Composants UI**
   - Rendu des badges de capacités
   - Interaction avec les tooltips
   - Filtrage par capacités

### Tests d'Intégration

1. **Flux complet** de sélection de modèle avec capacités
2. **Performance** avec de nombreux modèles
3. **Responsive** sur différentes tailles d'écran

### Tests E2E

1. **Sélection de modèle** basée sur les capacités
2. **Comparaison de modèles** avec capacités différentes
3. **Filtrage et recherche** par capacités

## Implementation Notes

### Phase 1 : Analyse et Stockage
- Extension du service `modelsApi` pour analyser les capacités
- Ajout des nouvelles interfaces TypeScript
- Système de cache pour les capacités analysées

### Phase 2 : Interface Basique
- Badges de capacités dans le sélecteur existant
- Tooltips avec informations détaillées
- Filtrage simple par capacités principales

### Phase 3 : Interface Avancée
- Modal de comparaison de modèles
- Filtres avancés par catégories de capacités
- Recommandations de modèles basées sur l'usage

### Phase 4 : Optimisations
- Cache intelligent des capacités
- Mise à jour automatique des métadonnées
- Analytics sur l'utilisation des capacités

## Visual Design

### Système d'Icônes

- **Texte** : `Type` (Lucide)
- **Images** : `Image` (Lucide)
- **Code** : `Code` (Lucide)
- **Math** : `Calculator` (Lucide)
- **Créativité** : `Palette` (Lucide)
- **Vitesse** : `Zap` (Lucide)
- **Contexte** : `FileText` (Lucide)

### Couleurs par Catégorie

- **Input** : Bleu (`blue-500`)
- **Output** : Vert (`green-500`)
- **Reasoning** : Violet (`purple-500`)
- **Specialized** : Orange (`orange-500`)

### Responsive Behavior

- **Desktop** : Badges complets avec texte
- **Tablet** : Badges avec icônes et texte court
- **Mobile** : Icônes uniquement avec tooltips au touch