"use client";
import { useEffect, useState } from "react";
import { fetchAuthSession, signInWithRedirect, signOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useAmplifyReady } from "./AmplifyProvider";

export default function AuthButton() {
  const amplifyReady = useAmplifyReady();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  async function loadUser() {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken;
      if (idToken) {
        setEmail((idToken.payload["email"] as string) ?? null);
      } else {
        setEmail(null);
      }
    } catch {
      setEmail(null);
    } finally {
      setReady(true);
    }
  }

  useEffect(() => {
    if (!amplifyReady) return;
    loadUser();

    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (
        payload.event === "signedIn" ||
        payload.event === "tokenRefresh" ||
        payload.event === "customOAuthState"
      ) {
        loadUser();
      }
      if (payload.event === "signedOut") {
        setEmail(null);
        setReady(true);
      }
    });

    return unsubscribe;
  }, [amplifyReady]);

  if (!amplifyReady || !ready) return null;

  if (email) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-400">{email}</span>
        <button
          onClick={() => signOut()}
          className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signInWithRedirect()}
      className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 transition text-sm font-medium"
    >
      Sign In
    </button>
  );
}
