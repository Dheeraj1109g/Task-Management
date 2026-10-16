"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Shield,
  ShieldCheck,
  Mail,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  TrendingUp,
  Users,
  Briefcase,
  Crown,
  ChevronRight,
  Kanban,
  Clock,
  Sparkles,
  BarChart3,
  Server,
  Star,
  Check,
  Play,
  Key,
  ArrowUpRight,
  Wallet,
  Activity,
  CreditCard,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeContext";

export default function LandingPage() {
  const [activeRoleTab, setActiveRoleTab] = useState<"admin" | "manager" | "member">("admin");
  const [demoToken, setDemoToken] = useState("sec_tok_98f4e2b071a39bc");
  const [tokenGenerated, setTokenGenerated] = useState(false);

  const generateNewToken = () => {
    const chars = "abcdef0123456789";
    let res = "sec_tok_";
    for (let i = 0; i < 18; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    setDemoToken(res);
    setTokenGenerated(true);
    setTimeout(() => setTokenGenerated(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-[#d2f801] selection:text-black relative overflow-hidden">
      {/* Background radial glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#d2f801]/10 via-[#10b981]/5 to-transparent blur-[160px] pointer-events-none" />
      <div className="absolute top-[800px] right-[-100px] w-[500px] h-[500px] bg-[#d2f801]/5 blur-[150px] pointer-events-none" />
      <div className="absolute top-[2000px] left-[-100px] w-[600px] h-[600px] bg-[#06b6d4]/5 blur-[170px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-[#182033] bg-[#07090e]/85 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-2xl bg-[#d2f801] flex items-center justify-center shadow-lg shadow-[#d2f801]/25 ring-1 ring-white/20 group-hover:scale-105 transition-all text-black font-black">
              <Layers className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  PulseFlow
                </span>
                <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#d2f801]/15 text-[#d2f801] border border-[#d2f801]/30">
                  FINTECH OS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">B2B Workflow &amp; RBAC Cloud</p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-[#d2f801] transition-colors">Platform</a>
            <a href="#rbac" className="hover:text-[#d2f801] transition-colors">RBAC Governance</a>
            <a href="#auth-tokens" className="hover:text-[#d2f801] transition-colors">Token Auth</a>
            <a href="#preview" className="hover:text-[#d2f801] transition-colors">Live Console</a>
            <a href="#pricing" className="hover:text-[#d2f801] transition-colors">Pricing</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-extrabold rounded-full bg-[#d2f801] hover:bg-[#bce000] text-black shadow-lg shadow-[#d2f801]/25 active:scale-95 transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        {/* Pill Announcement */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111724]/90 border border-[#202c42] text-xs text-slate-200 shadow-xl shadow-[#d2f801]/5 animate-in fade-in zoom-in-95">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d2f801] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d2f801]"></span>
          </span>
          <span className="font-extrabold text-[#d2f801]">FINSARO B2B FINTECH OS:</span>
          <span className="text-slate-300">Granular RBAC Policies &amp; Token Verification</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Main Heading */}
        <div className="max-w-4xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Next-Gen Fintech &amp; Task Infrastructure for{" "}
            <span className="bg-gradient-to-r from-[#d2f801] via-[#c6ed00] to-[#10b981] bg-clip-text text-transparent">
              Modern Enterprises.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Unify high-stakes financial operations and sprint workflows. Enforce granular role policies
            for Admins, Managers, and Members with automated cryptographic token email onboarding.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#d2f801] hover:bg-[#bce000] text-black font-black text-sm shadow-xl shadow-[#d2f801]/30 active:scale-95 transition-all cursor-pointer"
          >
            <span>Start 14-Day Free Trial</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
          <Link
            href="/tasks"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#121827] hover:bg-[#1a2236] border border-[#232e46] text-slate-200 hover:text-white font-bold text-sm transition-all cursor-pointer shadow-sm"
          >
            <Play className="w-4 h-4 text-[#d2f801] fill-[#d2f801]" />
            <span>Launch Live Sandbox</span>
          </Link>
        </div>

        {/* Live Metrics Ticker */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-5 rounded-2xl bg-[#0e1320] border border-[#1b253b] backdrop-blur-md shadow-lg">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#d2f801] tracking-tight">$184.2M+</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Pipeline Volume Managed</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#0e1320] border border-[#1b253b] backdrop-blur-md shadow-lg">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">99.99%</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Platform Uptime SLA</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#0e1320] border border-[#1b253b] backdrop-blur-md shadow-lg">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#d2f801] tracking-tight flex items-center justify-center gap-1.5">
              <span>3.2x</span>
              <span className="text-xs font-bold text-black bg-[#d2f801] px-2 py-0.5 rounded-full">+220%</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Sprint Velocity Lift</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#0e1320] border border-[#1b253b] backdrop-blur-md shadow-lg">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Bank-Grade</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">RBAC &amp; Token Auth</div>
          </div>
        </div>

        {/* Social Proof Logos */}
        <div className="pt-10 border-t border-[#182033] max-w-5xl mx-auto">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
            Trusted by modern leaders at over 5,000+ financial &amp; software organizations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-75 hover:opacity-100 transition-all">
            <div className="flex items-center gap-2 font-black text-sm tracking-tight text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d2f801]"></span> APEX CAPITAL
            </div>
            <div className="flex items-center gap-2 font-black text-sm tracking-tight text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> PLAID FINANCE
            </div>
            <div className="flex items-center gap-2 font-black text-sm tracking-tight text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> BREX WORKSPACE
            </div>
            <div className="flex items-center gap-2 font-black text-sm tracking-tight text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> MERCURY PAY
            </div>
            <div className="flex items-center gap-2 font-black text-sm tracking-tight text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d2f801]"></span> REVOLUT TEAMS
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Hero UI Preview (Fintech Mockup) */}
      <section id="preview" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-24">
        <div className="rounded-3xl border border-[#1d273f] bg-[#0c111e] p-5 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Mock Window Header */}
          <div className="flex items-center justify-between pb-5 border-b border-[#1b253b] mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-[#d2f801]"></span>
              <span className="ml-3 text-xs font-mono text-slate-400">console.pulseflow.io / workspace / rbac-v2</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-[#d2f801] bg-[#d2f801]/10 border border-[#d2f801]/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d2f801] animate-pulse"></span> Bank-Grade Encryption
              </span>
            </div>
          </div>

          {/* Interactive Role Simulator inside mockup */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#111726] border border-[#1f2b44]">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#d2f801]" />
              <span className="text-xs font-bold text-white">Interactive Console Demo: Select Role Perspective</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveRoleTab("admin")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeRoleTab === "admin"
                    ? "bg-[#d2f801] text-black shadow-lg shadow-[#d2f801]/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                👑 Super Admin
              </button>
              <button
                onClick={() => setActiveRoleTab("manager")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeRoleTab === "manager"
                    ? "bg-[#d2f801] text-black shadow-lg shadow-[#d2f801]/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                ⚡ Team Manager
              </button>
              <button
                onClick={() => setActiveRoleTab("member")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeRoleTab === "member"
                    ? "bg-[#d2f801] text-black shadow-lg shadow-[#d2f801]/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                👤 Member
              </button>
            </div>
          </div>

          {/* Mock Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Sprint Pipeline */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-[#111828] border border-[#1e2942]">
                  <div className="text-[11px] font-bold text-sky-400 uppercase">Backlog &amp; To Do</div>
                  <div className="text-xl font-extrabold text-white mt-1">14 Sprints</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">$32,400 allocated</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#111828] border border-[#1e2942]">
                  <div className="text-[11px] font-bold text-amber-400 uppercase">In Progress</div>
                  <div className="text-xl font-extrabold text-white mt-1">8 Active</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">$91,200 velocity</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#111828] border border-[#1e2942]">
                  <div className="text-[11px] font-bold text-[#d2f801] uppercase">Completed</div>
                  <div className="text-xl font-extrabold text-white mt-1">39 Delivered</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">100% SLA compliance</div>
                </div>
              </div>

              {/* Mock Tasks Table according to role */}
              <div className="rounded-2xl border border-[#1d2940] bg-[#090d16] p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-[#182236]">
                  <span className="font-bold text-slate-200">
                    {activeRoleTab === "admin"
                      ? "Organization Master Task Stream (All Users Visible)"
                      : activeRoleTab === "manager"
                      ? "Engineering & Finance Squad Pipeline"
                      : "My Assigned Execution Queue"}
                  </span>
                  <span className="text-black bg-[#d2f801] px-2.5 py-0.5 rounded-full font-extrabold text-[11px]">
                    Role Privileges: {activeRoleTab.toUpperCase()}
                  </span>
                </div>

                {/* Simulated task item 1 */}
                <div className="p-3.5 rounded-xl bg-[#111828] border border-[#1e2a42] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#d2f801]" />
                    <div>
                      <div className="font-semibold text-xs text-white">Reconcile Stripe &amp; Plaid Settlement Batch #401</div>
                      <div className="text-[11px] text-slate-400">Assigned: finance.lead@pulseflow.io • Due Today</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#d2f801]/15 text-[#d2f801] border border-[#d2f801]/30">
                    Completed
                  </span>
                </div>

                {/* Simulated task item 2 */}
                <div className="p-3.5 rounded-xl bg-[#111828] border border-[#1e2a42] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-dashed" />
                    <div>
                      <div className="font-semibold text-xs text-white">Deploy Token Verification Endpoint &amp; Rate Limiter</div>
                      <div className="text-[11px] text-slate-400">Assigned: dev.alex@pulseflow.io • Due in 2 days</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    In Progress
                  </span>
                </div>

                {/* Simulated task item 3 */}
                <div className="p-3.5 rounded-xl bg-[#111828] border border-[#1e2a42] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-sky-400" />
                    <div>
                      <div className="font-semibold text-xs text-white">Execute RBAC Role Audit for Enterprise Compliance</div>
                      <div className="text-[11px] text-slate-400">Assigned: security.admin@pulseflow.io • Due in 5 days</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
                    To Do
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Security & Role Capabilities Card */}
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#131b2e] to-[#0a0e17] border border-[#202b40] shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Role Matrix</span>
                  <span className="text-[11px] font-black text-black bg-[#d2f801] px-2.5 py-0.5 rounded-full">
                    {activeRoleTab.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#d2f801] shrink-0 stroke-[3]" />
                    <span>Create &amp; Update Personal Tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeRoleTab !== "member" ? (
                      <Check className="w-4 h-4 text-[#d2f801] shrink-0 stroke-[3]" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <span className={activeRoleTab === "member" ? "text-slate-500 line-through" : ""}>
                      View Organization-Wide Task Stream
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeRoleTab !== "member" ? (
                      <Check className="w-4 h-4 text-[#d2f801] shrink-0 stroke-[3]" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <span className={activeRoleTab === "member" ? "text-slate-500 line-through" : ""}>
                      Assign Tasks to Other Team Members
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeRoleTab === "admin" ? (
                      <Check className="w-4 h-4 text-[#d2f801] shrink-0 stroke-[3]" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <span className={activeRoleTab !== "admin" ? "text-slate-500 line-through" : ""}>
                      Admin RBAC: Promote / Demote Roles
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeRoleTab === "admin" ? (
                      <Check className="w-4 h-4 text-[#d2f801] shrink-0 stroke-[3]" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <span className={activeRoleTab !== "admin" ? "text-slate-500 line-through" : ""}>
                      Delete Any Task &amp; Manage All Users
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1f283d]">
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#d2f801] hover:bg-[#bce000] text-black font-extrabold text-xs transition-colors cursor-pointer"
                  >
                    <span>Test This In Real Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RBAC Deep Dive Section */}
      <section id="rbac" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#d2f801] uppercase tracking-widest">
            Enterprise Security Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Role-Based Access Control (RBAC) Built for Scale
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Never compromise operational safety. Distribute granular permissions across three distinct tiers
            with cryptographically enforced API validation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Super Admin Card */}
          <div className="p-7 rounded-3xl bg-[#0e1424] border border-[#d2f801]/40 shadow-xl shadow-[#d2f801]/5 space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-[#d2f801]/15 text-[#d2f801] flex items-center justify-center shadow-lg shadow-[#d2f801]/10">
              <Crown className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-[#d2f801] uppercase tracking-wider block">TIER 1</span>
              <h3 className="text-xl font-extrabold text-white mt-1">Super Admin</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full enterprise sovereignty. Authorize team invitations, reassign roles, inspect company-wide
              sprints, manually confirm email verifications, and manage audit logs.
            </p>
            <ul className="text-xs text-slate-300 space-y-2.5 pt-3 border-t border-[#1e2942]">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#d2f801] stroke-[3]" /> Full User Role Governance</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#d2f801] stroke-[3]" /> Delete &amp; Modify Any Task</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#d2f801] stroke-[3]" /> Organization Telemetry &amp; Stats</li>
            </ul>
          </div>

          {/* Manager Card */}
          <div className="p-7 rounded-3xl bg-[#0e1424] border border-amber-500/30 hover:border-amber-500/60 shadow-lg transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shadow-md shadow-amber-500/10">
              <Briefcase className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">TIER 2</span>
              <h3 className="text-xl font-extrabold text-white mt-1">Team Manager</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-velocity workflow orchestration. Coordinate cross-functional tasks, assign workloads to
              team members, update statuses, and monitor pipeline velocity.
            </p>
            <ul className="text-xs text-slate-300 space-y-2.5 pt-3 border-t border-[#1e2942]">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 stroke-[3]" /> View Team Task Pipeline</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 stroke-[3]" /> Assign Tasks to Members</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 stroke-[3]" /> Update Task Deadlines &amp; Status</li>
            </ul>
          </div>

          {/* Member Card */}
          <div className="p-7 rounded-3xl bg-[#0e1424] border border-sky-500/30 hover:border-sky-500/60 shadow-lg transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-400 flex items-center justify-center shadow-md shadow-sky-500/10">
              <Users className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-sky-400 uppercase tracking-wider block">TIER 3</span>
              <h3 className="text-xl font-extrabold text-white mt-1">Team Member</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Distraction-free personal productivity. Create individual tasks, manage statuses via Kanban,
              track deadlines, and enjoy zero access ambiguity.
            </p>
            <ul className="text-xs text-slate-300 space-y-2.5 pt-3 border-t border-[#1e2942]">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400 stroke-[3]" /> Private Task Sandbox</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400 stroke-[3]" /> Kanban &amp; List Workflow</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400 stroke-[3]" /> Tokenized Auth Security</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Token Email Verification Section */}
      <section id="auth-tokens" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-[#1d273f] bg-[#0c111e] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold text-[#d2f801] uppercase tracking-widest inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Cryptographic Email Onboarding
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                One-Time Cryptographic Tokens Dispatched on Sign Up.
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                When a team member signs up, PulseFlow immediately issues a high-entropy 32-byte security token.
                Accounts require token verification to confirm identity before role-specific policies are activated.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#121929] border border-[#1d2940] text-[#d2f801] mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">SMTP &amp; Simulated Dispatch</h4>
                    <p className="text-xs text-slate-400">Integrated with standard SMTP or logged in development for instant review.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#121929] border border-[#1d2940] text-[#d2f801] mt-0.5">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">24-Hour Expiry &amp; Single-Use</h4>
                    <p className="text-xs text-slate-400">Tokens automatically invalidate upon verification or expiry to prevent replay attacks.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Token Generator Demo */}
            <div className="p-6 rounded-2xl bg-[#090d16] border border-[#1e2a42] space-y-4">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-[#182236]">
                <span className="font-bold text-slate-300">Live Token Dispatch Simulator</span>
                <span className="text-[#d2f801] font-mono text-[11px] bg-[#d2f801]/10 px-2 py-0.5 rounded border border-[#d2f801]/30">HMAC-SHA256</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">Recipient Email:</label>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                  alex.founder@company-hq.com
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-400">Dispatched Verification Token:</label>
                  {tokenGenerated && (
                    <span className="text-[10px] font-bold text-[#d2f801] animate-in fade-in">New Token Issued!</span>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-[#d2f801]/40 text-xs font-mono font-bold text-[#d2f801] break-all select-all shadow-inner">
                  {demoToken}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={generateNewToken}
                  className="flex-1 py-2.5 px-4 rounded-full bg-[#d2f801] hover:bg-[#bce000] text-black font-extrabold text-xs transition-colors cursor-pointer shadow-md shadow-[#d2f801]/20"
                >
                  Regenerate Token
                </button>
                <Link
                  href={`/verify-email?token=${demoToken}`}
                  className="py-2.5 px-4 rounded-full bg-[#121929] hover:bg-[#1a2338] text-slate-200 border border-[#212e48] font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  Verify Link →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#d2f801] uppercase tracking-widest">
            Fintech-Grade Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered for Modern Enterprise Scale
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            From granular role hierarchies to sub-millisecond status transitions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-7 rounded-3xl bg-[#0e1424] border border-[#1c273e] space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#d2f801]/15 text-[#d2f801] flex items-center justify-center font-bold">
              <Kanban className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-extrabold text-white">Dual-Mode Kanban &amp; List</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Switch smoothly between agile Kanban swimlanes (To Do, In Progress, Completed) and high-density sorting tables.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-3xl bg-[#0e1424] border border-[#1c273e] space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#d2f801]/15 text-[#d2f801] flex items-center justify-center font-bold">
              <Shield className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-extrabold text-white">Strict Role Delegation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Admins can promote or demote team members in real-time. Built-in safeguard prevents removing the last admin.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-3xl bg-[#0e1424] border border-[#1c273e] space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#d2f801]/15 text-[#d2f801] flex items-center justify-center font-bold">
              <Server className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-extrabold text-white">Sub-Millisecond Execution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fast query resolution powered by Neon PostgreSQL with zero latency overhead across distributed regions.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Matrix */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#d2f801] uppercase tracking-widest">
            Predictable B2B Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Transparent Plans for Every Growth Stage
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Start free, upgrade as your team expands and demands enterprise RBAC governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="p-8 rounded-3xl bg-[#0e1424] border border-[#1c273e] shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-white">Starter Individual</h3>
              <p className="text-xs text-slate-400">Essential task management for developers and solo operators.</p>
              <div className="text-4xl font-extrabold text-white">$0 <span className="text-xs text-slate-400 font-normal">/ month</span></div>

              <ul className="text-xs text-slate-300 space-y-2.5 pt-4 border-t border-[#1e2942]">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#d2f801] stroke-[3]" /> Unlimited Personal Tasks</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#d2f801] stroke-[3]" /> Kanban &amp; List Views</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#d2f801] stroke-[3]" /> Token Email Verification</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="w-full py-3.5 rounded-full bg-[#121929] hover:bg-[#1a2338] text-white font-bold text-xs text-center border border-[#212e48] transition-colors block cursor-pointer"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Team Plan (Highlighted in Cyber Lime) */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#131c2f] to-[#0e1424] border-2 border-[#d2f801] shadow-2xl shadow-[#d2f801]/15 space-y-6 flex flex-col justify-between relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-[#d2f801] text-black text-[10px] font-black uppercase tracking-wider shadow-md">
              RECOMMENDED
            </span>
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-white">Pro Team</h3>
              <p className="text-xs text-slate-300">Sprint orchestration with Manager and Member roles.</p>
              <div className="text-4xl font-extrabold text-white">$29 <span className="text-xs text-slate-400 font-normal">/ user / mo</span></div>

              <ul className="text-xs text-slate-200 space-y-2.5 pt-4 border-t border-[#1e2942]">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#d2f801] stroke-[3]" /> Everything in Starter</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#d2f801] stroke-[3]" /> Team Manager RBAC Roles</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#d2f801] stroke-[3]" /> Cross-Team Task Delegation</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#d2f801] stroke-[3]" /> Sprint Velocity Metrics</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="w-full py-3.5 rounded-full bg-[#d2f801] hover:bg-[#bce000] text-black font-black text-xs text-center shadow-lg shadow-[#d2f801]/30 transition-all block cursor-pointer"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 rounded-3xl bg-[#0e1424] border border-[#1c273e] shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-white">Enterprise Sovereignty</h3>
              <p className="text-xs text-slate-400">Full Super Admin governance and customized compliance.</p>
              <div className="text-4xl font-extrabold text-white">$99 <span className="text-xs text-slate-400 font-normal">/ user / mo</span></div>

              <ul className="text-xs text-slate-300 space-y-2.5 pt-4 border-t border-[#1e2942]">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#d2f801] stroke-[3]" /> Super Admin Management</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#d2f801] stroke-[3]" /> Role Promotion &amp; Audit Logs</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#d2f801] stroke-[3]" /> Dedicated 99.99% SLA Support</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#d2f801] stroke-[3]" /> Custom SMTP Email Whitelabeling</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="w-full py-3.5 rounded-full bg-[#121929] hover:bg-[#1a2338] text-white font-bold text-xs text-center border border-[#212e48] transition-colors block cursor-pointer"
            >
              Contact Enterprise
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Conversion Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-[#111828] via-[#141d30] to-[#0d1220] border border-[#d2f801]/30 p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to Accelerate Your Team&apos;s Workflow?
            </h2>
            <p className="text-sm text-slate-300">
              Join thousands of fintechs and engineers building with secure RBAC and real-time execution.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              href="/login"
              className="w-full py-4 px-8 rounded-full bg-[#d2f801] hover:bg-[#bce000] text-black font-black text-sm transition-all shadow-xl shadow-[#d2f801]/30 cursor-pointer"
            >
              Get Started Immediately →
            </Link>
          </div>
        </div>
      </section>

      {/* Comprehensive Footer */}
      <footer className="border-t border-[#161f31] bg-[#05070a] py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-xs text-slate-400">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-xl bg-[#d2f801] flex items-center justify-center text-black font-black">
                <Layers className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-base text-white">PulseFlow B2B Fintech</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              The next-generation cloud for role-governed task management, tokenized onboarding, and financial sprint velocity.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-2 font-medium">
              <span>SOC2 Type II</span>
              <span>•</span>
              <span>256-Bit TLS</span>
              <span>•</span>
              <span>GDPR Ready</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Product</h4>
            <ul className="space-y-1.5 font-medium">
              <li><a href="#features" className="hover:text-[#d2f801] transition-colors">Kanban Engine</a></li>
              <li><a href="#rbac" className="hover:text-[#d2f801] transition-colors">RBAC Governance</a></li>
              <li><a href="#auth-tokens" className="hover:text-[#d2f801] transition-colors">Email Token Auth</a></li>
              <li><Link href="/tasks" className="hover:text-[#d2f801] transition-colors">Live Console</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Security</h4>
            <ul className="space-y-1.5 font-medium">
              <li><span className="hover:text-white cursor-pointer">JWT HS256</span></li>
              <li><span className="hover:text-white cursor-pointer">Bcrypt Salting</span></li>
              <li><span className="hover:text-white cursor-pointer">Role Isolation</span></li>
              <li><span className="hover:text-white cursor-pointer">Neon Postgres</span></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Access</h4>
            <ul className="space-y-1.5 font-medium">
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link href="/verify-email" className="hover:text-white transition-colors">Verify Token</Link></li>
              <li><Link href="/tasks" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-[#131b29] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 PulseFlow Technologies Inc. All rights reserved.</p>
          <p>Engineered for high-reliability B2B Fintech &amp; Tasks.</p>
        </div>
      </footer>
    </div>
  );
}
