// ═══════════════════════════════════════════
// app.js — Navigation + Toutes les pages
// ═══════════════════════════════════════════

let currentPage = "home";
let currentDebatTab = "actu";
let currentActuScope = "national";
let currentArchiveDebate = null;
let currentArchiveSide = "left";

// ═══════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════
function goTo(page) {
  currentPage = page;
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  var el = document.getElementById("page-" + page);
  if (el) el.classList.add("active");
  document.querySelectorAll(".nav-links button").forEach(b => b.classList.remove("active"));
  var btn = document.querySelector('[data-page="' + page + '"]');
  if (btn) btn.classList.add("active");
  window.scrollTo(0, 0);

  if (page === "carte" && typeof regFeatures !== "undefined" && Array.isArray(regFeatures) && regFeatures.length === 0 && typeof initMap === "function") initMap();
  if (page === "bilan" && typeof initBilan === "function") initBilan();
  if (page === "archives") initArchives();
  if (page === "debat") switchToTab(currentDebatTab);
}

// ═══════════════════════════════════════════
// HOME — Countdown
// ═══════════════════════════════════════════
function updateCountdown() {
  var el = document.getElementById("countdown");
  if (!el) return;
  var ms = new Date("2027-04-11T08:00:00") - new Date();
  var d = Math.max(0, Math.floor(ms / 864e5));
  var h = Math.max(0, Math.floor((ms % 864e5) / 36e5));
  var m = Math.max(0, Math.floor((ms % 36e5) / 6e4));
  el.innerHTML =
    '<div class="cd-unit"><span class="cd-num">' + d + '</span><span class="cd-label">jours</span></div>' +
    '<div class="cd-unit"><span class="cd-num">' + h + '</span><span class="cd-label">heures</span></div>' +
    '<div class="cd-unit"><span class="cd-num">' + m + '</span><span class="cd-label">min</span></div>';
}

// ═══════════════════════════════════════════
// HOME — Sondage bars
// ═══════════════════════════════════════════
function renderHomeSondage() {
  var c = document.getElementById("hero-sondage");
  if (!c || typeof CANDIDATES === "undefined" || !Array.isArray(CANDIDATES)) return;
  var sorted = CANDIDATES.slice().sort(function(a,b){ return b.sondage - a.sondage; });
  var max = sorted[0] ? sorted[0].sondage : 1;
  c.innerHTML = sorted.map(function(x) {
    return '<div class="sondage-row"><span class="sondage-name">' + x.name.split(" ").pop() +
      '</span><div class="sondage-bar-bg"><div class="sondage-bar-fill" style="width:' +
      (x.sondage/max*100) + '%;background:' + x.color + '"><span class="sondage-pct">' +
      x.sondage + '%</span></div></div></div>';
  }).join("") + '<p class="sondage-source">Harris Interactive / Ifop — Mars 2026</p>';
}

// ═══════════════════════════════════════════
// HOME — Topics grid
// ═══════════════════════════════════════════
function renderHomeTopics() {
  var c = document.getElementById("topics-grid");
  if (!c || typeof HOT_TOPICS === "undefined" || !Array.isArray(HOT_TOPICS)) return;
  c.innerHTML = HOT_TOPICS.map(function(t) {
    return '<button class="topic-card" onclick="goTo(\'debat\')">' +
      '<span class="topic-emoji">' + t.emoji + '</span>' +
      '<span class="topic-cat">' + t.cat + '</span>' +
      '<h3 class="topic-title">' + t.title + '</h3>' +
      '<p class="topic-desc">' + t.desc + '</p></button>';
  }).join("");
}

