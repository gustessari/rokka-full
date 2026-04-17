import { useState } from 'react';
import { Section } from '../utils/api';

interface Props {
  sections: Section[];
  activeSection: string | null;
  onSelect: (id: string) => void;
  onAddSection: (name: string, icon: string) => void;
  onDeleteSection: (id: string) => void;
  onRenameSection: (id: string, name: string) => void;
}

const ICONS = ['📁', '🔑', '🔗', '📝', '🎮', '📚', '🎬', '🎵', '💻', '🌐', '⚔️', '🛡️', '🏰', '🐉', '🗡️', '💎', '🧙', '📜', '🎯', '🔮'];

export default function Sidebar({ sections, activeSection, onSelect, onAddSection, onDeleteSection, onRenameSection }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('📁');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showIcons, setShowIcons] = useState(false);

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddSection(newName.trim(), newIcon);
    setNewName('');
    setNewIcon('📁');
    setShowAdd(false);
  };

  const handleRename = (id: string) => {
    if (!editName.trim()) return;
    onRenameSection(id, editName.trim());
    setEditingId(null);
  };

  return (
    <aside className="w-64 wow-panel flex flex-col overflow-hidden" style={{ borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
      <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--wow-border)' }}>
        <h3 className="text-sm font-bold gold-text uppercase tracking-wider">Sections</h3>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="gold-text hover:text-white text-lg leading-none"
          title="Add section"
        >
          +
        </button>
      </div>

      {showAdd && (
        <div className="p-3 space-y-2 animate-fade-in" style={{ borderBottom: '1px solid var(--wow-border)' }}>
          <div className="flex gap-2">
            <button
              onClick={() => setShowIcons(!showIcons)}
              className="text-xl hover:scale-110 transition-transform"
              title="Pick icon"
            >
              {newIcon}
            </button>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              className="wow-input text-sm py-1"
              placeholder="Section name..."
              autoFocus
            />
          </div>
          {showIcons && (
            <div className="flex flex-wrap gap-1.5">
              {ICONS.map(icon => (
                <button
                  key={icon}
                  onClick={() => { setNewIcon(icon); setShowIcons(false); }}
                  className={`text-lg p-1 rounded hover:bg-amber-900/30 ${newIcon === icon ? 'bg-amber-900/50' : ''}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={handleAdd} className="wow-btn text-xs py-1 px-3 flex-1">Create</button>
            <button onClick={() => setShowAdd(false)} className="wow-btn wow-btn-danger text-xs py-1 px-3">Cancel</button>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto">
        {sections.map(section => (
          <div
            key={section._id}
            className={`group flex items-center gap-2 px-4 py-3 cursor-pointer transition-all ${
              activeSection === section._id
                ? 'bg-amber-900/30 border-r-2 border-amber-500'
                : 'hover:bg-amber-900/15'
            }`}
            onClick={() => onSelect(section._id)}
          >
            <span className="text-lg">{section.icon}</span>
            {editingId === section._id ? (
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleRename(section._id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                onBlur={() => handleRename(section._id)}
                className="wow-input text-sm py-0.5 flex-1"
                autoFocus
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <span className="flex-1 text-sm truncate">{section.name}</span>
            )}
            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
              <button
                onClick={e => { e.stopPropagation(); setEditingId(section._id); setEditName(section.name); }}
                className="text-xs opacity-60 hover:opacity-100"
                title="Rename"
              >
                ✏️
              </button>
              <button
                onClick={e => { e.stopPropagation(); if (confirm(`Delete "${section.name}" and all its items?`)) onDeleteSection(section._id); }}
                className="text-xs opacity-60 hover:opacity-100"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        {sections.length === 0 && (
          <div className="p-4 text-center opacity-50 text-sm">
            <p>No sections yet.</p>
            <p className="mt-1 gold-text">Click + to create one</p>
          </div>
        )}
      </nav>
    </aside>
  );
}
