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
import { ThemeToggle } from "@/components/ThemeContext";

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
          className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#d2f801] ring-1 ring-black/10 mb-2 group transition-transform active:scale-95 text-black"
        >
          <Layers className="w-7 h-7 text-black stroke-[2.5]" />
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white flex items-center justify-center gap-2">
          Token Authentication
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Cryptographically verify your email to activate your role permissions.
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-[#1c273e] bg-white dark:bg-[#0c101a] p-6 sm:p-8 space-y-6">
        {verifiedUser ? (
          /* SUCCESS STATE */
          <div className="text-center space-y-5 animate-in fade-in zoom-in-95">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Verification Complete!</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Your email <span className="font-bold text-slate-950 dark:text-[#d2f801]">{verifiedUser.email}</span> has been confirmed.
              </p>
            </div>

            {/* Role Badge Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#07090e] border border-slate-200 dark:border-[#1c273e] flex items-center justify-between text-left">
              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Assigned RBAC Role
                </span>
                <span className="text-base font-extrabold text-slate-950 dark:text-white capitalize flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {verifiedUser.role} Level
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#d2f801]/30 dark:bg-[#d2f801]/15 text-slate-950 dark:text-[#d2f801] border border-[#bfe700] dark:border-[#d2f801]/30 font-extrabold">
                Activated
              </span>
            </div>

            <button
              onClick={() => router.push(getToken() ? "/tasks" : "/login")}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#d2f801] hover:bg-[#bce000] text-black font-extrabold text-sm active:scale-95 transition-colors cursor-pointer"
            >
              <span>{getToken() ? "Proceed to Dashboard" : "Sign In to Workspace"}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        ) : (
          /* VERIFICATION FORM */
          <div className="space-y-5">
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <div className="flex-1 font-semibold">{error}</div>
              </div>
            )}

            {resendMessage && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-lime-50 dark:bg-[#11170d] border border-lime-200 dark:border-[#243314] text-slate-900 dark:text-[#d2f801] text-xs animate-in fade-in">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-slate-900 dark:text-[#d2f801]" />
                <div className="flex-1 font-semibold">{resendMessage}</div>
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Security Verification Token
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Paste 32-byte security token..."
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-[#1c273e] bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-[#d2f801] focus:bg-white dark:focus:bg-[#07090e] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !tokenInput.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#d2f801] hover:bg-[#bce000] text-black font-extrabold text-sm active:scale-95 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Verifying Token...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm &amp; Activate Account</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            {/* Resend section */}
            <div className="pt-4 space-y-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Didn&apos;t receive a token or link?
              </span>

              <form onSubmit={handleResend} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Enter account email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#1c273e] bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-[#d2f801] focus:bg-white dark:focus:bg-[#07090e]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resending || !resendEmail.trim()}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-slate-100 dark:bg-[#0e1422] hover:bg-slate-200 dark:hover:bg-[#151d30] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#1c273e] disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {resending ? "Sending..." : "Resend Token"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-4">
        <Link href="/login" className="hover:text-slate-900 dark:hover:text-white font-medium transition-colors">
          Return to Sign In
        </Link>
        <span>•</span>
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white font-medium transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-[100dvh] bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#d2f801] selection:text-black transition-colors duration-200">
      {/* Floating Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
            <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-700 border-t-black dark:border-t-[#d2f801] rounded-full animate-spin" />
            <p className="text-xs">Loading verification engine...</p>
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </main>
  );
}
