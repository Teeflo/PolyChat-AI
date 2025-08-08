import React, { useMemo } from 'react';
import { useChat } from '../../hooks/useChat';
import { PRE_BUILT_TEMPLATES } from '../../data/templates';
import './SmartSuggestions.css';

const SmartSuggestions: React.FC = () => {
  const { activeSessions, applyTemplate } = useChat();

  const lastUser = useMemo(() => {
    const session = activeSessions[0];
    if (!session) return null;
    for (let i = session.messages.length - 1; i >= 0; i--) {
      const m = session.messages[i];
      if (m.role === 'user') return m.content;
    }
    return null;
  }, [activeSessions]);

  const suggestions = useMemo(() => {
    if (!lastUser) return PRE_BUILT_TEMPLATES.slice(0, 3);
    const text = lastUser.toLowerCase();
    const scored = PRE_BUILT_TEMPLATES.map(t => {
      let score = 0;
      const keywords = [t.category, ...t.tags];
      keywords.forEach(k => { if (text.includes(k.toLowerCase())) score += 2; });
      if (/code|bug|error|function|typescript|javascript|python/.test(text)) {
        if (t.category === 'programming') score += 3;
      }
      if (/write|email|article|post|text|grammar|style/.test(text)) {
        if (t.category === 'writing') score += 3;
      }
      if (/analy(s|z)e|data|market|research|trend/.test(text)) {
        if (t.category === 'analysis') score += 3;
      }
      return { t, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.t);
    return scored.length ? scored : PRE_BUILT_TEMPLATES.slice(0, 3);
  }, [lastUser]);

  if (!activeSessions.length) return null;

  return (
    <div className="smart-sugg-container">
      <div className="smart-sugg-title">Suggestions</div>
      <div className="smart-sugg-list">
        {suggestions.map((tpl) => (
          <button key={tpl.id} className="smart-sugg-chip" onClick={() => applyTemplate(tpl)}>
            <span className="smart-sugg-icon">{tpl.icon || '⭐'}</span>
            <span className="smart-sugg-name">{tpl.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SmartSuggestions;
