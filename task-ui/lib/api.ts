const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type TaskStatus = "todo" | "in_progress" | "done";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
};

export const getToken = () =>
  typeof window === "undefined" ? null : localStorage.getItem("token");
export const setToken = (t: string) => localStorage.setItem("token", t);
export const clearToken = () => localStorage.removeItem("token");

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401 && token) {
    clearToken();
    window.location.href = "/login";
    throw new Error("Session expired");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(typeof err.detail === "string" ? err.detail : "Invalid input");
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

const json = { "Content-Type": "application/json" };

export async function register(email: string, password: string) {
  await request("/auth/register", {
    method: "POST",
    headers: json,
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email: string, password: string) {
  const body = new URLSearchParams({ username: email, password });
  const data = await request<{ access_token: string }>("/auth/login", {
    method: "POST",
    body,
  });
  setToken(data.access_token);
}

export const listTasks = (status?: TaskStatus) =>
  request<Task[]>(`/tasks${status ? `?status=${status}` : ""}`);

export const createTask = (title: string, description?: string) =>
  request<Task>("/tasks", {
    method: "POST",
    headers: json,
    body: JSON.stringify({ title, description: description || null }),
  });

export const updateTask = (id: number, data: Partial<Pick<Task, "title" | "description" | "status">>) =>
  request<Task>(`/tasks/${id}`, {
    method: "PATCH",
    headers: json,
    body: JSON.stringify(data),
  });

export const deleteTask = (id: number) =>
  request<void>(`/tasks/${id}`, { method: "DELETE" });