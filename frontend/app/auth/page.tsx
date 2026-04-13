"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn, signUp, confirmSignUp, resetPassword, confirmResetPassword } from "aws-amplify/auth";

type Mode = "signin" | "signup" | "confirm" | "forgot" | "reset";

const PASSWORD_RULES = [
  { label: "At least 8 characters",   test: (p: string) => p.length >= 8         },
  { label: "One uppercase letter",     test: (p: string) => /[A-Z]/.test(p)       },
  { label: "One lowercase letter",     test: (p: string) => /[a-z]/.test(p)       },
  { label: "One number",               test: (p: string) => /[0-9]/.test(p)       },
];

function AuthForm() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const initial      = (searchParams.get("mode") as Mode) ?? "signin";

  const [mode,            setMode]            = useState<Mode>(initial);
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code,            setCode]            = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [error,           setError]           = useState<string | null>(null);
  const [successMsg,      setSuccessMsg]      = useState<string | null>(null);
  const [loading,         setLoading]         = useState(false);
  const [pwFocused,       setPwFocused]       = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setSuccessMsg(null);
  }

  async function handleSignIn() {
    setLoading(true); setError(null);
    try {
      await signIn({ username: email, password });
      router.push("/dashboard");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Sign in failed");
    } finally { setLoading(false); }
  }

  async function handleSignUp() {
    setLoading(true); setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      await signUp({ username: email, password, options: { userAttributes: { email } } });
      setMode("confirm");
      setSuccessMsg("Check your email for the verification code.");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Sign up failed");
    } finally { setLoading(false); }
  }

  async function handleConfirm() {
    setLoading(true); setError(null);
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      switchMode("signin");
      setSuccessMsg("Email verified! Sign in to continue.");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Verification failed");
    } finally { setLoading(false); }
  }

  async function handleForgot() {
    setLoading(true); setError(null);
    try {
      await resetPassword({ username: email });
      setMode("reset");
      setSuccessMsg("Reset code sent — check your email.");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to send reset code");
    } finally { setLoading(false); }
  }

  async function handleReset() {
    setLoading(true); setError(null);
    try {
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
      switchMode("signin");
      setSuccessMsg("Password reset! Sign in with your new password.");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Reset failed");
    } finally { setLoading(false); }
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition";
  const labelClass = "block text-xs text-gray-400 mb-1.5 uppercase tracking-wider";

  const showTabs = mode === "signin" || mode === "signup";

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src="/VerbaSonare_logo.png" alt="VerbaSonare" className="h-24 w-auto" />
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8">

          {/* Tabs */}
          {showTabs && (
            <div className="flex rounded-lg bg-white/5 p-1 mb-7">
              <button
                onClick={() => switchMode("signin")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                  mode === "signin" ? "bg-violet-600 text-white shadow shadow-violet-900/50" : "text-gray-400 hover:text-white"
                }`}
              >Sign In</button>
              <button
                onClick={() => switchMode("signup")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                  mode === "signup" ? "bg-violet-600 text-white shadow shadow-violet-900/50" : "text-gray-400 hover:text-white"
                }`}
              >Sign Up</button>
            </div>
          )}

          {mode === "confirm" && <h2 className="text-xl font-bold text-white mb-6 text-center">Verify your email</h2>}
          {mode === "forgot"  && <h2 className="text-xl font-bold text-white mb-6 text-center">Reset your password</h2>}
          {mode === "reset"   && <h2 className="text-xl font-bold text-white mb-6 text-center">Enter new password</h2>}

          {/* Success */}
          {successMsg && (
            <p className="mb-5 text-sm text-violet-300 bg-violet-900/20 border border-violet-700/40 rounded-lg px-4 py-3">
              {successMsg}
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="mb-5 text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          {/* ── Sign In ── */}
          {mode === "signin" && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className={inputClass} />
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="mt-2 text-xs text-violet-400 hover:text-violet-300 transition float-right"
                >
                  Forgot password?
                </button>
              </div>
              <button
                onClick={handleSignIn}
                disabled={loading || !email || !password}
                className="w-full py-3 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition shadow shadow-violet-900/40 mt-1"
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </div>
          )}

          {/* ── Sign Up ── */}
          {mode === "signup" && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setPwFocused(true)}
                  onBlur={() => setPwFocused(false)}
                  placeholder="••••••••"
                  className={inputClass}
                />
                {/* Real-time password requirements */}
                {(pwFocused || password.length > 0) && (
                  <div className="mt-3 space-y-1.5">
                    {PASSWORD_RULES.map(rule => {
                      const met = rule.test(password);
                      return (
                        <div key={rule.label} className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${met ? "text-violet-400" : "text-gray-600"}`}>
                            {met ? "✓" : "✗"}
                          </span>
                          <span className={`text-xs transition ${met ? "text-gray-300" : "text-gray-600"}`}>
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <label className={labelClass}>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" className={inputClass} />
              </div>
              <button
                onClick={handleSignUp}
                disabled={loading || !email || !password || !confirmPassword}
                className="w-full py-3 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition shadow shadow-violet-900/40 mt-1"
              >
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </div>
          )}

          {/* ── Confirm email ── */}
          {mode === "confirm" && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Verification Code</label>
                <input type="text" value={code} onChange={e => setCode(e.target.value)}
                  placeholder="123456"
                  className={`${inputClass} text-center tracking-[0.4em] text-lg`} />
                <p className="text-xs text-gray-500 mt-2 text-center">Sent to {email}</p>
              </div>
              <button
                onClick={handleConfirm}
                disabled={loading || !code}
                className="w-full py-3 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition shadow shadow-violet-900/40"
              >
                {loading ? "Verifying…" : "Verify Email"}
              </button>
            </div>
          )}

          {/* ── Forgot password ── */}
          {mode === "forgot" && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className={inputClass} />
                <p className="text-xs text-gray-500 mt-2">We will send a reset code to this address.</p>
              </div>
              <button
                onClick={handleForgot}
                disabled={loading || !email}
                className="w-full py-3 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition shadow shadow-violet-900/40"
              >
                {loading ? "Sending…" : "Send Reset Code"}
              </button>
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className="w-full text-xs text-gray-500 hover:text-gray-300 transition text-center"
              >
                ← Back to Sign In
              </button>
            </div>
          )}

          {/* ── Reset password ── */}
          {mode === "reset" && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Reset Code</label>
                <input type="text" value={code} onChange={e => setCode(e.target.value)}
                  placeholder="123456"
                  className={`${inputClass} text-center tracking-[0.4em] text-lg`} />
              </div>
              <div>
                <label className={labelClass}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  onFocus={() => setPwFocused(true)}
                  onBlur={() => setPwFocused(false)}
                  placeholder="••••••••"
                  className={inputClass}
                />
                {(pwFocused || newPassword.length > 0) && (
                  <div className="mt-3 space-y-1.5">
                    {PASSWORD_RULES.map(rule => {
                      const met = rule.test(newPassword);
                      return (
                        <div key={rule.label} className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${met ? "text-violet-400" : "text-gray-600"}`}>
                            {met ? "✓" : "✗"}
                          </span>
                          <span className={`text-xs transition ${met ? "text-gray-300" : "text-gray-600"}`}>
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <button
                onClick={handleReset}
                disabled={loading || !code || !newPassword}
                className="w-full py-3 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition shadow shadow-violet-900/40"
              >
                {loading ? "Resetting…" : "Reset Password"}
              </button>
            </div>
          )}

          {/* Back to home */}
          <div className="mt-7 pt-5 border-t border-white/5 text-center">
            <a href="/" className="text-xs text-gray-500 hover:text-gray-300 transition">
              ← Back to home
            </a>
          </div>
        </div>

        <p className="text-center mt-8 text-xs text-white/25 tracking-widest uppercase">
          Powered by AWS Free Tier
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
