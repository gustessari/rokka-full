import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/api';
import type { Section, VaultItem } from '../utils/api';
import { encrypt, decrypt, isEncrypted } from '../utils/crypto';
import SectionColumn from '../components/SectionColumn';
import AddItemModal from '../components/AddItemModal';
import AddSectionModal from '../components/AddSectionModal';
import Header from '../components/Header';

export default function Dashboard() {
  const { vaultKey, lockVault, refreshUser, user } = useAuth();
  const [sections, setSections] = useState<Section[]>([]);
  const [allItems, setAllItems] = useState<VaultItem[]>([]);
  const [addItemSection, setAddItemSection] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const initialLoad = useRef(false);

  const decryptItems = (items: VaultItem[], key: string | null): VaultItem[] => {
    if (!key) return items;
    return items.map(item => {
      try {
        if (isEncrypted(item.encryptedData)) {
          const plain = decrypt(item.encryptedData, key);
          return { ...item, encryptedData: plain || item.encryptedData };
        }
        return item;
      } catch {
        return item;
      }
    });
  };

  useEffect(() => {
    if (initialLoad.current) return;
    initialLoad.current = true;
    Promise.all([api.sections.list(), api.vault.list()])
      .then(([s, items]) => {
        setSections(s);
        setAllItems(decryptItems(items, vaultKey));
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) return;
    let cancelled = false;
    api.vault.list().then(items => {
      if (!cancelled) setAllItems(decryptItems(items, vaultKey));
    });
    return () => { cancelled = true; };
  }, [refreshKey, vaultKey, loading]);

  const reloadItems = () => setRefreshKey(k => k + 1);

  const handleAddSection = async (name: string, icon: string) => {
    await api.sections.create(name, icon);
    const updated = await api.sections.list();
    setSections(updated);
    setShowAddSection(false);
  };

  const handleDeleteSection = async (id: string) => {
    await api.sections.delete(id);
    const updated = await api.sections.list();
    setSections(updated);
    reloadItems();
    await refreshUser();
  };

  const handleUpdateSection = async (id: string, data: Partial<Section>) => {
    await api.sections.update(id, data);
    const updated = await api.sections.list();
    setSections(updated);
  };

  const handleAddItem = async (type: string, data: string) => {
    if (!addItemSection || !vaultKey) return;
    const encrypted = encrypt(data, vaultKey);
    await api.vault.save({ sectionId: addItemSection, type, encryptedData: encrypted });
    reloadItems();
    await refreshUser();
    setAddItemSection(null);
  };

  const handleDeleteItem = async (id: string) => {
    await api.vault.delete(id);
    reloadItems();
    await refreshUser();
  };

  const handleLock = async () => {
    await lockVault();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at center, #1a1008 0%, #0d0d0d 70%)' }}>
        <div className="gold-text text-xl animate-pulse">Loading your vault...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(ellipse at center, #1a1008 0%, #0d0d0d 70%)' }}>
      <Header onLock={handleLock} onAddSection={() => setShowAddSection(true)} user={user} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50 py-20">
            <div className="text-6xl mb-4">📜</div>
            <p className="text-lg gold-text mb-4">Your vault is empty</p>
            <button onClick={() => setShowAddSection(true)} className="wow-btn">
              + Create First Section
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 items-start">
            {sections.map(section => (
              <SectionColumn
                key={section._id}
                section={section}
                items={allItems.filter(i => i.sectionId === section._id)}
                onAddItem={() => setAddItemSection(section._id)}
                onDeleteItem={handleDeleteItem}
                onDeleteSection={() => handleDeleteSection(section._id)}
                onUpdateSection={(data) => handleUpdateSection(section._id, data)}
              />
            ))}
          </div>
        )}
      </main>

      {addItemSection && (
        <AddItemModal onAdd={handleAddItem} onClose={() => setAddItemSection(null)} />
      )}

      {showAddSection && (
        <AddSectionModal onAdd={handleAddSection} onClose={() => setShowAddSection(false)} />
      )}
    </div>
  );
}
