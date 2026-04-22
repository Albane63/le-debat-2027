// ═══════════════════════════════════════════
// tendances.js — Tendances & Décryptage tweets
// Overlay quasi plein écran
// ═══════════════════════════════════════════

let activeTweet = null;

function initTendances() {
  const grid = document.getElementById("tendances-grid");
  const overlay = document.getElementById("tweet-focus-overlay");
  const modalContent = document.getElementById("tweet-focus-modal-content");

  if (!grid || typeof FAKE_TWEETS === "undefined" || !Array.isArray(FAKE_TWEETS)) return;

  if (overlay) {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }

  if (modalContent) {
    modalContent.innerHTML = "";
  }

  grid.innerHTML = FAKE_TWEETS.map((t, i) => {
    const badge = getTrendBadge(t.topic);
    return `
      <div class="tweet-card tweet-card-v2 tweet-card-overlay-trigger" onclick="openTweetDebat(${i})">
        <div class="tweet-topline">
          <span class="tweet-topic-badge">${badge}</span>
          <span class="tweet-open-label">Décrypter</span>
        </div>

        <div class="tweet-header">
          <div class="tweet-avatar">${(t.author || "?")[0]}</div>
          <div>
            <div class="tweet-author">${t.author || "Auteur"}</div>
            <div class="tweet-handle">${t.handle || ""}</div>
          </div>
          <div class="tweet-badge">𝕏</div>
        </div>

        <div class="tweet-text">${t.text || ""}</div>

        <div class="tweet-stats">
          <span>❤️ ${t.likes || 0}</span>
          <span>🔄 ${t.rt || 0}</span>
          <span>🧠 Angle</span>
        </div>

        <div class="tweet-actions tweet-actions-v2">
          <button class="tweet-secondary-btn" onclick="event.stopPropagation(); openTweetDebat(${i})">
            🔍 Ouvrir
          </button>
          <button class="tweet-debat-btn" onclick="event.stopPropagation(); launchDebatFromTendance(${i})">
            ⚔️ Challenge
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function getTrendBadge(topic) {
  switch (topic) {
    case "sondages": return "Sondages";
    case "gauche": return "Gauche";
    case "centre": return "Centre";
    case "systeme": return "Système";
    case "municipales": return "Territoires";
    case "economie": return "Économie";
    default: return "Campagne";
  }
}

function getTopicMeta(topic) {
  const lower = (topic || "").toLowerCase();

  if (lower.includes("sond")) {
    return {
      icon: "📊",
      title: "Derrière les chiffres",
      angle: "Le tweet transforme souvent une intention de vote en récit de victoire ou d’effondrement.",
      missing: "Il manque la marge d’erreur, la dynamique, le second tour et la sociologie du vote.",
      emotion: "Le but est souvent de produire un effet d’inévitabilité."
    };
  }

  if (lower.includes("gauche")) {
    return {
      icon: "🤝",
      title: "Rapport de forces à gauche",
      angle: "Le tweet met en scène la division, l’union ou la rivalité stratégique.",
      missing: "Il manque souvent les divergences de fond entre les lignes politiques.",
      emotion: "Le message joue sur la frustration, la dispersion ou le désir d’unité."
    };
  }

  if (lower.includes("centre")) {
    return {
      icon: "🏛️",
      title: "Succession du bloc central",
      angle: "Le tweet cherche souvent à savoir qui peut incarner l’après-Macron.",
      missing: "Il manque la crédibilité électorale réelle, l’ancrage et la capacité de coalition.",
      emotion: "Le message nourrit l’idée de recomposition ou de vacance du pouvoir."
    };
  }

  if (lower.includes("municip")) {
    return {
      icon: "🗺️",
      title: "Lecture territoriale",
      angle: "Le tweet lit le national à travers des signaux locaux.",
      missing: "Il manque la différence entre vote local, vote intermédiaire et présidentielle.",
      emotion: "Le message donne l’impression qu’une bascule locale annonce déjà 2027."
    };
  }

  if (lower.includes("econ")) {
    return {
      icon: "💰",
      title: "Traduction économique",
      angle: "Le tweet convertit une difficulté matérielle en récit politique.",
      missing: "Il manque souvent les ordres de grandeur, les causes multiples et les délais d’effet.",
      emotion: "Le message active l’angoisse matérielle et le sentiment de déclassement."
    };
  }

  return {
    icon: "🎯",
    title: "Lecture politique",
    angle: "Le tweet simplifie une réalité complexe pour produire une lecture immédiate.",
    missing: "Il manque souvent du contexte, des chiffres et des hypothèses alternatives.",
    emotion: "Le message cherche un réflexe d’adhésion ou de rejet."
  };
}

function getTweetUnderlyingThemes(tweet) {
  const text = (tweet?.text || "").toLowerCase();
  const themes = [];

  const push = (label) => {
    if (!themes.includes(label)) themes.push(label);
  };

  if (text.match(/retraite|64 ans|62 ans|pension|cotis/)) push("Retraites");
  if (text.match(/immigr|fronti|asile|migrant/)) push("Immigration");
  if (text.match(/sécur|secur|police|violence|émeute|délinq/)) push("Sécurité");
  if (text.match(/europe|ue|bruxelles|souverain/)) push("Europe / Souveraineté");
  if (text.match(/pouvoir d'achat|inflation|prix|essence|emploi|usine/)) push("Économie / Pouvoir d’achat");
  if (text.match(/écolog|ecolog|climat|énergie|nucléaire/)) push("Écologie");
  if (text.match(/sondage|vote|second tour|intentions/)) push("Sondages");
  if (text.match(/gauche|lfi|ps|glucksmann|ruffin|union/)) push("Gauche");
  if (text.match(/rn|bardella|le pen|reconquête/)) push("Droite nationale");
  if (text.match(/macron|centre|bloc central|système|systeme|élite/)) push("Bloc central / Système");

  if (themes.length === 0) {
    push("Campagne");
    push("Cadrage médiatique");
    push("Rapport de forces");
  }

  return themes.slice(0, 6);
}

function openTweetDebat(index) {
  if (!Array.isArray(FAKE_TWEETS) || !FAKE_TWEETS[index]) return;
  activeTweet = FAKE_TWEETS[index];
  renderTweetOverlay(index);
}

function renderTweetOverlay(index) {
  const overlay = document.getElementById("tweet-focus-overlay");
  const modalContent = document.getElementById("tweet-focus-modal-content");
  if (!overlay || !modalContent || !activeTweet) return;

  const meta = getTopicMeta(activeTweet.topic);
  const themes = getTweetUnderlyingThemes(activeTweet);

  modalContent.innerHTML = `
    <div class="tweet-focus-layout">
      <div class="tweet-focus-main">
        <div class="tweet-focus-kicker">🔥 Tendance ouverte</div>

        <div class="tweet-focus-source tweet-card tweet-card-active tweet-card-active-v2">
          <div class="tweet-topline">
            <span class="tweet-topic-badge">${getTrendBadge(activeTweet.topic)}</span>
            <span class="tweet-open-label">Mode focus</span>
          </div>

          <div class="tweet-header">
            <div class="tweet-avatar">${(activeTweet.author || "?")[0]}</div>
            <div>
              <div class="tweet-author">${activeTweet.author || "Auteur"}</div>
              <div class="tweet-handle">${activeTweet.handle || ""}</div>
            </div>
            <div class="tweet-badge">𝕏</div>
          </div>

          <div class="tweet-text tweet-focus-text">${activeTweet.text || ""}</div>

          <div class="tweet-stats tweet-stats-focus">
            <span>❤️ ${activeTweet.likes || 0}</span>
            <span>🔄 ${activeTweet.rt || 0}</span>
            <span>${meta.icon} ${meta.title}</span>
          </div>
        </div>

        <div class="tweet-focus-grid">
          <div class="tweet-focus-card-block">
            <h4>🎯 Ce que ce tweet essaie de faire</h4>
            <p>${meta.angle}</p>
          </div>

          <div class="tweet-focus-card-block">
            <h4>🧩 Ce qui manque pour juger</h4>
            <p>${meta.missing}</p>
          </div>
        </div>

        <div class="tweet-focus-card-block tweet-focus-card-block-full">
          <h4>⚡ Effet émotionnel / cadrage</h4>
          <p>${meta.emotion}</p>
        </div>

        <div class="tweet-focus-card-block tweet-focus-card-block-full">
          <h4>🏷️ Thèmes sous-jacents</h4>
          <div class="tweet-focus-chips">
            ${themes.map(t => `<span class="tweet-focus-chip">${t}</span>`).join("")}
          </div>
        </div>

        <div class="tweet-focus-card-block tweet-focus-card-block-full">
          <h4>❓ Questions utiles avant d’avoir un avis</h4>
          <ul class="tweet-focus-questions">
            <li>Est-ce un fait, une interprétation ou un cadrage militant ?</li>
            <li>Quelle donnée manque pour vérifier le message ?</li>
            <li>Quel électorat ce tweet cherche-t-il à toucher ?</li>
          </ul>
        </div>
      </div>

      <aside class="tweet-focus-ai">
        <div class="tweet-focus-ai-head">
          <div class="tweet-focus-kicker">🤖 IA</div>
          <h3>Parler de ce tweet</h3>
          <p>L’IA te challenge sur les faits, les raccourcis, les biais et les angles morts.</p>
        </div>

        <div class="tweet-focus-ai-actions">
          <button onclick="launchDebatFromTendance(${index})">⚔️ Passer en challenge</button>
        </div>

        <div id="tendance-chat-box" class="panel-chat tweet-focus-chat-box"></div>
      </aside>
    </div>
  `;

  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("overlay-open");

  if (typeof createChat === "function") {
    createChat(
      "tendance-chat-box",
      `Ce tweet dit : "${activeTweet.text}"

Avant d’être d’accord ou non, essayons de le décortiquer. Est-ce un fait, une interprétation, un cadrage politique ou un raccourci ?`,
      `L'utilisateur analyse ce tweet : "${activeTweet.text}".
Aide-le à distinguer :
- fait vs opinion
- cadrage émotionnel
- thème politique sous-jacent
- information manquante
- meilleur contre-argument possible

Style : socratique, neutre, français, court, intelligent.`
    );
  }
}

function closeTweetOverlay() {
  const overlay = document.getElementById("tweet-focus-overlay");
  const modalContent = document.getElementById("tweet-focus-modal-content");

  if (overlay) {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }

  if (modalContent) {
    modalContent.innerHTML = "";
  }

  document.body.classList.remove("overlay-open");
  activeTweet = null;
}

function launchDebatFromTendance(tweetIndex) {
  closeTweetOverlay();

  if (typeof goTo === "function") goTo("debat");
  if (typeof switchToTab === "function") switchToTab("challenge");

  if (typeof startDebatFromTweet === "function") {
    startDebatFromTweet(tweetIndex);
  } else {
    console.warn("startDebatFromTweet non disponible — duel.js pas chargé ?");
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeTweetOverlay();
  }
});