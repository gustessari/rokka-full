import { useState } from 'react';

interface Props {
  onAdd: (type: string, data: string) => void;
  onClose: () => void;
}

const TYPES = [
  { value: 'link', icon: '🔗', label: 'Link' },
  { value: 'password', icon: '🔑', label: 'Password' },
  { value: 'text', icon: '📝', label: 'Note' },
  { value: 'image', icon: '🖼️', label: 'Image URL' },
  { value: 'video', icon: '🎬', label: 'Video URL' },
];

export default function AddItemModal({ onAdd, onClose }: Props) {
  const [type, setType] = useState('link');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    const data: Record<string, string> = { title: title.trim() };

    if (type === 'link' || type === 'image' || type === 'video') {
      data.url = content.trim();
      data.content = content.trim();
    } else if (type === 'password') {
      data.value = content.trim();
      data.content = content.trim();
    } else {
      data.content = content.trim();
    }

    onAdd(type, JSON.stringify(data));
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="wow-panel p-6 w-full max-w-lg animate-fade-in" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold gold-text gold-glow mb-6 tracking-wider">Add to Vault</h2>

        <div className="flex gap-2 mb-5 flex-wrap">
          {TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={`px-3 py-2 rounded text-sm font-semibold transition-all ${
                type === t.value
                  ? 'bg-amber-900/50 border border-amber-500 gold-text'
                  : 'bg-amber-900/15 border border-transparent hover:border-amber-800 opacity-60'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold gold-text mb-1 uppercase tracking-wider">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="wow-input"
              placeholder={type === 'password' ? 'e.g. Gmail Password' : 'e.g. My favorite tutorial'}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold gold-text mb-1 uppercase tracking-wider">
              {type === 'link' ? 'URL' : type === 'password' ? 'Password' : type === 'image' || type === 'video' ? 'URL' : 'Content'}
            </label>
            {type === 'text' ? (
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                className="wow-input min-h-[100px] resize-y"
                placeholder="Your note content..."
              />
            ) : (
              <input
                type={type === 'password' ? 'password' : 'text'}
                value={content}
                onChange={e => setContent(e.target.value)}
                className="wow-input"
                placeholder={
                  type === 'link' ? 'https://...' :
                  type === 'password' ? 'Your secret password' :
                  type === 'image' ? 'https://image-url...' :
                  type === 'video' ? 'https://video-url...' : ''
                }
              />
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="wow-btn flex-1" disabled={loading}>
              {loading ? 'Saving...' : '✨ Add to Vault'}
            </button>
            <button type="button" onClick={onClose} className="wow-btn wow-btn-danger">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