// ═══════════════════════════════════════════
// DEBAT — 2 onglets (Actu + Débat de fond)
// ═══════════════════════════════════════════
function switchToTab(tab) {
  currentDebatTab = tab;
  document.querySelectorAll(".debate-mode-card").forEach(function(b) {
    b.classList.toggle("active", b.dataset.debatTab === tab);
  });
  document.querySelectorAll(".debate-tab-panel").forEach(function(p) {
    p.classList.remove("active");
  });
  var panel = document.getElementById("debat-tab-" + tab);
  if (panel) panel.classList.add("active");

  if (tab === "actu") {
    renderActuBubbles(currentActuScope);
    if (typeof initTendances === "function") initTendances();
  }
  if (tab === "challenge" && typeof initDuel === "function") {
    initDuel();
  }
}

// ═══════════════════════════════════════════
// ACTU — Bulles médiatiques
// ═══════════════════════════════════════════
function switchActuScope(scope) {
  currentActuScope = scope;
  document.querySelectorAll(".actu-tab").forEach(function(t) { t.classList.remove("active"); });
  var tabs = document.querySelectorAll(".actu-tab");
  if (scope === "national" && tabs[0]) tabs[0].classList.add("active");
  if (scope === "international" && tabs[1]) tabs[1].classList.add("active");
  renderActuBubbles(scope);
}

function renderActuBubbles(scope) {
  var container = document.getElementById("actu-bubbles");
  if (!container || typeof MEDIA_TOPICS === "undefined") return;
  var topics = MEDIA_TOPICS[scope];
  if (!topics || !topics.length) return;
  var max = Math.max.apply(null, topics.map(function(t){ return t.pct; }));
  if (max < 1) max = 1;

  var html = '<div class="actu-method-bar">' +
    '<span class="actu-method-period">📅 ' + (MEDIA_TOPICS.period || '') + '</span>' +
    '<span class="actu-method-label">JT 20h (TF1, France 2, BFMTV) + presse (Le Monde, Le Figaro, Libération, Les Échos)</span></div>';

  html += '<div class="actu-bubbles-grid">';
  topics.forEach(function(t, i) {
    var size = 70 + (t.pct / max) * 70;
    html += '<div class="actu-bubble-wrap" onclick="openActuTopic(\'' + scope + '\',' + i + ')">' +
      '<div class="actu-bubble" style="width:' + size + 'px;height:' + size + 'px;background:' + t.color + '">' +
      '<span class="actu-bubble-emoji">' + t.emoji + '</span>' +
      '<span class="actu-bubble-pct">' + t.pct + '%</span></div>' +
      '<div class="actu-bubble-label">' + t.label + '</div>' +
      '<div class="actu-bubble-mentions">' + (t.mentions || '') + ' mentions</div></div>';
  });
  html += '</div>';
  html += '<p class="actu-source">⚠️ Données fictives à but éducatif · Mis à jour le ' + (MEDIA_TOPICS.updatedAt || '') + '</p>';
  container.innerHTML = html;
}

