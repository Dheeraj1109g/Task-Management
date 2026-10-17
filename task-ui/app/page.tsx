"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Layers,
  ShieldCheck,
  Mail,
  ArrowRight,
  CheckCircle2,
  Play,
  Key,
  Users,
  Briefcase,
  Check,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeContext";

interface MockTask {
  id: string;
  title: string;
  assignee: string;
  due: string;
  status: "Completed" | "In Progress" | "To Do";
  scope: "all" | "team" | "personal";
}

const SAMPLE_TASKS: MockTask[] = [
  {
    id: "PF-401",
    title: "Reconcile Stripe and settlement batch 401",
    assignee: "finance.lead@pulseflow.io",
    due: "Today",
    status: "Completed",
    scope: "all",
  },
  {
    id: "PF-402",
    title: "Deploy token verification endpoint and rate limiter",
    assignee: "dev.alex@pulseflow.io",
    due: "In 2 days",
    status: "In Progress",
    scope: "team",
  },
  {
    id: "PF-403",
    title: "Audit role assignment logs for quarterly compliance",
    assignee: "security.admin@pulseflow.io",
    due: "In 5 days",
    status: "To Do",
    scope: "all",
  },
  {
    id: "PF-404",
    title: "Review personal queue items for current sprint",
    assignee: "member.dan@pulseflow.io",
    due: "Tomorrow",
    status: "In Progress",
    scope: "personal",
  },
];

