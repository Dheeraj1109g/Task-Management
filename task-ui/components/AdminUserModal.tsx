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
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl z-10 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#d2f801] flex items-center justify-center shadow-md shadow-[#d2f801]/30 text-black font-black">
              <Crown className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                Team RBAC Governance
              </h2>
              <p className="text-xs text-slate-500">
                Manage roles, token verification statuses, and organization permissions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-4 sm:px-6 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search members by email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
            />
          </div>
          <div className="text-xs text-slate-500">
            Total Members: <span className="font-bold text-slate-900">{users.length}</span>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin text-slate-900" />
              <span className="text-xs">Loading organization roster...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              No members found matching your search.
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-center">Tasks</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filtered.map((u) => {
                    const isSelf = currentUserId === u.id;
                    const isBusy = busyId === u.id;

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 uppercase">
                              {u.email.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span>{u.email}</span>
                                {isSelf && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 font-normal">ID #{u.id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <select
                            value={u.role}
                            disabled={isBusy || isSelf}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold border cursor-pointer transition-all ${
                              u.role === "admin"
                                ? "bg-[#d2f801]/30 text-slate-950 border-[#bfe700]"
                                : u.role === "manager"
                                ? "bg-amber-100 text-amber-900 border-amber-300"
                                : "bg-sky-100 text-sky-900 border-sky-300"
                            } ${isSelf ? "opacity-75 cursor-not-allowed" : ""}`}
                          >
                            <option value="admin" className="bg-white text-slate-900">👑 Admin</option>
                            <option value="manager" className="bg-white text-slate-900">⚡ Manager</option>
                            <option value="member" className="bg-white text-slate-900">👤 Member</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-3">
                          {u.is_verified ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                <ShieldAlert className="w-3 h-3 text-amber-600" /> Unverified
                              </span>
                              <button
                                onClick={() => handleVerify(u.id)}
                                disabled={isBusy}
                                title="Manually verify this account"
                                className="text-[10px] font-bold text-slate-900 underline hover:text-[#bce000] cursor-pointer"
                              >
                                Verify Now
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-center font-bold text-slate-800">
                          {u.task_count}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {!isSelf && (
                            <button
                              onClick={() => handleDelete(u.id, u.email)}
                              disabled={isBusy}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
        <div className="p-4 sm:px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#d2f801] ring-1 ring-black/20"></span> Admin: Full Control
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Manager: Team Oversight
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span> Member: Self Tasks
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-950 hover:bg-slate-900 text-white font-bold cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
