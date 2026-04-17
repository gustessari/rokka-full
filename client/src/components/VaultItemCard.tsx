import { useState } from 'react';
import type { VaultItem } from '../utils/api';
import { isEncrypted } from '../utils/crypto';

const TYPE_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  link: { icon: '🔗', label: 'Link', color: '#2a5a8c' },
  password: { icon: '🔑', label: 'Password', color: '#8b0000' },
  text: { icon: '📝', label: 'Note', color: '#2d5a27' },
  image: { icon: '🖼️', label: 'Image', color: '#5a4530' },
  video: { icon: '🎬', label: 'Video', color: '#4a2060' },
  file: { icon: '📄', label: 'File', color: '#3d3d3d' },
};

interface Props {
  item: VaultItem;
  onDelete: () => void;
}

export default function VaultItemCard({ item, onDelete }: Props) {
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
    <div className="bg-black/30 rounded p-3 group hover:bg-black/50 transition-all animate-fade-in relative">
      <div className="flex items-start justify-between mb-1">
        <span
          className="text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider"
          style={{ background: config.color, color: '#e0d0b0' }}
        >
          {config.icon} {config.label}
        </span>
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-xs transition-opacity"
          title="Delete item"
        >
          ✕
        </button>
      </div>

      {locked ? (
        <div className="text-center py-3 opacity-40">
          <div className="text-2xl mb-1">🔒</div>
          <p className="text-[10px]">Encrypted</p>
        </div>
      ) : (
        <div className={content.url ? 'cursor-pointer' : ''} onClick={handleClick}>
          <h4 className="font-bold text-sm gold-text truncate mb-0.5">{content.title}</h4>
          {item.type === 'password' ? (
            <PasswordField value={content.detail} />
          ) : (
            <p className="text-xs opacity-70 line-clamp-2 break-all">{content.detail}</p>
          )}
          {content.url && (
            <p className="text-[10px] mt-1 opacity-40 truncate hover:opacity-80 transition-opacity">
              🔗 {content.url}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function PasswordField({ value }: { value: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-mono flex-1 truncate">
        {show ? value : '•'.repeat(Math.min(value.length, 16))}
      </span>
      <button
        onClick={e => { e.stopPropagation(); setShow(!show); }}
        className="text-[10px] opacity-60 hover:opacity-100"
      >
        {show ? '🙈' : '👁️'}
      </button>
      <button
        onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(value); }}
        className="text-[10px] opacity-60 hover:opacity-100"
        title="Copy"
      >
        📋
      </button>
    </div>
  );
}
