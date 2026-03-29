import { fetchAuthSession } from "aws-amplify/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

async function authHeaders(): Promise<Record<string, string>> {
  const { tokens } = await fetchAuthSession();
  return {
    "Content-Type":  "application/json",
    Authorization:   `Bearer ${tokens?.idToken}`,
  };
}

export interface SynthesizeResponse {
  audioUrl:  string;
  s3Key:     string;
  createdAt: string;
}

export interface HistoryItem {
  createdAt:   string;
  textSnippet: string;
  voiceId:     string;
  s3Key:       string;
}

export async function synthesizeSpeech(
  text: string,
  voiceId: string
): Promise<SynthesizeResponse> {
  const res = await fetch(`${API_URL}/synthesize`, {
    method:  "POST",
    headers: await authHeaders(),
    body:    JSON.stringify({ text, voiceId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  const res = await fetch(`${API_URL}/history`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
