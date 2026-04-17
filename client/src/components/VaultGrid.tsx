import type { VaultItem } from '../utils/api';
import { isEncrypted } from '../utils/crypto';

interface Props {
  items: VaultItem[];
  onDelete: (id: string) => void;
}

const TYPE_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  link: { icon: '🔗', label: 'Link', color: '#2a5a8c' },
  password: { icon: '🔑', label: 'Password', color: '#8b0000' },
  text: { icon: '📝', label: 'Note', color: '#2d5a27' },
  image: { icon: '🖼️', label: 'Image', color: '#5a4530' },
  video: { icon: '🎬', label: 'Video', color: '#4a2060' },
  file: { icon: '📄', label: 'File', color: '#3d3d3d' },
};

function ItemCard({ item, onDelete }: { item: VaultItem; onDelete: () => void }) {
  const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.text;
  const locked = isEncrypted(item.encryptedData);

  let content: { title: string; detail: string; url?: string } = { title: 'Encrypted', detail: '🔒' };

  if (!locked) {
    try {
      const parsed = JSON.parse(item.encryptedData);
      content = {
        title: parsed.title || parsed.name || item.type,
        detail: parsed.content || parsed.url || parsed.value || '',
        url: parsed.url,
      };
    } catch {
      content = { title: item.type, detail: item.encryptedData };
    }
  }

  const handleClick = () => {
    if (content.url) window.open(content.url, '_blank', 'noopener');
  };

  return (
    <div className="wow-card p-4 animate-fade-in group hover:border-amber-600 transition-all relative">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2 py-0.5 rounded font-semibold uppercase tracking-wider"
            style={{ background: config.color, color: '#e0d0b0' }}
          >
            {config.icon} {config.label}
          </span>
        </div>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-xs transition-opacity"
          title="Delete item"
        >
          ✕
        </button>
      </div>

      {locked ? (
        <div className="text-center py-4 opacity-40">
          <div className="text-3xl mb-1">🔒</div>
          <p className="text-xs">Encrypted</p>
        </div>
      ) : (
        <div
          className={content.url ? 'cursor-pointer' : ''}
          onClick={handleClick}
        >
          <h4 className="font-bold text-base gold-text truncate mb-1">{content.title}</h4>
          {item.type === 'password' ? (
            <PasswordField value={content.detail} />
          ) : (
            <p className="text-sm opacity-70 line-clamp-3 break-all">{content.detail}</p>
          )}
          {content.url && (
            <p className="text-xs mt-2 opacity-50 truncate hover:opacity-100 transition-opacity">
              🔗 {content.url}
            </p>
          )}
        </div>
      )}

      <div className="text-xs opacity-30 mt-3">
        {new Date(item.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}

function PasswordField({ value }: { value: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-mono flex-1 truncate">
        {show ? value : '•'.repeat(Math.min(value.length, 20))}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); setShow(!show); }}
        className="text-xs opacity-60 hover:opacity-100"
      >
        {show ? '🙈' : '👁️'}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(value); }}
        className="text-xs opacity-60 hover:opacity-100"
        title="Copy"
      >
        📋
      </button>
    </div>
  );
}

import { useState } from 'react';

export default function VaultGrid({ items, onDelete }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-40">
        <div className="text-5xl mb-3">🏰</div>
        <p className="text-lg gold-text">This section is empty</p>
        <p className="text-sm mt-1">Add items to fill your vault</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map(item => (
        <ItemCard key={item._id} item={item} onDelete={() => onDelete(item._id)} />
      ))}
    </div>
  );
}
