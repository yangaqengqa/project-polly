"use client";
import { useState } from "react";
import { synthesizeSpeech } from "@/lib/api";
import AudioPlayer from "@/app/components/AudioPlayer";
import AppShell from "@/app/components/AppShell";

const VOICES = [
  { id: "Joanna",  label: "Joanna (Female, US)"  },
  { id: "Matthew", label: "Matthew (Male, US)"    },
  { id: "Salli",   label: "Salli (Female, US)"    },
  { id: "Joey",    label: "Joey (Male, US)"        },
  { id: "Amy",     label: "Amy (Female, UK)"       },
  { id: "Brian",   label: "Brian (Male, UK)"       },
];

export default function DashboardPage() {
  const [text,     setText]     = useState("");
  const [voiceId,  setVoiceId]  = useState("Joanna");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function handleSynthesize() {
    setLoading(true);
    setError(null);
    setAudioUrl(null);
    try {
      const data = await synthesizeSpeech(text, voiceId);
      setAudioUrl(data.audioUrl);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Text to Speech</h1>

        <div className="space-y-3">
          <textarea
            rows={6}
            maxLength={3000}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to synthesize (max 3000 characters)..."
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-sm
                       placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{text.length} / 3000</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {VOICES.map((v) => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>

          <button
            onClick={handleSynthesize}
            disabled={loading || text.length === 0}
            className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-40
                       disabled:cursor-not-allowed transition text-sm font-medium"
          >
            {loading ? "Synthesizing…" : "Convert →"}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {audioUrl && <AudioPlayer url={audioUrl} />}
      </div>
    </AppShell>
  );
}
