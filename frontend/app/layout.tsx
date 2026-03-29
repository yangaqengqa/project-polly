import type { Metadata } from "next";
import "./globals.css";
import AmplifyProvider from "./components/AmplifyProvider";
import AuthButton from "./components/AuthButton";

export const metadata: Metadata = {
  title:       "Project Polly",
  description: "Real-time text-to-audio powered by Amazon Polly",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        <AmplifyProvider>
          <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
            <span className="font-bold text-lg tracking-tight">🎙 Project Polly</span>
            <div className="flex gap-4 text-sm items-center">
              <a href="/"        className="hover:text-white text-gray-400">Synthesize</a>
              <a href="/history" className="hover:text-white text-gray-400">History</a>
              <AuthButton />
            </div>
          </nav>
          <main className="max-w-2xl mx-auto px-4 py-10">{children}</main>
        </AmplifyProvider>
      </body>
    </html>
  );
}
