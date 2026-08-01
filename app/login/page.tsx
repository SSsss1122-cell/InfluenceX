import AuthCard from "../../components/AuthCard";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-slate-900 dark:from-[#0b0d15] dark:via-[#1a1d2e] dark:to-[#0b0d15] relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="fixed w-[420px] h-[420px] bg-indigo-500/20 dark:bg-indigo-500/25 rounded-full blur-[90px] -top-12 -right-6 animate-pulse" />
      <div className="fixed w-[360px] h-[360px] bg-purple-500/20 dark:bg-purple-500/25 rounded-full blur-[90px] -bottom-10 -left-8 animate-pulse delay-1000" />
      <div className="fixed w-[240px] h-[240px] bg-violet-400/10 dark:bg-violet-400/15 rounded-full blur-[90px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-700" />

      <AuthCard />
    </main>
  );
}