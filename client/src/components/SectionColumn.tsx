import { useState } from 'react';
import type { Section, VaultItem } from '../utils/api';
import VaultItemCard from './VaultItemCard';

interface Props {
  section: Section;
  items: VaultItem[];
  onAddItem: () => void;
  onDeleteItem: (id: string) => void;
  onDeleteSection: () => void;
  onUpdateSection: (data: Partial<Section>) => void;
}

export default function SectionColumn({ section, items, onAddItem, onDeleteItem, onDeleteSection, onUpdateSection }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(section.name);
  const [showMenu, setShowMenu] = useState(false);

  const handleRename = () => {
    if (editName.trim() && editName.trim() !== section.name) {
      onUpdateSection({ name: editName.trim() });
    }
    setEditing(false);
  };

  return (
    <div className={`wow-card rounded-lg overflow-hidden transition-all ${expanded ? 'wow-border-gold' : ''}`}>
      {/* Header — click to expand/collapse */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer select-none hover:bg-amber-900/20 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <span className="text-2xl">{section.icon}</span>

        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') setEditing(false);
              }}
              onBlur={handleRename}
              className="wow-input text-sm py-0.5"
              autoFocus
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <h3 className="font-bold gold-text text-base truncate">{section.name}</h3>
          )}
          <p className="text-xs opacity-40">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Menu button */}
          <div className="relative">
            <button
              onClick={e => { e.stopPropagation(); setShowMenu(m => !m); }}
              className="opacity-40 hover:opacity-100 text-sm p-1 transition-opacity"
              title="Options"
            >
              ⚙️
            </button>
            {showMenu && (
              <div
                className="absolute right-0 top-8 z-20 wow-panel rounded p-1 min-w-[140px] animate-fade-in"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => { setEditing(true); setShowMenu(false); }}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-amber-900/30 rounded"
                >
                  ✏️ Rename
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${section.name}" and all its items?`)) {
                      onDeleteSection();
                    }
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-red-900/30 rounded text-red-400"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>

          {/* Expand/collapse indicator */}
          <span className={`text-xs gold-text transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="collapse-content" style={{ borderTop: '1px solid var(--wow-border)' }}>
          <div className="p-3 space-y-2">
            {items.length === 0 ? (
              <div className="text-center py-6 opacity-40">
                <div className="text-3xl mb-2">🏰</div>
                <p className="text-xs">No items yet</p>
              </div>
            ) : (
              items.map(item => (
                <VaultItemCard key={item._id} item={item} onDelete={() => onDeleteItem(item._id)} />
              ))
            )}

            <button
              onClick={e => { e.stopPropagation(); onAddItem(); }}
              className="wow-btn w-full text-xs py-2"
            >
              + Add Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
