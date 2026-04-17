const BASE = '/api';

function getHeaders(): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export interface Section {
  _id: string;
  userId: string;
  name: string;
  icon: string;
  order: number;
  createdAt: string;
}

export interface VaultItem {
  _id: string;
  userId: string;
  sectionId: string;
  type: string;
  encryptedData: string;
  sizeBytes: number;
  createdAt: string;
}

export const api = {
  auth: {
    register: (email: string, password: string) =>
      request<{ message: string }>('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
    login: (email: string, password: string) =>
      request<{ token: string; user: { email: string; storageLimitBytes: number; storageUsedBytes: number } }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    me: () => request<{ email: string; storageLimitBytes: number; storageUsedBytes: number }>('/auth/me'),
    getVaultKeyVerifier: () => request<{ verifier: string }>('/auth/vault-key-verifier'),
    setVaultKeyVerifier: (verifier: string) =>
      request<{ message: string }>('/auth/vault-key-verifier', { method: 'POST', body: JSON.stringify({ verifier }) }),
  },
  sections: {
    list: () => request<Section[]>('/sections'),
    create: (name: string, icon: string) =>
      request<Section>('/sections', { method: 'POST', body: JSON.stringify({ name, icon }) }),
    update: (id: string, data: Partial<Section>) =>
      request<Section>(`/sections/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/sections/${id}`, { method: 'DELETE' }),
  },
  vault: {
    list: (sectionId?: string) =>
      request<VaultItem[]>(`/vault/all${sectionId ? `?sectionId=${sectionId}` : ''}`),
    save: (data: { sectionId: string; type: string; encryptedData: string }) =>
      request<VaultItem>('/vault/save', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<VaultItem>) =>
      request<VaultItem>(`/vault/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/vault/${id}`, { method: 'DELETE' }),
    bulkUpdate: (items: { _id: string; encryptedData: string }[]) =>
      request<{ message: string }>('/vault/bulk-update', { method: 'POST', body: JSON.stringify({ items }) }),
  },
};
