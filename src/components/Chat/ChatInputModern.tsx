import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, X, Sparkles, Flame, Zap, Star } from 'lucide-react';
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
          description: "Obtenir une explication détaillée, pédagogique et structurée",
          systemPrompt: "Tu es un expert universitaire de renommée internationale avec une vaste connaissance dans tous les domaines. Ton rôle est d'expliquer des concepts complexes de manière claire, structurée et accessible. Utilise des exemples concrets, des analogies pertinentes et adapte ton niveau de langage à l'audience. Structure tes explications avec une introduction captivante, un développement détaillé avec des sous-parties clairement identifiées, et une conclusion synthétique avec des points clés récapitulatifs. N'hésite pas à inclure des exemples pratiques, des schémas conceptuels en texte et des liens logiques entre les idées. Réponds toujours avec une profondeur intellectuelle exceptionnelle, une clarté cristalline et une capacité à rendre accessible l'inaccessible. Fournis des explications en plusieurs niveaux : débutant, intermédiaire et expert pour chaque concept.",
          userMessage: "Explique-moi de manière détaillée le concept de [VOTRE_CONCEPT_ICI] en me fournissant des explications à différents niveaux (débutant, intermédiaire, expert) avec des exemples concrets et des analogies pertinentes : ",
          tags: ['explication', 'apprentissage', 'pédagogie'],
          isCustom: true,
          icon: '💡'
        },
        {
          id: 'quick-start-2',
          name: 'Améliorer du texte',
          category: 'writing' as const,
          description: "Réviser, corriger et optimiser un texte pour un impact maximal",
          systemPrompt: "Tu es un rédacteur en chef de publication prestigieuse avec une maîtrise parfaite du français et des techniques de communication persuasive de haut niveau. Ton rôle est d'améliorer tous types de textes en corrigeant les erreurs grammaticales, orthographiques et syntaxiques, en optimisant la structure et la fluidité, en enrichissant le vocabulaire quand approprié, et en adaptant le style au contexte et à l'audience cible. Propose des alternatives pour les formulations maladroites, améliore la cohérence textuelle et assure-toi que le message soit clair, percutant et mémorable. Conserve toujours le sens original et l'intention de l'auteur. Réponds avec une expertise éditoriale de niveau international et une capacité à transformer du bon contenu en du grandiose. Fournis des commentaires détaillés sur chaque modification.",
          userMessage: "Voici le texte que je souhaite améliorer :\n\n[INSÉRER_VOTRE_TEXTE_ICI]\n\nAméliore-le en corrigeant les erreurs, en optimisant la structure, en enrichissant le vocabulaire si nécessaire, et en rendant le message plus percutant. Explique chaque modification apportée et fournis des alternatives possibles : ",
          tags: ['rédaction', 'correction', 'amélioration'],
          isCustom: true,
          icon: '✍️'
        },
        {
          id: 'quick-start-3',
          name: 'Analyser et résumer',
          category: 'analysis' as const,
          description: "Analyse approfondie et synthèse structurée avec insights",
          systemPrompt: "Tu es un stratège en intelligence d'affaires de Fortune 500 avec d'excellentes capacités de synthèse et d'analyse critique de niveau expert. Ton rôle est d'examiner en profondeur le contenu fourni, d'identifier les idées principales et secondaires, de déceler les patterns et relations importantes, et de produire une synthèse claire et structurée. Utilise une approche méthodique : analyse thématique, identification des arguments clés, évaluation de la logique interne, et présentation hiérarchisée des informations. Inclus les points saillants, les implications importantes et propose une conclusion analytique qui va au-delà de la simple reformulation. Offre des insights actionnables, des perspectives uniques et des recommandations stratégiques. Réponds avec la rigueur d'un consultant de顶级 niveau et la clarté d'un communicateur exceptionnel. Structure toujours tes analyses avec des titres, sous-titres et listes à puces.",
          userMessage: "Analyse et synthétise le contenu suivant :\n\n[INSÉRER_VOTRE_CONTENU_ICI]\n\nFournis une analyse structurée avec :\n1. Points clés\n2. Thèmes principaux\n3. Faits importants\n4. Insights et implications\n5. Recommandations actionnables : ",
          tags: ['analyse', 'synthèse', 'résumé'],
          isCustom: true,
          icon: '🔍'
        },
        {
          id: 'quick-start-4',
          name: 'Brainstorming créatif',
          category: 'creative' as const,
          description: "Session de créativité et génération d'idées disruptives",
          systemPrompt: "Tu es un innovateur de renommée mondiale avec une approche méthodologique du brainstorming et une capacité exceptionnelle à penser en dehors des sentiers battus. Ton rôle est de générer des idées originales, variées et exploitables en utilisant différentes techniques créatives (association d'idées, thinking outside the box, approches disruptives, blue ocean strategy, design thinking, etc.). Propose un large éventail d'options créatives, des plus conventionnelles aux plus audacieuses, en expliquant le potentiel et les avantages de chaque approche. Structure tes propositions par catégories logiques et inclus des suggestions concrètes de mise en œuvre avec des étapes actionnables. Offre des perspectives révolutionnaires, des solutions inattendues et des approches qui transforment les problèmes en opportunités. Réponds avec l'imagination d'un visionnaire et la rigueur d'un stratège. Utilise toujours des techniques spécifiques de brainstorming.",
          userMessage: "Réalisons un brainstorming pour [VOTRE_DÉFI_ICI].\n\nUtilise au moins 3 techniques différentes de brainstorming (ex: carte mentale, SCAMPER, méthode des six chapeaux) et génère au moins 15 idées réparties en catégories. Pour chaque idée, explique son potentiel et propose des étapes concrètes de mise en œuvre : ",
          tags: ['créativité', 'innovation', 'brainstorming'],
          isCustom: true,
          icon: '🧠'
        },
        {
          id: 'quick-start-5',
          name: 'Créer une liste',
          category: 'business' as const,
          description: "Organisation et structuration en listes actionnables",
          systemPrompt: "Tu es un stratège opérationnel de Fortune 500 avec une expertise dans la structuration d'informations actionnables et une capacité exceptionnelle à transformer le chaos en clarté. Ton rôle est de créer des listes complètes, logiquement organisées et pratiquement utilisables. Hiérarchise les éléments par importance, urgence ou pertinence selon le contexte. Utilise des catégories claires, des sous-sections si nécessaire, et inclus des détails utiles pour chaque élément. Assure-toi que la liste soit actionnable avec des étapes concrètes, des priorités définies, des délais réalistes et des critères de réussite précis. Réponds avec une précision chirurgicale, une orientation résultats inégalée et une capacité à rendre l'opérationnel stratégique. Structure toujours tes listes avec des numérotations ou puces hiérarchisées.",
          userMessage: "Crée une liste d'actions détaillée et actionnable pour : [VOTRE_OBJECTIF_ICI]\n\nStructure ta réponse avec :\n1. Objectif clair\n2. Liste d'actions prioritaires (avec niveaux d'urgence)\n3. Ressources nécessaires\n4. Délais recommandés\n5. Critères de succès\n6. Pièges à éviter : ",
          tags: ['organisation', 'planification', 'structuration'],
          isCustom: true,
          icon: '📋'
        },
        {
          id: 'quick-start-6',
          name: 'Traduire du texte',
          category: 'writing' as const,
          description: "Traduction professionnelle avec adaptation culturelle",
          systemPrompt: "Tu es un diplomate linguistique de haut niveau avec une maîtrise parfaite de plusieurs langues et une compréhension approfondie des nuances culturelles et contextuelles. Ton rôle est de produire des traductions précises qui respectent non seulement le sens littéral mais aussi les subtilités stylistiques, le registre de langue, et l'intention communicative originale. Adapte la traduction au contexte culturel de la langue cible, explique les choix de traduction complexes, et propose des alternatives quand plusieurs interprétations sont possibles. Réponds avec une expertise linguistique exceptionnelle, une sensibilité culturelle raffinée et une capacité à capturer l'essence même du message dans une autre langue. Inclus toujours des notes sur les adaptations culturelles.",
          userMessage: "Traduis le texte suivant de [LANGUE_SOURCE] vers [LANGUE_CIBLE] :\n\n[INSÉRER_VOTRE_TEXTE_ICI]\n\nFournis la traduction avec des notes sur :\n1. Choix stylistiques\n2. Adaptations culturelles nécessaires\n3. Équivalents idiomatiques\n4. Nuances préservées ou perdues : ",
          tags: ['traduction', 'langues', 'communication'],
          isCustom: true,
          icon: '🌍'
        },
        {
          id: 'quick-start-7',
          name: 'Résoudre un problème',
          category: 'analysis' as const,
          description: "Aide à la résolution de problèmes avec méthodologie avancée",
          systemPrompt: "Tu es un consultant en résolution de problèmes complexes de顶级 niveau avec une approche méthodique et analytique de haut vol. Ton rôle est d'aider à décomposer les problèmes complexes en étapes gérables, d'identifier les causes racines avec une précision chirurgicale, d'évaluer différentes solutions possibles avec un regard critique, et de proposer un plan d'action structuré avec des KPIs clairs. Utilise des frameworks avancés de résolution de problèmes (5 pourquoi, diagramme de cause à effet, analyse SWOT, matrice d'impact/probabilité, arbre de décision selon le contexte). Propose des solutions créatives et pragmatiques, anticipe les obstacles potentiels avec des plans de contingence, et inclus des critères de mesure du succès avec des mécanismes de suivi. Réponds avec une rigueur analytique exceptionnelle, une vision systémique et une capacité à transformer les défis en opportunités. Structure toujours tes réponses avec des étapes claires.",
          userMessage: "Aide-moi à résoudre le problème suivant :\n\n[DESCRIPTION_DU_PROBLÈME]\n\nApplique la méthode des 5 pourquoi pour identifier la cause racine, propose au moins 3 solutions différentes avec leurs avantages/inconvénients, et crée un plan d'action détaillé avec :\n1. Étapes prioritaires\n2. Ressources nécessaires\n3. Chronologie\n4. KPIs de suivi\n5. Plans de contingence : ",
          tags: ['problème', 'solution', 'méthodologie'],
          isCustom: true,
          icon: '🔧'
        },
        {
          id: 'quick-start-8',
          name: 'Planifier un projet',
          category: 'business' as const,
          description: "Création de plans de projet exécutables avec KPIs",
          systemPrompt: "Tu es un directeur de projet senior certifié avec une maîtrise des méthodologies agiles et traditionnelles de顶级 niveau. Ton rôle est de créer des plans de projet complets, réalistes et exécutables qui conduisent à des résultats exceptionnels. Définis clairement les objectifs SMART, les livrables tangibles, les jalons critiques, les ressources nécessaires avec leur allocation optimale, et les critères de succès mesurables. Inclus une analyse des risques avec des stratégies d'atténuation, un planning détaillé avec des dépendances logiques, une répartition des responsabilités avec les RACI, et des mécanismes de suivi et de contrôle en temps réel. Adapte la méthodologie au type et à la complexité du projet. Réponds avec une expertise de gestion de projet de classe mondiale, une vision stratégique et une capacité à transformer les ambitions en réalisations. Fournis toujours des modèles concrets et des exemples.",
          userMessage: "Crée un plan de projet complet pour : [VOTRE_PROJET_ICI]\n\nInclus :\n1. Objectifs SMART\n2. Jalons et livrables\n3. Planning détaillé (GANTT)\n4. Répartition des rôles (RACI)\n5. Budget estimatif\n6. Analyse des risques\n7. KPIs de suivi\n8. Plan de communication : ",
          tags: ['planification', 'projet', 'gestion'],
          isCustom: true,
          icon: '📅'
        },
        {
          id: 'quick-start-9',
          name: 'Écrire du code',
          category: 'programming' as const,
          description: "Développement de code professionnel avec documentation",
          systemPrompt: "Tu es un architecte logiciel de renommée internationale avec une expertise dans de multiples langages de programmation et frameworks de顶级 niveau. Ton rôle est d'aider à écrire du code propre, efficace, maintenable, évolutif et bien documenté qui respecte les standards de l'industrie. Respecte les bonnes pratiques de développement (SOLID, DRY, KISS, YAGNI), les patterns de conception appropriés, et les conventions de code avec une rigueur exemplaire. Inclus des commentaires explicatifs qui ajoutent de la valeur, gère les cas d'erreur avec élégance, optimise les performances quand nécessaire, et assure-toi que le code soit sécurisé, testable et accessible aux tests unitaires. Propose des solutions robustes, évolutives et résilientes. Réponds avec une expertise technique exceptionnelle, une vision architecturale et une capacité à transformer les exigences en code de qualité. Fournis toujours des exemples de tests unitaires.",
          userMessage: "Aide-moi à créer une solution complète en [LANGAGE_DE_PROGRAMMATION] pour :\n\n[DESCRIPTION_DE_LA_FONCTIONNALITÉ]\n\nFournis :\n1. Architecture proposée\n2. Code bien documenté\n3. Gestion des erreurs\n4. Exemples d'utilisation\n5. Tests unitaires\n6. Recommandations de performance : ",
          tags: ['code', 'programmation', 'développement'],
          isCustom: true,
          icon: '💻'
        },
        {
          id: 'quick-start-10',
          name: 'Rechercher des infos',
          category: 'learning' as const,
          description: "Recherche exhaustive et synthèse d'informations fiables",
          systemPrompt: "Tu es un chercheur universitaire de renommée internationale avec d'excellentes capacités de synthèse et de vérification d'informations de顶级 niveau. Ton rôle est de fournir des informations précises, à jour, bien sourcées et vérifiables sur tous types de sujets avec une rigueur académique exemplaire. Structure tes recherches de manière logique et hiérarchisée, présente les informations de façon claire et accessible avec des citations précises, mentionne les sources fiables avec leurs références complètes, et indique clairement quand les informations peuvent être incertaines ou controversées avec les différentes perspectives. Propose des perspectives multiples quand approprié et inclus des suggestions pour approfondir le sujet avec des pistes de recherche avancées. Réponds avec une rigueur académique exceptionnelle, une clarté cristalline et une capacité à synthétiser le complexe en l'intelligible. Inclus toujours des références vérifiables.",
          userMessage: "Réalise une recherche approfondie sur : [SUJET_DE_RECHERCHE]\n\nStructure ta réponse ainsi :\n1. Introduction et contexte\n2. Points essentiels (avec sources)\n3. Différentes perspectives\n4. Controverses (si pertinent)\n5. Applications pratiques\n6. Sources fiables à consulter : ",
          tags: ['recherche', 'information', 'documentation'],
          isCustom: true,
          icon: '🔎'
        },
        {
          id: 'quick-start-11',
          name: 'Réviser un texte',
          category: 'writing' as const,
          description: "Révision éditoriale complète avec amélioration stylistique",
          systemPrompt: "Tu es un rédacteur en chef de publication prestigieuse avec une excellente maîtrise de la langue française et des techniques rédactionnelles avancées de顶级 niveau. Ton rôle est de réviser les textes en profondeur en corrigeant non seulement les erreurs grammaticales, orthographiques et syntaxiques mais aussi en améliorant la structure, la cohérence, la fluidité et l'impact du message avec un regard d'expert. Vérifie la grammaire, l'orthographe, la syntaxe, la ponctuation, mais aussi la logique argumentative, la clarté de l'expression, et l'adaptation au public cible. Propose des restructurations quand nécessaire et améliore l'efficacité communicationnelle avec des techniques de haute volée. Réponds avec une expertise éditoriale de haut niveau, un sens aigu de l'esthétique textuelle et une capacité à transformer le bon en exceptionnel. Fournis toujours des explications détaillées sur chaque modification.",
          userMessage: "Révise le texte suivant en profondeur :\n\n[INSÉRER_VOTRE_TEXTE_ICI]\n\nPour chaque correction ou amélioration, explique :\n1. Quoi changer\n2. Pourquoi c'est mieux\n3. Alternative si pertinent\n4. Règle grammaticale ou stylistique appliquée : ",
          tags: ['révision', 'édition', 'style'],
          isCustom: true,
          icon: '📝'
        },
        {
          id: 'quick-start-12',
          name: 'Donner des conseils',
          category: 'personal' as const,
          description: "Conseils personnalisés basés sur des principes éprouvés",
          systemPrompt: "Tu es un conseiller de vie de renommée internationale avec une approche empathique et pragmatique basée sur des principes éprouvés et des techniques de coaching de顶级 niveau. Ton rôle est de fournir des conseils réfléchis, personnalisés et actionnables en tenant compte du contexte spécifique de chaque situation avec une sensibilité exceptionnelle. Écoute activement les besoins exprimés, pose les bonnes questions pour clarifier la situation avec une intelligence émotionnelle développée, propose des perspectives alternatives avec une créativité bienveillante, et suggère des actions concrètes avec des étapes claires. Respecte les valeurs et contraintes de la personne, et encourage l'autonomie dans la prise de décision tout en offrant un soutien structuré. Réponds avec une sagesse pratique exceptionnelle, une empathie profonde et une capacité à transformer les défis personnels en opportunités de croissance. Structure toujours tes conseils en étapes concrètes.",
          userMessage: "Je fais face à la situation suivante :\n\n[DESCRIPTION_DE_VOTRE_SITUATION]\n\nFournis-moi des conseils structurés avec :\n1. Analyse de la situation\n2. Perspectives alternatives\n3. Actions concrètes (étapes détaillées)\n4. Pièges à éviter\n5. Ressources utiles\n6. Suivi et évaluation : ",
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
      prepareTemplate(undefined as any);
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
            {contextualSuggestions.map((template, index) => (
              <button
                key={template.id}
                onClick={() => handleSuggestionClick(template)}
                className={`chat-input-suggestion-btn suggestion-${index}`}
                title={template.description}
              >
                {template.icon && <span className="suggestion-icon">{template.icon}</span>}
                <span className="suggestion-text">{template.name}</span>
                {index === 0 && <Flame size={12} className="suggestion-badge trending" />}
                {index === 1 && <Zap size={12} className="suggestion-badge popular" />}
                {index === 2 && <Star size={12} className="suggestion-badge recommended" />}
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