"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LogOut,
  Layers,
  Plus,
  Shield,
  Crown,
  Briefcase,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  Users,
} from "lucide-react";
import { User as UserType, UserRole, demoLogin } from "@/lib/api";
import { useToast } from "@/components/Toast";

interface NavbarProps {
  user: UserType | null;
  apiHealthy: boolean | null;
  onLogout: () => void;
  onOpenCreateModal: () => void;
  onOpenAdminModal?: () => void;
  onRoleSwitched?: () => void;
}

export function Navbar({
  user,
  apiHealthy,
  onLogout,
  onOpenCreateModal,
  onOpenAdminModal,
  onRoleSwitched,
}: NavbarProps) {
  const { showToast } = useToast();
  const [switchingRole, setSwitchingRole] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";
  const role = user?.role || "member";

  const handleQuickSwitch = async (targetRole: UserRole) => {
    setRoleMenuOpen(false);
    if (targetRole === role) return;
    setSwitchingRole(true);
    try {
      await demoLogin(targetRole);
      showToast(`Switched active session to Demo ${targetRole.toUpperCase()}`, "success");
      if (onRoleSwitched) {
        onRoleSwitched();
      } else {
        window.location.reload();
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to switch role", "error");
    } finally {
      setSwitchingRole(false);
    }
  };

  const getRoleBadge = () => {
    switch (role) {
      case "admin":
        return {
          icon: Crown,
          text: "Admin",
          color: "text-violet-300 bg-violet-500/15 border-violet-500/30 shadow-violet-500/10",
        };
      case "manager":
        return {
          icon: Briefcase,
          text: "Manager",
          color: "text-amber-300 bg-amber-500/15 border-amber-500/30 shadow-amber-500/10",
        };
      default:
        return {
          icon: UserIcon,
          text: "Member",
          color: "text-sky-300 bg-sky-500/15 border-sky-500/30 shadow-sky-500/10",
        };
    }
  };

  const badge = getRoleBadge();
  const BadgeIcon = badge.icon;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#080b11]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform active:scale-95"
            title="Return to Landing Page"
          >
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 group-hover:shadow-indigo-500/40 transition-all">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  PulseFlow
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  FINTECH v2.4
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400 font-medium">B2B Workflow &amp; RBAC Cloud</p>
            </div>
          </Link>
        </div>

        {/* Center / Status & Role indicator */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Active Role Pill with Quick Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              disabled={switchingRole}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm transition-all cursor-pointer ${badge.color}`}
            >
              <BadgeIcon className="w-3.5 h-3.5" />
              <span>Role: {badge.text}</span>
              <ChevronDown className="w-3 h-3 opacity-70 ml-0.5" />
            </button>

            {roleMenuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setRoleMenuOpen(false)} />
                <div className="absolute left-0 mt-2 z-30 w-52 rounded-2xl border border-slate-800 bg-[#0d121f] p-1.5 shadow-2xl animate-in fade-in zoom-in-95">
                  <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1">
                    Simulate Role (Demo)
                  </div>
                  <button
                    onClick={() => handleQuickSwitch("admin")}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      role === "admin" ? "bg-violet-500/20 text-violet-200" : "text-slate-300 hover:bg-slate-800/80"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Crown className="w-3.5 h-3.5 text-violet-400" />
                      Admin
                    </span>
                    {role === "admin" && <span className="text-[10px] text-violet-400 font-bold">Active</span>}
                  </button>
                  <button
                    onClick={() => handleQuickSwitch("manager")}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      role === "manager" ? "bg-amber-500/20 text-amber-200" : "text-slate-300 hover:bg-slate-800/80"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                      Manager
                    </span>
                    {role === "manager" && <span className="text-[10px] text-amber-400 font-bold">Active</span>}
                  </button>
                  <button
                    onClick={() => handleQuickSwitch("member")}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      role === "member" ? "bg-sky-500/20 text-sky-200" : "text-slate-300 hover:bg-slate-800/80"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <UserIcon className="w-3.5 h-3.5 text-sky-400" />
                      Member
                    </span>
                    {role === "member" && <span className="text-[10px] text-sky-400 font-bold">Active</span>}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* API Health */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-xs">
            <span className="relative flex h-2 w-2">
              {apiHealthy ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </>
              ) : apiHealthy === null ? (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 animate-pulse"></span>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              )}
            </span>
            <span className="text-slate-300">
              {apiHealthy === null ? "Telemetry sync..." : apiHealthy ? "Telemetry 99.99%" : "Backend Offline"}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Admin User Governance Button (if Admin) */}
          {role === "admin" && onOpenAdminModal && (
            <button
              onClick={onOpenAdminModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition-all cursor-pointer"
              title="Manage Team Roles and Access Control"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin RBAC</span>
            </button>
          )}

          {/* Create Task Button */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs ring-1 ring-white/10">
                {userInitial}
              </div>
              <span className="hidden sm:inline max-w-[130px] truncate font-medium text-slate-300">
                {user?.email ?? "User"}
              </span>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
