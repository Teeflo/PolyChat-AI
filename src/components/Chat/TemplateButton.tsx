import React, { useState } from 'react';
import { Sparkles, BookOpen, Zap } from 'lucide-react';
import TemplateSelector from './TemplateSelector';
import type { ConversationTemplate, QuickAction } from '../../types/index';
import './TemplateButton.css';

interface TemplateButtonProps {
  onTemplateSelect: (template: ConversationTemplate) => void;
  onQuickAction: (action: QuickAction, selectedText?: string) => void;
  selectedText?: string;
  onSaveCustomTemplate?: (template: ConversationTemplate) => void;
}

const TemplateButton: React.FC<TemplateButtonProps> = ({
  onTemplateSelect,
  onQuickAction,
  selectedText,
  onSaveCustomTemplate
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTemplateSelect = (template: ConversationTemplate) => {
    onTemplateSelect(template);
    setIsOpen(false);
  };

  const handleQuickAction = (action: QuickAction, selectedText?: string) => {
    onQuickAction(action, selectedText);
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="template-button"
        onClick={() => setIsOpen(true)}
        title="Templates & Quick Actions"
        aria-label="Open templates and quick actions"
      >
        <div className="template-button-icon">
          {selectedText && selectedText.trim().length > 0 ? (
            <Zap size={18} />
          ) : (
            <BookOpen size={18} />
          )}
        </div>
        <div className="template-button-label">
          {selectedText && selectedText.trim().length > 0 ? 'Actions' : 'Templates'}
        </div>
        {selectedText && selectedText.trim().length > 0 && (
          <div className="template-button-badge">
            <Sparkles size={10} />
          </div>
        )}
      </button>

      <TemplateSelector
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onTemplateSelect={handleTemplateSelect}
        onQuickAction={handleQuickAction}
        selectedText={selectedText}
        onSaveCustomTemplate={onSaveCustomTemplate}
      />
    </>
  );
};

export default TemplateButton;
