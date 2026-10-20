"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  User,
  Building2,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

type Role = "user" | "influencer" | "brand";
type Mode = "signup" | "login";

const VALID_ROLES: Role[] = ["user", "influencer", "brand"];

function getDashboardPath(role: Role): string {
  switch (role) {
    case "influencer":
      return "/influencer/dashboard"; // Or whatever page they fill details on

    case "brand":
      return "/brand-dashboard";

    case "user":
    default:
      return "/";
  }
}

function isValidRole(value: unknown): value is Role {
  return (
    typeof value === "string" &&
    VALID_ROLES.includes(value.toLowerCase() as Role)
  );
}

export default function SignupPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("user");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setMessage("");
    setErrorMessage("");
  }

  function redirectByRole(role: Role) {
    router.replace(getDashboardPath(role));
    router.refresh();
  }

  async function handleLogin(cleanEmail: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      const errorText = error.message.toLowerCase();

      if (
        errorText.includes("invalid login credentials") ||
        errorText.includes("invalid_credentials")
      ) {
        throw new Error(
          "Incorrect email or password. Please check your details and try again."
        );
      }

      if (errorText.includes("email not confirmed")) {
        throw new Error(
          "Please confirm your email before signing in."
        );
      }

      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Unable to sign in. Please try again.");
    }

    // First, get the role saved in the profiles table.
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError) {
      console.error(
        "Could not fetch profile role:",
        profileError.message
      );
    }

    const profileRole =
      typeof profile?.role === "string"
        ? profile.role.toLowerCase()
        : "";

    const metadataRole =
      typeof data.user.user_metadata?.role === "string"
        ? data.user.user_metadata.role.toLowerCase()
        : "";

    let resolvedRole: Role | null = null;

    if (isValidRole(profileRole)) {
      resolvedRole = profileRole;
    } else if (isValidRole(metadataRole)) {
      resolvedRole = metadataRole;
    }

    if (!resolvedRole) {
      await supabase.auth.signOut();

      throw new Error(
        "Your account role could not be determined. Please check the role in your Supabase profiles table."
      );
    }

    redirectByRole(resolvedRole);
  }

  async function handleSignup(cleanEmail: string) {
    const name = fullName.trim();

    if (name.length < 2) {
      throw new Error("Please enter your full name.");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: name,
          role: selectedRole,
        },
      },
    });

    if (error) {
      const errorText = error.message.toLowerCase();

      if (
        errorText.includes("already registered") ||
        errorText.includes("already exists") ||
        errorText.includes("user already registered")
      ) {
        switchMode("login");

        throw new Error(
          "This email is already registered. Please sign in instead."
        );
      }

      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Unable to create your account.");
    }

    if (
      data.user.identities &&
      data.user.identities.length === 0
    ) {
      switchMode("login");

      throw new Error(
        "This email is already registered. Please sign in instead."
      );
    }

    // If signup immediately creates a session, save the profile.
    if (data.session) {
      // 1. Save to general profiles table (for all users)
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: data.user.id,
            full_name: name,
            email: cleanEmail,
            role: selectedRole,
          },
          { onConflict: "id" }
        );

      if (profileError) {
        console.error(
          "Profile creation failed:",
          profileError.message
        );

        setMessage(
          "Your account was created, but your profile could not be saved. Check your profiles table and RLS policies."
        );

        return;
      }

      // 2. NEW: If they signed up as an Influencer, create their initial row in the influencers table
      if (selectedRole === "influencer") {
        // Generate a temporary unique username (they can change it later in their dashboard)
        const baseUsername = cleanEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const tempUsername = `${baseUsername}${randomSuffix}`;

        const { error: influencerError } = await supabase
          .from("influencers")
          .insert({
            user_id: data.user.id,
            name: name,
            username: tempUsername,
            bio: "New creator on InfluenceX",
            location: "Not specified",
            state: "Not specified",
            city: "Not specified",
            category: "General",
            available: false, // Set to false until they complete their profile
          });

        if (influencerError) {
          console.error("Influencer row creation failed:", influencerError.message);
          setMessage("Account created, but creator profile setup failed. Please contact support.");
          // We can still redirect them so they aren't stuck
        }
      }

      setMessage("Account created successfully. Redirecting...");
      redirectByRole(selectedRole);
      return;
    }

    // Email confirmation is enabled; ask the user to sign in after confirmation.
    setMessage(
      "Account created! Please confirm your email, then sign in."
    );

    setMode("login");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (mode === "signup" && fullName.trim().length < 2) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        await handleLogin(cleanEmail);
      } else {
        await handleSignup(cleanEmail);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-100 px-4 py-10">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-300/30 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-2xl backdrop-blur-xl md:grid-cols-2">
        {/* LEFT PANEL */}
        <section className="flex flex-col justify-center bg-gradient-to-br from-indigo-700 to-purple-700 p-8 text-white md:p-12">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-3">
              <Sparkles size={28} />
            </div>

            <span className="text-3xl font-extrabold">
              Influence<span className="text-purple-200">X</span>
            </span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight">
            Connect. Discover. Grow.
          </h1>

          <p className="mt-5 leading-7 text-indigo-100">
            Discover authentic influencers, connect brands with creators,
            and turn unused PR products into value.
          </p>

          <div className="mt-8 space-y-4 text-sm text-indigo-50">
            <p className="flex items-center gap-3">
              <CheckCircle size={18} />
              Discover relevant influencers
            </p>

            <p className="flex items-center gap-3">
              <CheckCircle size={18} />
              Manage your brand presence
            </p>

            <p className="flex items-center gap-3">
              <CheckCircle size={18} />
              Connect with the creator community
            </p>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="p-7 sm:p-10 md:p-12">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "signup"
                ? "Create your account"
                : "Welcome back"}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {mode === "signup"
                ? "Join the InfluenceX community."
                : "Sign in to continue to your dashboard."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <label className="block text-sm font-medium text-gray-700">
                Full Name

                <div className="relative mt-2">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    required
                    minLength={2}
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </label>
            )}

            <label className="block text-sm font-medium text-gray-700">
              Email Address

              <div className="relative mt-2">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Password

              <div className="relative mt-2">
                <input
                  required
                  minLength={6}
                  autoComplete={
                    mode === "signup"
                      ? "new-password"
                      : "current-password"
                  }
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {mode === "signup" && (
              <>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password

                  <div className="relative mt-2">
                    <input
                      required
                      minLength={6}
                      autoComplete="new-password"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className={`${inputClass} pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirm((value) => !value)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>

                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-gray-700">
                    I am a
                  </legend>

                  <div className="grid grid-cols-3 gap-2">
                    {VALID_ROLES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSelectedRole(item)}
                        aria-pressed={selectedRole === item}
                        className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-sm capitalize transition ${
                          selectedRole === item
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 text-gray-600 hover:border-indigo-300"
                        }`}
                      >
                        {item === "brand" ? (
                          <Building2 size={22} />
                        ) : item === "influencer" ? (
                          <Sparkles size={22} />
                        ) : (
                          <User size={22} />
                        )}
                        {item}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </>
            )}

            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {message && (
              <div
                role="status"
                className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
              >
                <CheckCircle size={18} className="mt-0.5 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  {mode === "signup" ? "Create Account" : "Sign In"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              {mode === "signup"
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() =>
                  switchMode(mode === "signup" ? "login" : "signup")
                }
                className="font-semibold text-indigo-600 hover:text-indigo-800"
              >
                {mode === "signup" ? "Sign in" : "Sign up"}
              </button>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}