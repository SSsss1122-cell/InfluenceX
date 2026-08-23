"use client";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Shield,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Role = "user" | "influencer" | "brand";

export default function SignupPage() {
  const router = useRouter();

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

  // ─── Form state ─────────────────────────────────────
 const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [selectedRole, setSelectedRole] = useState<"user" | "influencer" | "brand">("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirm: false,
  });

  // ─── UI state ──────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // ─── Password strength ─────────────────────────────
  const getStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };
  const strength = getStrength();

  // ─── Validation ────────────────────────────────────
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ─── Submit with Supabase ──────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccess(false);

    const err = {
      name: fullName.trim().length < 2,
      email: !validateEmail(email),
      password: password.length < 6,
      confirm: password !== confirm || !confirm,
    };
    setErrors(err);

    if (err.name || err.email || err.password || err.confirm) {
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: selectedRole,
          },
        },
      });

      if (error) throw error;

      setSuccess(true);
      setLoading(false);

      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push("/"); // 👈 Redirect to home
      }, 2000);
    } catch (error: any) {
      setGeneralError(error.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // ─── Social demo ────────────────────────────────────
  const socialSignup = (provider: string) => {
    alert(`Continue with ${provider} (Demo — no backend)`);
  };

  // ─── Theme icon ────────────────────────────────────
  const ThemeIcon = () =>
    theme === "dark" ? (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ) : (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    );

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-100 dark:from-[#0b0d15] dark:via-[#1a1d2e] dark:to-[#0b0d15] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-300/30 dark:bg-indigo-500/20 rounded-full blur-[120px] -top-40 -left-40 animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-purple-300/30 dark:bg-purple-500/20 rounded-full blur-[120px] -bottom-40 -right-40 animate-pulse delay-1000" />

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 w-11 h-11 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur border border-white/30 dark:border-white/10 shadow-md flex items-center justify-center text-gray-700 dark:text-white hover:scale-105 transition-transform"
        aria-label="Toggle theme"
      >
        <ThemeIcon />
      </button>

      {/* LEFT SIDE: Brand / Hero */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start p-8 md:p-16 lg:p-20 relative z-10">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Influence<span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">X</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white mt-2">
            Join the <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Creator Economy</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-white/70 mt-4 leading-relaxed">
            Resell unused PR products, discover authentic deals, and connect with brands — all in one place.
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-gray-700 dark:text-white/80">
              <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>Earn extra income from unused products</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-white/80">
              <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span>Authentic items, verified community</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-white/80">
              <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span>Discover influencers & brands near you</span>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-4 text-sm text-gray-500 dark:text-white/40">
            <span>Already a member?</span>
            <a href="#" className="font-semibold text-indigo-500 hover:text-indigo-400 transition-colors flex items-center gap-1">
              Sign in <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md bg-white/70 dark:bg-white/6 backdrop-blur-2xl border border-white/30 dark:border-white/8 rounded-3xl shadow-2xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] p-8 sm:p-10 transition-all duration-300">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
            <p className="text-sm text-gray-500 dark:text-white/50 mt-1">Start your journey with InfluenceX</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-white/70 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className={`w-full rounded-2xl border-2 bg-white/50 dark:bg-white/5 backdrop-blur px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none transition-all ${
                    errors.name
                      ? "border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.15)]"
                      : "border-white/20 dark:border-white/10 focus:border-indigo-400/60 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                  }`}
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/40" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-white/70 mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full rounded-2xl border-2 bg-white/50 dark:bg-white/5 backdrop-blur px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none transition-all ${
                    errors.email
                      ? "border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.15)]"
                      : "border-white/20 dark:border-white/10 focus:border-indigo-400/60 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                  }`}
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/40" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-white/70 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-2xl border-2 bg-white/50 dark:bg-white/5 backdrop-blur px-4 py-2.5 pr-24 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none transition-all ${
                    errors.password
                      ? "border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.15)]"
                      : "border-white/20 dark:border-white/10 focus:border-indigo-400/60 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {/* Password strength bar */}
                {password.length > 0 && (
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 flex gap-0.5">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-5 h-1 rounded-full transition-colors ${
                          strength >= i
                            ? i === 1
                              ? "bg-red-400"
                              : i === 2
                              ? "bg-yellow-400"
                              : "bg-green-400"
                            : "bg-gray-300 dark:bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-white/70 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-2xl border-2 bg-white/50 dark:bg-white/5 backdrop-blur px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none transition-all ${
                    errors.confirm
                      ? "border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.15)]"
                      : "border-white/20 dark:border-white/10 focus:border-indigo-400/60 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-white/70 mb-1.5">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {(["user", "influencer", "brand"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`py-2 rounded-2xl border-2 text-sm font-medium transition-all ${
                      selectedRole === r
                        ? "border-indigo-500 bg-indigo-500/10 text-gray-900 dark:text-white shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                        : "border-white/20 dark:border-white/10 bg-white/30 dark:bg-white/5 text-gray-500 dark:text-white/60 hover:border-indigo-400/40"
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

            {/* General error message */}
            {generalError && (
              <div className="flex items-start gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-500/10 p-3 rounded-2xl border border-red-200 dark:border-red-500/20">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{generalError}</span>
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="flex items-start gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-500/10 p-3 rounded-2xl border border-green-200 dark:border-green-500/20">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Account created! Redirecting to home…</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-2.5 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Create Account"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            {/* Social */}
            <div className="flex items-center gap-4 text-xs font-medium text-gray-400 dark:text-white/30 uppercase">
              <span className="flex-1 h-px bg-gray-200/30 dark:bg-white/8" />
              or continue with
              <span className="flex-1 h-px bg-gray-200/30 dark:bg-white/8" />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => socialSignup("Google")}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-white/20 dark:border-white/10 bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 py-2.5 text-sm font-medium text-gray-700 dark:text-white transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.027 16.08 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => socialSignup("GitHub")}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-white/20 dark:border-white/10 bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 py-2.5 text-sm font-medium text-gray-700 dark:text-white transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.694.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                GitHub
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-white/50 mt-2">
              By signing up, you agree to our{" "}
              <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Terms</a> and{" "}
              <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}