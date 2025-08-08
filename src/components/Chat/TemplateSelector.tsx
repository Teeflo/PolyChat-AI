import React from 'react';
import { X } from 'lucide-react';
import type { ConversationTemplate, QuickAction } from '../../types';
import { PRE_BUILT_TEMPLATES, QUICK_ACTIONS } from '../../data/templates';
import './TemplateSelector.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTemplateSelect: (template: ConversationTemplate) => void;
  onQuickAction: (action: QuickAction, selectedText?: string) => void;
  selectedText?: string;
  onSaveCustomTemplate?: (template: ConversationTemplate) => void;
}

const TemplateSelector: React.FC<Props> = ({ isOpen, onClose, onTemplateSelect, onQuickAction, selectedText }) => {
  if (!isOpen) return null;
  return (
    <div className="template-selector-overlay" onClick={onClose}>
      <div className="template-selector" onClick={(e)=>e.stopPropagation()}>
        <div className="template-selector-header">
          <h3>Templates & Actions</h3>
          <button className="template-close" onClick={onClose} aria-label="Fermer"><X size={16} /></button>
        </div>
        <div className="template-selector-content">
          <div className="template-group">
            <div className="template-group-title">Templates</div>
            <div className="template-grid">
              {PRE_BUILT_TEMPLATES.slice(0, 12).map(tpl => (
                <button key={tpl.id} className="template-card" onClick={()=>onTemplateSelect(tpl)}>
                  <div className="template-icon">{tpl.icon||'📄'}</div>
                  <div className="template-name">{tpl.name}</div>
                  <div className="template-desc">{tpl.description}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="template-group">
            <div className="template-group-title">Actions rapides</div>
            <div className="template-actions">
              {QUICK_ACTIONS.map(act => (
                <button key={act.id} className="template-action" onClick={()=>onQuickAction(act, selectedText)}>
                  <span className="action-icon">{act.icon}</span>
                  <span className="action-name">{act.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