function openActuTopic(scope, index) {
  var topics = (typeof MEDIA_TOPICS !== "undefined" && MEDIA_TOPICS[scope]) ? MEDIA_TOPICS[scope] : [];
  var t = topics[index];
  if (!t) return;
  var overlay = document.getElementById("actu-overlay");
  var content = document.getElementById("actu-overlay-content");
  if (!overlay || !content) return;

  var scopeLabel = scope === "national" ? "🇫🇷 nationale" : "🌍 internationale";
  var sourcesHtml = (t.sources || []).map(function(s){ return '<div class="actu-source-item">· ' + s + '</div>'; }).join("");

  content.innerHTML =
  '<div class="actu-detail-layout">' +

    '<div class="actu-detail-main">' +
      '<div class="actu-detail-hero" style="background:' + t.color + '">' +
        '<span class="actu-detail-emoji">' + t.emoji + '</span>' +
        '<div>' +
          '<h2 class="actu-detail-title">' + t.label + '</h2>' +
          '<div class="actu-detail-pct">' + t.pct + '% de couverture ' + scopeLabel + ' · ' + (t.mentions||'') + ' mentions en 7 jours</div>' +
        '</div>' +
      '</div>' +

      '<div class="actu-detail-sections-scroll">' +
        '<div class="actu-detail-section"><h4>📋 De quoi on parle</h4><p>' + t.desc + '</p></div>' +
        '<div class="actu-detail-section"><h4>📡 Contexte</h4><p>' + t.context + '</p></div>' +
        '<div class="actu-detail-section actu-detail-debate"><h4>❓ La question de fond</h4><p class="actu-debate-q">' + t.debate + '</p></div>' +
        '<div class="actu-detail-section"><h4>📰 Sources (' + (MEDIA_TOPICS.period || '') + ')</h4>' +
          '<div class="actu-sources-list">' + sourcesHtml + '</div>' +
          '<p class="actu-method-note">Méthode : ' + (MEDIA_TOPICS.method || '') + '</p>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<aside class="actu-detail-chat">' +
      '<div class="actu-detail-chat-head">' +
        '<h4>💬 Débattre ce sujet</h4>' +
        '<p class="actu-chat-hint">L\'IA te challenge sur ' + t.label + '</p>' +
      '</div>' +
      '<div id="actu-chat" class="panel-chat actu-chat-box"></div>' +
    '</aside>' +

  '</div>';

  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("overlay-open");

  if (typeof createChat === "function") {
    createChat("actu-chat",
      "📰 " + t.label + " — " + t.pct + "% de la couverture (" + (t.mentions||'') + " mentions).\n\n" + t.debate + "\n\nQu'est-ce que tu en penses ? 🤔",
      "Sujet: " + t.label + ". " + t.desc + " Contexte: " + t.context + ". Question: " + t.debate + ". Sois socratique, neutre, français, court."
    );
  }
}

function closeActuOverlay() {
  var overlay = document.getElementById("actu-overlay");
  if (overlay) { overlay.classList.remove("open"); overlay.setAttribute("aria-hidden", "true"); }
  document.body.classList.remove("overlay-open");
}

// ═══════════════════════════════════════════
// CANDIDATS — Partis grid + page dédiée
// ═══════════════════════════════════════════
function initCandidats() { renderPartiesGrid(); }

function renderPartiesGrid() {
  var grid = document.getElementById("parties-grid");
  var detail = document.getElementById("candidat-detail");
  var chat = document.getElementById("candidat-chat-global");
  if (!grid || typeof PARTIES === "undefined") return;
  grid.style.display = "";
  if (detail) detail.style.display = "none";
  if (chat) chat.style.display = "none";

  var html = "";
  PARTIES.forEach(function(p) {
    var main = null;
    if (p.candidats && CANDIDATES) {
      for (var ci = 0; ci < p.candidats.length; ci++) {
        var found = CANDIDATES.find(function(c){ return c.id === p.candidats[ci]; });
        if (found) { main = found; break; }
      }
    }
    html += '<div class="party-card" onclick="selectParty(\'' + p.id + '\')">' +
      '<div class="party-card-top" style="background:' + p.color + '">' +
      '<span class="party-card-emoji">' + p.emoji + '</span>' +
      '<div class="party-card-sondage">' + p.sondage + '%</div></div>' +
      '<div class="party-card-body"><div class="party-card-name">' + p.name + '</div>' +
      '<div class="party-card-position">' + p.position + '</div>' +
      (main ? '<div class="party-card-candidat"><span>' + (main.avatar||'') + '</span> ' + main.name + '</div>' : '') +
      '<div class="party-card-themes">' + (p.themes||[]).slice(0,3).map(function(t){ return '<span class="party-theme-sm">' + t + '</span>'; }).join("") + '</div>' +
      '</div></div>';
  });
  html += '<div class="lepen-warning-full">⚖️ <strong>Marine Le Pen</strong> — Inéligible. Appel 7/07/2026. Si éligible : ~34%.</div>';
  grid.innerHTML = html;
}

