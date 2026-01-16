import * as schemaV1 from "./schemas/schema_v1.js";
import * as schemaV2 from "./schemas/schema_v2.js";
import { emit } from "./emitter/emit.js";
import { getSession } from "./state/session.js";

/* ------------------ SCHEMA REGISTRY ------------------ */

const schemas = {
  v1: schemaV1,
  v2: schemaV2
};

let activeSchemaKey = "v1";

/* ------------------ DATA ------------------ */

const cards = {
  c1: { id: "c1", title: "Card 1", tags: ["memory"] },
  c2: { id: "c2", title: "Card 2", tags: ["testimony"] },
  c3: { id: "c3", title: "Card 3", tags: ["holocaust"] }
};

const user = {
  anonymousId: "anon-123",
  userId: null
};

/* ------------------ UI ELEMENTS ------------------ */

const schemaSelect = document.getElementById("schema-select");
const previewPanel = document.getElementById("event-preview");

/* ------------------ INIT ------------------ */

Object.entries(schemas).forEach(([key, schema]) => {
  const option = document.createElement("option");
  option.value = key;
  option.textContent = schema.schemaName;
  schemaSelect.appendChild(option);
});

schemaSelect.value = activeSchemaKey;
schemaSelect.addEventListener("change", e => {
  activeSchemaKey = e.target.value;
  previewPanel.textContent = "// schema switched";
});

/* ------------------ EVENT HANDLING ------------------ */

function handleAction(action, cardId) {
  const schema = schemas[activeSchemaKey];
  const card = cards[cardId];
  const session = getSession();

  const event = schema.buildEvent({
    action,
    card,
    session,
    user
  });

  previewPanel.textContent = JSON.stringify(event, null, 2);
  emit(event);
}

/* ------------------ UI ------------------ */

const cardsView = document.getElementById("cards");
const contentView = document.getElementById("content");
const contentTitle = document.getElementById("content-title");
const contentBody = document.getElementById("content-body");
const closeBtn = document.getElementById("close-content");

function openContent(card) {
  contentTitle.textContent = card.title;
  contentBody.textContent = `This is the content for ${card.title}.`;
  cardsView.style.display = "none";
  contentView.style.display = "block";
}

function closeContent() {
  contentView.style.display = "none";
  cardsView.style.display = "grid";
}

closeBtn.addEventListener("click", closeContent);

/* ------------------ BIND UI ------------------ */

document.querySelectorAll(".card").forEach(cardEl => {
  const cardId = cardEl.dataset.cardId;

  cardEl.querySelector(".view")
    .addEventListener("click", () => {
      handleAction("view", cardId);   // emit event
      openContent(cards[cardId]);     // show content
    });

});
