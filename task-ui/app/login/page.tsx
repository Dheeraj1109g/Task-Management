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
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [failCount, setFailCount] = useState(0);

  // Registration verification popup state
  const [issuedToken, setIssuedToken] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [verifyingToken, setVerifyingToken] = useState(false);

  const check = useCallback(async () => {
    setChecking(true);
    try {
      const h = await checkBackendHealth();
      if (h.api) {
        setApiOnline(true);
        setFailCount(0);
      } else {
        setFailCount((prev) => prev + 1);
        setApiOnline(false);
      }
    } catch {
      setFailCount((prev) => prev + 1);
      setApiOnline(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    if (getToken()) {
      router.replace("/tasks");
    }

    check();

    const intervalTime = apiOnline ? 20000 : 3500;
    const interval = setInterval(check, intervalTime);

    return () => {
      clearInterval(interval);
    };
  }, [router, check, apiOnline]);

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
          className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 shadow-xl shadow-indigo-500/25 ring-1 ring-white/20 mb-2 group transition-transform active:scale-95"
        >
          <Layers className="w-7 h-7 text-white" />
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
          PulseFlow
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {mode === "login"
            ? "Sign in to access your role-governed task console."
            : "Create an enterprise account with token authentication."}
        </p>

        {/* Server status pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-400 mt-1">
          <span
            className={`h-2 w-2 rounded-full ${
              apiOnline === true
                ? "bg-emerald-400 animate-pulse"
                : apiOnline === null || failCount < 3
                ? "bg-amber-400 animate-pulse"
                : "bg-rose-500"
            }`}
          />
          <span>
            {apiOnline === true
              ? "Fintech API Online"
              : apiOnline === null
              ? "Connecting..."
              : failCount < 3
              ? "Starting backend... (Please wait)"
              : "Backend Offline"}
          </span>
          {apiOnline === false && failCount >= 3 && (
            <button
              type="button"
              onClick={() => check()}
              disabled={checking}
              className="ml-1 inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 underline cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${checking ? "animate-spin" : ""}`} />
              Retry
            </button>
          )}
        </div>
      </div>

      {/* Quick 1-Click Demo Accounts */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d121f]/90 p-3 shadow-lg">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>One-Click Demo Roles (Instant Access):</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleDemoSignIn("admin")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-violet-300 transition-all text-xs font-semibold cursor-pointer active:scale-95"
          >
            <Crown className="w-4 h-4 mb-0.5 text-violet-400" />
            <span>Admin</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleDemoSignIn("manager")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition-all text-xs font-semibold cursor-pointer active:scale-95"
          >
            <Briefcase className="w-4 h-4 mb-0.5 text-amber-400" />
            <span>Manager</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleDemoSignIn("member")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 transition-all text-xs font-semibold cursor-pointer active:scale-95"
          >
            <UserIcon className="w-4 h-4 mb-0.5 text-sky-400" />
            <span>Member</span>
          </button>
        </div>
      </div>

      {/* Card Form */}
      <div className="rounded-3xl border border-slate-800 bg-[#0d121f]/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Token Verification Alert after register */}
        {issuedToken ? (
          <div className="space-y-4 animate-in fade-in zoom-in-95">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Email Verification Token Dispatched</h3>
              <p className="text-xs text-slate-300">
                We generated a secure 32-byte cryptographic token for <strong>{registeredEmail}</strong>.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 break-all select-all">
                {issuedToken}
              </div>
            </div>

            <button
              type="button"
              onClick={handleDirectVerify}
              disabled={verifyingToken}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
            >
              {verifyingToken ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
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
              className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer text-center"
            >
              Skip verification for now →
            </button>
          </div>
        ) : (
          <>
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-900/80 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  mode === "login"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
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
                className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  mode === "register"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{error}</div>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-800 bg-slate-900/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-slate-300">Password</label>
                  <span className="text-slate-500 text-[11px]">Min. 8 characters</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-800 bg-slate-900/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
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
                    <label className="block text-xs font-medium text-slate-300">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-800 bg-slate-900/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 animate-in fade-in">
                    <label className="block text-xs font-medium text-slate-300">
                      Select Organization Role
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                      className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-800 bg-slate-900/60 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="member">👤 Member (Individual Workflow)</option>
                      <option value="manager">⚡ Manager (Sprint &amp; Team Oversight)</option>
                      <option value="admin">👑 Admin (Full Governance &amp; Security)</option>
                    </select>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === "login" ? "Sign In" : "Create Account & Issue Token"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick toggle footer */}
            <div className="pt-2 text-center text-xs text-slate-400">
              {mode === "login" ? (
                <p>
                  Don&apos;t have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setError("");
                    }}
                    className="font-medium text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
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
                    className="font-medium text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
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
      <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500 pt-2">
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400/80" />
          <span>Role-Based RBAC</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Mail className="w-4 h-4 text-indigo-400/80" />
          <span>Token Email Verification</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Layers className="w-4 h-4 text-violet-400/80" />
          <span>Fintech Task Engine</span>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center">
        <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
          ← Back to Landing Page
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#080b11] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-xs">Loading authentication...</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}