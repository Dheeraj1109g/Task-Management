"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Mail,
  Layers,
  Sparkles,
} from "lucide-react";
import { verifyEmail, resendVerification, getToken, User } from "@/lib/api";
import { useToast } from "@/components/Toast";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const urlToken = searchParams.get("token") || "";
  const [tokenInput, setTokenInput] = useState(urlToken);
  const [loading, setLoading] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const doVerify = async (tok: string) => {
    if (!tok.trim()) {
      setError("Please enter a valid verification token");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const user = await verifyEmail(tok.trim());
      setVerifiedUser(user);
      showToast("Email verified successfully! Your account is activated.", "success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlToken) {
      doVerify(urlToken);
    }
  }, [urlToken]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;
    setResending(true);
    setResendMessage("");
    setError("");
    try {
      const res = await resendVerification(resendEmail.trim());
      setResendMessage(res.message || "Verification email sent! Check your inbox.");
      if (res.verification_token) {
        setTokenInput(res.verification_token);
      }
      showToast("New verification token dispatched!", "success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend verification email");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-lg relative z-10 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link
          href="/"
          className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 shadow-xl shadow-indigo-500/25 ring-1 ring-white/20 mb-2"
        >
          <Layers className="w-7 h-7 text-white" />
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
          Token Authentication
        </h1>
        <p className="text-sm text-slate-400">
          Cryptographically verify your email to unlock your role permissions.
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
        {verifiedUser ? (
          /* SUCCESS STATE */
          <div className="text-center space-y-5 animate-in fade-in zoom-in-95">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Verification Complete!</h2>
              <p className="text-sm text-slate-300">
                Your email <span className="font-semibold text-white">{verifiedUser.email}</span> has been confirmed.
              </p>
            </div>

            {/* Role Badge Card */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-left">
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  Assigned RBAC Role
                </span>
                <span className="text-base font-bold text-white capitalize flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  {verifiedUser.role} Level
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                Activated
              </span>
            </div>

            <button
              onClick={() => router.push(getToken() ? "/tasks" : "/login")}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <span>{getToken() ? "Proceed to Dashboard" : "Sign In to Workspace"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* VERIFICATION FORM */
          <div className="space-y-5">
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{error}</div>
              </div>
            )}

            {resendMessage && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs animate-in fade-in">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{resendMessage}</div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                doVerify(tokenInput);
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Security Verification Token
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Paste 32-byte security token..."
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-800 bg-slate-900/60 text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !tokenInput.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Token...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm &amp; Activate Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Resend section */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <span className="text-xs font-semibold text-slate-400 block">
                Didn&apos;t receive a token or link?
              </span>

              <form onSubmit={handleResend} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Enter account email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resending || !resendEmail.trim()}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {resending ? "Sending..." : "Resend Token"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-4">
        <Link href="/login" className="hover:text-slate-300 transition-colors">
          Return to Sign In
        </Link>
        <span>•</span>
        <Link href="/" className="hover:text-slate-300 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-[#080b11] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-xs">Loading verification engine...</p>
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </main>
  );
}
