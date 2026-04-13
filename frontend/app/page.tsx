import Link from "next/link";

export default function LandingPage() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/VerbaSonare_landscape_centered.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Buttons — positioned below the VerbaSonare text in the logo */}
      <div className="absolute z-10 flex flex-col items-center gap-6" style={{ top: '70%' }}>
        <p className="text-white/70 tracking-wide" style={{ fontSize: '18px' }}>Converts your texts to speech</p>
        <div className="flex gap-4">
          <Link
            href="/auth?mode=signup"
            className="px-10 py-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm tracking-wide transition shadow-lg shadow-violet-900/40"
          >
            Sign Up
          </Link>
          <Link
            href="/auth?mode=signin"
            className="px-10 py-3 rounded-lg border border-white/50 hover:bg-white/10 text-white font-semibold text-sm tracking-wide transition"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-xs text-white/35 tracking-widest uppercase">
        Powered by AWS Free Tier
      </p>
    </div>
  );
}
