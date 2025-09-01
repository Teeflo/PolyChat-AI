import React, { useState, useMemo } from 'react';
import { Sparkles, X } from 'lucide-react';
import { PRE_BUILT_TEMPLATES } from '../../data/templates';
import type { ConversationTemplate } from '../../types/index';
import './InlineSuggestions.css';

interface InlineSuggestionsProps {
  inputValue: string;
  onSuggestionClick: (template: ConversationTemplate) => void;
  onHide: () => void;
}

const InlineSuggestions: React.FC<InlineSuggestionsProps> = ({
  inputValue,
  onSuggestionClick,
  onHide
}) => {
  const [showAll, setShowAll] = useState(false);

  // Générer des suggestions basées sur le contexte de saisie
  const contextualSuggestions = useMemo(() => {
    if (!inputValue.trim()) {
      // Nouveau chat ou champ vide - suggestions de démarrage
      return [
        {
          id: 'quick-start-1',
          name: '💡 Expliquer un concept',
          category: 'learning' as const,
          description: 'Demander une explication claire',
          systemPrompt: 'Tu es un excellent pédagogue. Explique des concepts complexes de manière simple et accessible.',
          userMessage: 'Explique-moi simplement : ',
          tags: ['explication'],
          isCustom: true,
          icon: '💡'
        },
        {
          id: 'quick-start-2',
          name: '✍️ Améliorer du texte',
          category: 'writing' as const,
          description: 'Corriger et améliorer un texte',
          systemPrompt: 'Tu es un expert en rédaction. Améliore le texte en gardant le sens original.',
          userMessage: 'Améliore ce texte : ',
          tags: ['amélioration'],
          isCustom: true,
          icon: '✍️'
        },
        {
          id: 'quick-start-3',
          name: '🔍 Analyser et résumer',
          category: 'analysis' as const,
          description: 'Analyser et résumer du contenu',
          systemPrompt: 'Tu es un expert en analyse. Identifie les points clés et résume de manière structurée.',
          userMessage: 'Analyse et résume : ',
          tags: ['analyse'],
          isCustom: true,
          icon: '🔍'
        },
        {
          id: 'quick-start-4',
          name: '🧠 Brainstorming',
          category: 'creative' as const,
          description: 'Générer des idées créatives',
          systemPrompt: 'Tu es un expert en créativité. Aide à générer des idées originales et innovantes.',
          userMessage: 'Aide-moi à brainstormer des idées pour : ',
          tags: ['créativité', 'idées'],
          isCustom: true,
          icon: '🧠'
        },
        {
          id: 'quick-start-5',
          name: '📋 Créer une liste',
          category: 'business' as const,
          description: 'Organiser des informations en liste',
          systemPrompt: 'Tu es un expert en organisation. Crée des listes structurées et pratiques.',
          userMessage: 'Crée-moi une liste pour : ',
          tags: ['organisation', 'liste'],
          isCustom: true,
          icon: '📋'
        }
      ].slice(0, showAll ? 5 : 3);
    }

    if (inputValue.trim().length < 3) return [];

    const input = inputValue.toLowerCase();
    
    // Recherche intelligente basée sur le contenu
    const scored = PRE_BUILT_TEMPLATES.map(template => {
      let score = 0;
      
      // Score basé sur les mots-clés du template
      template.tags?.forEach(tag => {
        if (input.includes(tag.toLowerCase())) score += 3;
      });
      
      // Score basé sur le nom et la description
      if (input.includes(template.name.toLowerCase())) score += 5;
      if (template.description?.toLowerCase().includes(input)) score += 2;
      
      // Patterns contextuels spécifiques
      if (/code|bug|debug|program|function/.test(input) && template.category === 'programming') score += 4;
      if (/write|text|email|article|grammar/.test(input) && template.category === 'writing') score += 4;
      if (/explain|learn|understand|teach/.test(input) && template.category === 'learning') score += 4;
      if (/analy|research|data|market/.test(input) && template.category === 'analysis') score += 4;
      if (/idea|creative|story|brainstorm/.test(input) && template.category === 'creative') score += 4;
      
      return { template, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, showAll ? 8 : 3)
    .map(item => item.template);

    return scored;
  }, [inputValue, showAll]);

  if (contextualSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="inline-suggestions">
      <div className="inline-suggestions-header">
        <div className="inline-suggestions-title">
          <Sparkles size={12} />
          <span>Suggestions rapides</span>
        </div>
        <button 
          onClick={onHide}
          className="inline-suggestions-close"
          title="Masquer les suggestions"
        >
          <X size={12} />
        </button>
      </div>
      
      <div className="inline-suggestions-buttons">
        {contextualSuggestions.map((suggestion, index) => (
          <button
            key={`${suggestion.id}-${index}`}
            onClick={() => onSuggestionClick(suggestion)}
            className="suggestion-button"
            title={suggestion.description}
          >
            <span className="suggestion-button-icon">
              {suggestion.icon || '⭐'}
            </span>
            <span className="suggestion-button-text">{suggestion.name}</span>
          </button>
        ))}
      </div>
      
      {!showAll && contextualSuggestions.length >= 3 && inputValue.trim() === '' && (
        <button 
          onClick={() => setShowAll(true)}
          className="inline-suggestions-more"
        >
          + Plus de suggestions
        </button>
      )}
    </div>
  );
};

export default InlineSuggestions;
