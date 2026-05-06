const BASE_URL = 'http://localhost:8000/api';

export const optimizeProcess = async (data) => {
  const res = await fetch(`${BASE_URL}/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'API Error');
  }
  return res.json();
};

export const getHistory = async (limit = 10) => {
  const res = await fetch(`${BASE_URL}/history?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
};

export const getHealth = async () => {
  const res = await fetch(`${BASE_URL}/health`);
  return res.json();
};

// NEW — fetch materials from backend
export const getMaterials = async () => {
  const res = await fetch(`${BASE_URL}/materials`);
  if (!res.ok) throw new Error('Failed to fetch materials');
  return res.json();
};