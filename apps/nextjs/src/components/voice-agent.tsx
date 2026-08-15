"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@saasfly/ui/button";

import { looksLikeCodingRequest } from "~/lib/build-handoff";
import { useVentureLoop } from "~/hooks/use-venture-loop";

const SAMPLE_RATE = 24000;

const DEFAULT_INSTRUCTIONS = [
  "You are ADAPT voice for MyBizAI (Fifth Avenue Intelligence Group).",
  "Speak briefly and clearly — decisions, not dashboards.",
  "Help operators move Ideas → Research → Plan → Brand → Campaigns → Finance → Approve → Venture.",
  "Ask one focused question at a time. Prefer action over lecture.",
  "CRITICAL: Do NOT write code, diffs, or long technical implementations aloud.",
  "If the operator asks to code, implement, fix, refactor, or ship engineering work, acknowledge in one sentence that it will be queued for Grok Build (their coding subscription) and stop.",
  "Keep voice cheap — conversation and routing only; coding is a handoff.",
].join(" ");

type VoiceBackend = "xai" | "browser";

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

type ProviderSnapshot = {
  assist: {
    active: string;
    model: string | null;
    xaiConfigured: boolean;
  };
  voice: {
    active: VoiceBackend;
    xaiConfigured: boolean;
    alternatives: VoiceBackend[];
    model: string | null;
  };
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

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function VoiceAgent({
  compact = false,
}: {
  compact?: boolean;
}) {
  const {
    buildQueue,
    queueBuildBrief,
    clearBuildBrief,
    runAssist,
    planVision,
  } = useVentureLoop();
  const [backend, setBackend] = useState<VoiceBackend>("xai");
  const [snapshot, setSnapshot] = useState<ProviderSnapshot | null>(null);
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const playTimeRef = useRef(0);
  const assistantBufferRef = useRef("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const browserBusyRef = useRef(false);

  useEffect(() => {
    void fetch("/api/providers")
      .then((res) => res.json())
      .then((data: ProviderSnapshot) => {
        setSnapshot(data);
        setBackend(data.voice.active);
      })
      .catch(() => setSnapshot(null));
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

  const handoffCoding = useCallback(
    async (request: string) => {
      const refined = await runAssist("build.handoff", request);
      const brief = queueBuildBrief({
        request,
        source: "voice",
        context: `${refined}\n\nPlan vision: ${planVision}`,
      });
      appendLine(
        "system",
        `Queued for Grok Build · “${brief.title}” — copy the brief below (subscription covers coding).`,
      );
      return brief;
    },
    [appendLine, planVision, queueBuildBrief, runAssist],
  );

  const maybeHandoff = useCallback(
    (transcript: string) => {
      if (!looksLikeCodingRequest(transcript)) return;
      void handoffCoding(transcript);
    },
    [handoffCoding],
  );

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    browserBusyRef.current = false;
    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }
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

  const speakBrowser = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.02;
      utter.onstart = () => setStatus("speaking");
      utter.onend = () => setStatus("listening");
      window.speechSynthesis.speak(utter);
    },
    [],
  );

  const replyViaAssist = useCallback(
    async (userText: string) => {
      browserBusyRef.current = true;
      setStatus("connecting");
      try {
        if (looksLikeCodingRequest(userText)) {
          await handoffCoding(userText);
          const ack =
            "Queued that for Grok Build. Copy the brief when you’re ready — your subscription covers the coding.";
          appendLine("assistant", ack);
          speakBrowser(ack);
          return;
        }
        const res = await fetch("/api/assist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: "shell.approve",
            prompt: `${DEFAULT_INSTRUCTIONS}\n\nOperator said: ${userText}\nReply in 1-2 short spoken sentences.`,
          }),
        });
        const data = (await res.json()) as { draft?: string };
        const draft =
          data.draft?.trim() ||
          "Got it — open the next studio step when you’re ready.";
        appendLine("assistant", draft);
        speakBrowser(draft);
      } catch {
        setError("Browser voice could not reach /api/assist");
        setStatus("error");
      } finally {
        browserBusyRef.current = false;
      }
    },
    [appendLine, handoffCoding, speakBrowser],
  );

  const startBrowser = useCallback(async () => {
    const Recognition = getSpeechRecognition();
    if (!Recognition) {
      setStatus("unavailable");
      setError(
        "This browser has no SpeechRecognition. Use Chrome/Edge or switch to xAI voice.",
      );
      return;
    }

    setError(null);
    setStatus("listening");
    appendLine("system", "Browser voice · mic + speechSynthesis · assist brain");

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      if (!result?.isFinal) return;
      const transcript = result[0]?.transcript?.trim();
      if (!transcript || browserBusyRef.current) return;
      appendLine("user", transcript);
      void replyViaAssist(transcript);
    };
    recognition.onerror = (event) => {
      if (event.error === "aborted" || event.error === "no-speech") return;
      setError(event.error ?? "Speech recognition error");
      setStatus("error");
    };
    recognition.onend = () => {
      if (recognitionRef.current) {
        try {
          recognition.start();
        } catch {
          /* already started */
        }
      }
    };

    speakBrowser("ADAPT browser voice online. What should we move next?");
    recognition.start();
  }, [appendLine, replyViaAssist, speakBrowser]);

  const startXai = useCallback(async () => {
    setError(null);
    setStatus("connecting");
    assistantBufferRef.current = "";

    try {
      const sessionRes = await fetch("/api/voice/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "xai" }),
      });
      const session = (await sessionRes.json()) as {
        token?: string;
        wsUrl?: string;
        voice?: string;
        error?: string;
        configured?: boolean;
        provider?: string;
      };

      if (!sessionRes.ok || !session.token || !session.wsUrl) {
        setStatus(session.configured === false ? "unavailable" : "error");
        setError(
          session.error ??
            "Could not start xAI voice. Set XAI_API_KEY or switch to Browser.",
        );
        return;
      }

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
        appendLine("system", "xAI grok-voice · server VAD listening");
      };

      ws.onmessage = (message) => {
        let event: {
          type?: string;
          delta?: string;
          transcript?: string;
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
              maybeHandoff(event.transcript);
            }
            break;
          case "conversation.item.created":
            if (event.item?.role === "user") {
              const text = event.item.content
                ?.map((part) => part.text ?? part.transcript ?? "")
                .join(" ");
              if (text) {
                appendLine("user", text);
                maybeHandoff(text);
              }
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
        err instanceof Error ? err.message : "Could not start xAI voice agent",
      );
      stop();
    }
  }, [appendLine, maybeHandoff, playPcmChunk, stop]);

  const start = useCallback(async () => {
    stop();
    if (backend === "browser") {
      await startBrowser();
      return;
    }
    await startXai();
  }, [backend, startBrowser, startXai, stop]);

  const statusLabel =
    status === "connecting"
      ? "Connecting…"
      : status === "listening"
        ? "Listening"
        : status === "speaking"
          ? "Speaking"
          : status === "unavailable"
            ? "Unavailable"
            : status === "error"
              ? "Error"
              : "Idle";

  const alternatives = snapshot?.voice.alternatives ?? ["browser"];
  const xaiReady = snapshot?.voice.xaiConfigured ?? false;

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
            Swappable voice · {backend}
          </p>
          <h2 className="mt-1 font-display text-xl tracking-tight">
            ADAPT voice agent
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Flip between xAI grok-voice and browser speech tonight. Assist brain
            stays on{" "}
            {snapshot?.assist.active === "xai"
              ? `grok-4.6`
              : snapshot?.assist.active ?? "local"}
            .
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-orange">
          {statusLabel}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["xai", "browser"] as const).map((id) => {
          const enabled = alternatives.includes(id) || id === "browser";
          const locked = id === "xai" && !xaiReady;
          return (
            <button
              key={id}
              type="button"
              disabled={status !== "idle" && status !== "error" && status !== "unavailable"}
              onClick={() => {
                if (locked) return;
                setBackend(id);
                setError(null);
              }}
              className={
                backend === id
                  ? "rounded-full bg-brand-orange/15 px-3 py-1.5 text-xs font-medium text-brand-orange"
                  : locked || !enabled
                    ? "rounded-full bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground/50"
                    : "rounded-full bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              }
            >
              {id === "xai" ? "xAI voice" : "Browser voice"}
              {locked ? " · needs key" : ""}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {status === "idle" || status === "error" || status === "unavailable" ? (
          <Button
            type="button"
            className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft"
            onClick={() => void start()}
            disabled={backend === "xai" && !xaiReady}
          >
            Start {backend === "xai" ? "xAI" : "browser"} voice
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

      <div className="space-y-2 border-t border-border/60 pt-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
          Grok Build queue · subscription coding
        </p>
        {buildQueue.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Say “implement…”, “fix…”, or “refactor…” — voice queues a brief
            here. Paste into{" "}
            <a
              href="https://railway.com/agents/grok"
              target="_blank"
              rel="noreferrer"
              className="text-brand-orange underline-offset-2 hover:underline"
            >
              Grok Build
            </a>{" "}
            (SuperGrok) with the Railway plugin — subscription covers coding;
            Grok deploys to Railway for you.
          </p>
        ) : (
          buildQueue.slice(0, 3).map((brief) => (
            <div
              key={brief.id}
              className="rounded-xl border border-brand-gold/25 bg-background/40 p-3"
            >
              <p className="text-sm font-medium text-foreground">{brief.title}</p>
              <pre className="mt-2 max-h-28 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/40 p-2 font-mono text-[11px] text-muted-foreground">
                {brief.prompt}
              </pre>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft"
                  onClick={async () => {
                    await navigator.clipboard.writeText(brief.prompt);
                    setCopiedId(brief.id);
                    window.setTimeout(() => setCopiedId(null), 2000);
                  }}
                >
                  {copiedId === brief.id ? "Copied" : "Path A · Copy Grok Build"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-full border-brand-gold/50 text-brand-gold"
                  onClick={async () => {
                    setCopiedId(`${brief.id}-send`);
                    try {
                      const res = await fetch("/api/coding/tasks", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          objective: brief.request,
                          prompt: brief.prompt,
                          provider: "grok",
                        }),
                      });
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok) {
                        setError(
                          data.error ||
                            "Path B worker unavailable — use Path A copy.",
                        );
                        setCopiedId(null);
                        return;
                      }
                      appendLine(
                        "system",
                        `Path B · queued on Railway worker ${data.worker?.task?.task_id ?? ""}`,
                      );
                      setCopiedId(`${brief.id}-sent`);
                      window.setTimeout(() => setCopiedId(null), 2500);
                    } catch {
                      setError("Path B worker unreachable");
                      setCopiedId(null);
                    }
                  }}
                >
                  {copiedId === `${brief.id}-sent`
                    ? "Queued on worker"
                    : copiedId === `${brief.id}-send`
                      ? "Sending…"
                      : "Path B · Railway worker"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-full border-brand-gold/50 text-brand-gold"
                  onClick={async () => {
                    await navigator.clipboard.writeText(brief.cli);
                    setCopiedId(`${brief.id}-cli`);
                    window.setTimeout(() => setCopiedId(null), 2000);
                  }}
                >
                  {copiedId === `${brief.id}-cli` ? "CLI copied" : "Copy grok -p"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => clearBuildBrief(brief.id)}
                >
                  Clear
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
