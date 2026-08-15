/**
 * Contracts sized for one worker tonight, N workers later.
 * Keep these shapes stable — providers swap under CodingAgent.
 */

/** @typedef {'queued'|'claimed'|'running'|'succeeded'|'failed'|'cancelled'} TaskStatus */
/** @typedef {'idle'|'busy'|'draining'|'error'} WorkerStatus */
/** @typedef {'grok'|'codex'|'claude'|'cursor'|'nova'|'stub'} AgentProviderId */

/**
 * @typedef {object} CodingTask
 * @property {string} task_id
 * @property {string} repo
 * @property {string} base_branch
 * @property {string} objective
 * @property {string[]} acceptance_criteria
 * @property {string} [app_target]
 * @property {string} [environment]
 * @property {{ max_minutes?: number, max_dollars?: number }} [budget]
 * @property {string} [prompt]
 * @property {AgentProviderId} [provider]
 * @property {string} [created_at]
 * @property {TaskStatus} [status]
 */

/**
 * @typedef {object} CodingWorker
 * @property {string} worker_id
 * @property {WorkerStatus} status
 * @property {string|null} current_task
 * @property {string} heartbeat
 * @property {AgentProviderId[]} capabilities
 */

/**
 * @typedef {object} CodingResult
 * @property {string} task_id
 * @property {string|null} branch
 * @property {string|null} commit
 * @property {string|null} pr
 * @property {{ passed: boolean, log: string }} tests
 * @property {string[]} artifacts
 * @property {'succeeded'|'failed'} status
 * @property {string} [error]
 * @property {string} [summary]
 */

export {};
