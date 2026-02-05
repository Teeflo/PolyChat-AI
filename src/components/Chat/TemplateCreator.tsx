import React, { useState } from 'react';
import { X, Save, BookOpen } from 'lucide-react';
import type { ConversationTemplate, TemplateCategory } from '../../types/index';
import { TEMPLATE_CATEGORIES } from '../../data/templates';
import './TemplateCreator.css';

interface TemplateCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: ConversationTemplate) => void;
}

const TemplateCreator: React.FC<TemplateCreatorProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<TemplateCategory>('programming');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleSave = () => {
    if (!name.trim() || !systemPrompt.trim() || !userMessage.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const template: ConversationTemplate = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      description: description.trim(),
      systemPrompt: systemPrompt.trim(),
      userMessage: userMessage.trim(),
      tags,
      isCustom: true,
      icon: '📝',
      color: TEMPLATE_CATEGORIES.find((c) => c.id === category)?.color || '#3B82F6',
    };

    onSave(template);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setCategory('programming');
    setDescription('');
    setSystemPrompt('');
    setUserMessage('');
    setTags([]);
    setNewTag('');
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      addTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="template-creator-overlay" onClick={handleClose}>
      <div className="template-creator-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="template-creator-header">
          <div className="template-creator-title">
            <BookOpen size={20} />
            <span>Create Custom Template</span>
          </div>
          <button className="template-creator-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="template-creator-form">
          <div className="template-creator-field">
            <label htmlFor="template-name">Template Name *</label>
            <input
              id="template-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Code Review Assistant"
              className="template-creator-input"
            />
          </div>

          <div className="template-creator-field">
            <label htmlFor="template-category">Category *</label>
            <select
              id="template-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TemplateCategory)}
              className="template-creator-select"
            >
              {TEMPLATE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="template-creator-field">
            <label htmlFor="template-description">Description</label>
            <textarea
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this template does..."
              className="template-creator-textarea"
              rows={2}
            />
          </div>

          <div className="template-creator-field">
            <label htmlFor="template-system-prompt">System Prompt *</label>
            <textarea
              id="template-system-prompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="You are an expert... (Instructions for the AI)"
              className="template-creator-textarea"
              rows={4}
            />
          </div>

          <div className="template-creator-field">
            <label htmlFor="template-user-message">User Message Template *</label>
            <textarea
              id="template-user-message"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Please [action] this: [Paste your content here]"
              className="template-creator-textarea"
              rows={3}
            />
          </div>

          <div className="template-creator-field">
            <label>Tags</label>
            <div className="template-creator-tags">
              <div className="template-creator-tags-input">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a tag..."
                  className="template-creator-input"
                />
                <button type="button" onClick={addTag} className="template-creator-add-tag-btn">
                  Add
                </button>
              </div>
              <div className="template-creator-tags-list">
                {tags.map((tag) => (
                  <span key={tag} className="template-creator-tag">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="template-creator-tag-remove">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="template-creator-footer">
          <button onClick={handleClose} className="template-creator-cancel-btn">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="template-creator-save-btn"
            disabled={!name.trim() || !systemPrompt.trim() || !userMessage.trim()}
          >
            <Save size={16} />
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCreator;
