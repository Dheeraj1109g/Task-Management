"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Trash2,
  Search,
  RefreshCw,
  Mail,
  User,
  Briefcase,
  Layers,
  Crown,
} from "lucide-react";
import {
  AdminUserView,
  UserRole,
  listAdminUsers,
  updateUserRole,
  verifyUserManually,
  deleteUser,
} from "@/lib/api";
import { useToast } from "@/components/Toast";

interface AdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: number;
}

export function AdminUserModal({ isOpen, onClose, currentUserId }: AdminUserModalProps) {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await listAdminUsers();
      setUsers(data);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to load team members", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    setBusyId(userId);
    try {
      const updated = await updateUserRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      showToast(`User role updated to ${newRole}`, "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update role", "error");
    } finally {
      setBusyId(null);
    }
  };

  const handleVerify = async (userId: number) => {
    setBusyId(userId);
    try {
      const updated = await verifyUserManually(userId);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      showToast("Account manually verified", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to verify account", "error");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (userId: number, email: string) => {
    if (!window.confirm(`Are you sure you want to remove user "${email}"? This will delete all their tasks.`)) {
      return;
    }
    setBusyId(userId);
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast(`User ${email} removed`, "info");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete user", "error");
    } finally {
      setBusyId(null);
    }
  };

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-800 bg-[#0d121f] shadow-2xl z-10 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 text-white">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Team RBAC Governance
              </h2>
              <p className="text-xs text-slate-400">
                Manage roles, token verification statuses, and organization permissions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-4 sm:px-6 border-b border-slate-800/80 bg-slate-900/30 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search members by email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-800 bg-slate-950/80 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="text-xs text-slate-400">
            Total Members: <span className="font-semibold text-white">{users.length}</span>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
              <span className="text-xs">Loading organization roster...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              No members found matching your search.
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800/80 overflow-hidden bg-slate-950/40">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-medium">
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-center">Tasks</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filtered.map((u) => {
                    const isSelf = currentUserId === u.id;
                    const isBusy = busyId === u.id;

                    return (
                      <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-white">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center font-bold text-indigo-400 uppercase">
                              {u.email.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span>{u.email}</span>
                                {isSelf && (
                                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500">ID #{u.id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <select
                            value={u.role}
                            disabled={isBusy || isSelf}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-semibold border cursor-pointer transition-all ${
                              u.role === "admin"
                                ? "bg-violet-500/10 text-violet-300 border-violet-500/30"
                                : u.role === "manager"
                                ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                                : "bg-sky-500/10 text-sky-300 border-sky-500/30"
                            } ${isSelf ? "opacity-75 cursor-not-allowed" : ""}`}
                          >
                            <option value="admin" className="bg-slate-900 text-slate-200">👑 Admin</option>
                            <option value="manager" className="bg-slate-900 text-slate-200">⚡ Manager</option>
                            <option value="member" className="bg-slate-900 text-slate-200">👤 Member</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-3">
                          {u.is_verified ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                              <ShieldCheck className="w-3 h-3" /> Verified
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                                <ShieldAlert className="w-3 h-3" /> Unverified
                              </span>
                              <button
                                onClick={() => handleVerify(u.id)}
                                disabled={isBusy}
                                title="Manually verify this account"
                                className="text-[10px] text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                              >
                                Verify Now
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-center font-semibold text-slate-300">
                          {u.task_count}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {!isSelf && (
                            <button
                              onClick={() => handleDelete(u.id, u.email)}
                              disabled={isBusy}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Delete Member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-400"></span> Admin: Full Control
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Manager: Team Oversight
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span> Member: Self Tasks
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
