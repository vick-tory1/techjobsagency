"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import PasswordInput from "./PasswordInput";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      mode: "admin",
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid admin email or password.");
      return;
    }

    router.push(searchParams.get("callbackUrl") || "/admin");
    router.refresh();
  }

  async function continueWithGoogle() {
    setError("");
    setIsLoading(true);
    try {
      const config = await fetch("/api/auth/providers", { cache: "no-store" });
      if (!config.ok) throw new Error("Google authentication could not be checked right now.");
      const providers = await config.json();
      if (!providers.google) {
        setIsLoading(false);
        setError("Google sign-in is not connected yet. Add a Google client ID and secret in .env.local, then restart the server.");
        return;
      }
      await signIn("google", {
        callbackUrl: searchParams.get("callbackUrl") || "/admin",
      });
    } catch (caught) {
      setIsLoading(false);
      setError(caught instanceof Error ? caught.message : "Google authentication could not start. Please try email and password.");
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-gray-950 px-4 py-8 text-white">
      <Image src="/assets/analytics-hiring-dashboard.jpg" alt="Operations dashboard for marketplace administration" fill priority sizes="100vw" className="absolute inset-0 -z-20 object-cover opacity-35" />
      <div className="absolute inset-0 -z-10 bg-gray-950/75" />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
        <Link href="/" className="mb-8 text-sm font-bold text-green-200">Back to public site</Link>
        <form onSubmit={submit} className="rounded-lg border border-white/10 bg-white p-6 text-gray-950 shadow-xl">
          <p className="text-sm font-black uppercase text-green-700">Flowpilot admin</p>
          <h1 className="mt-2 text-3xl font-black">Keep the hiring marketplace credible</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">Review published roles, application movement, talent visibility, and support signals from one secure workspace. Use the account assigned to marketplace operations.</p>
          <div className="mt-5 grid gap-3">
            {["Check published roles before job seekers apply.", "Review application movement and account issues quickly.", "Keep private admin access limited to approved operators."].map((item) => <p key={item} className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm font-semibold leading-6 text-gray-700">{item}</p>)}
          </div>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-bold text-gray-700">Admin email</span>
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500" />
            </label>
            <PasswordInput label="Admin password" value={password} onChange={setPassword} required />
          </div>
          {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          <button disabled={isLoading} className="mt-5 w-full rounded-lg bg-gray-950 px-4 py-2.5 font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-500">
            {isLoading ? "Checking admin access..." : "Sign in to admin"}
          </button>
          <div className="my-4 flex items-center gap-3 text-xs font-bold uppercase text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />
            or
            <span className="h-px flex-1 bg-gray-200" />
          </div>
          <button type="button" onClick={continueWithGoogle} disabled={isLoading} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-bold text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-100">
            {isLoading ? "Opening Google..." : "Continue with Google"}
          </button>
        </form>
      </div>
    </main>
  );
}
