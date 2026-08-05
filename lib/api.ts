import type { DashboardData } from "./types";

// Relative paths only — the browser now only ever talks to this
// Next.js app's own /api/* routes (same origin as the page itself).
// Those routes proxy to Odoo server-side (see lib/proxy.ts), where
// cross-origin rules don't apply at all. No NEXT_PUBLIC_API_BASE
// needed on the client anymore.
const TOKEN_KEY = "student_dashboard_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    throw new ApiError("Session expired — please log in again.", 401);
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // response wasn't JSON — keep the generic message
    }
    throw new ApiError(message, res.status);
  }
  return res.json() as Promise<T>;
}

export async function login(phone: string, password: string) {
  const data = await request<{ token: string; student_id: number; student_name: string }>(
    "/api/auth/login",
    { method: "POST", body: JSON.stringify({ phone, password }) }
  );
  setToken(data.token);
  return data;
}

export function getDashboard() {
  return request<DashboardData>("/api/student/dashboard", { method: "GET" });
}

export function toggleTask(taskId: number) {
  return request<{ is_done: boolean }>(`/api/student/task/${taskId}/toggle`, { method: "POST" });
}

export function updateTask(
  taskId: number,
  vals: Partial<{
    student_remarks: string;
    confidence_level: string;
    difficulty_level: string;
    time_spent: number;
    completion_percentage: number;
  }>
) {
  return request<{ ok: boolean }>(`/api/student/task/${taskId}/update`, {
    method: "POST",
    body: JSON.stringify(vals),
  });
}

export function createDoubt(vals: { description: string; priority?: string; subject_id?: number; topic_id?: number }) {
  return request<{ id: number }>("/api/student/doubts", {
    method: "POST",
    body: JSON.stringify(vals),
  });
}

export { ApiError };
