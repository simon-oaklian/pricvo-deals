"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function safeAdminRedirectPath(from: string | null): string {
  if (from && from.startsWith("/admin") && !from.startsWith("/admin/login")) {
    return from;
  }
  return "/admin/deals";
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(false);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        const from = searchParams.get("from");
        router.push(safeAdminRedirectPath(from));
        router.refresh();
        return;
      }

      setError(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
      <div className="mb-6 flex items-baseline gap-2">
        <span className="text-xl font-semibold tracking-tight text-stone-900">Pricvo</span>
        <span className="rounded-md bg-stone-200 px-2 py-0.5 text-xs font-medium text-stone-600">
          Admin
        </span>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            disabled={submitting}
            required
          />
        </div>

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            Incorrect password
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
            <div className="h-40 animate-pulse rounded-lg bg-stone-100" />
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}
