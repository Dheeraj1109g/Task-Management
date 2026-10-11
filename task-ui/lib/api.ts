export const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/login\/?$/, "").replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:8000";
    }
  }

  return "https://task-management-psww.onrender.com";
};

export const API_URL = getApiBaseUrl();

export type TaskStatus = "todo" | "in_progress" | "done";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
};

export type User = {
  id: number;
  email: string;
  created_at: string;
};

export type TaskStats = {
  todo: number;
  in_progress: number;
  done: number;
  total: number;
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const setToken = (t: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", t);
  }
};

export const clearToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

async function request<T>(path: string, options: RequestInit = {}, retries: number = 1): Promise<T> {
  const token = getToken();
  const baseUrl = getApiBaseUrl();
  let res: Response;
  try {
    res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 1500));
      return request<T>(path, options, retries - 1);
    }
    throw new Error(
      "Cannot connect to the server. Please ensure the backend is running."
    );
  }

  if (res.status === 401 && token) {
    clearToken();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.replace("/login?expired=1");
    }
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    let msg = "Something went wrong";
    if (typeof err.detail === "string") {
      msg = err.detail;
    } else if (Array.isArray(err.detail) && err.detail.length > 0) {
      msg = err.detail.map((d: { msg?: string; message?: string }) => d.msg || d.message || "Invalid input").join("; ");
    }
    throw new Error(msg);
  }

  return res.status === 204 ? (undefined as T) : res.json();
}

const jsonHeaders = { "Content-Type": "application/json" };

export async function register(email: string, password: string): Promise<User> {
  return request<User>("/auth/register", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });
}

export async function login(email: string, password: string): Promise<string> {
  const body = new URLSearchParams({ username: email.trim().toLowerCase(), password });
  const data = await request<{ access_token: string }>("/auth/login", {
    method: "POST",
    body,
  });
  setToken(data.access_token);
  return data.access_token;
}

export async function getMe(): Promise<User> {
  return request<User>("/auth/me");
}

export async function listTasks(
  status?: TaskStatus,
  limit: number = 100,
  offset: number = 0
): Promise<Task[]> {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (limit) params.append("limit", limit.toString());
  if (offset) params.append("offset", offset.toString());

  const query = params.toString() ? `?${params.toString()}` : "";
  return request<Task[]>(`/tasks${query}`);
}

export async function getTask(id: number): Promise<Task> {
  return request<Task>(`/tasks/${id}`);
}

export async function createTask(
  title: string,
  description?: string | null,
  dueDate?: string | null
): Promise<Task> {
  return request<Task>("/tasks", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({
      title: title.trim(),
      description: description?.trim() ? description.trim() : null,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
    }),
  });
}

export async function updateTask(
  id: number,
  data: {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    due_date?: string | null;
  }
): Promise<Task> {
  const payload: Record<string, unknown> = {};
  if (data.title !== undefined) payload.title = data.title.trim();
  if (data.description !== undefined) {
    payload.description = data.description?.trim() ? data.description.trim() : null;
  }
  if (data.status !== undefined) payload.status = data.status;
  if (data.due_date !== undefined) {
    payload.due_date = data.due_date ? new Date(data.due_date).toISOString() : null;
  }

  return request<Task>(`/tasks/${id}`, {
    method: "PATCH",
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(id: number): Promise<void> {
  return request<void>(`/tasks/${id}`, { method: "DELETE" });
}

export async function getStats(): Promise<TaskStats> {
  return request<TaskStats>("/tasks/stats");
}

export interface HealthStatus {
  api: boolean;
  db: boolean;
}

export async function checkBackendHealth(): Promise<HealthStatus> {
  const baseUrl = getApiBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const apiPromise = fetch(`${baseUrl}/health`, {
      cache: "no-store",
      signal: controller.signal,
    }).catch(() => null);

    const dbPromise = fetch(`${baseUrl}/health/db`, {
      cache: "no-store",
      signal: controller.signal,
    }).catch(() => null);

    const [apiRes, dbRes] = await Promise.all([apiPromise, dbPromise]);
    clearTimeout(timeoutId);

    return {
      api: apiRes?.ok ?? false,
      db: dbRes?.ok ?? false,
    };
  } catch {
    return { api: false, db: false };
  }
}