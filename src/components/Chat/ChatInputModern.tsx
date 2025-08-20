import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, X, Sparkles } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { PRE_BUILT_TEMPLATES } from '../../data/templates';
import type { ConversationTemplate } from '../../types/index';
import './ChatInputModern.css';

const ChatInputModern: React.FC = () => {
  const [message, setMessage] = useState('');
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessageToAll, isAnyLoading, pendingTemplate, prepareTemplate } = useChat();

  // Générer des suggestions basées sur le contexte
  const contextualSuggestions = useMemo(() => {
    if (!message.trim()) {
      // Suggestions de démarrage étendues avec prompts améliorés
      const allStartSuggestions = [
        {
          id: 'quick-start-1',
          name: 'Expliquer un concept',
          category: 'learning' as const,
          description: "Obtenir une explication détaillée et pédagogique",
          systemPrompt: "Tu es un expert pédagogue avec une vaste connaissance dans tous les domaines. Ton rôle est d'expliquer des concepts complexes de manière claire, structurée et accessible. Utilise des exemples concrets, des analogies pertinentes, et adapte ton niveau de langage à l'audience. Structure tes explications avec une introduction, un développement détaillé avec des sous-parties si nécessaire, et une conclusion synthétique. N'hésite pas à inclure des exemples pratiques, des schémas conceptuels en texte, et des liens logiques entre les idées.",
          userMessage: "Explique-moi de manière détaillée et pédagogique : ",
          tags: ['explication', 'apprentissage', 'pédagogie'],
          isCustom: true,
          icon: '💡'
        },
        {
          id: 'quick-start-2',
          name: 'Améliorer du texte',
          category: 'writing' as const,
          description: "Réviser, corriger et optimiser un texte",
          systemPrompt: "Tu es un expert en rédaction et en communication écrite avec une maîtrise parfaite du français. Ton rôle est d'améliorer tous types de textes en corrigeant les erreurs grammaticales, orthographiques et syntaxiques, en optimisant la structure et la fluidité, en enrichissant le vocabulaire quand approprié, et en adaptant le style au contexte et à l'audience cible. Propose des alternatives pour les formulations maladroites, améliore la cohérence textuelle, et assure-toi que le message soit clair et impactant. Conserve toujours le sens original et l'intention de l'auteur.",
          userMessage: "Améliore, corrige et optimise ce texte en préservant son sens original : ",
          tags: ['rédaction', 'correction', 'amélioration'],
          isCustom: true,
          icon: '✍️'
        },
        {
          id: 'quick-start-3',
          name: 'Analyser et résumer',
          category: 'analysis' as const,
          description: "Analyse approfondie et synthèse structurée",
          systemPrompt: "Tu es un expert analyste avec d'excellentes capacités de synthèse et d'analyse critique. Ton rôle est d'examiner en profondeur le contenu fourni, d'identifier les idées principales et secondaires, de déceler les patterns et relations importantes, et de produire une synthèse claire et structurée. Utilise une approche méthodique : analyse thématique, identification des arguments clés, évaluation de la logique interne, et présentation hiérarchisée des informations. Inclus les points saillants, les implications importantes, et propose une conclusion analytique qui va au-delà de la simple reformulation.",
          userMessage: "Analyse en profondeur et produis une synthèse structurée de : ",
          tags: ['analyse', 'synthèse', 'résumé'],
          isCustom: true,
          icon: '🔍'
        },
        {
          id: 'quick-start-4',
          name: 'Brainstorming créatif',
          category: 'creative' as const,
          description: "Session de créativité et génération d'idées",
          systemPrompt: "Tu es un expert en créativité et innovation avec une approche méthodologique du brainstorming. Ton rôle est de générer des idées originales, variées et exploitables en utilisant différentes techniques créatives (association d'idées, thinking outside the box, approches disruptives, etc.). Propose un large éventail d'options créatives, des plus conventionnelles aux plus audacieuses, en expliquant le potentiel et les avantages de chaque approche. Structure tes propositions par catégories logiques et inclus des suggestions concrètes de mise en œuvre.",
          userMessage: "Lance une session de brainstorming créatif et génère des idées innovantes pour : ",
          tags: ['créativité', 'innovation', 'brainstorming'],
          isCustom: true,
          icon: '🧠'
        },
        {
          id: 'quick-start-5',
          name: 'Créer une liste',
          category: 'business' as const,
          description: "Organisation et structuration en listes",
          systemPrompt: "Tu es un expert en organisation et en structuration d'informations. Ton rôle est de créer des listes complètes, logiquement organisées et pratiquement utilisables. Hiérarchise les éléments par importance, urgence ou pertinence selon le contexte. Utilise des catégories claires, des sous-sections si nécessaire, et inclus des détails utiles pour chaque élément. Assure-toi que la liste soit actionnable avec des étapes concrètes, des priorités définies, et des critères de réussite quand approprié.",
          userMessage: "Crée une liste complète, structurée et actionnable pour : ",
          tags: ['organisation', 'planification', 'structuration'],
          isCustom: true,
          icon: '📋'
        },
        {
          id: 'quick-start-6',
          name: 'Traduire du texte',
          category: 'writing' as const,
          description: "Traduction professionnelle et contextuelle",
          systemPrompt: "Tu es un expert traducteur professionnel maîtrisant parfaitement plusieurs langues avec une compréhension approfondie des nuances culturelles et contextuelles. Ton rôle est de produire des traductions précises qui respectent non seulement le sens littéral mais aussi les subtilités stylistiques, le registre de langue, et l'intention communicative originale. Adapte la traduction au contexte culturel de la langue cible, explique les choix de traduction complexes, et propose des alternatives quand plusieurs interprétations sont possibles.",
          userMessage: "Traduis avec précision et en respectant le contexte culturel : ",
          tags: ['traduction', 'langues', 'communication'],
          isCustom: true,
          icon: '🌍'
        },
        {
          id: 'quick-start-7',
          name: 'Résoudre un problème',
          category: 'analysis' as const,
          description: "Aide à la résolution de problèmes étape par étape",
          systemPrompt: "Tu es un expert en résolution de problèmes avec une approche méthodique et analytique. Ton rôle est d'aider à décomposer les problèmes complexes en étapes manageable, d'identifier les causes racines, d'évaluer différentes solutions possibles, et de proposer un plan d'action structuré. Utilise des frameworks de résolution de problèmes (5 pourquoi, diagramme de cause à effet, analyse SWOT selon le contexte). Propose des solutions créatives et pragmatiques, anticipe les obstacles potentiels, et inclus des critères de mesure du succès.",
          userMessage: "Aide-moi à résoudre ce problème de manière structurée : ",
          tags: ['problème', 'solution', 'méthodologie'],
          isCustom: true,
          icon: '🔧'
        },
        {
          id: 'quick-start-8',
          name: 'Planifier un projet',
          category: 'business' as const,
          description: "Création de plans de projet détaillés",
          systemPrompt: "Tu es un expert en gestion de projet avec une maîtrise des méthodologies agiles et traditionnelles. Ton rôle est de créer des plans de projet complets, réalistes et exécutables. Définis clairement les objectifs, les livrables, les jalons, les ressources nécessaires, et les critères de succès. Inclus une analyse des risques, un planning détaillé avec des dépendances, une répartition des responsabilités, et des mécanismes de suivi et de contrôle. Adapte la méthodologie au type et à la complexité du projet.",
          userMessage: "Aide-moi à créer un plan de projet détaillé pour : ",
          tags: ['planification', 'projet', 'gestion'],
          isCustom: true,
          icon: '📅'
        },
        {
          id: 'quick-start-9',
          name: 'Écrire du code',
          category: 'programming' as const,
          description: "Assistance au développement et programmation",
          systemPrompt: "Tu es un développeur senior expert dans multiple langages de programmation et frameworks. Ton rôle est d'aider à écrire du code propre, efficace, maintenable et bien documenté. Respecte les bonnes pratiques de développement, les patterns de conception appropriés, et les conventions de code. Inclus des commentaires explicatifs, gère les cas d'erreur, optimise les performances quand nécessaire, et assure-toi que le code soit sécurisé et testable. Propose des solutions robustes et évolutives.",
          userMessage: "Aide-moi à développer et écrire du code professionnel pour : ",
          tags: ['code', 'programmation', 'développement'],
          isCustom: true,
          icon: '💻'
        },
        {
          id: 'quick-start-10',
          name: 'Rechercher des infos',
          category: 'learning' as const,
          description: "Recherche et synthèse d'informations",
          systemPrompt: "Tu es un expert chercheur avec d'excellentes capacités de synthèse et de vérification d'informations. Ton rôle est de fournir des informations précises, à jour et bien sourcées sur tous types de sujets. Structure tes recherches de manière logique, présente les informations de façon claire et accessible, mentionne les sources fiables, et indique quand les informations peuvent être incertaines ou controversées. Propose des perspectives multiples quand approprié et inclus des suggestions pour approfondir le sujet.",
          userMessage: "Recherche et synthétise des informations complètes sur : ",
          tags: ['recherche', 'information', 'documentation'],
          isCustom: true,
          icon: '🔎'
        },
        {
          id: 'quick-start-11',
          name: 'Réviser un texte',
          category: 'writing' as const,
          description: "Révision éditoriale et amélioration stylistique",
          systemPrompt: "Tu es un réviseur éditorial expert avec une excellente maîtrise de la langue française et des techniques rédactionnelles. Ton rôle est de réviser les textes en profondeur en corrigeant non seulement les erreurs mais aussi en améliorant la structure, la cohérence, la fluidité et l'impact du message. Vérifie la grammaire, l'orthographe, la syntaxe, la ponctuation, mais aussi la logique argumentative, la clarté de l'expression, et l'adaptation au public cible. Propose des restructurations quand nécessaire et améliore l'efficacité communicationnelle.",
          userMessage: "Effectue une révision éditoriale complète de ce texte : ",
          tags: ['révision', 'édition', 'style'],
          isCustom: true,
          icon: '📝'
        },
        {
          id: 'quick-start-12',
          name: 'Donner des conseils',
          category: 'personal' as const,
          description: "Conseils personnalisés et guidance",
          systemPrompt: "Tu es un conseiller expérimenté avec une approche empathique et pragmatique. Ton rôle est de fournir des conseils réfléchis, personnalisés et actionnables en tenant compte du contexte spécifique de chaque situation. Écoute activement les besoins exprimés, pose les bonnes questions pour clarifier la situation, propose des perspectives alternatives, et suggère des actions concrètes. Respecte les valeurs et contraintes de la personne, et encourage l'autonomie dans la prise de décision tout en offrant un soutien structuré.",
          userMessage: "Donne-moi des conseils personnalisés et pratiques sur : ",
          tags: ['conseil', 'guidance', 'aide'],
          isCustom: true,
          icon: '💝'
        }
      ];
      
      return allStartSuggestions.slice(0, showAllSuggestions ? 12 : 4);
    }

    if (message.trim().length < 3) return [];

    const input = message.toLowerCase();
    
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
      
      return { template, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, showAllSuggestions ? 10 : 5)
    .map(item => item.template);

    return scored;
  }, [message, showAllSuggestions]);

  // Calculer s'il y a plus de suggestions disponibles
  const hasMoreSuggestions = useMemo(() => {
    if (!message.trim()) {
      // Pour les suggestions de démarrage, on a 12 suggestions au total
      return !showAllSuggestions && contextualSuggestions.length >= 4;
    } else {
      // Pour les suggestions contextuelles, vérifier s'il y a plus de templates correspondants
      const input = message.toLowerCase();
      const allMatching = PRE_BUILT_TEMPLATES.filter(template => {
        let score = 0;
        template.tags?.forEach(tag => {
          if (input.includes(tag.toLowerCase())) score += 3;
        });
        if (input.includes(template.name.toLowerCase())) score += 5;
        if (template.description?.toLowerCase().includes(input)) score += 2;
        return score > 0;
      });
      return !showAllSuggestions && allMatching.length > 5;
    }
  }, [message, showAllSuggestions, contextualSuggestions.length]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Appliquer le template pending quand il change
  useEffect(() => {
    if (pendingTemplate) {
      setMessage(pendingTemplate.userMessage);
      // Effacer le pending template après l'avoir utilisé
      prepareTemplate(null);
      // Focus sur le textarea
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
        }
      }, 100);
    }
  }, [pendingTemplate, prepareTemplate]);

  const handleSend = async () => {
    if (message.trim() && !isAnyLoading) {
      await sendMessageToAll(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearMessage = () => {
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSuggestionClick = (template: ConversationTemplate) => {
    setMessage(template.userMessage);
    prepareTemplate(template);
    
    // Focus sur le textarea et positionner le curseur à la fin
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const length = template.userMessage.length;
        textareaRef.current.setSelectionRange(length, length);
      }
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
  };

  const handleInputFocus = () => {
    // Pas besoin de logique spéciale, les suggestions sont toujours visibles
  };

  const handleInputBlur = () => {
    // Pas besoin de logique spéciale, les suggestions sont toujours visibles
  };

  return (
    <div className="chat-input-modern-container chat-input-enhanced">
      {/* Indicateur de template actif */}
      {pendingTemplate && (
        <div className="chat-input-template-indicator">
          <Sparkles size={14} />
          <span>Template "{pendingTemplate.name}" préparé - Modifiez le message ci-dessous</span>
        </div>
      )}
      
      <div className="chat-input-modern-wrapper">
        {/* Suggestions toujours affichées et intégrées dans la barre de chat */}
        {contextualSuggestions.length > 0 && (
          <div className="chat-input-suggestions-bar">
            {contextualSuggestions.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSuggestionClick(template)}
                className="chat-input-suggestion-btn"
                title={template.description}
              >
                {template.icon && <span className="suggestion-icon">{template.icon}</span>}
                <span className="suggestion-text">{template.name}</span>
              </button>
            ))}
            {hasMoreSuggestions && (
              <button
                onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                className="chat-input-suggestion-btn show-more"
              >
                <Sparkles size={14} />
                <span>{showAllSuggestions ? 'Moins' : 'Plus'}</span>
              </button>
            )}
          </div>
        )}
        
        {/* Zone de saisie principale avec bouton d'envoi intégré */}
        <div className="chat-input-modern-input-area">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question à l'IA..."
            className="chat-input-modern-textarea"
            disabled={isAnyLoading}
            rows={1}
            maxLength={4000}
          />
          
          {/* Bouton pour effacer */}
          {message.length > 0 && (
            <button
              onClick={clearMessage}
              className="chat-input-clear-btn"
              aria-label="Effacer le message"
              title="Effacer le message"
            >
              <X size={16} />
            </button>
          )}
          
          {/* Compteur de caractères */}
          <div className="chat-input-modern-char-counter">
            {message.length}/4000
          </div>
          
          {/* Bouton d'envoi intégré à droite */}
          <button
            onClick={handleSend}
            disabled={!message.trim() || isAnyLoading}
            className={`chat-input-modern-send-btn ${message.trim() ? 'active' : 'inactive'}`}
            aria-label="Envoyer le message"
          >
            {isAnyLoading ? (
              <div className="chat-input-modern-spinner" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Raccourcis clavier */}
      <div className="chat-input-modern-shortcuts">
        <span className="chat-input-modern-shortcut">
          <kbd>Entrée</kbd> pour envoyer • <kbd>Shift + Entrée</kbd> pour nouvelle ligne
        </span>
      </div>
    </div>
  );
};

export default ChatInputModern;
