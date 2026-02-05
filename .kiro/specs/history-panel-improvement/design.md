# Design Document

## Overview

Cette fonctionnalité transforme le panneau d'historique actuel en une interface moderne et puissante pour la gestion des conversations. Le design s'appuie sur l'architecture existante de PolyChat-AI et étend significativement les fonctionnalités de `ChatHistorySidebar` avec des capacités de recherche, filtrage, organisation et export avancées.

L'objectif est de créer une expérience utilisateur fluide et intuitive qui permette aux utilisateurs de gérer efficacement leurs conversations passées, qu'ils en aient quelques-unes ou des centaines.

## Architecture

### Composants Modifiés

1. **ChatHistorySidebar** - Refonte complète avec nouvelle interface et fonctionnalités
2. **localStorage service** - Extension pour supporter les nouvelles métadonnées
3. **useChat Hook** - Ajout de méthodes pour l'organisation et la recherche

### Nouveaux Composants

1. **HistorySearchBar** - Barre de recherche avancée avec filtres
2. **ConversationCard** - Carte de conversation avec actions rapides
3. **HistoryFilters** - Panneau de filtres avancés
4. **ConversationFolder** - Système de dossiers pour l'organisation
5. **ExportModal** - Interface d'export avec options multiples
6. **HistoryVirtualList** - Liste virtualisée pour les performances

## Components and Interfaces

### Interface de Données Étendues

```typescript
export interface ConversationMetadata {
  id: string;
  title: string;
  customTitle?: string; // Titre personnalisé par l'utilisateur
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  modelIds: string[]; // Modèles utilisés dans la conversation
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  folderId?: string;
  hasImages: boolean;
  hasCode: boolean;
  wordCount: number;
  lastActivity: Date;
}

export interface ConversationFolder {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
  conversationIds: string[];
  isExpanded: boolean;
}

export interface HistoryFilters {
  searchTerm: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  modelIds: string[];
  contentTypes: ('text' | 'image' | 'code')[];
  status: ('all' | 'pinned' | 'archived')[];
  folders: string[];
  sortBy: 'date' | 'title' | 'activity' | 'messages';
  sortOrder: 'asc' | 'desc';
}

export interface ExportOptions {
  format: 'json' | 'markdown' | 'pdf' | 'txt';
  includeMetadata: boolean;
  includeImages: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  selectedConversations?: string[];
}
```

### Services Étendus

```typescript
// services/conversationManager.ts
export class ConversationManager {
  static generateMetadata(session: ChatSession): ConversationMetadata {
    // Génération automatique des métadonnées
  }

  static searchConversations(sessions: ChatSession[], searchTerm: string): ChatSession[] {
    // Recherche full-text dans les conversations
  }

  static filterConversations(sessions: ChatSession[], filters: HistoryFilters): ChatSession[] {
    // Filtrage avancé des conversations
  }

  static exportConversations(sessions: ChatSession[], options: ExportOptions): Promise<Blob> {
    // Export des conversations dans différents formats
  }
}
```

### Composants d'Interface

#### HistorySearchBar

```typescript
interface HistorySearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onFiltersToggle: () => void;
  resultCount: number;
  isFiltersOpen: boolean;
}
```

#### ConversationCard

```typescript
interface ConversationCardProps {
  conversation: ChatSession;
  metadata: ConversationMetadata;
  isSelected: boolean;
  isActive: boolean;
  onSelect: (id: string) => void;
  onPin: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onMoveToFolder: (id: string, folderId: string) => void;
}
```

#### HistoryFilters

```typescript
interface HistoryFiltersProps {
  filters: HistoryFilters;
  availableModels: string[];
  availableFolders: ConversationFolder[];
  onFiltersChange: (filters: Partial<HistoryFilters>) => void;
  onClearFilters: () => void;
}
```

#### ConversationFolder

```typescript
interface ConversationFolderProps {
  folder: ConversationFolder;
  conversations: ChatSession[];
  isExpanded: boolean;
  onToggleExpand: (folderId: string) => void;
  onRename: (folderId: string, newName: string) => void;
  onDelete: (folderId: string) => void;
  onColorChange: (folderId: string, color: string) => void;
}
```

## Data Models

### Système de Recherche

Le système de recherche analysera :

1. **Contenu des Messages**
   - Recherche full-text dans le contenu
   - Support des opérateurs de recherche ("phrase exacte", +obligatoire, -exclusion)
   - Recherche dans les métadonnées (titres, tags)

2. **Indexation Intelligente**
   - Index inversé pour la recherche rapide
   - Mise à jour incrémentale de l'index
   - Support de la recherche floue (typos)

3. **Filtres Avancés**
   - Filtrage par date avec sélecteur de plage
   - Filtrage par modèles utilisés
   - Filtrage par type de contenu (texte, images, code)
   - Filtrage par statut (épinglé, archivé)

