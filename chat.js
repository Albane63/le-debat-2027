// ═══════════════════════════════════════════
// chat.js — V1 enrichie (tracking + persistance)
// ═══════════════════════════════════════════

var userInteractions = JSON.parse(localStorage.getItem("userInteractions")) || {
  conversations: [],
  topics_discussed: {},
  candidates_explored: [],
  regions_explored: [],
  tweets_analyzed: [],
  debats_completed: [],
  positions: [],
  total_messages: 0,
};

function saveInteractions() {
  localStorage.setItem("userInteractions", JSON.stringify(userInteractions));
}

function logInteraction(source, topic, userMsg, aiMsg) {
  let convo = userInteractions.conversations.find(c =>
    c.source === source && c.topic === topic && (Date.now() - c.timestamp) < 600000
  );

  if (!convo) {
    convo = { source, topic, messages: [], timestamp: Date.now() };
    userInteractions.conversations.push(convo);
  }

  if (userMsg) convo.messages.push({ role: "user", text: userMsg });
  if (aiMsg) convo.messages.push({ role: "ai", text: aiMsg });

  convo.timestamp = Date.now();

  if (topic) {
    userInteractions.topics_discussed[topic] =
      (userInteractions.topics_discussed[topic] || 0) + 1;
  }

  if (userMsg) userInteractions.total_messages++;

  saveInteractions();
}

// 🔥 NOUVEAU : prise de position utilisateur
function logUserPosition(topic, position) {
  userInteractions.positions.push({
    topic,
    position,
    timestamp: Date.now(),
  });
  saveInteractions();
}

// ── CHAT UI ──

function createChat(containerId, initialMessage, contextPrompt) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const messages = [{ role: "assistant", content: initialMessage }];

  container.innerHTML = `
    <div class="chat-box" id="${containerId}-box"></div>
    <div class="chat-input-area">
      <input type="text" id="${containerId}-input" placeholder="Dis ce que tu penses..." />
      <button onclick="chatSend('${containerId}')">→</button>
    </div>
  `;

  container.dataset.messages = JSON.stringify(messages);
  container.dataset.context = contextPrompt || "";

  renderChat(containerId);
}

function renderChat(containerId) {
  const container = document.getElementById(containerId);
  const box = document.getElementById(containerId + "-box");
  if (!box) return;

  const messages = JSON.parse(container.dataset.messages || "[]");

  box.innerHTML = messages.map(m =>
    `<div class="chat-msg ${m.role}">${m.content}</div>`
  ).join("");

  box.scrollTop = box.scrollHeight;
}

async function chatSend(containerId) {
  const container = document.getElementById(containerId);
  const input = document.getElementById(containerId + "-input");

  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  input.disabled = true;

  let messages = JSON.parse(container.dataset.messages || "[]");
  messages.push({ role: "user", content: text });

  // Show typing indicator
  container.dataset.messages = JSON.stringify(messages);
  renderChat(containerId);
  const box = document.getElementById(containerId + "-box");
  if (box) {
    box.innerHTML += '<div class="chat-msg assistant typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
    box.scrollTop = box.scrollHeight;
  }

  // Build API messages with context
  const contextPrompt = container.dataset.context || "";
  const apiMessages = messages
    .filter(m => m.role === "user" || m.role === "assistant")
    .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));

  const aiReply = await askAI(apiMessages, contextPrompt ? (AI_SYSTEM + "\n\nContexte: " + contextPrompt) : undefined);

  messages.push({ role: "assistant", content: aiReply });

  container.dataset.messages = JSON.stringify(messages);
  input.disabled = false;

  renderChat(containerId);

  logInteraction("chat", contextPrompt, text, aiReply);
}