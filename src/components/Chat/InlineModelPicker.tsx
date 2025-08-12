import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Sparkles, Search } from 'lucide-react';
import { useModels } from '../../hooks/useModels';
import { useChat } from '../../hooks/useChat';
import { getModelPricing } from '../../services/modelsApi';

interface InlineModelPickerProps {
  sessionId?: string; // Optionnel si non utilisé directement
  onSelect: (modelId: string) => void;
}

// Sélecteur custom pour choisir un modèle dans une fenêtre pending
const InlineModelPicker: React.FC<InlineModelPickerProps> = ({ onSelect }) => {
  const { models, loading } = useModels();
  const { selectedModels } = useChat();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    const base = models.filter(m => !selectedModels.includes(m.id));
    if (!query.trim()) return base.slice(0, 40);
    const q = query.toLowerCase();
    return base.filter(m => m.id.toLowerCase().includes(q) || m.name?.toLowerCase().includes(q)).slice(0, 60);
  }, [models, selectedModels, query]);

  return (
    <div className={`inline-model-picker ${open ? 'open' : ''}`} ref={ref}>
      <button
        type="button"
        className="imp-trigger"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : 'false'}
        onClick={()=> setOpen(o=>!o)}
      >
        <Sparkles size={14} />
        <span>Choisir un modèle</span>
        <ChevronDown size={14} className="imp-caret" />
      </button>
      {open && (
        <div className="imp-pop" aria-label="Liste des modèles disponibles">
          <div className="imp-search">
            <Search size={14} />
            <input
              placeholder="Filtrer..."
              value={query}
              onChange={e=>setQuery(e.target.value)}
              aria-label="Filtrer les modèles"
            />
          </div>
          {loading && <div className="imp-empty">Chargement…</div>}
          {!loading && filtered.length===0 && (
            <div className="imp-empty">Aucun résultat</div>
          )}
          {!loading && filtered.length>0 && (
            <ul className="imp-list" role="listbox" aria-label="Modèles filtrés">
              {filtered.map(m => (
                <li
                  key={m.id}
                  role="option"
                  aria-selected="false"
                  className="imp-item"
                  onClick={() => { onSelect(m.id); setOpen(false); }}
                  tabIndex={0}
                  onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' ') { e.preventDefault(); onSelect(m.id); setOpen(false);} }}
                >
                  {(() => {
                    const provider = m.id.split('/')[0];
                    // Récupération brute pour format court
                    let shortPrice = '–';
                    let priceClass = 'imp-price-paid';
                    try {
                      const prompt = parseFloat((m as any).pricing?.prompt || '0') || 0;
                      const completion = parseFloat((m as any).pricing?.completion || '0') || 0;
                      if (prompt === 0 && completion === 0) {
                        shortPrice = 'FREE';
                        priceClass = 'imp-price-free';
                      } else {
                        const p = prompt * 1_000_000; // $/1M
                        const c = completion * 1_000_000;
                        const fp = p ? p.toFixed(p < 0.1 ? 3 : 2) : '0';
                        const fc = c ? c.toFixed(c < 0.1 ? 3 : 2) : '0';
                        shortPrice = (p && c && fp !== fc) ? `${fp}/${fc}$` : `${(p||c).toFixed((p||c) < 0.1 ? 3 : 2)}$`;
                      }
                    } catch {}
                    return (
                      <>
                        <span className="imp-name">{m.id.split('/').pop()}</span>
                        <div className="imp-meta-row">
                          <span className="imp-provider">{provider}</span>
                          <span className={`imp-price ${priceClass}`} title={getModelPricing(m)}>{shortPrice}</span>
                        </div>
                      </>
                    );
                  })()}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default InlineModelPicker;