export default function LandingPage() {
  const [activeRoleTab, setActiveRoleTab] = useState<"admin" | "manager" | "member">("admin");
  const [demoToken, setDemoToken] = useState("sec_tok_98f4e2b071a39bc8d41e");
  const [tokenGenerated, setTokenGenerated] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(false);

  const generateNewToken = () => {
    const chars = "abcdef0123456789";
    let res = "sec_tok_";
    for (let i = 0; i < 20; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    setDemoToken(res);
    setTokenGenerated(true);
    setTokenVerified(false);
    setTimeout(() => setTokenGenerated(false), 2000);
  };

  const verifyDemoToken = () => {
    setTokenVerified(true);
  };

  const visibleTasks = SAMPLE_TASKS.filter((task) => {
    if (activeRoleTab === "admin") return true;
    if (activeRoleTab === "manager") return task.scope === "team" || task.scope === "all";
    return task.scope === "personal" || task.assignee.includes("member");
  });

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden bg-[#090c13] text-[#f1f3f7] flex flex-col font-sans selection:bg-[#d2f801] selection:text-black">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#090c13] w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 animate-enter shrink-0">
            <div className="h-9 w-9 rounded-lg bg-[#d2f801] flex items-center justify-center text-black font-bold">
              <Layers className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg tracking-tight text-white">PulseFlow</span>
              <span className="text-[13px] text-slate-400 hidden sm:inline">Task Infrastructure</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-base text-slate-300">
            <a href="#console" className="hover:text-white transition-colors">Console</a>
            <a href="#architecture" className="hover:text-white transition-colors">Governance</a>
            <a href="#verification" className="hover:text-white transition-colors">Verification</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-base text-slate-300 hover:text-white transition-colors font-medium px-2 py-1"
            >
              Sign In
            </Link>
            <Link
              href="/tasks"
              className="px-3.5 py-2 rounded-lg bg-[#d2f801] hover:bg-[#bce000] text-black font-semibold text-sm transition-colors whitespace-nowrap animate-enter"
            >
              <span className="sm:hidden">Sandbox</span>
              <span className="hidden sm:inline">Launch Sandbox</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-6 lg:px-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Claim, Copy, and CTAs */}
          <div className="lg:col-span-5 space-y-8 animate-enter">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Role access for sprint teams.
              </h1>
              <p className="text-base text-slate-300 leading-relaxed max-w-xl">
                Enforce granular policies across administrators, managers, and members with automated cryptographic token onboarding and verified sprint delivery.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/tasks"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#d2f801] hover:bg-[#bce000] text-black font-semibold text-base transition-colors text-center animate-enter"
              >
                <Play className="w-4 h-4 text-black fill-black" />
                <span>Launch Live Sandbox</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#141b2b] hover:bg-[#1a2337] text-white font-medium text-base transition-colors text-center animate-enter"
              >
                <span>Start 14-Day Free Trial</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>

            <div className="pt-8 grid grid-cols-2 gap-6 text-slate-300">
              <div className="animate-enter">
                <div className="text-3xl font-bold text-white tracking-tight">$184.2M</div>
                <div className="text-base text-slate-400 mt-1">Pipeline volume managed</div>
              </div>
              <div className="animate-enter">
                <div className="text-3xl font-bold text-white tracking-tight">99.99%</div>
                <div className="text-base text-slate-400 mt-1">Uptime SLA commitment</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Product Fragment (Live Instrument) */}
          <div className="lg:col-span-7 w-full animate-enter" id="console">
            <div
              data-ui="true"
              className="rounded-2xl bg-[#101626] p-6 space-y-6 min-h-[380px]"
            >
              {/* Console Top Bar */}
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-700" />
                  <span className="w-3 h-3 rounded-full bg-slate-700" />
                  <span className="w-3 h-3 rounded-full bg-slate-700" />
                  <span className="ml-2 text-sm text-slate-400 font-medium">
                    console.pulseflow.io / workspace / rbac-v2
                  </span>
                </div>
                <span className="text-sm text-[#d2f801] font-semibold bg-[#d2f801]/10 px-2.5 py-1 rounded">
                  Policy Enforced
                </span>
              </div>

              {/* Interactive Role Selector Switcher */}
              <div className="p-4 rounded-xl bg-[#151d32] space-y-3">
                <div className="text-sm font-semibold text-slate-300">
                  Select Perspective to Test RBAC Permissions:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setActiveRoleTab("admin")}
                    className={`py-2 px-3 rounded-lg text-sm font-bold transition-colors cursor-pointer text-center ${
                      activeRoleTab === "admin"
                        ? "bg-[#d2f801] text-black"
                        : "bg-[#1b253f] text-slate-300 hover:text-white"
                    }`}
                  >
                    Super Admin
                  </button>
                  <button
                    onClick={() => setActiveRoleTab("manager")}
                    className={`py-2 px-3 rounded-lg text-sm font-bold transition-colors cursor-pointer text-center ${
                      activeRoleTab === "manager"
                        ? "bg-[#d2f801] text-black"
                        : "bg-[#1b253f] text-slate-300 hover:text-white"
                    }`}
                  >
                    Team Manager
                  </button>
                  <button
                    onClick={() => setActiveRoleTab("member")}
                    className={`py-2 px-3 rounded-lg text-sm font-bold transition-colors cursor-pointer text-center ${
                      activeRoleTab === "member"
                        ? "bg-[#d2f801] text-black"
                        : "bg-[#1b253f] text-slate-300 hover:text-white"
                    }`}
                  >
                    Member
                  </button>
                </div>
              </div>

              {/* Role Permissions Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-[#151d32] flex items-center justify-between">
                  <span className="text-slate-300">Inspect full organization pipeline</span>
                  {activeRoleTab !== "member" ? (
                    <span className="text-sm font-semibold text-[#d2f801]">Permitted</span>
                  ) : (
                    <span className="text-sm text-slate-500">Restricted</span>
                  )}
                </div>
                <div className="p-3 rounded-lg bg-[#151d32] flex items-center justify-between">
                  <span className="text-slate-300">Assign workloads to members</span>
                  {activeRoleTab !== "member" ? (
                    <span className="text-sm font-semibold text-[#d2f801]">Permitted</span>
                  ) : (
                    <span className="text-sm text-slate-500">Restricted</span>
                  )}
                </div>
                <div className="p-3 rounded-lg bg-[#151d32] flex items-center justify-between">
                  <span className="text-slate-300">Promote and demote user roles</span>
                  {activeRoleTab === "admin" ? (
                    <span className="text-sm font-semibold text-[#d2f801]">Permitted</span>
                  ) : (
                    <span className="text-sm text-slate-500">Restricted</span>
                  )}
                </div>
                <div className="p-3 rounded-lg bg-[#151d32] flex items-center justify-between">
                  <span className="text-slate-300">Manage cryptographic token settings</span>
                  {activeRoleTab === "admin" ? (
                    <span className="text-sm font-semibold text-[#d2f801]">Permitted</span>
                  ) : (
                    <span className="text-sm text-slate-500">Restricted</span>
                  )}
                </div>
              </div>

              {/* Live Filtered Tasks Feed */}
              <div className="p-4 rounded-xl bg-[#151d32] space-y-3">
                <div className="flex items-center justify-between text-sm text-slate-400 pb-1">
                  <span>Stream ({visibleTasks.length} visible for {activeRoleTab})</span>
                  <span>Filtered by RBAC Scope</span>
                </div>
                <div className="space-y-3">
                  {visibleTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between gap-3 text-sm py-1"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#d2f801] shrink-0" />
                        <div>
                          <div className="font-semibold text-white">{task.title}</div>
                          <div className="text-slate-400 text-sm">{task.assignee} • Due {task.due}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-sm font-medium bg-[#1e2942] text-slate-300 shrink-0">
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proof / Client Row */}
      <section className="py-16 px-6 lg:px-10 max-w-7xl mx-auto w-full animate-enter">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <p className="text-base font-semibold text-slate-400">
            Trusted across production financial infrastructure:
          </p>
          <div className="flex flex-wrap items-center gap-8 sm:gap-12 text-base font-bold tracking-tight text-slate-300">
            <span className="animate-enter">Apex Capital</span>
            <span className="animate-enter">Plaid Finance</span>
            <span className="animate-enter">Brex Workspace</span>
            <span className="animate-enter">Mercury Pay</span>
            <span className="animate-enter">Revolut Teams</span>
          </div>
        </div>
      </section>

      {/* Section 2: Architecture & Governance Breakdown */}
      <section id="architecture" className="py-24 px-6 lg:px-10 max-w-7xl mx-auto w-full space-y-16 animate-enter">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Authentic Archival Image and Principle */}
          <div className="lg:col-span-5 space-y-6 animate-enter">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Three operational tiers.
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Distribute authority without ambiguity. Every request is verified by policy middleware against user permissions stored in relational tables.
            </p>

            <div className="rounded-2xl overflow-hidden bg-[#101626] p-4 space-y-3 animate-enter">
              <div className="relative w-full h-64 rounded-xl overflow-hidden bg-slate-900">
                <Image
                  src="/assets/vault-key.jpg"
                  alt="Vault Key, stone sculpture, 14th century, The Metropolitan Museum of Art"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="text-sm text-slate-400">
                Vault Key (14th century), The Metropolitan Museum of Art, Public Domain CC0.
              </div>
            </div>
          </div>

          {/* Right Column: Asymmetric Tier Structure (Unified Surface, not identical icon cards) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Super Admin Tier: Prominent Sovereign Card */}
            <div className="p-8 rounded-2xl bg-[#101626] space-y-4 animate-enter">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#d2f801]/10 text-[#d2f801] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Super Admin</h3>
                    <p className="text-sm text-slate-400">Enterprise Sovereignty &amp; Governance</p>
                  </div>
                </div>
                <span className="text-sm text-[#d2f801] font-semibold bg-[#d2f801]/10 px-3 py-1 rounded">
                  Tier 1
                </span>
              </div>
              <p className="text-base text-slate-300 leading-relaxed">
                Full authority over workspace users. Promote or demote team members, inspect audit histories, configure security endpoints, and delete sensitive tasks.
              </p>
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d2f801]" />
                  <span>Assign and revoke user roles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d2f801]" />
                  <span>Delete tasks and override statuses</span>
                </div>
              </div>
            </div>

            {/* Split Row for Manager & Member: Two distinct layout columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#131b2e] space-y-3 animate-enter">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Team Manager</h3>
                  <span className="text-sm text-slate-300 font-semibold bg-[#1c2742] px-2.5 py-0.5 rounded">
                    Tier 2
                  </span>
                </div>
                <p className="text-base text-slate-300 leading-relaxed">
                  Sprint coordination across squad pipelines. Distribute task ownership and monitor deadline completion.
                </p>
                <div className="pt-1 text-sm text-slate-400">
                  Includes delegation tools and sprint velocity metrics.
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0d1320] space-y-3 animate-enter">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Team Member</h3>
                  <span className="text-sm text-slate-300 font-semibold bg-[#172136] px-2.5 py-0.5 rounded">
                    Tier 3
                  </span>
                </div>
                <p className="text-base text-slate-300 leading-relaxed">
                  Focused individual execution. Members manage personal backlog items and update progress through Kanban.
                </p>
                <div className="pt-1 text-sm text-slate-400">
                  Includes private sandboxes and tokenized authentication.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Cryptographic Token Verification */}
      <section id="verification" className="py-24 px-6 lg:px-10 max-w-7xl mx-auto w-full animate-enter">
        <div className="p-8 lg:p-12 rounded-2xl bg-[#101626]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6 animate-enter">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Cryptographic token dispatch.
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                When a user registers, PulseFlow generates an entropy-dense token linked to their account record. Verification confirms ownership before role-based capabilities activate.
              </p>

              <div className="space-y-4 text-base text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-[#172036] text-[#d2f801] mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">SMTP and sandbox logging</div>
                    <div className="text-sm text-slate-400 mt-0.5">Dispatched via production mailers or displayed directly for development testing.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-[#172036] text-[#d2f801] mt-0.5">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">24-hour expiration window</div>
                    <div className="text-sm text-slate-400 mt-0.5">Tokens automatically expire after 24 hours and invalidate immediately once claimed.</div>
                  </div>
                </div>
              </div>

              {/* Large Archival Image: Louis Sullivan Vault Pattern */}
              <div className="rounded-xl overflow-hidden bg-slate-900/60 p-4 space-y-2 animate-enter">
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-slate-800">
                  <Image
                    src="/assets/schiller-building-later-garrick-theater-sections-of.jpg"
                    alt="Sections of Star-Pod Design from Proscenium Vault, Louis Sullivan, Art Institute of Chicago"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
                <div className="text-sm text-slate-400">
                  Vault Pattern Study (1892), Louis Sullivan, Art Institute of Chicago, Public Domain CC0.
                </div>
              </div>
            </div>

            {/* Token Simulator Widget */}
            <div className="lg:col-span-6 animate-enter" data-ui="true">
              <div className="p-6 rounded-xl bg-[#090c13] space-y-4 min-h-[300px]">
                <div className="flex items-center justify-between text-sm pb-2">
                  <span className="font-bold text-slate-200">Interactive Token Dispatcher</span>
                  <span className="text-[#d2f801] text-sm font-semibold">HMAC-SHA256</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400">Recipient Account:</label>
                  <div className="p-3 rounded-lg bg-[#141b2c] text-sm text-slate-300">
                    lead.engineer@company-hq.com
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-400">Dispatched Token Payload:</label>
                    {tokenGenerated && (
                      <span className="text-sm text-[#d2f801] font-semibold">Regenerated</span>
                    )}
                  </div>
                  <div className="p-3 rounded-lg bg-[#141b2c] text-sm text-[#d2f801] font-semibold break-all select-all">
                    {demoToken}
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={generateNewToken}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-[#1b253f] hover:bg-[#233052] text-white font-semibold text-sm transition-colors cursor-pointer text-center"
                  >
                    Regenerate Payload
                  </button>
                  <button
                    onClick={verifyDemoToken}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-[#d2f801] hover:bg-[#bce000] text-black font-semibold text-sm transition-colors cursor-pointer text-center"
                  >
                    {tokenVerified ? "Token Verified Valid" : "Verify Token Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Pricing Menu (dealt blueprint: pricing-menu-list) */}
      <section id="pricing" className="py-24 px-6 lg:px-10 max-w-7xl mx-auto w-full space-y-12 animate-enter">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-3 animate-enter">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Transparent plans.
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              All tiers include PostgreSQL persistence, email token verification, and real-time task updates.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {/* Starter Row */}
            <div className="p-6 rounded-2xl bg-[#101626] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-enter">
              <div className="space-y-1 max-w-md">
                <div className="text-lg font-bold text-white">Starter Individual</div>
                <div className="text-base text-slate-300">
                  Unlimited personal tasks, Kanban boards, and cryptographic email verification.
                </div>
              </div>
              <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-3">
                <div className="text-2xl font-bold text-white tabular-nums">$0 <span className="text-base font-normal text-slate-400">/ mo</span></div>
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-lg bg-[#182136] hover:bg-[#212d48] text-white font-semibold text-sm transition-colors text-center"
                >
                  Start Free
                </Link>
              </div>
            </div>

            {/* Pro Team Row */}
            <div className="p-6 rounded-2xl bg-[#151d32] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-enter">
              <div className="space-y-1 max-w-md">
                <div className="text-lg font-bold text-white">Pro Team</div>
                <div className="text-base text-slate-200">
                  Team Manager delegation permissions, squad pipeline oversight, and sprint velocity telemetry.
                </div>
              </div>
              <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-3">
                <div className="text-2xl font-bold text-white tabular-nums">$29 <span className="text-base font-normal text-slate-400">/ user / mo</span></div>
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-lg bg-[#d2f801] hover:bg-[#bce000] text-black font-semibold text-sm transition-colors text-center"
                >
                  Start 14-Day Trial
                </Link>
              </div>
            </div>

            {/* Enterprise Row */}
            <div className="p-6 rounded-2xl bg-[#101626] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-enter">
              <div className="space-y-1 max-w-md">
                <div className="text-lg font-bold text-white">Enterprise Sovereignty</div>
                <div className="text-base text-slate-300">
                  Super Admin role governance, promotion audit logs, custom SMTP, and 99.99% uptime guarantee.
                </div>
              </div>
              <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-3">
                <div className="text-2xl font-bold text-white tabular-nums">$99 <span className="text-base font-normal text-slate-400">/ user / mo</span></div>
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-lg bg-[#182136] hover:bg-[#212d48] text-white font-semibold text-sm transition-colors text-center"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Closing Section */}
      <section className="py-24 px-6 lg:px-10 max-w-7xl mx-auto w-full text-center space-y-6 animate-enter">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            Deploy role-governed task execution.
          </h2>
          <p className="text-base text-slate-300">
            Provision workspaces with strict access policies and automated token email onboarding.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/tasks"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-[#d2f801] hover:bg-[#bce000] text-black font-semibold text-base transition-colors cursor-pointer animate-enter"
          >
            <span>Launch Live Sandbox</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </section>

      {/* Footer: A single quiet line */}
      <footer className="mt-auto py-12 px-6 lg:px-10 max-w-7xl mx-auto w-full text-base text-slate-400">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">PulseFlow</span>
            <span>·</span>
            <span>Task Infrastructure</span>
          </div>

          <div className="flex items-center gap-6 text-slate-300 text-sm">
            <a href="#console" className="hover:text-white transition-colors">Console</a>
            <a href="#architecture" className="hover:text-white transition-colors">Governance</a>
            <a href="#verification" className="hover:text-white transition-colors">Verification</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>

          <div className="text-slate-400 text-sm">
            © 2026 PulseFlow Technologies Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}