### Système d'Organisation

```typescript
// Structure de stockage pour l'organisation
interface HistoryOrganization {
  folders: ConversationFolder[];
  pinnedConversations: string[];
  archivedConversations: string[];
  conversationMetadata: Record<string, ConversationMetadata>;
  lastCleanup: Date;
}
```

## Error Handling

### Gestion des Erreurs de Recherche

1. **Index corrompu** : Reconstruction automatique de l'index
2. **Recherche trop large** : Limitation des résultats avec pagination
3. **Filtres invalides** : Réinitialisation aux valeurs par défaut

### Gestion des Erreurs d'Export

1. **Échec d'export** : Retry automatique avec format de fallback
2. **Fichier trop volumineux** : Division en plusieurs fichiers
3. **Format non supporté** : Conversion vers format compatible

## Testing Strategy

### Tests Unitaires

1. **ConversationManager**
   - Test de génération de métadonnées
   - Test de recherche et filtrage
   - Test d'export dans différents formats

2. **Composants d'Interface**
   - Test des interactions de recherche
   - Test des actions rapides sur les conversations
   - Test de la gestion des dossiers

### Tests d'Intégration

1. **Flux complet** de recherche et filtrage
2. **Performance** avec de nombreuses conversations
3. **Persistance** des préférences et organisation

### Tests E2E

1. **Recherche et sélection** de conversations
2. **Organisation** avec dossiers et épinglage
3. **Export** de conversations multiples

## Implementation Phases

### Phase 1 : Infrastructure et Recherche

- Extension des interfaces de données
- Implémentation du système de recherche
- Refonte de la base du composant ChatHistorySidebar

### Phase 2 : Interface et Filtrage

- Nouveaux composants d'interface
- Système de filtres avancés
- Actions rapides sur les conversations

### Phase 3 : Organisation et Export

- Système de dossiers et épinglage
- Fonctionnalités d'export multiples
- Optimisations de performance

## Visual Design

### Layout Principal

```
┌─────────────────────────────────────┐
│ 🔍 [Recherche...] [Filtres] [+]    │
├─────────────────────────────────────┤
│ 📌 Épinglées (2)                    │
│ ┌─────────────────────────────────┐ │
│ │ 💬 Conversation importante     │ │
│ │ GPT-4 • 15 messages • 2h       │ │
│ │ [📌] [📁] [📤] [🗑️]            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 📁 Projets (5) ▼                   │
│ ┌─────────────────────────────────┐ │
│ │ 🤖 Debug React App             │ │
│ │ Claude • 23 messages • 1j      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 📅 Récentes (12)                   │
│ ┌─────────────────────────────────┐ │
│ │ ✨ Idées créatives             │ │
│ │ GPT-4 • 8 messages • 3j        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Carte de Conversation

```
┌─────────────────────────────────────┐
│ 💬 Titre de la conversation        │
│ ┌─ Aperçu du dernier message...    │
│ │                                 │
│ └─ GPT-4 • 15 messages • 2h       │
│ [🏷️ tag1] [🏷️ tag2]              │
│ [📌] [📁] [📤] [✏️] [🗑️]          │
└─────────────────────────────────────┘
```

### Panneau de Filtres

```
┌─────────────────────────────────────┐
│ 🔍 Filtres Avancés                 │
├─────────────────────────────────────┤
│ 📅 Période                         │
│ [Dernière semaine ▼]               │
│                                     │
│ 🤖 Modèles                         │
│ ☑️ GPT-4    ☐ Claude    ☐ Gemini   │
│                                     │
│ 📄 Contenu                         │
│ ☑️ Texte    ☑️ Images   ☐ Code     │
│                                     │
│ 📊 Statut                          │
│ ☑️ Tous     ☐ Épinglés  ☐ Archivés │
│                                     │
│ [Effacer] [Appliquer]              │
└─────────────────────────────────────┘
```

## Performance Optimizations

### Virtualisation

1. **Liste virtualisée** pour gérer des milliers de conversations
2. **Chargement paresseux** des métadonnées
3. **Pagination** des résultats de recherche

### Cache et Index

1. **Cache en mémoire** pour les recherches fréquentes
2. **Index de recherche** persistant en localStorage
3. **Debouncing** des requêtes de recherche

### Responsive Design

1. **Breakpoints adaptatifs** pour différentes tailles d'écran
2. **Gestes tactiles** pour les actions rapides sur mobile
3. **Interface compacte** pour les petits écrans

## Accessibility Features

1. **Navigation au clavier** complète
2. **Lecteurs d'écran** avec ARIA labels appropriés
3. **Contraste élevé** pour la lisibilité
4. **Tailles de police** ajustables
5. **Raccourcis clavier** pour les actions fréquentes
