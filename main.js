import * as schemaV1 from "./schemas/schema_v1.js";
import * as schemaV2 from "./schemas/schema_v2.js";

/* ------------------ SESSION & USER ------------------ */

const session = {
  id: crypto.randomUUID(),
  started_at: Date.now()
};

const user = {
  anonymous_id: "anon-123",
  user_id: null
};

/* ------------------ SCHEMA REGISTRY ------------------ */

const schemas = {
  v1: schemaV1,
  v2: schemaV2
};

let activeSchema = schemas.v1;

/* ------------------ UI: SCHEMA SELECT ------------------ */

const schemaSelect = document.getElementById("schema-select");

Object.entries(schemas).forEach(([key, schema]) => {
  const opt = document.createElement("option");
  opt.value = key;
  opt.textContent = schema.schemaName;
  schemaSelect.appendChild(opt);
});

schemaSelect.value = "v1";

schemaSelect.addEventListener("change", e => {
  activeSchema = schemas[e.target.value];
  logSystem(`Switched to ${activeSchema.schemaName}`);
});

/* ------------------ EMITTER ------------------ */

const consoleEl = document.getElementById("console");

function emit(event) {
  logEvent(event);
}

function logEvent(event) {
  const line = document.createElement("div");
  line.className = "console-line";
  line.textContent =
    `[${new Date().toISOString()}]\n${JSON.stringify(event, null, 2)}`;
  consoleEl.appendChild(line);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function logSystem(msg) {
  const line = document.createElement("div");
  line.className = "console-line";
  line.style.background = "#334155";
  line.textContent = `[SYSTEM] ${msg}`;
  consoleEl.appendChild(line);
}

/* ------------------ UI STATE ------------------ */

const overlay = document.getElementById("overlay");
const zoomTitle = document.getElementById("zoomTitle");
const timerEl = document.getElementById("timer");
const closeBtn = document.getElementById("closeBtn");

let activeItemId = null;
let startTime = null;
let interval = null;

/* ------------------ OPEN / CLOSE ------------------ */

function openContent({ id, title }) {
  activeItemId = id;
  startTime = Date.now();

  zoomTitle.textContent = title;
  overlay.classList.add("open");

  interval = setInterval(() => {
    timerEl.textContent =
      Math.floor((Date.now() - startTime) / 1000);
  }, 1000);

  emit(activeSchema.view_start({
    item_id: id,
    session,
    user
  }));
}

function closeContent() {
  if (!activeItemId) return;

  emit(activeSchema.view_end({
    item_id: activeItemId,
    dwell_ms: Date.now() - startTime,
    session,
    user
  }));

  clearInterval(interval);
  overlay.classList.remove("open");
  timerEl.textContent = "0";

  activeItemId = null;
  startTime = null;
}

/* ------------------ BINDINGS ------------------ */

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    openContent({
      id: card.dataset.id,
      title: card.dataset.title
    });
  });
});

closeBtn.addEventListener("click", closeContent);
overlay.addEventListener("click", e => {
  if (e.target === overlay) closeContent();
});
