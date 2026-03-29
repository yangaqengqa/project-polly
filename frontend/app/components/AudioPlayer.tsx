"use client";

interface Props {
  url: string;
}

export default function AudioPlayer({ url }: Props) {
  return (
    <div className="mt-6 p-4 rounded-lg bg-gray-800 border border-gray-700">
      <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Output</p>
      <audio controls src={url} className="w-full" />
      <a
        href={url}
        download="polly-audio.mp3"
        className="mt-3 inline-block text-xs text-indigo-400 hover:text-indigo-300"
      >
        ↓ Download MP3
      </a>
    </div>
  );
}
