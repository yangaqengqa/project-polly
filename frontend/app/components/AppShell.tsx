"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  async function loadUser() {
    try {
      const session = await fetchAuthSession();
      if (session.tokens?.idToken) {
        setReady(true);
      } else {
        router.replace("/");
      }
    } catch {
      router.replace("/");
    }
  }

  useEffect(() => {
    loadUser();

    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedOut") {
        router.replace("/");
      }
    });

    return unsubscribe;
  }, []);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 antialiased">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <a href="/dashboard" className="flex items-center gap-3">
          <img src="/VerbaSonare_logo.png" alt="VerbaSonare" className="h-8 w-auto" />
          <span className="font-bold text-lg tracking-tight">VerbaSonare</span>
        </a>
        <div className="flex gap-6 text-sm items-center">
          <a href="/history" className="hover:text-white text-gray-400 transition">History</a>
          <div className="border-l border-gray-800 pl-6">
            <button
              onClick={() => signOut()}
              className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-10">{children}</main>
    </div>
  );
}
