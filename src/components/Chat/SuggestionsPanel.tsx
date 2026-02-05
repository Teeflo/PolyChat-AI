import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import SmartSuggestions from './SmartSuggestions';
import './SuggestionsPanel.css';

const SuggestionsPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`suggestions-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="suggestions-panel-toggle" onClick={() => setIsExpanded(!isExpanded)}>
        <Sparkles size={14} />
        <span>Suggestions</span>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isExpanded && (
        <div className="suggestions-panel-content">
          <SmartSuggestions />
        </div>
      )}
    </div>
  );
};

export default SuggestionsPanel;
