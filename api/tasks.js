const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const json = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

const requireSupabase = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required.");
  }
};

const readBody = async (req) => {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");

  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 10_000_000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });
    req.on("error", reject);
  });
};

const supabaseFetch = (path, options = {}) => fetch(`${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1${path}`, {
  ...options,
  headers: {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
    ...(options.headers || {})
  }
});

module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed." });

  try {
    requireSupabase();
    const body = await readBody(req);
    const task = body.task || body;
    if (!task?.id) return json(res, 400, { error: "Task id is required." });

    const row = {
      id: task.id,
      title: task.title || "",
      category: task.category || "",
      reward: task.reward || "",
      time_limit_minutes: task.timeLimitMinutes || "",
      description: task.description || "",
      before_text: task.beforeText || task.finalBeforeText || "",
      after_text: task.afterText || task.finalAfterText || "",
      payload: task
    };

    const response = await supabaseFetch("/tasks?on_conflict=id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(row)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Failed to save task.");
    json(res, 200, { ok: true, task: data[0]?.payload || task });
  } catch (error) {
    json(res, 500, { error: error.message });
  }
};
