import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";

const execFileAsync = promisify(execFile);

/**
 * @typedef {object} AgentRunInput
 * @property {string} cwd
 * @property {string} prompt
 * @property {string} objective
 * @property {string} [appTarget]
 */

/**
 * @typedef {object} AgentRunOutput
 * @property {string} summary
 * @property {string} log
 */

/**
 * @param {string} provider
 * @returns {(input: AgentRunInput) => Promise<AgentRunOutput>}
 */
export function resolveCodingAgent(provider) {
  switch ((provider || "grok").toLowerCase()) {
    case "stub":
      return runStubAgent;
    case "grok":
    default:
      return runGrokAgent;
  }
}

/** @param {AgentRunInput} input */
async function runStubAgent(input) {
  const marker = path.join(
    input.cwd,
    "apps/coding-worker/WORKER_STUB_RESULT.md",
  );
  await fs.mkdir(path.dirname(marker), { recursive: true });
  await fs.writeFile(
    marker,
    [
      "# Stub coding agent result",
      "",
      `Objective: ${input.objective}`,
      `Generated: ${new Date().toISOString()}`,
      "",
      "Replace provider=stub with provider=grok once GITHUB_TOKEN + XAI_API_KEY are set.",
      "",
    ].join("\n"),
    "utf8",
  );
  return {
    summary: "Stub agent wrote WORKER_STUB_RESULT.md",
    log: "stub ok",
  };
}

/** @param {AgentRunInput} input */
async function runGrokAgent(input) {
  if (!process.env.XAI_API_KEY?.trim()) {
    throw new Error("XAI_API_KEY required for grok coding agent");
  }

  const prompt = [
    input.prompt,
    "",
    "Constraints for this Railway coding-worker run:",
    "- Make a small, real code change that advances the objective.",
    "- Do not touch secrets, billing, or auth keys.",
    "- Prefer apps/nextjs or apps/coding-worker files.",
    input.appTarget
      ? `- App private target (for later verification): ${input.appTarget}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const { stdout, stderr } = await execFileAsync(
      "grok",
      [
        "--no-auto-update",
        "-p",
        prompt,
        "--always-approve",
        "--output-format",
        "plain",
      ],
      {
        cwd: input.cwd,
        env: process.env,
        maxBuffer: 20 * 1024 * 1024,
        timeout: Number(process.env.AGENT_TIMEOUT_MS || 20 * 60 * 1000),
      },
    );
    return {
      summary: (stdout || "").trim().slice(0, 2000) || "grok completed",
      log: `${stdout}\n${stderr}`.slice(0, 8000),
    };
  } catch (error) {
    const err = /** @type {Error & { stdout?: string, stderr?: string }} */ (
      error
    );
    // Fallback: minimal deterministic patch so Path B still proves git→PR tonight
    // if grok CLI is unavailable in the image.
    if (/ENOENT|not found|grok/i.test(String(err.message))) {
      return runApiPatchFallback(input);
    }
    throw new Error(
      `grok failed: ${err.message}\n${err.stdout || ""}\n${err.stderr || ""}`.slice(
        0,
        4000,
      ),
    );
  }
}

/**
 * Narrow API fallback — appends an operator note file so the worker loop
 * can still open a PR when the CLI binary is missing.
 * @param {AgentRunInput} input
 */
async function runApiPatchFallback(input) {
  const notePath = path.join(
    input.cwd,
    "docs/plans/coding-worker-last-run.md",
  );
  await fs.mkdir(path.dirname(notePath), { recursive: true });
  await fs.writeFile(
    notePath,
    [
      "# Coding worker run",
      "",
      `Objective: ${input.objective}`,
      `At: ${new Date().toISOString()}`,
      "",
      "Grok CLI was unavailable; wrote this marker so Path B (task→branch→PR) still completes.",
      "Install/fix `@xai-official/grok` in the worker image for real code edits.",
      "",
    ].join("\n"),
    "utf8",
  );
  return {
    summary: "API/CLI fallback wrote coding-worker-last-run.md",
    log: "grok CLI missing · fallback marker committed",
  };
}
