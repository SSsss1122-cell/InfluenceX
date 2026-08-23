"use client";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

type Role = "user" | "influencer" | "brand";

export default function AuthCard() {
  // ─── Theme ──────────────────────────────────────────
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("influencex-theme") as "dark" | "light" | null;
    if (stored) setTheme(stored);
    else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("influencex-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const router = useRouter();

  // ─── Tab state ──────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  // ─── Login form ────────────────────────────────────
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState({ email: false, password: false });

  // ─── Signup form ──────────────────────────────────
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [signupErrors, setSignupErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirm: false,
  });

  // ─── Validation helpers ──────────────────────────
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ─── Login submit ─────────────────────────────────
 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const email = loginEmail.trim();

  const err = {
    email: !validateEmail(email),
    password: loginPassword.length < 6,
  };

  setLoginErrors(err);

  if (err.email || err.password) {
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: loginPassword,
  });

  if (error) {
    console.error("Login error:", error.message);
    alert(`Login failed: ${error.message}`);
    return;
  }

  if (!data.user) {
    alert("Login failed. User not found.");
    return;
  }

  console.log("Login successful:", data.user);

  // Redirect to home page
  router.push("/");
  router.refresh();
};
  // ─── Signup submit ────────────────────────────────
  const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();

  const err = {
    name: signupName.trim().length < 2,
    email: !validateEmail(signupEmail),
    password: signupPassword.length < 6,
    confirm: signupPassword !== signupConfirm || !signupConfirm,
  };

  setSignupErrors(err);

  if (err.name || err.email || err.password || err.confirm) {
    return;
  }

  console.log("SIGNUP STARTED");
  console.log("Email:", signupEmail);
  console.log("Role:", role);

  const { data, error } = await supabase.auth.signUp({
    email: loginEmail.trim(),
    password: loginPassword,
    options: {
      data: {
        full_name: signupName.trim(),
        role: role,
      },
    },
  });

  console.log("SUPABASE SIGNUP DATA:", data);
  console.log("SUPABASE SIGNUP ERROR:", error);

  if (error) {
    alert(`Signup failed: ${error.message}`);
    return;
  }

  alert("Account created successfully!");

  setSignupName("");
  setSignupEmail("");
  setSignupPassword("");
  setSignupConfirm("");
  setActiveTab("login");
};

  // ─── Social demo ──────────────────────────────────
  const socialLogin = (provider: string) => {
    alert(`Continue with ${provider} (Demo — no backend)`);
  };

  return (
    <div className="relative z-10 w-full max-w-md rounded-[2.5rem] bg-white/70 dark:bg-white/6 backdrop-blur-2xl border border-white/30 dark:border-white/8 shadow-2xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] p-8 sm:p-9 transition-all duration-300 max-h-[96vh] overflow-y-auto">
      {/* ─── Logo ──────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-1">
        <svg
          className="w-8 h-8 text-indigo-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Influence<span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">X</span>
        </span>
        <span className="text-[0.6rem] font-semibold uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2.5 py-0.5 rounded-full">
          Beta
        </span>
      </div>
      <p className="text-sm font-normal text-gray-600 dark:text-white/70 mb-5">
        Resell · Discover · Connect
      </p>

      {/* ─── Theme toggle (inside card) ────────────── */}
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/30 dark:bg-white/5 backdrop-blur border border-white/20 dark:border-white/10 shadow-sm flex items-center justify-center text-gray-700 dark:text-white hover:scale-105 transition-transform"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        )}
      </button>

      {/* ─── Tabs ────────────────────────────────────── */}
      <div className="flex gap-2 border-b border-gray-200/30 dark:border-white/8 pb-1.5 mb-5">
        <button
          onClick={() => setActiveTab("login")}
          className={`flex-1 text-center font-semibold text-sm sm:text-base py-1.5 transition-all relative ${
            activeTab === "login"
              ? "text-gray-900 dark:text-white"
              : "text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70"
          }`}
        >
          Sign In
          {activeTab === "login" && (
            <span className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-7 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("signup")}
          className={`flex-1 text-center font-semibold text-sm sm:text-base py-1.5 transition-all relative ${
            activeTab === "signup"
              ? "text-gray-900 dark:text-white"
              : "text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70"
          }`}
        >
          Create Account
          {activeTab === "signup" && (
            <span className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-7 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
          )}
        </button>
      </div>

      {/* ─── Login Panel ────────────────────────────── */}
      {activeTab === "login" && (
        <form onSubmit={handleLogin} className="space-y-4 animate-fadeSlide">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-white/70 mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full rounded-2xl border-2 bg-white/5 dark:bg-white/5 backdrop-blur px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none transition-all ${
                  loginErrors.email ? "border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.15)]" : "border-white/10 dark:border-white/10 focus:border-indigo-400/60 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                }`}
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/40" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-white/70 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full rounded-2xl border-2 bg-white/5 dark:bg-white/5 backdrop-blur px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none transition-all ${
                  loginErrors.password ? "border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.15)]" : "border-white/10 dark:border-white/10 focus:border-indigo-400/60 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                }`}
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/40" />
            </div>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-500 rounded border-gray-300 dark:border-white/20" />
              Remember me
            </label>
            <button type="button" className="text-sm text-gray-400 dark:text-white/40 hover:text-indigo-400 transition-colors">
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-2.5 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Sign In
          </button>
          <div className="flex items-center gap-4 text-xs font-medium text-gray-400 dark:text-white/30 uppercase">
            <span className="flex-1 h-px bg-gray-200/30 dark:bg-white/8" />
            or continue with
            <span className="flex-1 h-px bg-gray-200/30 dark:bg-white/8" />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => socialLogin("Google")}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-white/10 dark:border-white/10 bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 py-2.5 text-sm font-medium text-gray-700 dark:text-white transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.027 16.08 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => socialLogin("GitHub")}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-white/10 dark:border-white/10 bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 py-2.5 text-sm font-medium text-gray-700 dark:text-white transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.694.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              GitHub
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-white/60">
            Don't have an account?{" "}
            <button type="button" onClick={() => setActiveTab("signup")} className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign up
            </button>
          </p>
        </form>
      )}

      {/* ─── Signup Panel ────────────────────────────── */}
      {activeTab === "signup" && (
        <form onSubmit={handleSignup} className="space-y-3.5 animate-fadeSlide">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-white/70 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="Alex Rivera"
                className={`w-full rounded-2xl border-2 bg-white/5 dark:bg-white/5 backdrop-blur px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none transition-all ${
                  signupErrors.name ? "border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.15)]" : "border-white/10 dark:border-white/10 focus:border-indigo-400/60 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                }`}
              />
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/40" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-white/70 mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full rounded-2xl border-2 bg-white/5 dark:bg-white/5 backdrop-blur px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none transition-all ${
                  signupErrors.email ? "border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.15)]" : "border-white/10 dark:border-white/10 focus:border-indigo-400/60 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                }`}
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/40" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-white/70 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full rounded-2xl border-2 bg-white/5 dark:bg-white/5 backdrop-blur px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none transition-all ${
                  signupErrors.password ? "border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.15)]" : "border-white/10 dark:border-white/10 focus:border-indigo-400/60 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                }`}
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/40" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-white/70 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                value={signupConfirm}
                onChange={(e) => setSignupConfirm(e.target.value)}
                placeholder="••••••••"
                className={`w-full rounded-2xl border-2 bg-white/5 dark:bg-white/5 backdrop-blur px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none transition-all ${
                  signupErrors.confirm ? "border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.15)]" : "border-white/10 dark:border-white/10 focus:border-indigo-400/60 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                }`}
              />
              <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/40" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-white/70 mb-1.5">I am a</label>
            <div className="grid grid-cols-3 gap-2">
              {(["user", "influencer", "brand"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 rounded-2xl border-2 text-sm font-medium transition-all ${
                    role === r
                      ? "border-indigo-500 bg-indigo-500/10 text-gray-900 dark:text-white shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                      : "border-white/10 dark:border-white/10 bg-white/5 dark:bg-white/5 text-gray-500 dark:text-white/60 hover:border-indigo-400/40"
                  }`}
                >
                  <span className="block text-base">
                    {r === "user" && "👤"}
                    {r === "influencer" && "⭐"}
                    {r === "brand" && "🏢"}
                  </span>
                  <span className="capitalize">{r}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-2.5 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Create Account
          </button>
          <div className="flex items-center gap-4 text-xs font-medium text-gray-400 dark:text-white/30 uppercase">
            <span className="flex-1 h-px bg-gray-200/30 dark:bg-white/8" />
            or continue with
            <span className="flex-1 h-px bg-gray-200/30 dark:bg-white/8" />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => socialLogin("Google")}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-white/10 dark:border-white/10 bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 py-2.5 text-sm font-medium text-gray-700 dark:text-white transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.027 16.08 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => socialLogin("GitHub")}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-white/10 dark:border-white/10 bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 py-2.5 text-sm font-medium text-gray-700 dark:text-white transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.694.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              GitHub
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-white/60">
            Already have an account?{" "}
            <button type="button" onClick={() => setActiveTab("login")} className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign in
            </button>
          </p>
        </form>
      )}

      {/* ─── Global animation style ────────────────── */}
      <style>{`
        @keyframes fadeSlide {
          0% { opacity: 0; transform: translateY(10px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeSlide { animation: fadeSlide 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>
    </div>
  );
}