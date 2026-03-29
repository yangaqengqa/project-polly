"use client";
import { useEffect, useState } from "react";
import { fetchHistory, synthesizeSpeech, type HistoryItem } from "../../lib/api";
import AudioPlayer from "../components/AudioPlayer";

export default function HistoryPage() {
  const [items,      setItems]      = useState<HistoryItem[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [activeUrl,  setActiveUrl]  = useState<string | null>(null);
  const [replaying,  setReplaying]  = useState<string | null>(null);

  useEffect(() => {
    fetchHistory()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function replay(item: HistoryItem) {
    setReplaying(item.createdAt);
    setActiveUrl(null);
    try {
      const data = await synthesizeSpeech(item.textSnippet, item.voiceId);
      setActiveUrl(data.audioUrl);
    } finally {
      setReplaying(null);
    }
  }

  if (loading) return <p className="text-gray-400 text-sm">Loading history…</p>;
  if (error)   return <p className="text-red-400 text-sm">{error}</p>;
  if (!items.length) return <p className="text-gray-400 text-sm">No history yet. Go synthesize something!</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">History</h1>

      {activeUrl && <AudioPlayer url={activeUrl} />}

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.createdAt}
            className="flex items-start justify-between gap-4 rounded-lg bg-gray-800
                       border border-gray-700 px-4 py-3"
          >
            <div className="space-y-1 min-w-0">
              <p className="text-sm truncate">{item.textSnippet}{item.textSnippet.length === 100 ? "…" : ""}</p>
              <p className="text-xs text-gray-500">
                {item.voiceId} · {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => replay(item)}
              disabled={replaying === item.createdAt}
              className="shrink-0 px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500
                         disabled:opacity-40 transition text-xs font-medium"
            >
              {replaying === item.createdAt ? "…" : "▶ Play"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
