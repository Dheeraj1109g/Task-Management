"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Layers,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Crown,
  Briefcase,
  User as UserIcon,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { login, register, getToken, checkBackendHealth, demoLogin, verifyEmail, UserRole } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { ThemeToggle } from "@/components/ThemeContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("member");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string>(() =>
    searchParams.get("expired") === "1"
      ? "Your session has expired. Please sign in again."
      : ""
  );
  const [loading, setLoading] = useState(false);

  // Registration verification popup state
  const [issuedToken, setIssuedToken] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [verifyingToken, setVerifyingToken] = useState(false);

  useEffect(() => {
    if (getToken()) {
      router.replace("/tasks");
    }
  }, [router]);

  const handleDemoSignIn = async (role: UserRole) => {
    setError("");
    setLoading(true);
    try {
      await demoLogin(role);
      showToast(`Welcome! Signed in as Demo ${role.toUpperCase()}`, "success");
      router.push("/tasks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in to demo account");
    } finally {
      setLoading(false);
    }
  };

  const handleDirectVerify = async () => {
    if (!issuedToken) return;
    setVerifyingToken(true);
    try {
      await verifyEmail(issuedToken);
      showToast("Email verified successfully! Entering workspace...", "success");
      await login(registeredEmail, password);
      router.push("/tasks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      setVerifyingToken(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        const regRes = await register(email.trim(), password, selectedRole);
        if (regRes.verification_token) {
          setIssuedToken(regRes.verification_token);
          setRegisteredEmail(email.trim());
          showToast("Account created with verification token!", "success");
          return;
        }
      }
      await login(email.trim(), password);
      showToast("Welcome to PulseFlow!", "success");
      router.push("/tasks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link
          href="/"
          className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#d2f801] ring-1 ring-black/10 mb-2 group transition-transform active:scale-95 text-black"
        >
          <Layers className="w-7 h-7 text-black stroke-[2.5]" />
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white flex items-center justify-center gap-2">
          PulseFlow
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {mode === "login"
            ? "Sign in to access your role-governed task console."
            : "Create an enterprise account with token authentication."}
        </p>
      </div>

      {/* Quick 1-Click Demo Accounts */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#1c273e] bg-white dark:bg-[#0c101a] p-3.5">
        <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>One-Click Demo Roles (Instant Access):</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleDemoSignIn("admin")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#d2f801]/25 dark:bg-[#d2f801]/15 hover:bg-[#d2f801]/40 dark:hover:bg-[#d2f801]/25 border border-[#bfe700] dark:border-[#d2f801]/30 text-slate-950 dark:text-[#d2f801] transition-colors text-xs font-bold cursor-pointer active:scale-95"
          >
            <Crown className="w-4 h-4 mb-0.5 text-slate-900 dark:text-[#d2f801]" />
            <span>Admin</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleDemoSignIn("manager")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-300 transition-colors text-xs font-bold cursor-pointer active:scale-95"
          >
            <Briefcase className="w-4 h-4 mb-0.5 text-amber-600 dark:text-amber-400" />
            <span>Manager</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleDemoSignIn("member")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50 border border-sky-200 dark:border-sky-800/50 text-sky-900 dark:text-sky-300 transition-colors text-xs font-bold cursor-pointer active:scale-95"
          >
            <UserIcon className="w-4 h-4 mb-0.5 text-sky-600 dark:text-sky-400" />
            <span>Member</span>
          </button>
        </div>
      </div>

      {/* Card Form */}
      <div className="rounded-3xl border border-slate-200 dark:border-[#1c273e] bg-white dark:bg-[#0c101a] p-6 sm:p-8 space-y-6">
        {/* Token Verification Alert after register */}
        {issuedToken ? (
          <div className="space-y-4 animate-in fade-in zoom-in-95">
            <div className="p-4 rounded-2xl bg-lime-50 dark:bg-[#11170d] border border-lime-200 dark:border-[#243314] text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#d2f801] text-black flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-extrabold text-slate-950 dark:text-white">Email Verification Token Dispatched</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                We generated a secure cryptographic token for <strong className="text-slate-950 dark:text-white">{registeredEmail}</strong>.
              </p>
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#07090e] border border-slate-200 dark:border-[#1c273e] text-xs text-slate-950 dark:text-[#d2f801] font-bold break-all select-all">
                <code>{issuedToken}</code>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDirectVerify}
              disabled={verifyingToken}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#d2f801] hover:bg-[#bce000] text-black font-extrabold text-sm active:scale-95 transition-colors cursor-pointer"
            >
              {verifyingToken ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Activating Account...</span>
                </>
              ) : (
                <>
                  <span>Verify Email &amp; Open Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={async () => {
                await login(registeredEmail, password);
                router.push("/tasks");
              }}
              className="w-full py-2.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors cursor-pointer text-center"
            >
              Skip verification for now →
            </button>
          </div>
        ) : (
          <>
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-[#07090e] border border-slate-200 dark:border-[#1c273e]">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === "login"
                    ? "bg-slate-950 dark:bg-white text-white dark:text-black shadow-xs font-extrabold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === "register"
                    ? "bg-slate-950 dark:bg-white text-white dark:text-black shadow-xs font-extrabold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <div className="flex-1 font-semibold">{error}</div>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-[#1c273e] bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-[#d2f801] focus:bg-white dark:focus:bg-[#07090e] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px]">Min. 8 characters</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-[#1c273e] bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-[#d2f801] focus:bg-white dark:focus:bg-[#07090e] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password & Role Picker (on register) */}
              {mode === "register" && (
                <>
                  <div className="space-y-1.5 animate-in fade-in">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <ShieldCheck className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-[#1c273e] bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-[#d2f801] focus:bg-white dark:focus:bg-[#07090e] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 animate-in fade-in">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Select Organization Role
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                      className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-[#1c273e] bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-[#d2f801] focus:bg-white dark:focus:bg-[#07090e] cursor-pointer"
                    >
                      <option value="member" className="bg-white dark:bg-[#0d121f] text-slate-900 dark:text-white">Member (Individual Workflow)</option>
                      <option value="manager" className="bg-white dark:bg-[#0d121f] text-slate-900 dark:text-white">Manager (Sprint &amp; Team Oversight)</option>
                      <option value="admin" className="bg-white dark:bg-[#0d121f] text-slate-900 dark:text-white">Admin (Full Governance &amp; Security)</option>
                    </select>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#d2f801] hover:bg-[#bce000] text-black font-extrabold text-sm active:scale-[0.98] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === "login" ? "Sign In" : "Create Account & Issue Token"}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            {/* Quick toggle footer */}
            <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              {mode === "login" ? (
                <p>
                  Don&apos;t have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setError("");
                    }}
                    className="font-bold text-slate-900 dark:text-[#d2f801] hover:underline cursor-pointer"
                  >
                    Create one now
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError("");
                    }}
                    className="font-bold text-slate-900 dark:text-[#d2f801] hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500 dark:text-slate-400 pt-2 font-medium">
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Role-Based RBAC</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Mail className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          <span>Token Email Verification</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Layers className="w-4 h-4 text-black dark:text-[#d2f801]" />
          <span>Fintech Task Engine</span>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center">
        <Link href="/" className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors">
          ← Back to Landing Page
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-[100dvh] bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#d2f801] selection:text-black transition-colors duration-200">
      {/* Floating Theme Toggle in top-right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
            <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-700 border-t-black dark:border-t-[#d2f801] rounded-full animate-spin" />
            <p className="text-xs">Loading authentication...</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}