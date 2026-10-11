"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Task, TaskStatus, clearToken, createTask, deleteTask,
  getToken, listTasks, updateTask,
} from "@/lib/api";

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskStatus | "">("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      setTasks(await listTasks(filter || undefined));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    }
  }, [filter]);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    load();
  }, [load, router]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setError("");
    try {
      await createTask(title.trim());
      setTitle("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add task");
    }
  }

  async function handleStatus(id: number, status: TaskStatus) {
    setError("");
    setBusyId(id);
    try {
      await updateTask(id, { status });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setBusyId(null);
      await load();
    }
  }

  async function handleDelete(id: number) {
    setError("");
    setBusyId(id);
    try {
      await deleteTask(id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete task";
      // 404 means it's already gone, so just refresh instead of showing an error
      if (msg !== "Task not found") setError(msg);
    } finally {
      setBusyId(null);
      await load();
    }
  }

  function logout() {
    clearToken();
    router.push("/login");
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <button onClick={logout} className="text-sm text-gray-400 underline">
          Log out
        </button>
      </header>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title"
          className="flex-1 rounded border border-gray-600 bg-transparent p-2"
        />
        <button className="rounded bg-white px-4 font-medium text-black">Add</button>
      </form>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value as TaskStatus | "")}
        className="rounded border border-gray-600 bg-black p-2"
      >
        <option value="">All</option>
        <option value="todo">To do</option>
        <option value="in_progress">In progress</option>
        <option value="done">Done</option>
      </select>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <ul className="space-y-2">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between gap-2 rounded border border-gray-700 p-3"
          >
            <span className={t.status === "done" ? "line-through text-gray-500" : ""}>
              {t.title}
            </span>
            <div className="flex items-center gap-2">
              <select
                value={t.status}
                disabled={busyId === t.id}
                onChange={(e) => handleStatus(t.id, e.target.value as TaskStatus)}
                className="rounded border border-gray-600 bg-black p-1 text-sm disabled:opacity-50"
              >
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
              <button
                disabled={busyId === t.id}
                onClick={() => handleDelete(t.id)}
                className="text-red-500 disabled:opacity-50"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
        {tasks.length === 0 && <p className="text-gray-500">No tasks yet.</p>}
      </ul>
    </main>
  );
}