function selectParty(partyId) {
  var p = PARTIES.find(function(x){ return x.id === partyId; });
  if (!p) return;
  var grid = document.getElementById("parties-grid");
  var detail = document.getElementById("candidat-detail");
  if (!detail) return;
  grid.style.display = "none";
  detail.style.display = "block";

  var candidats = (p.candidats||[]).map(function(id){ return CANDIDATES.find(function(c){ return c.id === id; }); }).filter(Boolean);
  var trendSvg = buildTrendSvg(p.trend, p.trendLabels, p.color);

  var h = '<button class="btn-back-party" onclick="renderPartiesGrid();window.scrollTo(0,document.getElementById(\'page-candidats\').offsetTop-60)">← Tous les partis</button>';
  h += '<div class="party-page"><div class="party-content">';
  h += '<div class="party-hero" style="background:linear-gradient(135deg,' + p.color + ',' + p.color + 'dd)"><span class="party-hero-emoji">' + p.emoji + '</span><div class="party-hero-info"><h2 class="party-hero-name">' + p.name + '</h2><span class="party-hero-pos">' + p.position + '</span></div><div class="party-hero-score">' + p.sondage + '<span>%</span></div></div>';
  if (trendSvg) h += '<div class="party-section"><h4>📈 Évolution</h4><div class="party-trend">' + trendSvg + '</div></div>';
  h += '<div class="party-section"><h4>🎯 Candidats</h4><div class="party-people-grid">';
  candidats.forEach(function(c) {
    h += '<div class="person-card main" style="border-left-color:' + p.color + '"><div class="person-avatar">' + (c.avatar||'👤') + '</div><div class="person-info"><div class="person-name">' + c.name + ' <span class="person-pct" style="color:' + p.color + '">' + c.sondage + '%</span></div><div class="person-role">' + (c.role||'') + ' · ' + (c.status||'') + '</div><div class="person-desc">' + (c.desc||'') + '</div></div></div>';
  });
  h += '</div></div>';
  h += '<div class="party-section"><h4>👥 Figures clés</h4><div class="party-people-grid">';
  (p.figures||[]).forEach(function(f) {
    h += '<div class="person-card ' + (f.hot?'hot':'') + '"><div class="person-avatar">' + (f.avatar||'👤') + '</div><div class="person-info"><div class="person-name">' + f.name + (f.hot?' <span class="person-hot">🔥</span>':'') + '</div><div class="person-role">' + f.role + (f.note?' · <em>' + f.note + '</em>':'') + '</div></div></div>';
  });
  h += '</div></div>';
  h += '<div class="party-row-2"><div class="party-box ok"><h4>💪 Forces</h4><p>' + (p.force||'') + '</p></div><div class="party-box warn"><h4>⚠️ Faiblesses</h4><p>' + (p.faiblesse||'') + '</p></div></div>';
  h += '<div class="party-section"><h4>📡 Actu</h4><p class="party-actu-text">' + (p.actu||'') + '</p></div>';
  if (p.timeline) {
    h += '<div class="party-section"><h4>📅 Chronologie</h4><div class="party-timeline">';
    p.timeline.forEach(function(t) { h += '<div class="timeline-item"><div class="timeline-dot" style="background:' + p.color + '"></div><span>' + t + '</span></div>'; });
    h += '</div></div>';
  }
  h += '<div class="party-section"><h4>🏷️ Thèmes</h4><div class="party-themes-large">';
  (p.themes||[]).forEach(function(t) { h += '<span class="party-theme-lg" style="border-color:' + p.color + '">' + t + '</span>'; });
  h += '</div></div></div>';
  h += '<div class="party-chat-col"><div class="party-chat-sticky"><h4 class="party-chat-title">💬 Débattre</h4><p class="party-chat-hint">Pose tes questions sur le ' + p.name + '</p><div id="party-chat" class="panel-chat"></div></div></div></div>';

  detail.innerHTML = h;
  if (typeof createChat === "function") {
    createChat("party-chat", p.emoji + " " + p.name + " — " + (p.actu||'') + "\n\nQu'en penses-tu ? 🤔",
      "Parti: " + p.name + ". " + p.position + ". " + p.sondage + "%. Force: " + (p.force||'') + ". Faiblesse: " + (p.faiblesse||'') + ". Challenge socratique.");
  }
  detail.scrollIntoView({ behavior: "smooth" });
}

