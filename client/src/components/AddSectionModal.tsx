import { useState } from 'react';
import IconPicker from './IconPicker';

interface Props {
  onAdd: (name: string, icon: string) => void;
  onClose: () => void;
}

export default function AddSectionModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📁');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), icon);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="wow-panel p-6 w-full max-w-md animate-fade-in" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold gold-text gold-glow mb-6 tracking-wider">Create Section</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-start gap-4">
            <div>
              <label className="block text-xs font-semibold gold-text mb-1 uppercase tracking-wider">Icon</label>
              <IconPicker value={icon} onChange={setIcon} />
            </div>

            <div className="flex-1">
              <label className="block text-xs font-semibold gold-text mb-1 uppercase tracking-wider">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="wow-input"
                placeholder="e.g. Japanese, Funny Videos..."
                autoFocus
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="wow-btn flex-1">
              ✨ Create Section
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
