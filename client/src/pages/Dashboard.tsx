import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/api';
import type { Section, VaultItem } from '../utils/api';
import { encrypt, decrypt, isEncrypted } from '../utils/crypto';
import Sidebar from '../components/Sidebar';
import VaultGrid from '../components/VaultGrid';
import AddItemModal from '../components/AddItemModal';
import Header from '../components/Header';

export default function Dashboard() {
  const { vaultKey, lockVault, refreshUser, user } = useAuth();
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [items, setItems] = useState<VaultItem[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const initialLoad = useRef(false);

  useEffect(() => {
    if (initialLoad.current) return;
    initialLoad.current = true;
    api.sections.list().then(s => {
      setSections(s);
      if (s.length > 0) setActiveSection(s[0]._id);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeSection) return;
    let cancelled = false;
    api.vault.list(activeSection).then(raw => {
      if (cancelled) return;
      if (!vaultKey) { setItems(raw); return; }
      setItems(raw.map(item => {
        try {
          if (isEncrypted(item.encryptedData)) {
            const plain = decrypt(item.encryptedData, vaultKey);
            return { ...item, encryptedData: plain || item.encryptedData };
          }
          return item;
        } catch {
          return item;
        }
      }));
    });
    return () => { cancelled = true; };
  }, [activeSection, vaultKey, refreshKey]);

  const reloadItems = () => setRefreshKey(k => k + 1);

  const handleAddSection = async (name: string, icon: string) => {
    const section = await api.sections.create(name, icon);
    const updated = await api.sections.list();
    setSections(updated);
    setActiveSection(section._id);
  };

  const handleDeleteSection = async (id: string) => {
    await api.sections.delete(id);
    const updated = await api.sections.list();
    setSections(updated);
    if (activeSection === id) {
      setActiveSection(updated.length > 0 ? updated[0]._id : null);
    }
    await refreshUser();
  };

  const handleRenameSection = async (id: string, name: string) => {
    await api.sections.update(id, { name });
    const updated = await api.sections.list();
    setSections(updated);
  };

  const handleAddItem = async (type: string, data: string) => {
    if (!activeSection || !vaultKey) return;
    const encrypted = encrypt(data, vaultKey);
    await api.vault.save({ sectionId: activeSection, type, encryptedData: encrypted });
    reloadItems();
    await refreshUser();
    setShowAddItem(false);
  };

  const handleDeleteItem = async (id: string) => {
    await api.vault.delete(id);
    reloadItems();
    await refreshUser();
  };

  const handleLock = async () => {
    if (!vaultKey) { lockVault(); return; }
    const allItems = await api.vault.list();
    const toEncrypt = allItems.filter(item => !isEncrypted(item.encryptedData));
    if (toEncrypt.length > 0) {
      const updates = toEncrypt.map(item => ({
        _id: item._id,
        encryptedData: encrypt(item.encryptedData, vaultKey),
      }));
      await api.vault.bulkUpdate(updates);
    }
    lockVault();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at center, #1a1008 0%, #0d0d0d 70%)' }}>
        <div className="gold-text text-xl animate-pulse">Loading your vault...</div>
      </div>
    );
  }

  const currentSection = sections.find(s => s._id === activeSection);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(ellipse at center, #1a1008 0%, #0d0d0d 70%)' }}>
      <Header onLock={handleLock} user={user} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          sections={sections}
          activeSection={activeSection}
          onSelect={setActiveSection}
          onAddSection={handleAddSection}
          onDeleteSection={handleDeleteSection}
          onRenameSection={handleRenameSection}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {currentSection ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold gold-text gold-glow">
                  {currentSection.icon} {currentSection.name}
                </h2>
                <button onClick={() => setShowAddItem(true)} className="wow-btn text-sm">
                  + Add Item
                </button>
              </div>

              <VaultGrid items={items} onDelete={handleDeleteItem} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-50">
              <div className="text-6xl mb-4">📜</div>
              <p className="text-lg gold-text">Select or create a section to begin</p>
            </div>
          )}
        </main>
      </div>

      {showAddItem && (
        <AddItemModal onAdd={handleAddItem} onClose={() => setShowAddItem(false)} />
      )}
    </div>
  );
}
