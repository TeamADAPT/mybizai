import { NextResponse } from "next/server";

import { packageBuildBrief } from "~/lib/build-handoff";

export const runtime = "nodejs";

function workerConfig() {
  // Prefer private mesh; fall back to public URL when private URL is unset/truncated.
  const privateUrl = process.env.CODING_WORKER_URL?.trim().replace(/\/$/, "");
  const publicUrl = process.env.CODING_WORKER_PUBLIC_URL?.trim().replace(
    /\/$/,
    "",
  );
  const looksIncomplete = !!privateUrl && /railway\.internal:?$/.test(privateUrl);
  const baseUrl =
    privateUrl && !looksIncomplete
      ? privateUrl
      : publicUrl || privateUrl || "";
  const secret = process.env.CODING_WORKER_SECRET?.trim() || "";
  return { baseUrl, secret };
}

export async function GET() {
  const { baseUrl, secret } = workerConfig();
  if (!baseUrl) {
    return NextResponse.json({
      configured: false,
      path_a: "local-grok-build",
      path_b: null,
    });
  }

  try {
    const res = await fetch(`${baseUrl}/health`, {
      headers: secret ? { Authorization: `Bearer ${secret}` } : {},
      cache: "no-store",
    });
    const health = await res.json().catch(() => ({}));
    return NextResponse.json({
      configured: true,
      path_a: "local-grok-build",
      path_b: baseUrl,
      worker_health: health,
      ok: res.ok,
    });
  } catch (error) {
    return NextResponse.json({
      configured: true,
      path_a: "local-grok-build",
      path_b: baseUrl,
      ok: false,
      error: error instanceof Error ? error.message : "unreachable",
    });
  }
}

export async function POST(req: Request) {
  const { baseUrl, secret } = workerConfig();
  if (!baseUrl) {
    return NextResponse.json(
      {
        error:
          "CODING_WORKER_URL is not set. Path B (Railway worker) is offline — use Path A copy for Grok Build.",
      },
      { status: 503 },
    );
  }

  let body: {
    request?: string;
    objective?: string;
    prompt?: string;
    context?: string;
    provider?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const request = (body.objective || body.request || "").trim();
  if (!request) {
    return NextResponse.json(
      { error: "objective/request required" },
      { status: 400 },
    );
  }

  const brief = packageBuildBrief({
    request,
    source: "voice",
    context: body.context,
  });

  const payload = {
    task_id: brief.id,
    objective: brief.title,
    prompt: body.prompt?.trim() || brief.prompt,
    acceptance_criteria: [
      "Small focused diff",
      "Open a PR against main",
      "Prefer ADAPT loop / voice / worker surfaces",
    ],
    repo: process.env.CODING_REPO_URL || "https://github.com/TeamADAPT/mybizai",
    base_branch:
      process.env.CODING_BASE_BRANCH || "cursor/foundation-backlog-wave-d537",
    app_target:
      process.env.CODING_APP_TARGET || "http://mybizai.railway.internal:3000",
    environment: "production",
    provider: body.provider || process.env.CODING_AGENT_PROVIDER || "grok",
    budget: { max_minutes: 45 },
  };

  try {
    const res = await fetch(`${baseUrl}/v1/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: "worker rejected task", detail: data },
        { status: 502 },
      );
    }
    return NextResponse.json({
      path: "B",
      brief,
      worker: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "worker unreachable",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }
}
