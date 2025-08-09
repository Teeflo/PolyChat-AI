import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Sparkles, ChevronDown, X, Plus, Search } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useModels } from '../../hooks/useModels';
import './ModelSwitcher.css';

/**
 * Composant de sélection de modèles ultra discret.
 * - Affichage sous forme de petite pilule (current model ou nombre)
 * - Popover flottant minimaliste sur clic pour gérer les modèles (multi ≤3)
 */
const ModelSwitcher: React.FC = () => {
  const { selectedModels, addModel, removeModel, activeSessions } = useChat();
  const { models, loading } = useModels();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement | null>(null);

  // Fermer en cliquant dehors
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLabel = useMemo(() => {
    if (selectedModels.length === 0) return 'Sélectionner IA';
    if (selectedModels.length === 1) {
      const id = selectedModels[0];
      const name = id.split('/').pop() || id;
      return name.length > 12 ? name.substring(0, 12) + '…' : name;
    }
    return `${selectedModels.length} IA actives`;
  }, [selectedModels]);

  const available = useMemo(() => {
    const base = models.filter(m => !selectedModels.includes(m.id));
    if (!query.trim()) return base.slice(0, 40);
    const q = query.toLowerCase();
    return base.filter(m => m.id.toLowerCase().includes(q) || m.name?.toLowerCase().includes(q)).slice(0, 50);
  }, [models, selectedModels, query]);

  const canAdd = selectedModels.length < 3;

  const handleToggle = () => setOpen(o => !o);

  const handleAdd = (id: string) => {
    if (!canAdd) return;
    addModel(id);
    setQuery('');
  };

  const handleRemove = (id: string) => {
    if (selectedModels.length > 1) removeModel(id);
  };

  return (
    <div className="model-switcher" ref={ref}>
      <button
        className={`model-switcher-pill ${open ? 'open' : ''}`}
        onClick={handleToggle}
        aria-label="Sélecteur de modèles"
        title={selectedModels.join(', ') || 'Sélectionner un modèle'}
        type="button"
      >
        <Sparkles size={14} />
        <span className="model-switcher-label">{currentLabel}</span>
        <ChevronDown size={14} className="model-switcher-caret" />
      </button>

      {open && (
        <div className="model-switcher-popover" role="dialog">
          <div className="model-switcher-section active">
            <div className="model-switcher-section-title">Actifs</div>
            {selectedModels.length === 0 && (
              <div className="model-switcher-empty">Aucun modèle actif</div>
            )}
            <ul className="model-switcher-active-list">
              {activeSessions.map(s => (
                <li key={s.id} className="model-switcher-active-item">
                  <span className="model-switcher-active-name">{s.modelId.split('/').pop()}</span>
                  {selectedModels.length > 1 && (
                    <button
                      onClick={() => handleRemove(s.modelId)}
                      className="model-switcher-remove"
                      aria-label={`Retirer ${s.modelId}`}
                    >
                      <X size={12} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="model-switcher-section add">
            <div className="model-switcher-section-header">
              <div className="model-switcher-section-title">Ajouter</div>
              <div className="model-switcher-counter">{selectedModels.length}/3</div>
            </div>
            <div className="model-switcher-search">
              <Search size={14} />
              <input
                placeholder="Rechercher un modèle..."
                aria-label="Rechercher un modèle"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            {loading && <div className="model-switcher-loading">Chargement...</div>}
            {!loading && available.length === 0 && (
              <div className="model-switcher-empty">Aucun résultat</div>
            )}
            {!loading && available.length > 0 && (
        <ul className="model-switcher-available-list">
                {available.map(m => (
                  <li key={m.id}>
                    <button
                      disabled={!canAdd}
                      onClick={() => handleAdd(m.id)}
                      className="model-switcher-available-btn"
                      title={m.id}
          type="button"
                    >
                      <span className="model-switcher-model-name">{m.id.split('/').pop()}</span>
                      {canAdd && <Plus size={12} />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSwitcher;
