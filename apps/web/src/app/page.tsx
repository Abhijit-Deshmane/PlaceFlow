import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();
  const isAuthenticated = Boolean(userId);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <nav className="flex h-16 w-full items-center justify-between border-b border-zinc-800/80 px-8 max-w-7xl mx-auto backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-500/30">
            P
          </div>
          <span className="text-xl font-bold tracking-tight">PlaceFlow</span>
        </div>

        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                href="/sign-in"
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <Link
              href="/overview"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
            >
              Open Dashboard &rarr;
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto py-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400 mb-8 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Clerk Authentication & Role-Based Authorization
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          College Placement Management,{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Unified & Secure
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed">
          PlaceFlow seamlessly connects Students, Placement Officers, Recruiters, and College Administrators with type-safe server-enforced role access.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                href="/sign-in"
                className="w-full sm:w-auto rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
              >
                Get Started with Clerk
              </Link>
              <Link
                href="/sign-up"
                className="w-full sm:w-auto rounded-xl border border-zinc-800 bg-zinc-900/60 px-8 py-3.5 text-base font-semibold text-zinc-200 transition-all hover:bg-zinc-800/80 hover:text-white"
              >
                Create Account
              </Link>
            </>
          ) : (
            <Link
              href="/overview"
              className="w-full sm:w-auto rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
            >
              Go to Dashboard &rarr;
            </Link>
          )}
        </div>

        {/* Roles Feature Grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full text-left">
          {[
            {
              role: "Super Admin",
              desc: "System configuration, global user governance, and audit trails.",
            },
            {
              role: "College Admin",
              desc: "Manage college staff, students, partner companies, and drives.",
            },
            {
              role: "Placement Officer",
              desc: "Drive creation, candidate shortlisting, and interview workflows.",
            },
            {
              role: "Recruiter",
              desc: "Authorized drive candidate reviews, interviews, and outcomes.",
            },
            {
              role: "Student",
              desc: "Eligibility tracking, one-click drive applications, and offers.",
            },
          ].map((item) => (
            <div
              key={item.role}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-xs transition-all hover:border-zinc-700"
            >
              <h2 className="text-sm font-semibold text-zinc-100">{item.role}</h2>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
        &copy; {new Date().getFullYear()} PlaceFlow. All rights reserved.
      </footer>
    </div>
  );
}
