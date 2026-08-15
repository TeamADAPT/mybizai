import http from "node:http";
import { enqueueTask, getResult, getTask, getWorker, listTasks, queueDepth } from "./store.js";
import { kickRunner } from "./runner.js";

const port = Number(process.env.PORT || 8080);
const sharedSecret = process.env.CODING_WORKER_SECRET?.trim() || "";

/**
 * @param {http.IncomingMessage} req
 * @param {string} expected
 */
function authorized(req) {
  if (!sharedSecret) return true; // open until secret is set (dev only)
  const header = req.headers["authorization"] || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  const alt = req.headers["x-coding-worker-secret"];
  return bearer === sharedSecret || alt === sharedSecret;
}

/**
 * @param {http.IncomingMessage} req
 */
async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

/**
 * @param {http.ServerResponse} res
 * @param {number} status
 * @param {unknown} body
 */
function send(res, status, body) {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    "content-type": "application/json",
    "cache-control": "no-store",
  });
  res.end(payload);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && url.pathname === "/health") {
    return send(res, 200, {
      ok: true,
      worker: getWorker(),
      queue_depth: queueDepth(),
    });
  }

  if (req.method === "GET" && url.pathname === "/v1/worker") {
    return send(res, 200, getWorker());
  }

  if (req.method === "GET" && url.pathname === "/v1/tasks") {
    if (!authorized(req)) return send(res, 401, { error: "unauthorized" });
    return send(res, 200, { tasks: listTasks() });
  }

  const taskMatch = url.pathname.match(/^\/v1\/tasks\/([^/]+)$/);
  if (req.method === "GET" && taskMatch) {
    if (!authorized(req)) return send(res, 401, { error: "unauthorized" });
    const task = getTask(taskMatch[1]);
    if (!task) return send(res, 404, { error: "not_found" });
    return send(res, 200, { task, result: getResult(taskMatch[1]) });
  }

  if (req.method === "POST" && url.pathname === "/v1/tasks") {
    if (!authorized(req)) return send(res, 401, { error: "unauthorized" });
    try {
      const body = await readJson(req);
      if (!body.objective || typeof body.objective !== "string") {
        return send(res, 400, { error: "objective required" });
      }
      const task = enqueueTask(body);
      kickRunner();
      return send(res, 202, { task });
    } catch (error) {
      return send(res, 400, {
        error: error instanceof Error ? error.message : "bad_request",
      });
    }
  }

  return send(res, 404, { error: "not_found" });
});

server.listen(port, () => {
  console.log(
    JSON.stringify({
      msg: "coding-worker listening",
      port,
      worker: getWorker(),
    }),
  );
});
