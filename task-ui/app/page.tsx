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
} from "lucide-react";

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
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background radial glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-indigo-500/15 via-violet-600/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-[800px] right-[-100px] w-[500px] h-[500px] bg-emerald-500/5 blur-[130px] pointer-events-none" />
      <div className="absolute top-[1600px] left-[-100px] w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#080b11]/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 group-hover:scale-105 transition-all">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  PulseFlow
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">B2B Fintech &amp; RBAC Cloud</p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Platform</a>
            <a href="#rbac" className="hover:text-white transition-colors">RBAC Governance</a>
            <a href="#auth-tokens" className="hover:text-white transition-colors">Token Auth</a>
            <a href="#preview" className="hover:text-white transition-colors">Live Console</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-xl shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        {/* Pill Announcement */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-xl shadow-indigo-500/5 animate-in fade-in zoom-in-95">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white">v2.4 Release:</span>
          <span className="text-slate-400">Granular RBAC Policies &amp; Token-Based Email Verification</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </div>

        {/* Main Heading */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            The B2B Fintech &amp; Task OS for{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400 bg-clip-text text-transparent">
              High-Velocity Teams.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Unify high-stakes financial operations and sprint execution. Enforce role-based security
            boundaries for Admins, Managers, and Members with automated token email verification.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/30 active:scale-95 transition-all cursor-pointer"
          >
            <span>Start 14-Day Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/tasks"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0d121f] hover:bg-slate-900 border border-slate-800 text-slate-200 hover:text-white font-semibold text-sm transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" />
            <span>Launch Live Sandbox</span>
          </Link>
        </div>

        {/* Live Metrics Ticker */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-[#0d121f]/80 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">$184.2M+</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Task Velocity Tracked</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0d121f]/80 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">99.99%</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Platform Uptime SLA</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0d121f]/80 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 tracking-tight">3.2x</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Faster Sprint Execution</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0d121f]/80 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-extrabold text-violet-400 tracking-tight">Bank-Grade</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">RBAC &amp; Token Auth</div>
          </div>
        </div>

        {/* Social Proof Logos */}
        <div className="pt-8 border-t border-slate-800/60 max-w-5xl mx-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
            Trusted by modern leaders at over 5,000+ financial &amp; software organizations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2 font-bold text-base tracking-tight text-white">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span> APEX CAPITAL
            </div>
            <div className="flex items-center gap-2 font-bold text-base tracking-tight text-white">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span> PLAID FINANCE
            </div>
            <div className="flex items-center gap-2 font-bold text-base tracking-tight text-white">
              <span className="w-3 h-3 rounded-full bg-sky-500"></span> BREX WORKSPACE
            </div>
            <div className="flex items-center gap-2 font-bold text-base tracking-tight text-white">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span> MERCURY PAY
            </div>
            <div className="flex items-center gap-2 font-bold text-base tracking-tight text-white">
              <span className="w-3 h-3 rounded-full bg-violet-500"></span> REVOLUT TEAMS
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Hero UI Preview (Fintech Mockup) */}
      <section id="preview" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-24">
        <div className="rounded-3xl border border-slate-800 bg-[#0d121f] p-4 sm:p-7 shadow-2xl relative overflow-hidden">
          {/* Mock Window Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="ml-3 text-xs font-mono text-slate-400">console.pulseflow.io / workspace / rbac-v2</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Telemetry Active
              </span>
            </div>
          </div>

          {/* Interactive Role Simulator inside mockup */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#090d16] border border-slate-800">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-white">Interactive Preview: Switch Active Role</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveRoleTab("admin")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeRoleTab === "admin"
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                👑 Super Admin
              </button>
              <button
                onClick={() => setActiveRoleTab("manager")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeRoleTab === "manager"
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                ⚡ Team Manager
              </button>
              <button
                onClick={() => setActiveRoleTab("member")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeRoleTab === "member"
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
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
                <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="text-[11px] font-semibold text-sky-400 uppercase">Backlog &amp; To Do</div>
                  <div className="text-xl font-bold text-white mt-1">14 Sprints</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">$32,400 allocated</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="text-[11px] font-semibold text-amber-400 uppercase">In Progress</div>
                  <div className="text-xl font-bold text-white mt-1">8 Active</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">$91,200 velocity</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="text-[11px] font-semibold text-emerald-400 uppercase">Completed</div>
                  <div className="text-xl font-bold text-white mt-1">39 Delivered</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">100% SLA compliance</div>
                </div>
              </div>

              {/* Mock Tasks Table according to role */}
              <div className="rounded-2xl border border-slate-800 bg-[#090d16] p-4 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
                  <span className="font-bold text-slate-200">
                    {activeRoleTab === "admin"
                      ? "Organization Master Task Stream (All Users Visible)"
                      : activeRoleTab === "manager"
                      ? "Engineering & Finance Squad Pipeline"
                      : "My Assigned Execution Queue"}
                  </span>
                  <span className="text-indigo-400 font-semibold text-[11px]">
                    Role Privileges: {activeRoleTab.toUpperCase()}
                  </span>
                </div>

                {/* Simulated task item 1 */}
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-xs text-white">Reconcile Stripe &amp; Plaid Settlement Batch #401</div>
                      <div className="text-[11px] text-slate-400">Assigned: finance.lead@pulseflow.io • Due Today</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                    Completed
                  </span>
                </div>

                {/* Simulated task item 2 */}
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-dashed" />
                    <div>
                      <div className="font-semibold text-xs text-white">Deploy Token Verification Endpoint &amp; Rate Limiter</div>
                      <div className="text-[11px] text-slate-400">Assigned: dev.alex@pulseflow.io • Due in 2 days</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300">
                    In Progress
                  </span>
                </div>

                {/* Simulated task item 3 */}
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-sky-400" />
                    <div>
                      <div className="font-semibold text-xs text-white">Execute RBAC Role Audit for Enterprise Compliance</div>
                      <div className="text-[11px] text-slate-400">Assigned: security.admin@pulseflow.io • Due in 5 days</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/15 text-sky-300">
                    To Do
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Security & Role Capabilities Card */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#131b2e] to-[#090d16] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Role Matrix</span>
                  <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    {activeRoleTab.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Create &amp; Update Personal Tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeRoleTab !== "member" ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <span className={activeRoleTab === "member" ? "text-slate-500 line-through" : ""}>
                      View Organization-Wide Task Stream
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeRoleTab !== "member" ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <span className={activeRoleTab === "member" ? "text-slate-500 line-through" : ""}>
                      Assign Tasks to Other Team Members
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeRoleTab === "admin" ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <span className={activeRoleTab !== "admin" ? "text-slate-500 line-through" : ""}>
                      Admin RBAC: Promote / Demote Roles
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeRoleTab === "admin" ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <span className={activeRoleTab !== "admin" ? "text-slate-500 line-through" : ""}>
                      Delete Any Task &amp; Manage All Users
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    <span>Test This In Real Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
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
          <div className="p-6 rounded-3xl bg-[#0d121f] border border-violet-500/30 hover:border-violet-500/60 transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/15 text-violet-400 flex items-center justify-center shadow-lg shadow-violet-500/10">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider block">TIER 1</span>
              <h3 className="text-xl font-bold text-white mt-1">Super Admin</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full enterprise sovereignty. Authorize team invitations, reassign roles, inspect company-wide
              sprints, manually confirm email verifications, and manage audit logs.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> Full User Role Governance</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> Delete &amp; Modify Any Task</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> Organization Telemetry &amp; Stats</li>
            </ul>
          </div>

          {/* Manager Card */}
          <div className="p-6 rounded-3xl bg-[#0d121f] border border-amber-500/30 hover:border-amber-500/60 transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">TIER 2</span>
              <h3 className="text-xl font-bold text-white mt-1">Team Manager</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-velocity workflow orchestration. Coordinate cross-functional tasks, assign workloads to
              team members, update statuses, and monitor pipeline velocity.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> View Team Task Pipeline</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Assign Tasks to Members</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Update Task Deadlines &amp; Status</li>
            </ul>
          </div>

          {/* Member Card */}
          <div className="p-6 rounded-3xl bg-[#0d121f] border border-sky-500/30 hover:border-sky-500/60 transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/10">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">TIER 3</span>
              <h3 className="text-xl font-bold text-white mt-1">Team Member</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Distraction-free personal productivity. Create individual tasks, manage statuses via Kanban,
              track deadlines, and enjoy zero access ambiguity.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400" /> Private Task Sandbox</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400" /> Kanban &amp; List Workflow</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400" /> Tokenized Auth Security</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Token Email Verification Section */}
      <section id="auth-tokens" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-slate-800 bg-[#0d121f] p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
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
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">SMTP &amp; Simulated Dispatch</h4>
                    <p className="text-xs text-slate-400">Integrated with standard SMTP or logged in development for instant review.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 mt-0.5">
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
            <div className="p-6 rounded-2xl bg-[#090d16] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                <span className="font-bold text-slate-300">Live Token Dispatch Simulator</span>
                <span className="text-emerald-400 font-mono text-[11px]">HMAC-SHA256</span>
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
                    <span className="text-[10px] font-bold text-emerald-400 animate-in fade-in">New Token Issued!</span>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/40 text-xs font-mono text-indigo-300 break-all select-all">
                  {demoToken}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={generateNewToken}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Regenerate Token
                </button>
                <Link
                  href={`/verify-email?token=${demoToken}`}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer text-center"
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
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Fintech-Grade Product Architecture
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
          <div className="p-6 rounded-3xl bg-[#0d121f] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Kanban className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Dual-Mode Kanban &amp; List</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Switch smoothly between agile Kanban swimlanes (To Do, In Progress, Completed) and high-density sorting tables.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-[#0d121f] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Strict Role Delegation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Admins can promote or demote team members in real-time. Built-in safeguard prevents removing the last admin.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-[#0d121f] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Real-Time Health Telemetry</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatic ping monitoring for database connections and API endpoints with instant reconnect indicators.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Matrix */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
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
          <div className="p-8 rounded-3xl bg-[#0d121f] border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Starter Individual</h3>
              <p className="text-xs text-slate-400">Essential task management for developers and solo operators.</p>
              <div className="text-4xl font-extrabold text-white">$0 <span className="text-xs text-slate-400 font-normal">/ month</span></div>

              <ul className="text-xs text-slate-300 space-y-2.5 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited Personal Tasks</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Kanban &amp; List Views</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Token Email Verification</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-colors block cursor-pointer"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Team Plan (Highlighted) */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#131b2e] to-[#0d121f] border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 space-y-6 flex flex-col justify-between relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
              MOST POPULAR
            </span>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Pro Team</h3>
              <p className="text-xs text-slate-300">Sprint orchestration with Manager and Member roles.</p>
              <div className="text-4xl font-extrabold text-white">$29 <span className="text-xs text-slate-400 font-normal">/ user / mo</span></div>

              <ul className="text-xs text-slate-200 space-y-2.5 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Everything in Starter</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Team Manager RBAC Roles</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Cross-Team Task Delegation</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Sprint Velocity Metrics</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-xs text-center shadow-lg shadow-indigo-500/25 transition-all block cursor-pointer"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 rounded-3xl bg-[#0d121f] border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Enterprise Sovereignty</h3>
              <p className="text-xs text-slate-400">Full Super Admin governance and customized compliance.</p>
              <div className="text-4xl font-extrabold text-white">$99 <span className="text-xs text-slate-400 font-normal">/ user / mo</span></div>

              <ul className="text-xs text-slate-300 space-y-2.5 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Super Admin Management</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Role Promotion &amp; Audit Logs</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Dedicated 99.99% SLA Support</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Custom SMTP Email Whitelabeling</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-colors block cursor-pointer"
            >
              Contact Enterprise
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Conversion Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900/50 via-violet-900/40 to-slate-900/80 border border-indigo-500/30 p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
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
              className="w-full py-3.5 px-6 rounded-xl bg-white text-slate-950 font-extrabold text-sm hover:bg-slate-200 transition-colors shadow-xl cursor-pointer"
            >
              Get Started Immediately →
            </Link>
          </div>
        </div>
      </section>

      {/* Comprehensive Footer */}
      <footer className="border-t border-slate-800/80 bg-[#06080d] py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-xs text-slate-400">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white">PulseFlow B2B Fintech</span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              The next-generation cloud for role-governed task management, tokenized onboarding, and financial sprint velocity.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-2">
              <span>SOC2 Type II</span>
              <span>•</span>
              <span>256-Bit TLS</span>
              <span>•</span>
              <span>GDPR Ready</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Product</h4>
            <ul className="space-y-1.5">
              <li><a href="#features" className="hover:text-white transition-colors">Kanban Engine</a></li>
              <li><a href="#rbac" className="hover:text-white transition-colors">RBAC Governance</a></li>
              <li><a href="#auth-tokens" className="hover:text-white transition-colors">Email Token Auth</a></li>
              <li><Link href="/tasks" className="hover:text-white transition-colors">Live Console</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Security</h4>
            <ul className="space-y-1.5">
              <li><span className="hover:text-white cursor-pointer">JWT HS256</span></li>
              <li><span className="hover:text-white cursor-pointer">Bcrypt Salting</span></li>
              <li><span className="hover:text-white cursor-pointer">Role Isolation</span></li>
              <li><span className="hover:text-white cursor-pointer">Neon Postgres</span></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Access</h4>
            <ul className="space-y-1.5">
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link href="/verify-email" className="hover:text-white transition-colors">Verify Token</Link></li>
              <li><Link href="/tasks" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 PulseFlow Technologies Inc. All rights reserved.</p>
          <p>Engineered for high-reliability B2B Fintech &amp; Tasks.</p>
        </div>
      </footer>
    </div>
  );
}
