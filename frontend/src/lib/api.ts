
let _base = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || import.meta.env.BASE_URL || "";

if (!_base || _base === "/") _base = "http://localhost:5000";
// remove trailing slash
const BASE = _base.replace(/\/$/, "");

function getStorage() {
  try {
    return JSON.parse(localStorage.getItem("hl_session") || "null");
  } catch {
    return null;
  }
}

function setStorage(v: unknown) {
  localStorage.setItem("hl_session", JSON.stringify(v));
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    fetch(`${BASE}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: s.refreshToken }),
    }).catch(() => {});
  }
  localStorage.removeItem("hl_session");
}

export function getSession() {
  return getStorage();
}

export function getAuthHeaders(): Record<string, string> {
  const s = getStorage();
  return s?.accessToken ? { Authorization: `Bearer ${s.accessToken}` } : ({} as Record<string, string>);
}

export async function getMyAppointments() {
  const res = await fetch(`${BASE}/appointments`, { headers: getAuthHeaders() });
  if (!res.ok) throw res;
  return res.json();
}

export async function getAppointments(params: { patientId?: string; doctorId?: string; page?: number; limit?: number } = {}) {
  const headers = getAuthHeaders();
  const url = new URL(`${BASE}/appointments`);
  if (params.patientId) url.searchParams.set("patientId", params.patientId);
  if (params.doctorId) url.searchParams.set("doctorId", params.doctorId);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.limit) url.searchParams.set("limit", String(params.limit));
  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw res;
  return res.json();
}

export interface AppointmentPayload {
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  reason?: string;
  notes?: string;
}

export async function createAppointment(payload: AppointmentPayload) {
  const headers = { "Content-Type": "application/json", ...getAuthHeaders() } as Record<string, string>;
  const res = await fetch(`${BASE}/appointments`, {
    method: "POST",
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

export async function getPatients(query: PatientQuery | string = "") {
  const url = new URL(`${BASE}/patients`);
  if (typeof query === "string") {
    if (query) url.searchParams.set("q", query);
  } else {
    if (query.q) url.searchParams.set("q", query.q);
    if (query.page) url.searchParams.set("page", String(query.page));
    if (query.limit) url.searchParams.set("limit", String(query.limit));
  }
  const res = await fetch(url.toString(), { headers: getAuthHeaders() });
  if (!res.ok) throw res;
  return res.json();
}

export interface PatientPayload {
  name: string;
  gender?: string;
  contact?: { phone?: string; email?: string };
  address?: string;
  allergies?: string[];
  dob?: string;
  medicalHistory?: string[];
}

export async function createPatient(payload: PatientPayload) {
  const headers = { "Content-Type": "application/json", ...getAuthHeaders() } as Record<string, string>;
  const res = await fetch(`${BASE}/patients`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw res;
  return res.json();
}

export async function updatePatient(id: string, payload: PatientPayload) {
  const headers = { "Content-Type": "application/json", ...getAuthHeaders() } as Record<string, string>;
  const res = await fetch(`${BASE}/patients/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw res;
  return res.json();
}

export async function deletePatient(id: string) {
  const res = await fetch(`${BASE}/patients/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw res;
  return res.json();
}

export async function getAuditLogs(params: { page?: number; pageSize?: number; search?: string; action?: string } = {}) {
  const headers = getAuthHeaders();
  const url = new URL(`${BASE}/audit-logs`);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.pageSize) url.searchParams.set("pageSize", String(params.pageSize));
  if (params.search) url.searchParams.set("search", params.search);
  if (params.action && params.action !== "all") url.searchParams.set("action", params.action);
  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw res;
  return res.json();
}

export async function getUsers() {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE}/users`, { headers });
  if (!res.ok) throw res;
  return res.json();
}

export async function getPrescriptions(params: { patientId?: string; doctorId?: string; page?: number; limit?: number } = {}) {
  const headers = getAuthHeaders();
  const url = new URL(`${BASE}/prescriptions`);
  if (params.patientId) url.searchParams.set("patientId", params.patientId);
  if (params.doctorId) url.searchParams.set("doctorId", params.doctorId);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.limit) url.searchParams.set("limit", String(params.limit));
  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw res;
  return res.json();
}

export async function createUser(payload: { name: string; email: string; password: string; role: string }) {
  const headers = { "Content-Type": "application/json", ...getAuthHeaders() } as Record<string, string>;
  const res = await fetch(`${BASE}/users`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
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
  getAuditLogs,
  getUsers,
  getPrescriptions,
  createUser,
};
