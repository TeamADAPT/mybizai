import {
  claimNextTask,
  completeTask,
  getWorker,
  updateTask,
} from "./store.js";
import { resolveCodingAgent } from "./providers.js";
import {
  commitPushAndPr,
  prepareWorkspace,
  runVerification,
} from "./workspace.js";

let loopRunning = false;

export function kickRunner() {
  if (loopRunning) return;
  loopRunning = true;
  void runLoop().finally(() => {
    loopRunning = false;
  });
}

async function runLoop() {
  while (true) {
    const task = claimNextTask();
    if (!task) return;

    updateTask(task.task_id, { status: "running" });
    let workspaceRoot = null;

    try {
      const workspace = await prepareWorkspace({
        repo: task.repo,
        baseBranch: task.base_branch,
        taskId: task.task_id,
      });
      workspaceRoot = workspace.root;

      const agent = resolveCodingAgent(task.provider || "grok");
      const agentOut = await agent({
        cwd: workspace.cwd,
        prompt: task.prompt || task.objective,
        objective: task.objective,
        appTarget: task.app_target,
      });

      const tests = await runVerification(workspace.cwd);
      try {
        const { commit, pr, changedFiles } = await commitPushAndPr({
          cwd: workspace.cwd,
          branch: workspace.branch,
          token: workspace.token,
          objective: task.objective,
          message: `worker(${task.task_id}): ${task.objective.slice(0, 60)}`,
        });

        completeTask({
          task_id: task.task_id,
          branch: workspace.branch,
          commit,
          pr,
          tests,
          artifacts: changedFiles,
          status: "succeeded",
          summary: agentOut.summary,
        });
      } catch (pushError) {
        const partial =
          /** @type {{ partial?: { commit?: string, pr?: string, changedFiles?: string[], branch?: string, needs_pat?: boolean } }} */ (
            pushError
          ).partial;
        if (partial?.commit && partial?.needs_pat) {
          // Git push worked; only PR permission missing. Surfaced as failed so
          // operators replace GITHUB_TOKEN with a PAT, but Result keeps refs.
          const message =
            pushError instanceof Error ? pushError.message : String(pushError);
          completeTask({
            task_id: task.task_id,
            branch: partial.branch || workspace.branch,
            commit: partial.commit,
            pr: partial.pr || null,
            tests,
            artifacts: partial.changedFiles || [],
            status: "failed",
            error: message,
            summary: `${agentOut.summary} · needs durable GITHUB_TOKEN (PAT) for unattended PR create`,
          });
        } else {
          throw pushError;
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      completeTask({
        task_id: task.task_id,
        branch: null,
        commit: null,
        pr: null,
        tests: { passed: false, log: message },
        artifacts: [],
        status: "failed",
        error: message,
      });
    } finally {
      // Best-effort cleanup
      if (workspaceRoot) {
        try {
          const { rm } = await import("node:fs/promises");
          await rm(workspaceRoot, { recursive: true, force: true });
        } catch {
          /* ignore */
        }
      }
    }

    // One-at-a-time tonight; loop continues if more queued.
    getWorker();
  }
}
