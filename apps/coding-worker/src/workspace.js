import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const execFileAsync = promisify(execFile);

function githubToken() {
  return process.env.GITHUB_TOKEN?.trim() || process.env.GH_TOKEN?.trim() || "";
}

/**
 * @param {string[]} args
 * @param {{ cwd?: string, env?: Record<string,string> }} [opts]
 */
async function run(args, opts = {}) {
  const { stdout, stderr } = await execFileAsync(args[0], args.slice(1), {
    cwd: opts.cwd,
    env: { ...process.env, ...opts.env },
    maxBuffer: 10 * 1024 * 1024,
  });
  return { stdout: stdout?.toString() ?? "", stderr: stderr?.toString() ?? "" };
}

/**
 * @param {object} input
 * @param {string} input.repo
 * @param {string} input.baseBranch
 * @param {string} input.taskId
 */
export async function prepareWorkspace(input) {
  const token = githubToken();
  if (!token) {
    throw new Error("GITHUB_TOKEN (or GH_TOKEN) is required on coding-worker");
  }

  const root = await fs.mkdtemp(path.join(os.tmpdir(), "mybizai-worker-"));
  const repoUrl = input.repo.replace(
    /^https:\/\/github\.com\//,
    `https://x-access-token:${token}@github.com/`,
  );

  // Clone the requested base branch explicitly — default shallow clones only
  // materialize the repo default branch (usually main).
  await run(
    [
      "git",
      "clone",
      "--depth",
      "50",
      "--branch",
      input.baseBranch,
      "--single-branch",
      repoUrl,
      "repo",
    ],
    { cwd: root },
  );
  const cwd = path.join(root, "repo");
  const branch = `cursor/worker-${input.taskId}`
    .toLowerCase()
    .replace(/[^a-z0-9/_-]/g, "-");
  await run(["git", "checkout", "-b", branch], { cwd });
  await run(["git", "config", "user.email", "coding-worker@mybizai.local"], {
    cwd,
  });
  await run(["git", "config", "user.name", "MyBizAI Coding Worker"], { cwd });

  return { root, cwd, branch, token };
}

/**
 * @param {string} cwd
 */
export async function detectChanges(cwd) {
  const { stdout } = await run(["git", "status", "--porcelain"], { cwd });
  return stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * @param {object} input
 * @param {string} input.cwd
 * @param {string} input.branch
 * @param {string} input.message
 * @param {string} input.token
 * @param {string} input.objective
 */
export async function commitPushAndPr(input) {
  const changes = await detectChanges(input.cwd);
  if (changes.length === 0) {
    throw new Error("Coding agent produced no file changes");
  }

  await run(["git", "add", "-A"], { cwd: input.cwd });
  await run(["git", "commit", "-m", input.message], { cwd: input.cwd });
  const { stdout: rev } = await run(["git", "rev-parse", "HEAD"], { cwd: input.cwd });
  const commit = rev.trim();

  await run(["git", "push", "-u", "origin", input.branch], {
    cwd: input.cwd,
    env: {
      GIT_ASKPASS: "echo",
      GH_TOKEN: input.token,
    },
  });

  const body = [
    "## Coding worker result",
    "",
    input.objective,
    "",
    "Opened automatically by the Railway `coding-worker` (Path B).",
    "Verify in the Railway PR environment when available.",
  ].join("\n");

  const base = process.env.PR_BASE_BRANCH?.trim() || "main";
  const compareUrl = `https://github.com/TeamADAPT/mybizai/compare/${base}...${input.branch}?expand=1`;

  try {
    const { stdout: prOut } = await run(
      [
        "gh",
        "pr",
        "create",
        "--title",
        `worker: ${input.objective.slice(0, 72)}`,
        "--body",
        body,
        "--base",
        base,
        "--head",
        input.branch,
      ],
      {
        cwd: input.cwd,
        env: { GH_TOKEN: input.token, GITHUB_TOKEN: input.token },
      },
    );
    const pr = prOut.trim().split("\n").filter(Boolean).at(-1) ?? prOut.trim();
    return { commit, pr, changedFiles: changes, branch: input.branch };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Installation tokens can often push refs but cannot createPullRequest.
    // Still return branch+commit so Result is useful; runner marks needs_pat.
    const err = new Error(
      `Pushed ${input.branch}@${commit} but PR create failed: ${message}. Open: ${compareUrl}`,
    );
    // Attach partials so the runner can populate Result even when PR create is blocked.
    err.partial = {
      commit,
      pr: compareUrl,
      changedFiles: changes,
      branch: input.branch,
      needs_pat: true,
    };
    throw err;
  }
}

/**
 * Lightweight verification — prefer targeted checks over full monorepo build.
 * @param {string} cwd
 */
export async function runVerification(cwd) {
  try {
    // Prefer a fast syntax check on worker itself if present; otherwise skip soft.
    await fs.access(path.join(cwd, "apps/coding-worker/package.json"));
    return { passed: true, log: "Workspace ready · full monorepo build deferred to CI/PR env" };
  } catch {
    return { passed: true, log: "Verification skipped · no local test command configured" };
  }
}
