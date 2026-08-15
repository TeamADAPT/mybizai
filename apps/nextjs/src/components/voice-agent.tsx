"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@saasfly/ui/button";

const SAMPLE_RATE = 24000;

const DEFAULT_INSTRUCTIONS = [
  "You are ADAPT voice for MyBizAI (Fifth Avenue Intelligence Group).",
  "Speak briefly and clearly — decisions, not dashboards.",
  "Help operators move Ideas → Research → Plan → Brand → Campaigns → Finance → Approve → Venture.",
  "Ask one focused question at a time. Prefer action over lecture.",
].join(" ");

type VoiceStatus =
  | "idle"
  | "connecting"
  | "listening"
  | "speaking"
  | "error"
  | "unavailable";

type TranscriptLine = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
};

function float32ToBase64PCM16(float32Array: Float32Array): string {
  const pcm16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const sample = float32Array[i] ?? 0;
    const s = Math.max(-1, Math.min(1, sample));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(pcm16.buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64PCM16ToFloat32(base64String: string): Float32Array {
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const pcm16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(pcm16.length);
  for (let i = 0; i < pcm16.length; i++) {
    float32[i] = (pcm16[i] ?? 0) / 32768;
  }
  return float32;
}

export function VoiceAgent({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [configured, setConfigured] = useState<boolean | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const playTimeRef = useRef(0);
  const assistantBufferRef = useRef("");

  useEffect(() => {
    void fetch("/api/voice/session")
      .then((res) => res.json())
      .then((data: { configured?: boolean }) => {
        setConfigured(Boolean(data.configured));
      })
      .catch(() => setConfigured(false));
  }, []);

  const appendLine = useCallback(
    (role: TranscriptLine["role"], text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setLines((prev) => [
        ...prev.slice(-24),
        { id: `${Date.now()}-${Math.random()}`, role, text: trimmed },
      ]);
    },
    [],
  );

  const stop = useCallback(() => {
    processorRef.current?.disconnect();
    processorRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    playTimeRef.current = 0;
    setStatus((prev) => (prev === "unavailable" ? prev : "idle"));
  }, []);

  useEffect(() => () => stop(), [stop]);

  const playPcmChunk = useCallback((base64: string) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    const float32 = base64PCM16ToFloat32(base64);
    if (!float32.length) return;
    const buffer = ctx.createBuffer(1, float32.length, SAMPLE_RATE);
    buffer.copyToChannel(float32, 0);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    const startAt = Math.max(ctx.currentTime, playTimeRef.current);
    source.start(startAt);
    playTimeRef.current = startAt + buffer.duration;
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setStatus("connecting");
    assistantBufferRef.current = "";

    try {
      const sessionRes = await fetch("/api/voice/session", { method: "POST" });
      const session = (await sessionRes.json()) as {
        token?: string;
        wsUrl?: string;
        voice?: string;
        error?: string;
        configured?: boolean;
      };

      if (!sessionRes.ok || !session.token || !session.wsUrl) {
        setConfigured(session.configured ?? false);
        setStatus(session.configured === false ? "unavailable" : "error");
        setError(
          session.error ??
            "Could not start voice session. Check XAI_API_KEY on Railway.",
        );
        return;
      }

      setConfigured(true);

      const audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
      audioContextRef.current = audioContext;
      playTimeRef.current = audioContext.currentTime;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      const ws = new WebSocket(session.wsUrl, [
        `xai-client-secret.${session.token}`,
      ]);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: "session.update",
            session: {
              voice: session.voice || "eve",
              instructions: DEFAULT_INSTRUCTIONS,
              turn_detection: { type: "server_vad" },
              audio: {
                input: { format: { type: "audio/pcm", rate: SAMPLE_RATE } },
                output: { format: { type: "audio/pcm", rate: SAMPLE_RATE } },
              },
              replace: {
                MyBizAI: "My Biz A I",
                ADAPT: "A DAPT",
              },
            },
          }),
        );

        ws.send(
          JSON.stringify({
            type: "conversation.item.create",
            item: {
              type: "force_message",
              role: "assistant",
              interruptible: true,
              content: [
                {
                  type: "output_text",
                  text: "ADAPT voice online. What should we move next in the loop?",
                },
              ],
            },
          }),
        );

        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        const silent = audioContext.createGain();
        silent.gain.value = 0;
        processorRef.current = processor;
        processor.onaudioprocess = (event) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          const input = event.inputBuffer.getChannelData(0);
          ws.send(
            JSON.stringify({
              type: "input_audio_buffer.append",
              audio: float32ToBase64PCM16(input),
            }),
          );
        };
        source.connect(processor);
        processor.connect(silent);
        silent.connect(audioContext.destination);
        setStatus("listening");
        appendLine("system", "Mic live · server VAD listening");
      };

      ws.onmessage = (message) => {
        let event: {
          type?: string;
          delta?: string;
          transcript?: string;
          text?: string;
          error?: { message?: string };
          item?: {
            role?: string;
            content?: { type?: string; text?: string; transcript?: string }[];
          };
        };
        try {
          event = JSON.parse(String(message.data)) as typeof event;
        } catch {
          return;
        }

        switch (event.type) {
          case "response.output_audio.delta":
          case "response.audio.delta":
            if (event.delta) {
              setStatus("speaking");
              playPcmChunk(event.delta);
            }
            break;
          case "response.output_audio_transcript.delta":
          case "response.audio_transcript.delta":
            if (event.delta) {
              assistantBufferRef.current += event.delta;
            }
            break;
          case "response.output_audio_transcript.done":
          case "response.audio_transcript.done":
          case "response.done":
            if (assistantBufferRef.current) {
              appendLine("assistant", assistantBufferRef.current);
              assistantBufferRef.current = "";
            }
            setStatus("listening");
            break;
          case "conversation.item.input_audio_transcription.completed":
            if (event.transcript) {
              appendLine("user", event.transcript);
            }
            break;
          case "conversation.item.created":
            if (event.item?.role === "user") {
              const text = event.item.content
                ?.map((part) => part.text ?? part.transcript ?? "")
                .join(" ");
              if (text) appendLine("user", text);
            }
            break;
          case "error":
            setError(event.error?.message ?? "Voice session error");
            setStatus("error");
            break;
          default:
            break;
        }
      };

      ws.onerror = () => {
        setError("WebSocket error talking to xAI voice");
        setStatus("error");
      };

      ws.onclose = () => {
        setStatus((prev) => (prev === "error" ? prev : "idle"));
      };
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Could not start voice agent",
      );
      stop();
    }
  }, [appendLine, playPcmChunk, stop]);

  const statusLabel =
    status === "connecting"
      ? "Connecting…"
      : status === "listening"
        ? "Listening"
        : status === "speaking"
          ? "Speaking"
          : status === "unavailable"
            ? "Needs XAI_API_KEY"
            : status === "error"
              ? "Error"
              : "Idle";

  return (
    <div
      className={
        compact
          ? "space-y-3 rounded-2xl border border-brand-gold/30 bg-brand-ink/50 p-4"
          : "space-y-4 rounded-2xl border border-brand-gold/30 bg-card/80 p-5 dark:bg-brand-ink/40"
      }
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
            xAI voice · grok-voice
          </p>
          <h2 className="mt-1 font-display text-xl tracking-tight">
            ADAPT voice agent
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Browser talks through an ephemeral token — your API key stays on
            Railway. Model text drafts use grok-4.6.
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-orange">
          {statusLabel}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {status === "idle" || status === "error" || status === "unavailable" ? (
          <Button
            type="button"
            className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft"
            onClick={() => void start()}
            disabled={configured === false}
          >
            Start voice
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
            onClick={stop}
          >
            End session
          </Button>
        )}
      </div>

      {configured === false ? (
        <p className="text-sm text-muted-foreground">
          Set <code className="font-mono text-xs">XAI_API_KEY</code> on Railway
          (service mybizai) to unlock voice and grok-4.6 assist.
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <ul className="max-h-56 space-y-2 overflow-y-auto text-sm">
        {lines.length === 0 ? (
          <li className="text-muted-foreground">
            Transcript appears here after you start.
          </li>
        ) : (
          lines.map((line) => (
            <li key={line.id} className="border-b border-border/50 pb-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-brand-gold">
                {line.role}
              </span>
              <p className="mt-1 text-foreground">{line.text}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
