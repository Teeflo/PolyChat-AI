import React, { useMemo, useState } from 'react';
import { Sparkles, ChevronRight, Star, ArrowUpRight, Zap } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { PRE_BUILT_TEMPLATES, TEMPLATE_CATEGORIES } from '../../data/templates';
import type { ConversationTemplate } from '../../types/index';
import './SmartSuggestions.css';

const SmartSuggestions: React.FC = () => {
  const { activeSessions, prepareTemplate } = useChat();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const lastMessages = useMemo(() => {
    const session = activeSessions[0];
    if (!session) return [];
    return session.messages.slice(-3).filter(m => m.role === 'user').map(m => m.content);
  }, [activeSessions]);

  const contextualSuggestions = useMemo(() => {
    if (!lastMessages.length) return PRE_BUILT_TEMPLATES.slice(0, 4);
    
    const allText = lastMessages.join(' ').toLowerCase();
    
    const scored = PRE_BUILT_TEMPLATES.map(template => {
      let score = 0;
      const keywords = [template.category, ...template.tags];
      
      // Scoring basé sur les mots-clés
      keywords.forEach(keyword => {
        if (allText.includes(keyword.toLowerCase())) score += 2;
      });
      
      // Scoring contextuel avancé
      if (/code|bug|error|function|typescript|javascript|python|debug|review/.test(allText)) {
        if (template.category === 'programming') score += 5;
      }
      if (/write|email|article|post|text|grammar|style|content/.test(allText)) {
        if (template.category === 'writing') score += 5;
      }
      if (/analy(s|z)e|data|market|research|trend|insight/.test(allText)) {
        if (template.category === 'analysis') score += 5;
      }
      if (/idea|creative|story|brainstorm|innovative/.test(allText)) {
        if (template.category === 'creative') score += 5;
      }
      if (/learn|explain|understand|tutorial|guide/.test(allText)) {
        if (template.category === 'learning') score += 5;
      }
      if (/business|strategy|plan|market|professional/.test(allText)) {
        if (template.category === 'business') score += 5;
      }
      
      return { template, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(item => item.template);
    
    return scored.length ? scored : PRE_BUILT_TEMPLATES.slice(0, 4);
  }, [lastMessages]);

  const categorizedTemplates = useMemo(() => {
    const categories: Record<string, ConversationTemplate[]> = {};
    PRE_BUILT_TEMPLATES.forEach(template => {
      if (!categories[template.category]) {
        categories[template.category] = [];
      }
      categories[template.category].push(template);
    });
    return categories;
  }, []);

  const quickActions = useMemo(() => [
    { 
      name: 'Améliorer ce texte', 
      icon: '✨', 
      action: () => prepareTemplate({
        id: 'improve-text',
        name: 'Améliorer le texte',
        category: 'writing',
        description: 'Améliorer la qualité du texte',
        systemPrompt: 'Tu es un expert en rédaction. Améliore le texte suivant en gardant le sens original mais en rendant le style plus fluide, clair et engageant.',
        userMessage: 'Améliore ce texte : [Colle ton texte ici]',
        tags: ['amélioration', 'style'],
        isCustom: true
      })
    },
    { 
      name: 'Expliquer simplement', 
      icon: '🎯', 
      action: () => prepareTemplate({
        id: 'explain-simple',
        name: 'Expliquer simplement',
        category: 'learning',
        description: 'Expliquer un concept complexe simplement',
        systemPrompt: 'Tu es un excellent pédagogue. Explique des concepts complexes de manière simple et accessible, avec des exemples concrets.',
        userMessage: 'Explique-moi simplement : [Ton concept/question ici]',
        tags: ['explication', 'pédagogie'],
        isCustom: true
      })
    },
    { 
      name: 'Générer des idées', 
      icon: '💡', 
      action: () => prepareTemplate({
        id: 'generate-ideas',
        name: 'Générer des idées',
        category: 'creative',
        description: 'Brainstorming créatif',
        systemPrompt: 'Tu es un expert en créativité et innovation. Génère des idées originales et pratiques pour résoudre des problèmes ou explorer de nouvelles opportunités.',
        userMessage: 'Génère-moi des idées créatives pour : [Ton défi/projet ici]',
        tags: ['créativité', 'innovation'],
        isCustom: true
      })
    }
  ], [prepareTemplate]);

  if (!activeSessions.length) return null;

  return (
    <div className="smart-suggestions">
      {/* En-tête avec icône moderne */}
      <div className="smart-suggestions-header">
        <div className="smart-suggestions-title">
          <Sparkles size={16} />
          <span>Suggestions intelligentes</span>
        </div>
        <div className="smart-suggestions-subtitle">
          Basées sur votre conversation
        </div>
      </div>

      {/* Actions rapides */}
      <div className="quick-actions">
        <div className="quick-actions-title">Actions rapides</div>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="quick-action-btn"
            >
              <span className="quick-action-icon">{action.icon}</span>
              <span className="quick-action-name">{action.name}</span>
              <ArrowUpRight size={12} className="quick-action-arrow" />
            </button>
          ))}
        </div>
      </div>

      {/* Suggestions contextuelles */}
      <div className="contextual-suggestions">
        <div className="contextual-title">
          <Star size={14} />
          <span>Recommandé pour vous</span>
        </div>
        <div className="contextual-grid">
          {contextualSuggestions.map((template) => {
            const category = TEMPLATE_CATEGORIES.find(cat => cat.id === template.category);
            return (
              <button
                key={template.id}
                onClick={() => prepareTemplate(template)}
                className={`contextual-suggestion category-${template.category}`}
              >
                <div className="contextual-suggestion-header">
                  <span className="contextual-suggestion-icon">
                    {template.icon || category?.icon || '⭐'}
                  </span>
                  <div className="contextual-suggestion-category">
                    {category?.name || template.category}
                  </div>
                </div>
                <div className="contextual-suggestion-name">{template.name}</div>
                <div className="contextual-suggestion-desc">{template.description}</div>
                <ChevronRight size={14} className="contextual-suggestion-arrow" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Exploration par catégories */}
      <div className="category-explorer">
        <div className="category-explorer-title">
          <Zap size={14} />
          <span>Explorer par catégorie</span>
        </div>
        <div className="category-tabs">
          {TEMPLATE_CATEGORIES.slice(0, 4).map((category) => (
            <button
              key={category.id}
              onClick={() => setExpandedCategory(
                expandedCategory === category.id ? null : category.id
              )}
              className={`category-tab category-${category.id} ${expandedCategory === category.id ? 'active' : ''}`}
            >
              <span className="category-tab-icon">{category.icon}</span>
              <span className="category-tab-name">{category.name}</span>
              <span className="category-tab-count">
                {categorizedTemplates[category.id]?.length || 0}
              </span>
            </button>
          ))}
        </div>
        
        {expandedCategory && categorizedTemplates[expandedCategory] && (
          <div className="expanded-category">
            <div className="expanded-category-grid">
              {categorizedTemplates[expandedCategory].slice(0, 6).map((template) => (
                <button
                  key={template.id}
                  onClick={() => prepareTemplate(template)}
                  className="expanded-template"
                >
                  <span className="expanded-template-icon">{template.icon || '⭐'}</span>
                  <div className="expanded-template-content">
                    <div className="expanded-template-name">{template.name}</div>
                    <div className="expanded-template-desc">{template.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartSuggestions;
