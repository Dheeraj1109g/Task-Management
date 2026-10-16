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
  apiHealthy?: boolean | null;
  onLogout: () => void;
  onOpenCreateModal: () => void;
  onOpenAdminModal?: () => void;
  onRoleSwitched?: () => void;
}

export function Navbar({
  user,
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
          color: "text-slate-950 bg-[#d2f801]/30 border-[#bfe700]",
        };
      case "manager":
        return {
          icon: Briefcase,
          text: "Manager",
          color: "text-amber-900 bg-amber-100 border-amber-300",
        };
      default:
        return {
          icon: UserIcon,
          text: "Member",
          color: "text-sky-900 bg-sky-100 border-sky-300",
        };
    }
  };

  const badge = getRoleBadge();
  const BadgeIcon = badge.icon;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform active:scale-95"
            title="Return to Landing Page"
          >
            <div className="h-10 w-10 rounded-2xl bg-[#d2f801] flex items-center justify-center shadow-md shadow-[#d2f801]/30 ring-1 ring-black/10 group-hover:scale-105 transition-all text-black font-black">
              <Layers className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-950">
                  PulseFlow
                </span>
                <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#d2f801]/30 text-slate-950 border border-[#bfe700]">
                  FINTECH OS
                </span>
              </div>
              <p className="hidden md:block text-[10px] text-slate-500 font-medium">B2B Workflow &amp; RBAC Cloud</p>
            </div>
          </Link>
        </div>

        {/* Center / Role indicator */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Active Role Pill with Quick Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              disabled={switchingRole}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-sm transition-all cursor-pointer ${badge.color}`}
            >
              <BadgeIcon className="w-3.5 h-3.5" />
              <span>Role: {badge.text}</span>
              <ChevronDown className="w-3 h-3 opacity-70 ml-0.5" />
            </button>

            {roleMenuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setRoleMenuOpen(false)} />
                <div className="absolute left-0 mt-2 z-30 w-52 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl animate-in fade-in zoom-in-95">
                  <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Simulate Role (Demo)
                  </div>
                  <button
                    onClick={() => handleQuickSwitch("admin")}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      role === "admin" ? "bg-[#d2f801]/30 text-slate-950 font-bold" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Crown className="w-3.5 h-3.5 text-slate-900" />
                      Admin
                    </span>
                    {role === "admin" && <span className="text-[10px] text-slate-900 font-bold">Active</span>}
                  </button>
                  <button
                    onClick={() => handleQuickSwitch("manager")}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      role === "manager" ? "bg-amber-100 text-amber-900 font-bold" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                      Manager
                    </span>
                    {role === "manager" && <span className="text-[10px] text-amber-600 font-bold">Active</span>}
                  </button>
                  <button
                    onClick={() => handleQuickSwitch("member")}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      role === "member" ? "bg-sky-100 text-sky-900 font-bold" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <UserIcon className="w-3.5 h-3.5 text-sky-600" />
                      Member
                    </span>
                    {role === "member" && <span className="text-[10px] text-sky-600 font-bold">Active</span>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Admin User Governance Button (if Admin) */}
          {role === "admin" && onOpenAdminModal && (
            <button
              onClick={onOpenAdminModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200 transition-all cursor-pointer"
              title="Manage Team Roles and Access Control"
            >
              <Users className="w-3.5 h-3.5 text-slate-900" />
              <span className="hidden sm:inline">Admin RBAC</span>
            </button>
          )}

          {/* Create Task Button */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs sm:text-sm font-extrabold rounded-full bg-[#d2f801] hover:bg-[#bce000] text-black shadow-md shadow-[#d2f801]/30 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">New Task</span>
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-800">
              <div className="w-6 h-6 rounded-full bg-[#d2f801] flex items-center justify-center font-black text-black text-xs ring-1 ring-black/10">
                {userInitial}
              </div>
              <span className="hidden sm:inline max-w-[130px] truncate font-semibold text-slate-800">
                {user?.email ?? "User"}
              </span>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all border border-transparent hover:border-rose-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
