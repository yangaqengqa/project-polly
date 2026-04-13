import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import dynamic from "next/dynamic";

const AmplifyProvider = dynamic(() => import("./components/AmplifyProvider"), { ssr: false });

export const metadata: Metadata = {
  title: "VerbaSonare",
  description: "Converts your texts to speech — powered by Amazon Polly",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AmplifyProvider>{children}</AmplifyProvider>
      </body>
    </html>
  );
}