function selectCandidat(id) {
  if (typeof logCandidateExplored === "function") logCandidateExplored(id);
  var party = (typeof PARTIES !== "undefined") ? PARTIES.find(function(p){ return (p.candidats||[]).indexOf(id) !== -1; }) : null;
  if (party) selectParty(party.id);
}

function buildTrendSvg(data, labels, color) {
  if (!data || data.length < 2) return '';
  var W=500, H=120, pX=35, pY=15;
  var max = Math.max.apply(null, data);
  if (max < 1) max = 1;
  var sX = (W-pX*2)/(data.length-1);
  var pts = data.map(function(v,i){ return { x:pX+i*sX, y:pY+(1-v/max)*(H-pY*2), v:v }; });
  var pathD = pts.map(function(p,i){ return (i===0?'M':'L')+p.x+','+p.y; }).join(' ');
  var areaD = pathD + ' L'+pts[pts.length-1].x+','+(H-pY)+' L'+pts[0].x+','+(H-pY)+' Z';
  var svg = '<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;display:block">';
  svg += '<path d="'+areaD+'" fill="'+color+'" opacity="0.08"/>';
  svg += '<path d="'+pathD+'" fill="none" stroke="'+color+'" stroke-width="2.5" stroke-linejoin="round"/>';
  pts.forEach(function(p){ svg += '<circle cx="'+p.x+'" cy="'+p.y+'" r="3.5" fill="'+color+'" stroke="#fff" stroke-width="1.5"/>'; });
  pts.forEach(function(p,i){ svg += '<text x="'+p.x+'" y="'+(H-2)+'" text-anchor="middle" style="font-size:8px;fill:#94A3B8">'+(labels&&labels[i]?labels[i]:'')+'</text>'; });
  pts.forEach(function(p){ svg += '<text x="'+p.x+'" y="'+(p.y-8)+'" text-anchor="middle" style="font-size:9px;font-weight:700;fill:'+color+'">'+p.v+'%</text>'; });
  svg += '</svg>';
  return svg;
}

// ═══════════════════════════════════════════
// ARCHIVES
// ═══════════════════════════════════════════
function initArchives() {
  var c = document.getElementById("archives-view");
  if (!c || typeof ARCHIVE_DEBATS === "undefined" || !Array.isArray(ARCHIVE_DEBATS)) return;
  var html = '<div class="archives-grid">';
  ARCHIVE_DEBATS.forEach(function(d, i) {
    html += '<button class="archive-card" onclick="openArchiveDebate(' + i + ')">' +
      '<div class="archive-card-thumb">📺</div><div class="archive-card-body">' +
      '<div class="archive-card-title">' + (d.title||'') + '</div>' +
      '<div class="archive-card-date">' + (d.date||'') + '</div>' +
      '<div class="archive-card-desc">' + (d.context||'').substring(0,100) + '...</div></div></button>';
  });
  html += '</div>';
  c.innerHTML = html;
}

function openArchiveDebate(index) {
  if (!Array.isArray(ARCHIVE_DEBATS) || !ARCHIVE_DEBATS[index]) return;
  currentArchiveDebate = ARCHIVE_DEBATS[index];
  currentArchiveSide = "left";
  renderArchiveDetail();
}

