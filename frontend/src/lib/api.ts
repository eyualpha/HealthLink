// Prefer explicit Vite env `VITE_API_URL`. Fall back to other envs, but avoid
// using `BASE_URL` alone because Vite exposes it as '/' and that produces
// protocol-relative URLs when concatenated (e.g. `//auth/login`).
let _base = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || import.meta.env.BASE_URL || '';
// Treat bare '/' or empty as unspecified and fallback to localhost
if (!_base || _base === '/') _base = 'http://localhost:5000';
// remove trailing slash
const BASE = _base.replace(/\/$/, '');

function getStorage() {
  try {
    return JSON.parse(localStorage.getItem('hl_session') || 'null');
  } catch {
    return null;
  }
}

function setStorage(v: any) {
  localStorage.setItem('hl_session', JSON.stringify(v));
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw res;
  const data = await res.json();
  setStorage({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
}

export function logout() {
  const s = getStorage();
  if (s?.refreshToken) {
    // fire-and-forget revoke
    fetch(`${BASE}/auth/logout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken: s.refreshToken }) }).catch(() => {});
  }
  localStorage.removeItem('hl_session');
}

export function getSession() {
  return getStorage();
}

export function getAuthHeaders(): Record<string, string> {
  const s = getStorage();
  return s?.accessToken ? { Authorization: `Bearer ${s.accessToken}` } : {} as Record<string, string>;
}

export async function getMyAppointments() {
  const res = await fetch(`${BASE}/appointments`, { headers: getAuthHeaders() });
  if (!res.ok) throw res;
  return res.json();
}

export async function createAppointment(payload: any) {
  const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() } as Record<string,string>;
  const res = await fetch(`${BASE}/appointments`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw res;
  return res.json();
}

export interface PatientQuery {
  q?: string;
  page?: number;
  limit?: number;
}

export async function getPatients(query: PatientQuery | string = '') {
  const url = new URL(`${BASE}/patients`);
  if (typeof query === 'string') {
    if (query) url.searchParams.set('q', query);
  } else {
    if (query.q) url.searchParams.set('q', query.q);
    if (query.page) url.searchParams.set('page', String(query.page));
    if (query.limit) url.searchParams.set('limit', String(query.limit));
  }
  const res = await fetch(url.toString(), { headers: getAuthHeaders() });
  if (!res.ok) throw res;
  return res.json();
}

export async function createPatient(payload: any) {
  const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() } as Record<string,string>;
  const res = await fetch(`${BASE}/patients`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw res;
  return res.json();
}

export async function updatePatient(id: string, payload: any) {
  const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() } as Record<string,string>;
  const res = await fetch(`${BASE}/patients/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw res;
  return res.json();
}

export async function deletePatient(id: string) {
  const res = await fetch(`${BASE}/patients/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw res;
  return res.json();
}

// Users (admin)
export async function createUser(payload: { name: string; email: string; role: string; password: string }) {
  const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() } as Record<string,string>;
  const res = await fetch(`${BASE}/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw res;
  return res.json();
}

// Audit Logs
export interface AuditQuery {
  search?: string;
  action?: string; // 'login' | 'logout' | 'create' | 'update' | 'delete' | 'permission' | 'other' | 'all'
  page?: number;
  pageSize?: number;
}

export async function getAuditLogs(query: AuditQuery = {}) {
  const url = new URL(`${BASE}/audit-logs`);
  if (query.search) url.searchParams.set('search', query.search);
  if (query.action) url.searchParams.set('action', query.action);
  if (query.page) url.searchParams.set('page', String(query.page));
  if (query.pageSize) url.searchParams.set('pageSize', String(query.pageSize));
  const res = await fetch(url.toString(), { headers: getAuthHeaders() });
  if (!res.ok) throw res;
  return res.json();
}

export default {
  login,
  logout,
  getSession,
  getMyAppointments,
  createAppointment,
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
  createUser,
  getAuditLogs,
};
