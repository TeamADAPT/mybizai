import { randomUUID } from "node:crypto";

/** @typedef {import('./types.js').CodingTask} CodingTask */
/** @typedef {import('./types.js').CodingWorker} CodingWorker */
/** @typedef {import('./types.js').CodingResult} CodingResult */

const workerId = process.env.WORKER_ID?.trim() || `worker-${randomUUID().slice(0, 8)}`;

/** @type {Map<string, CodingTask>} */
const tasks = new Map();
/** @type {Map<string, CodingResult>} */
const results = new Map();
/** @type {string[]} */
const queue = [];

/** @type {CodingWorker} */
let worker = {
  worker_id: workerId,
  status: "idle",
  current_task: null,
  heartbeat: new Date().toISOString(),
  capabilities: ["grok", "stub"],
};

export function getWorker() {
  worker.heartbeat = new Date().toISOString();
  return { ...worker };
}

export function listTasks() {
  return [...tasks.values()];
}

export function getTask(taskId) {
  return tasks.get(taskId) ?? null;
}

export function getResult(taskId) {
  return results.get(taskId) ?? null;
}

/**
 * @param {Partial<CodingTask> & { objective: string }} input
 * @returns {CodingTask}
 */
export function enqueueTask(input) {
  const task_id = input.task_id?.trim() || `task-${randomUUID().slice(0, 8)}`;
  if (tasks.has(task_id)) {
    throw new Error(`task_id already exists: ${task_id}`);
  }

  /** @type {CodingTask} */
  const task = {
    task_id,
    repo: input.repo?.trim() || process.env.REPO_URL || "https://github.com/TeamADAPT/mybizai",
    base_branch:
      input.base_branch?.trim() ||
      process.env.BASE_BRANCH ||
      "cursor/foundation-backlog-wave-d537",
    objective: input.objective.trim(),
    acceptance_criteria: Array.isArray(input.acceptance_criteria)
      ? input.acceptance_criteria
      : ["Small focused diff", "Tests or typecheck touched surfaces", "Open a PR"],
    app_target:
      input.app_target?.trim() ||
      process.env.APP_TARGET ||
      "http://mybizai.railway.internal:8080",
    environment: input.environment?.trim() || process.env.RAILWAY_ENVIRONMENT || "production",
    budget: input.budget ?? { max_minutes: 45 },
    prompt: input.prompt?.trim() || input.objective.trim(),
    provider: input.provider || process.env.CODING_AGENT_PROVIDER || "grok",
    created_at: new Date().toISOString(),
    status: "queued",
  };

  tasks.set(task_id, task);
  queue.push(task_id);
  return task;
}

export function claimNextTask() {
  if (worker.status === "busy") return null;
  const taskId = queue.shift();
  if (!taskId) return null;
  const task = tasks.get(taskId);
  if (!task) return null;
  task.status = "claimed";
  worker.status = "busy";
  worker.current_task = taskId;
  worker.heartbeat = new Date().toISOString();
  return task;
}

/**
 * @param {string} taskId
 * @param {Partial<CodingTask>} patch
 */
export function updateTask(taskId, patch) {
  const task = tasks.get(taskId);
  if (!task) return null;
  Object.assign(task, patch);
  return task;
}

/**
 * @param {CodingResult} result
 */
export function completeTask(result) {
  results.set(result.task_id, result);
  const task = tasks.get(result.task_id);
  if (task) {
    task.status = result.status === "succeeded" ? "succeeded" : "failed";
  }
  worker.status = "idle";
  worker.current_task = null;
  worker.heartbeat = new Date().toISOString();
  return result;
}

export function queueDepth() {
  return queue.length;
}
