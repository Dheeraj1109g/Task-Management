"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Kanban,
  List,
  RefreshCw,
  Sparkles,
  Inbox,
  X,
} from "lucide-react";

import {
  Task,
  TaskStatus,
  TaskStats,
  User,
  clearToken,
  createTask,
  deleteTask,
  getMe,
  getStats,
  getToken,
  listTasks,
  updateTask,
  checkBackendHealth,
} from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { StatsOverview } from "@/components/StatsOverview";
import { TaskCard } from "@/components/TaskCard";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskModal } from "@/components/TaskModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { useToast } from "@/components/Toast";

type SortOption = "created_desc" | "created_asc" | "due_soon" | "title_asc";

export default function TasksPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);

  const [filter, setFilter] = useState<TaskStatus | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("created_desc");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalDefaultStatus, setModalDefaultStatus] = useState<TaskStatus>("todo");
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const reloadAll = useCallback(async () => {
    try {
      const [fetchedTasks, fetchedStats, fetchedUser, health] = await Promise.all([
        listTasks(),
        getStats(),
        getMe(),
        checkBackendHealth(),
      ]);

      setTasks(fetchedTasks);
      setStats(fetchedStats);
      setUser(fetchedUser);
      setApiHealthy(health.api && health.db);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load tasks";
      if (!msg.includes("Session expired")) {
        showToast(msg, "error");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    let ignore = false;
    Promise.all([listTasks(), getStats(), getMe(), checkBackendHealth()])
      .then(([fetchedTasks, fetchedStats, fetchedUser, health]) => {
        if (ignore) return;
        setTasks(fetchedTasks);
        setStats(fetchedStats);
        setUser(fetchedUser);
        setApiHealthy(health.api && health.db);
        setIsLoading(false);
      })
      .catch((err) => {
        if (ignore) return;
        const msg = err instanceof Error ? err.message : "Failed to load tasks";
        if (!msg.includes("Session expired")) {
          showToast(msg, "error");
        }
        setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [router, showToast]);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    reloadAll();
  };

  const handleLogout = () => {
    clearToken();
    showToast("Signed out successfully", "info");
    router.push("/login");
  };

  // Task Actions
  const handleCreateOrUpdate = async (data: {
    title: string;
    description: string | null;
    status: TaskStatus;
    due_date: string | null;
  }) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
      showToast("Task updated successfully", "success");
    } else {
      const newTask = await createTask(data.title, data.description, data.due_date);
      if (data.status !== "todo") {
        await updateTask(newTask.id, { status: data.status });
      }
      showToast("Task created successfully", "success");
    }
    await reloadAll();
  };

  const handleStatusChange = async (id: number, nextStatus: TaskStatus) => {
    setBusyId(id);
    try {
      await updateTask(id, { status: nextStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
      );
      getStats().then(setStats).catch(() => null);
      showToast("Status updated", "info");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update status", "error");
      await reloadAll();
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteConfirm = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      getStats().then(setStats).catch(() => null);
      showToast("Task deleted", "info");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete task", "error");
      await reloadAll();
    }
  };

  const openCreateModal = (defaultStatus: TaskStatus = "todo") => {
    setEditingTask(null);
    setModalDefaultStatus(defaultStatus);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Filter & Search & Sort Logic
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Status filter
    if (filter) {
      result = result.filter((t) => t.status === filter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "created_desc") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "created_asc") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === "title_asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "due_soon") {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      return 0;
    });

    return result;
  }, [tasks, filter, searchQuery, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400 animate-pulse">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar
        user={user}
        apiHealthy={apiHealthy}
        onLogout={handleLogout}
        onOpenCreateModal={() => openCreateModal("todo")}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* Top Header / Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              Workspace Dashboard
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Organize, track progress, and accomplish your goals.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => openCreateModal("todo")}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Stats Metric Cards */}
        <StatsOverview
          stats={stats}
          activeFilter={filter}
          onSelectFilter={(newFilter) => setFilter(newFilter)}
        />

        {/* Filter, Search & View Controls */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3.5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search tasks by title or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-sm rounded-xl border border-slate-800 bg-slate-950/70 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-slate-400 hover:text-slate-200 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort & View Mode Switcher */}
            <div className="flex items-center flex-wrap gap-2.5">
              {/* Sort selector */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950/70 text-xs text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline text-slate-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent border-none text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="created_desc" className="bg-slate-900">Newest first</option>
                  <option value="created_asc" className="bg-slate-900">Oldest first</option>
                  <option value="due_soon" className="bg-slate-900">Due date</option>
                  <option value="title_asc" className="bg-slate-900">Title (A-Z)</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center p-1 rounded-xl border border-slate-800 bg-slate-950/70">
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    viewMode === "list"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">List</span>
                </button>
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    viewMode === "kanban"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Kanban Board View"
                >
                  <Kanban className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Board</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-slate-800/60 text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>

            <button
              onClick={() => setFilter("")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                filter === ""
                  ? "bg-slate-100 text-slate-900 font-semibold shadow"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilter("todo")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                filter === "todo"
                  ? "bg-sky-500 text-white font-semibold shadow"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-sky-300 border border-slate-800"
              }`}
            >
              To Do ({tasks.filter((t) => t.status === "todo").length})
            </button>
            <button
              onClick={() => setFilter("in_progress")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                filter === "in_progress"
                  ? "bg-amber-500 text-white font-semibold shadow"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800"
              }`}
            >
              In Progress ({tasks.filter((t) => t.status === "in_progress").length})
            </button>
            <button
              onClick={() => setFilter("done")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                filter === "done"
                  ? "bg-emerald-500 text-white font-semibold shadow"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-300 border border-slate-800"
              }`}
            >
              Completed ({tasks.filter((t) => t.status === "done").length})
            </button>

            {(filter !== "" || searchQuery) && (
              <button
                onClick={() => {
                  setFilter("");
                  setSearchQuery("");
                }}
                className="ml-auto text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Task View Area */}
        {viewMode === "kanban" ? (
          <KanbanBoard
            tasks={filteredAndSortedTasks}
            onUpdateStatus={handleStatusChange}
            onEdit={openEditModal}
            onDeleteRequest={(t) => setDeletingTask(t)}
            onQuickAdd={(status) => openCreateModal(status)}
            isBusyId={busyId}
          />
        ) : (
          <div className="space-y-3">
            {filteredAndSortedTasks.length > 0 ? (
              filteredAndSortedTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onUpdateStatus={handleStatusChange}
                  onEdit={openEditModal}
                  onDeleteRequest={(t) => setDeletingTask(t)}
                  isBusy={busyId === t.id}
                />
              ))
            ) : tasks.length === 0 ? (
              /* Empty state: No tasks at all */
              <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-800 bg-slate-900/20">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Inbox className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-200">No tasks created yet</h3>
                <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
                  Start organizing your day by creating your first task with deadlines, descriptions, and status tracking.
                </p>
                <button
                  onClick={() => openCreateModal("todo")}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Task
                </button>
              </div>
            ) : (
              /* Filter produced 0 results */
              <div className="text-center py-12 px-4 rounded-2xl border border-slate-800/80 bg-slate-900/30">
                <Search className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <h4 className="font-semibold text-slate-300">No matching tasks found</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search query or status filter to see other tasks.
                </p>
                <button
                  onClick={() => {
                    setFilter("");
                    setSearchQuery("");
                  }}
                  className="mt-3 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleCreateOrUpdate}
        initialData={editingTask}
        defaultStatus={modalDefaultStatus}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingTask)}
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
