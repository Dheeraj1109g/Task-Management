"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  ShieldAlert,
  ShieldCheck,
  Users,
  Briefcase,
  Crown,
  UserCheck,
  CheckCircle2,
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
  resendVerification,
} from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { StatsOverview } from "@/components/StatsOverview";
import { TaskCard } from "@/components/TaskCard";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskModal } from "@/components/TaskModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { AdminUserModal } from "@/components/AdminUserModal";
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
  const [scope, setScope] = useState<"mine" | "team">("mine");

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalDefaultStatus, setModalDefaultStatus] = useState<TaskStatus>("todo");
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Resend email state
  const [resendingEmail, setResendingEmail] = useState(false);

  const isPrivileged = user?.role === "admin" || user?.role === "manager";

  const reloadAll = useCallback(async (currentScope: "mine" | "team" = scope) => {
    try {
      const isTeam = currentScope === "team";
      const [fetchedTasks, fetchedStats, fetchedUser, health] = await Promise.all([
        listTasks(undefined, isTeam),
        getStats(isTeam ? "all" : "mine"),
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
  }, [scope, showToast]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    reloadAll();
  }, [router, reloadAll]);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    reloadAll();
  };

  const handleScopeChange = (newScope: "mine" | "team") => {
    setScope(newScope);
    setIsLoading(true);
    reloadAll(newScope);
  };

  const handleLogout = () => {
    clearToken();
    showToast("Signed out successfully", "info");
    router.push("/login");
  };

  const handleResendEmail = async () => {
    if (!user?.email) return;
    setResendingEmail(true);
    try {
      const res = await resendVerification(user.email);
      showToast(res.message || "Verification email sent!", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to resend email", "error");
    } finally {
      setResendingEmail(false);
    }
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
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );

    try {
      await updateTask(id, { status: nextStatus });
      // Refresh stats silently
      const updatedStats = await getStats(scope === "team" ? "all" : "mine");
      setStats(updatedStats);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Status update failed", "error");
      reloadAll();
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteConfirm = async (id: number) => {
    setBusyId(id);
    try {
      await deleteTask(id);
      showToast("Task deleted", "info");
      setDeletingTask(null);
      await reloadAll();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete task", "error");
    } finally {
      setBusyId(null);
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

  // Filter & Sort
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Status Filter
    if (filter) {
      result = result.filter((t) => t.status === filter);
    }

    // Search Query (title or description or owner_email)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.owner_email && t.owner_email.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "created_asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "due_soon": {
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        }
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "created_desc":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return result;
  }, [tasks, filter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        user={user}
        apiHealthy={apiHealthy}
        onLogout={handleLogout}
        onOpenCreateModal={() => openCreateModal("todo")}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onRoleSwitched={() => reloadAll()}
      />

      {/* Unverified Email Security Banner */}
      {user && !user.is_verified && (
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/20 to-orange-500/15 border-b border-amber-500/30 px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-amber-300">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <strong>Email Verification Pending:</strong> A security token was issued for{" "}
                <span className="font-semibold text-white">{user.email}</span>. Please verify your email to ensure full account recovery and security compliance.
              </span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handleResendEmail}
                disabled={resendingEmail}
                className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-medium transition-colors cursor-pointer"
              >
                {resendingEmail ? "Sending..." : "Resend Token"}
              </button>
              <Link
                href="/verify-email"
                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer"
              >
                Enter Token Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Workspace Header / Welcome */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Fintech Workflow Console
              </h1>
              {user?.role && (
                <span
                  className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                    user.role === "admin"
                      ? "bg-violet-500/15 text-violet-300 border-violet-500/30"
                      : user.role === "manager"
                      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                      : "bg-sky-500/15 text-sky-300 border-sky-500/30"
                  }`}
                >
                  {user.role} workspace
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time sprint metrics, RBAC pipeline permissions, and task lifecycle management.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Team Scope Switcher (for Admin/Manager) */}
            {isPrivileged && (
              <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800">
                <button
                  onClick={() => handleScopeChange("mine")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    scope === "mine"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  My Tasks
                </button>
                <button
                  onClick={() => handleScopeChange("team")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    scope === "team"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  All Team Tasks
                </button>
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-800 hover:bg-slate-900/80 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              title="Refresh Tasks"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-indigo-400" : ""}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            {/* Admin Console Pill */}
            {user?.role === "admin" && (
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Manage Roles</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Overview Component */}
        <StatsOverview
          stats={stats}
          activeFilter={filter}
          onSelectFilter={(st) => setFilter(st)}
        />

        {/* Controls Toolbar: Search, Sort, View Toggle */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#0d121f]/70 backdrop-blur-md p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={scope === "team" ? "Search by task title, description, or assigned member..." : "Search your tasks..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm rounded-xl border border-slate-800 bg-slate-950/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-slate-500 hover:text-slate-300 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort & View Mode */}
            <div className="flex items-center gap-2.5">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none pl-8 pr-8 py-2 text-xs font-medium rounded-xl border border-slate-800 bg-slate-950/80 text-slate-300 hover:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="created_desc">Newest First</option>
                  <option value="created_asc">Oldest First</option>
                  <option value="due_soon">Due Date (Soonest)</option>
                  <option value="title_asc">Title (A-Z)</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* View Mode Toggle: List vs Kanban */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800">
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
            currentUser={user}
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
                  currentUser={user}
                  onUpdateStatus={handleStatusChange}
                  onEdit={openEditModal}
                  onDeleteRequest={(t) => setDeletingTask(t)}
                  isBusy={busyId === t.id}
                />
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center bg-[#0d121f]/30">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-3">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-200">No tasks found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {searchQuery || filter
                    ? "Try adjusting your search criteria or clearing active filters."
                    : scope === "team"
                    ? "No tasks have been created across the organization yet."
                    : "Create your first task to start tracking velocity and milestones."}
                </p>
                <button
                  onClick={() => openCreateModal("todo")}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Create Task
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
        task={deletingTask}
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Admin User Management Modal */}
      <AdminUserModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        currentUserId={user?.id}
      />
    </div>
  );
}
