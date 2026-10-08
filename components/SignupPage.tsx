"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import {
  Mail,
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

  // ─────────────────────────────────────────────
  // THEME
  // ─────────────────────────────────────────────
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem(
      "influencex-theme"
    ) as "dark" | "light" | null;

    if (stored) {
      setTheme(stored);
    } else if (
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem("influencex-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // ─────────────────────────────────────────────
  // FORM STATE
  // ─────────────────────────────────────────────
  const [mode, setMode] = useState<"signup" | "login">(
    "signup"
  );

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [selectedRole, setSelectedRole] =
    useState<Role>("user");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] =
    useState<string | null>(null);

  // ─────────────────────────────────────────────
  // PASSWORD STRENGTH
  // ─────────────────────────────────────────────
  const getStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const strength = getStrength();

  // ─────────────────────────────────────────────
  // EMAIL VALIDATION
  // ─────────────────────────────────────────────
  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // ─────────────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────────────
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setGeneralError(null);
    setSuccess(false);

    const cleanEmail = email.trim().toLowerCase();

    // ─────────────────────────────────────────
    // VALIDATION
    // ─────────────────────────────────────────
    const err = {
      name:
        mode === "signup" &&
        fullName.trim().length < 2,

      email: !validateEmail(cleanEmail),

      password: password.length < 6,

      confirm:
        mode === "signup" &&
        (password !== confirm || !confirm),
    };

    setErrors(err);

    if (
      err.name ||
      err.email ||
      err.password ||
      err.confirm
    ) {
      return;
    }

    setLoading(true);

    try {
      // ═══════════════════════════════════════
      // LOGIN
      // ═══════════════════════════════════════
      if (mode === "login") {
        const {
          data,
          error,
        } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          console.error(
            "LOGIN ERROR:",
            error
          );

          const message =
            error.message?.toLowerCase() || "";

          if (
            message.includes(
              "invalid login credentials"
            )
          ) {
            setGeneralError(
              "Invalid email or password. Please check your details and try again."
            );
          } else if (
            message.includes(
              "email not confirmed"
            )
          ) {
            setGeneralError(
              "Please confirm your email address before signing in."
            );
          } else {
            setGeneralError(
              error.message
            );
          }

          setLoading(false);
          return;
        }

        // Login successful
        console.log(
          "Login successful:",
          data.user?.email
        );

        setSuccess(true);

        setTimeout(() => {
          router.push("/");
        }, 500);

        return;
      }

      // ═══════════════════════════════════════
      // SIGN UP
      // ═══════════════════════════════════════
      const {
        data,
        error,
      } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: selectedRole,
          },
        },
      });

      // ═══════════════════════════════════════
      // EXISTING ACCOUNT
      // ═══════════════════════════════════════
      if (error) {
        console.error(
          "SIGNUP ERROR:",
          error
        );

        const message =
          error.message?.toLowerCase() || "";

        if (
          message.includes(
            "already registered"
          ) ||
          message.includes(
            "user already registered"
          ) ||
          message.includes(
            "already exists"
          )
        ) {
          setGeneralError(
            "This email is already registered. Please sign in using your existing account."
          );

          // Automatically switch to login
          setMode("login");

          // Keep email
          // Clear passwords so user can enter
          // the existing password.
          setPassword("");
          setConfirm("");

          setLoading(false);

          return;
        }

        setGeneralError(
          error.message ||
            "Unable to create account."
        );

        setLoading(false);

        return;
      }

      // ═══════════════════════════════════════
      // PROFILE
      // ═══════════════════════════════════════
      if (data.user) {
        try {
          const {
            error: profileError,
          } = await supabase
            .from("profiles")
            .upsert(
              {
                id: data.user.id,
                full_name:
                  fullName.trim(),
                email: cleanEmail,
                role: selectedRole,
              },
              {
                onConflict: "id",
              }
            );

          if (profileError) {
            console.warn(
              "Profile error:",
              profileError
            );
          }
        } catch (profileError) {
          console.warn(
            "Profile operation failed:",
            profileError
          );
        }
      }

      // ═══════════════════════════════════════
      // CHECK SESSION
      // ═══════════════════════════════════════
      const {
        data: {
          session,
        },
      } =
        await supabase.auth.getSession();

      // ─────────────────────────────────────────
      // SESSION EXISTS
      // ─────────────────────────────────────────
      if (session) {
        setSuccess(true);

        setTimeout(() => {
          router.push("/");
        }, 800);

        return;
      }

      // ─────────────────────────────────────────
      // EMAIL CONFIRMATION REQUIRED
      // ─────────────────────────────────────────
      setGeneralError(
        "Account created successfully! Please check your email and confirm your account before signing in."
      );

      setMode("login");

      setPassword("");
      setConfirm("");

      setLoading(false);
    } catch (error: any) {
      console.error(
        "SIGNUP/LOGIN ERROR:",
        error
      );

      setGeneralError(
        error?.message ||
          "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // SOCIAL SIGNUP
  // ─────────────────────────────────────────────
  const socialSignup = (
    provider: string
  ) => {
    alert(
      `Continue with ${provider} (Demo — no backend)`
    );
  };

  // ─────────────────────────────────────────────
  // THEME ICON
  // ─────────────────────────────────────────────
  const ThemeIcon = () =>
    theme === "dark" ? (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ) : (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle
          cx="12"
          cy="12"
          r="5"
        />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    );

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-100 dark:from-[#0b0d15] dark:via-[#1a1d2e] dark:to-[#0b0d15] relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-300/30 dark:bg-indigo-500/20 rounded-full blur-[120px] -top-40 -left-40 animate-pulse" />

      <div className="absolute w-[400px] h-[400px] bg-purple-300/30 dark:bg-purple-500/20 rounded-full blur-[120px] -bottom-40 -right-40 animate-pulse delay-1000" />

      {/* Theme Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 w-11 h-11 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur border border-white/30 dark:border-white/10 shadow-md flex items-center justify-center text-gray-700 dark:text-white hover:scale-105 transition-transform"
      >
        <ThemeIcon />
      </button>

      {/* ═══════════════════════════════════════
          LEFT SECTION
      ═══════════════════════════════════════ */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start p-8 md:p-16 lg:p-20 relative z-10">
        <div className="max-w-md">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg
                className="w-7 h-7 text-white"
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
            </div>

            <span className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Influence
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                X
              </span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white mt-2">
            Join the <br className="hidden sm:block" />

            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Creator Economy
            </span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-white/70 mt-4 leading-relaxed">
            Resell unused PR products, discover authentic deals, and connect with brands — all in one place.
          </p>

          {/* Features */}
          <div className="mt-8 space-y-3">

            <div className="flex items-center gap-3 text-gray-700 dark:text-white/80">
              <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>

              <span>
                Earn extra income from unused products
              </span>
            </div>

            <div className="flex items-center gap-3 text-gray-700 dark:text-white/80">
              <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Shield className="w-3.5 h-3.5" />
              </div>

              <span>
                Authentic items, verified community
              </span>
            </div>

            <div className="flex items-center gap-3 text-gray-700 dark:text-white/80">
              <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400">
                <Users className="w-3.5 h-3.5" />
              </div>

              <span>
                Discover influencers & brands near you
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          RIGHT SECTION
      ═══════════════════════════════════════ */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10">

        <div className="w-full max-w-md bg-white/70 dark:bg-white/6 backdrop-blur-2xl border border-white/30 dark:border-white/8 rounded-3xl shadow-2xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] p-8 sm:p-10">

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === "signup"
                ? "Create your account"
                : "Welcome back"}
            </h2>

            <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
              {mode === "signup"
                ? "Start your journey with InfluenceX"
                : "Sign in to continue"}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Full Name */}
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-white/70 mb-1">
                  Full Name
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(
                        e.target.value
                      )
                    }
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
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-white/70 mb-1">
                Email
              </label>

              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
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
              <label className="block text-xs font-medium text-gray-600 dark:text-white/70 mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="••••••••"
                  className={`w-full rounded-2xl border-2 bg-white/50 dark:bg-white/5 backdrop-blur px-4 py-2.5 pr-24 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none transition-all ${
                    errors.password
                      ? "border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.15)]"
                      : "border-white/20 dark:border-white/10 focus:border-indigo-400/60 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                  }`}
                />

                {/* Password strength */}
                {password.length > 0 &&
                  mode === "signup" && (
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 flex gap-0.5">
                      {[1, 2, 3].map(
                        (i) => (
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
                        )
                      )}
                    </div>
                  )}

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-white/70 mb-1">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showConfirm
                          ? "text"
                          : "password"
                      }
                      value={confirm}
                      onChange={(e) =>
                        setConfirm(
                          e.target.value
                        )
                      }
                      placeholder="••••••••"
                      className={`w-full rounded-2xl border-2 bg-white/50 dark:bg-white/5 backdrop-blur px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none transition-all ${
                        errors.confirm
                          ? "border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.15)]"
                          : "border-white/20 dark:border-white/10 focus:border-indigo-400/60 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirm(
                          !showConfirm
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-white/70 mb-1.5">
                    I am a
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        "user",
                        "influencer",
                        "brand",
                      ] as const
                    ).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() =>
                          setSelectedRole(
                            r
                          )
                        }
                        className={`py-2 rounded-2xl border-2 text-sm font-medium transition-all ${
                          selectedRole === r
                            ? "border-indigo-500 bg-indigo-500/10 text-gray-900 dark:text-white shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                            : "border-white/20 dark:border-white/10 bg-white/30 dark:bg-white/5 text-gray-500 dark:text-white/60 hover:border-indigo-400/40"
                        }`}
                      >
                        <span className="block text-base">
                          {r ===
                            "user" &&
                            "👤"}

                          {r ===
                            "influencer" &&
                            "⭐"}

                          {r ===
                            "brand" &&
                            "🏢"}
                        </span>

                        <span className="capitalize">
                          {r}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Error */}
            {generalError && (
              <div className="flex items-start gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-500/10 p-3 rounded-2xl border border-red-200 dark:border-red-500/20">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />

                <span>
                  {generalError}
                </span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-start gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-500/10 p-3 rounded-2xl border border-green-200 dark:border-green-500/20">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />

                <span>
                  Success! Redirecting to home…
                </span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={
                loading || success
              }
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-2.5 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                mode === "signup" ? (
                  "Creating account…"
                ) : (
                  "Signing in…"
                )
              ) : mode === "signup" ? (
                "Create Account"
              ) : (
                "Sign In"
              )}

              {!loading && (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>

            {/* Switch Login / Signup */}
            <p className="text-center text-sm text-gray-500 dark:text-white/50 mt-2">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}

                  <button
                    type="button"
                    onClick={() => {
                      setMode(
                        "login"
                      );
                      setGeneralError(
                        null
                      );
                      setSuccess(
                        false
                      );
                      setErrors({
                        name: false,
                        email: false,
                        password: false,
                        confirm: false,
                      });
                    }}
                    className="font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}

                  <button
                    type="button"
                    onClick={() => {
                      setMode(
                        "signup"
                      );
                      setGeneralError(
                        null
                      );
                      setSuccess(
                        false
                      );
                      setErrors({
                        name: false,
                        email: false,
                        password: false,
                        confirm: false,
                      });
                    }}
                    className="font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}