function renderArchiveDetail() {
  var d = currentArchiveDebate;
  var c = document.getElementById("archives-view");
  if (!c || !d) return;
  var vid = d.youtubeId ? "https://www.youtube.com/embed/" + d.youtubeId : "";
  var lN = d.leftName || "Camp A";
  var rN = d.rightName || "Camp B";
  var lP = d.leftPosition || d.positionA || "";
  var rP = d.rightPosition || d.positionB || "";

  c.innerHTML =
    '<div class="archives-detail"><div>' +
    '<button class="archive-back-btn" onclick="initArchives()">← Retour</button>' +
    '<div class="debate-panel-intro" style="margin-top:14px"><div class="debate-panel-kicker">📺 Débat historique</div>' +
    '<h3>' + (d.title||'') + '</h3><p>' + (d.date||'') + '</p></div>' +
    '<div class="archives-video-wrap">' + (vid ? '<iframe src="'+vid+'" allowfullscreen></iframe>' : '<div style="padding:24px;color:white">Vidéo indisponible</div>') + '</div>' +
    '<div class="archives-meta-grid">' +
    '<div class="archives-meta-card"><h4>Contexte</h4><p>' + (d.context||'') + '</p></div>' +
    '<div class="archives-meta-card"><h4>Résumé</h4><p>' + (d.resume||d.summary||'') + '</p></div>' +
    '<div class="archives-meta-card"><h4>' + lN + '</h4><p>' + lP + '</p></div>' +
    '<div class="archives-meta-card"><h4>' + rN + '</h4><p>' + rP + '</p></div></div>' +
    '</div><aside class="archives-chat-sticky"><div class="debate-side-card">' +
    '<div class="archive-chat-title">💬 Rejouer le débat</div>' +
    '<div class="archive-chat-sub">Choisis ton camp.</div>' +
    '<div class="archive-chat-switches">' +
    '<button class="archive-chat-switch ' + (currentArchiveSide==="left"?"active":"") + '" onclick="setArchiveSide(\'left\')">Je défends ' + lN + '</button>' +
    '<button class="archive-chat-switch ' + (currentArchiveSide==="right"?"active":"") + '" onclick="setArchiveSide(\'right\')">Je défends ' + rN + '</button></div>' +
    '<div id="archive-chat"></div></div></aside></div>';

  initArchiveChat();
}

function setArchiveSide(side) { currentArchiveSide = side; renderArchiveDetail(); }

function initArchiveChat() {
  if (typeof createChat !== "function" || !currentArchiveDebate) return;
  var d = currentArchiveDebate;
  var uN = currentArchiveSide === "left" ? (d.leftName||"Camp A") : (d.rightName||"Camp B");
  var oN = currentArchiveSide === "left" ? (d.rightName||"Camp B") : (d.leftName||"Camp A");
  createChat("archive-chat",
    "Tu défends " + uN + ". Je joue " + oN + ". Lance ton premier argument.",
    "Débat: " + (d.title||'') + ". Contexte: " + (d.context||'') + ". User=" + uN + ". IA=" + oN + ". Contradicteur, court, ferme."
  );
}

// ═══════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════
document.addEventListener("DOMContentLoaded", function() {
  updateCountdown();
  setInterval(updateCountdown, 60000);
  renderHomeSondage();
  renderHomeTopics();
  initCandidats();
  if (currentPage === "archives") initArchives();
});

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeActuOverlay();
});
// ═══════════════════════════════════════════
// app.js — V1 parcours utilisateur
// ═══════════════════════════════════════════

function openDebatTab(tab) {
  goTo("debat");
  setTimeout(() => switchToTab(tab), 50);
}

// 🔥 AJOUT DANS L’OVERLAY ACTU
function injectUserChoices(topicId) {
  return `
    <div class="actu-user-choice">
      <p>👉 Ta position :</p>
      <div class="actu-choice-buttons">
        <button onclick="handlePosition('${topicId}','agree')">👍 D'accord</button>
        <button onclick="handlePosition('${topicId}','disagree')">👎 Pas d'accord</button>
        <button onclick="handlePosition('${topicId}','unsure')">🤔 Je ne sais pas</button>
      </div>
    </div>
  `;
}

function handlePosition(topic, position) {
  logUserPosition(topic, position);

  const msg = {
    agree: "Tu sembles d'accord. Sur quels arguments précis tu te bases ?",
    disagree: "Intéressant. Quel est ton principal désaccord ?",
    unsure: "C'est normal d'hésiter. Qu'est-ce qui te manque pour te décider ?"
  };

  const chat = document.getElementById("actu-chat-input");
  if (chat) {
    chat.value = msg[position] || "";
    chat.focus();
  }
}