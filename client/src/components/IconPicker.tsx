import { useState } from 'react';

const ICON_CATEGORIES: { label: string; icons: string[] }[] = [
  {
    label: 'General',
    icons: ['📁', '📂', '⭐', '❤️', '💡', '🎯', '🔖', '📌', '🏷️', '📎', '🗂️', '📋', '📊', '🗃️', '📦'],
  },
  {
    label: 'Security',
    icons: ['🔑', '🔒', '🔐', '🛡️', '⚔️', '🗡️', '🏹', '💣', '🔓', '🔏'],
  },
  {
    label: 'Tech',
    icons: ['💻', '🖥️', '📱', '⌨️', '🖱️', '💾', '🌐', '📡', '🔌', '🤖', '⚙️', '🔧', '🛠️', '📲', '🧩'],
  },
  {
    label: 'Media',
    icons: ['🎬', '🎵', '🎮', '📸', '🎨', '🖼️', '📹', '🎧', '📺', '🎭', '🎪', '🎤', '📻', '🎼', '🎯'],
  },
  {
    label: 'Study',
    icons: ['📚', '📖', '📝', '✏️', '🎓', '🧠', '📐', '🔬', '🧪', '🌍', '📜', '🗺️', '💬', '🈯', '🇯🇵'],
  },
  {
    label: 'Fantasy',
    icons: ['🐉', '🧙', '🏰', '🔮', '💎', '👑', '🦅', '🐺', '🦁', '🧝', '🧛', '🧟', '💀', '👻', '🌙'],
  },
  {
    label: 'Fun',
    icons: ['😂', '🤣', '🎉', '🎊', '🍕', '🍺', '☕', '🚀', '💰', '🎃', '🌈', '🔥', '💥', '✨', '🌟'],
  },
];

interface Props {
  value: string;
  onChange: (icon: string) => void;
}

export default function IconPicker({ value, onChange }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="text-3xl hover:scale-110 transition-transform p-2 rounded hover:bg-amber-900/30"
        title="Pick icon"
      >
        {value}
      </button>

      {expanded && (
        <div className="absolute left-0 top-14 z-30 wow-panel rounded-lg p-3 w-72 max-h-80 overflow-y-auto animate-fade-in">
          {ICON_CATEGORIES.map(cat => (
            <div key={cat.label} className="mb-3">
              <p className="text-[10px] uppercase tracking-wider gold-text font-semibold mb-1.5">{cat.label}</p>
              <div className="flex flex-wrap gap-1">
                {cat.icons.map(icon => (
                  <button
                    key={`${cat.label}-${icon}`}
                    type="button"
                    onClick={() => { onChange(icon); setExpanded(false); }}
                    className={`text-lg p-1.5 rounded hover:bg-amber-900/40 transition-colors ${
                      value === icon ? 'bg-amber-900/50 ring-1 ring-amber-500' : ''
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
