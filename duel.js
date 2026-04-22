// ═══════════════════════════════════════════
// duel.js — Mode Débat Challenge (1v1 vs IA)
// ═══════════════════════════════════════════
 
let currentDebat = null;
let debatHistory = [];
let debatRound = 0;
const MAX_ROUNDS = 5;
let userSide = null;    // "for" ou "against"
let debatFinished = false;
let isAiTyping = false;
 
// ─── INITIALISATION ───────────────────────
 
function initDuel() {
  debatFinished = false;
  debatRound = 0;
  renderDebatSetup();
}
 
function renderDebatSetup() {
  const grid = document.getElementById("duel-topics");
  if (!grid) return;
 
  // Sujets permanents
  const permanentHTML = DUEL_SUBJECTS.map(d => `
    <button class="duel-topic-btn" onclick="chooseDebatSide('${d.id}')">
      <span class="duel-topic-emoji">${d.emoji}</span>
      <span class="duel-topic-title">${d.title}</span>
    </button>
  `).join("");
 
  // Sujet libre
  const freeHTML = `
    <div class="debat-free-topic">
      <div class="debat-free-label">✍️ Propose ton sujet</div>
      <div class="debat-free-row">
        <input type="text" id="debat-free-input" class="debat-free-field"
          placeholder="Ex: Faut-il interdire les jets privés ?"
          onkeydown="if(event.key==='Enter') startFreeTopic()" />
        <button class="debat-free-go" onclick="startFreeTopic()">Débattre</button>
      </div>
    </div>
  `;
 
  // Tendances (si FAKE_TWEETS existe)
  let tendancesHTML = "";
  if (typeof FAKE_TWEETS !== "undefined" && FAKE_TWEETS.length > 0) {
    const trending = FAKE_TWEETS.slice(0, 3);
    tendancesHTML = `
      <div class="debat-section-label">🔥 Depuis les tendances</div>
      <div class="debat-trending-cards">
        ${trending.map((t, i) => `
          <button class="debat-trending-btn" onclick="startDebatFromTweet(${i})">
            <span class="debat-trending-text">${truncate(t.text, 80)}</span>
            <span class="debat-trending-author">— ${t.author}</span>
          </button>
        `).join("")}
      </div>
    `;
  }
 
  grid.innerHTML = `
    <div class="debat-section-label">⚔️ Grands débats</div>
    <div class="debat-permanent-grid">${permanentHTML}</div>
    ${tendancesHTML}
    ${freeHTML}
  `;
}
 
function truncate(str, max) {
  return str.length > max ? str.substring(0, max) + "…" : str;
}
 
// ─── CHOIX DU CAMP ────────────────────────
 
function chooseDebatSide(subjectId) {
  currentDebat = DUEL_SUBJECTS.find(d => d.id === subjectId);
  if (!currentDebat) return;
  showSideChooser();
}
 
function startDebatFromTweet(tweetIndex) {
  const tweet = FAKE_TWEETS[tweetIndex];
  if (!tweet) return;
 
  // Crée un sujet de débat à partir du tweet
  currentDebat = {
    id: "tweet_" + tweetIndex,
    emoji: "🐦",
    title: truncate(tweet.text, 60),
    tweetSource: tweet,
    // On définit 2 camps génériques, l'IA adaptera
    left: {
      label: "D'accord avec ce tweet",
      avatar: "✅",
      persona: `Tu défends la position exprimée dans ce tweet : "${tweet.text}". Tu argumentes en faveur de ce point de vue avec des faits et de la logique.`
    },
    right: {
      label: "Contre ce tweet",
      avatar: "❌",
      persona: `Tu t'opposes à la position exprimée dans ce tweet : "${tweet.text}". Tu argumentes contre ce point de vue avec des faits et de la logique.`
    }
  };
  showSideChooser();
}
 
function startFreeTopic() {
  const input = document.getElementById("debat-free-input");
  const text = input.value.trim();
  if (!text) return;
 
  currentDebat = {
    id: "free_" + Date.now(),
    emoji: "💡",
    title: truncate(text, 60),
    fullQuestion: text,
    left: {
      label: "Pour",
      avatar: "✅",
      persona: `Tu défends la position "Pour" sur le sujet : "${text}". Argumente avec des faits, des exemples concrets et de la logique.`
    },
    right: {
      label: "Contre",
      avatar: "❌",
      persona: `Tu défends la position "Contre" sur le sujet : "${text}". Argumente avec des faits, des exemples concrets et de la logique.`
    }
  };
  showSideChooser();
}
 
function showSideChooser() {
  document.getElementById("duel-setup").style.display = "none";
  document.getElementById("duel-arena").style.display = "block";
 
  const arena = document.getElementById("duel-arena");
  arena.innerHTML = `
    <div class="debat-side-chooser">
      <div class="debat-side-title">${currentDebat.emoji} ${currentDebat.title}</div>
      <div class="debat-side-question">Quel camp veux-tu défendre ?</div>
      <div class="debat-side-options">
        <button class="debat-side-btn for" onclick="startDebat('for')">
          <span class="debat-side-avatar">${currentDebat.left.avatar}</span>
          <span class="debat-side-label">${currentDebat.left.label}</span>
        </button>
        <div class="debat-side-vs">VS</div>
        <button class="debat-side-btn against" onclick="startDebat('against')">
          <span class="debat-side-avatar">${currentDebat.right.avatar}</span>
          <span class="debat-side-label">${currentDebat.right.label}</span>
        </button>
      </div>
      <button class="debat-side-random" onclick="startDebat(Math.random()>0.5?'for':'against')">
        🎲 Choisis pour moi
      </button>
    </div>
  `;
}
 
// ─── LANCEMENT DU DÉBAT ───────────────────
 
function startDebat(side) {
  userSide = side;
  debatHistory = [];
  debatRound = 0;
  debatFinished = false;
 
  const aiSide = side === "for" ? "right" : "left";
  const userCamp = side === "for" ? currentDebat.left : currentDebat.right;
  const aiCamp = side === "for" ? currentDebat.right : currentDebat.left;
 
  // Store references for easy access
  currentDebat._userCamp = userCamp;
  currentDebat._aiCamp = aiCamp;
  currentDebat._aiSide = aiSide;
 
  const arena = document.getElementById("duel-arena");
  arena.innerHTML = `
    <div id="debat-header">
      <div class="debat-match-title">${currentDebat.emoji} ${currentDebat.title}</div>
      <div class="debat-match-fighters">
        <div class="debat-fighter user-fighter">
          <span class="debat-fighter-avatar">🧑</span>
          <span class="debat-fighter-name">Toi</span>
          <span class="debat-fighter-camp">${userCamp.label}</span>
        </div>
        <div class="debat-fighter-vs">VS</div>
        <div class="debat-fighter ai-fighter">
          <span class="debat-fighter-avatar">🤖</span>
          <span class="debat-fighter-name">IA</span>
          <span class="debat-fighter-camp">${aiCamp.label}</span>
        </div>
      </div>
      <div class="debat-round-tracker" id="debat-round-tracker">
        ${renderRoundDots()}
      </div>
    </div>
    <div id="debat-messages" class="debat-messages"></div>
    <div id="debat-input-zone" class="debat-input-zone">
      <div class="debat-round-label" id="debat-round-label">Round 1/${MAX_ROUNDS} — À toi de commencer ! Lance ton premier argument.</div>
      <div class="debat-input-row">
        <textarea id="debat-input" class="debat-input-field"
          placeholder="Ton argument..."
          onkeydown="if(event.key==='Enter' && !event.shiftKey){event.preventDefault();debatSend()}"
          rows="2"></textarea>
        <button class="debat-send-btn" onclick="debatSend()" id="debat-send-btn">Envoyer</button>
      </div>
    </div>
    <div id="debat-synthesis" class="debat-synthesis" style="display:none"></div>
  `;
}
 
function renderRoundDots() {
  let dots = "";
  for (let i = 0; i < MAX_ROUNDS; i++) {
    const state = i < debatRound ? "done" : (i === debatRound ? "active" : "pending");
    dots += `<span class="round-dot ${state}">${i + 1}</span>`;
  }
  return dots;
}
 
function updateRoundTracker() {
  const tracker = document.getElementById("debat-round-tracker");
  if (tracker) tracker.innerHTML = renderRoundDots();
}
 
// ─── ENVOI DE MESSAGE ─────────────────────
 
async function debatSend() {
  if (debatFinished || isAiTyping) return;
  const input = document.getElementById("debat-input");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  input.focus();
 
  debatRound++;
 
  // Message utilisateur
  debatHistory.push({ side: "user", text: text, round: debatRound });
  renderDebatMessages();
  updateRoundTracker();
 
  // Disable input pendant la réponse IA
  setInputEnabled(false);
  showTypingIndicator();
 
  // Réponse IA
  const aiReply = await generateDebatReply(text);
  hideTypingIndicator();
  debatHistory.push({ side: "ai", text: aiReply, round: debatRound });
  renderDebatMessages();
 
  if (debatRound >= MAX_ROUNDS) {
    // Fin du débat → synthèse
    debatFinished = true;
    document.getElementById("debat-input-zone").style.display = "none";
    await showSynthesis();
  } else {
    setInputEnabled(true);
    const label = document.getElementById("debat-round-label");
    if (label) label.textContent = `Round ${debatRound + 1}/${MAX_ROUNDS} — Réponds à l'IA !`;
  }
}
 
function setInputEnabled(enabled) {
  const input = document.getElementById("debat-input");
  const btn = document.getElementById("debat-send-btn");
  if (input) input.disabled = !enabled;
  if (btn) btn.disabled = !enabled;
  isAiTyping = !enabled;
}
 
function showTypingIndicator() {
  const container = document.getElementById("debat-messages");
  const typing = document.createElement("div");
  typing.id = "ai-typing";
  typing.className = "duel-msg ai";
  typing.innerHTML = `
    <div class="duel-msg-avatar">🤖</div>
    <div class="duel-msg-bubble">
      <div class="duel-msg-label">${currentDebat._aiCamp.label}</div>
      <div class="typing-dots"><span></span><span></span><span></span></div>
    </div>
  `;
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
}
 
function hideTypingIndicator() {
  const typing = document.getElementById("ai-typing");
  if (typing) typing.remove();
}
 
// ─── RENDU DES MESSAGES ───────────────────
 
function renderDebatMessages() {
  const container = document.getElementById("debat-messages");
  if (!container) return;
 
  container.innerHTML = debatHistory.map(m => {
    const isUser = m.side === "user";
    const avatar = isUser ? "🧑" : "🤖";
    const label = isUser ? "Toi" : currentDebat._aiCamp.label;
    const sideClass = isUser ? "user" : "ai";
 
    return `
      <div class="duel-msg ${sideClass}">
        <div class="duel-msg-avatar">${avatar}</div>
        <div class="duel-msg-bubble">
          <div class="duel-msg-label">${label} ${m.round ? `· Round ${m.round}` : ""}</div>
          <div class="duel-msg-text">${m.text}</div>
        </div>
      </div>
    `;
  }).join("");
 
  container.scrollTop = container.scrollHeight;
}
 
// ─── GÉNÉRATION RÉPONSE IA ────────────────
 
async function generateDebatReply(userText) {
  if (typeof API_KEY !== "undefined" && API_KEY && API_KEY.length > 10) {
    const persona = currentDebat._aiCamp.persona ||
      `Tu incarnes la position "${currentDebat._aiCamp.label}" sur le sujet "${currentDebat.title}".`;
 
    const systemPrompt = `${persona}
Tu es dans un débat 1 contre 1 avec l'utilisateur. Tu défends ton camp avec conviction.
Règles :
- Réponds en 2-4 phrases percutantes maximum
- Utilise des faits, chiffres et exemples concrets
- Réponds directement à l'argument de ton adversaire avant de développer le tien
- Sois passionné mais respectueux, jamais insultant
- En français
Round ${debatRound}/${MAX_ROUNDS}.`;
 
    const msgs = debatHistory
      .map(m => ({
        role: m.side === "user" ? "user" : "assistant",
        content: m.text
      }));
    msgs.push({ role: "user", content: userText });
 
    try {
      return await callRealAPI(msgs, systemPrompt);
    } catch(e) {
      console.error("API error:", e);
    }
  }
 
  // Fallback : réponses simulées
  return getSimulatedReply(userText);
}
 
function getSimulatedReply(userText) {
  const aiSide = currentDebat._aiSide; // "left" or "right"
  const topicId = currentDebat.id;
 
  // Réponses simulées par sujet
  const simulated = {
    immigration: {
      left: [
        "Les chiffres parlent : 500 000 titres de séjour par an. Nos hôpitaux, nos écoles, nos logements ne suivent plus. C'est de la responsabilité, pas du racisme.",
        "Regardez le Danemark, gouverné par la gauche : ils ont durci leur politique migratoire et ça fonctionne. Être ferme n'est pas être inhumain.",
        "L'accueil inconditionnel est une posture morale confortable, mais ce sont les classes populaires qui en paient le prix dans leur quotidien.",
      ],
      right: [
        "Sans immigration, qui va travailler dans nos hôpitaux, nos chantiers, nos restaurants ? 1 médecin sur 4 en France est d'origine étrangère.",
        "Les études économiques le montrent : l'immigration nette contribue positivement au PIB. Le problème n'est pas l'immigration, c'est l'intégration.",
        "Rappelons que la France vieillit. Sans apport démographique, c'est notre système de retraites qui s'effondre.",
      ],
    },
    retraites: {
      left: [
        "Les caissières, les ouvriers du BTP, les aides-soignantes — eux, ils ne vivent pas jusqu'à 85 ans. La retraite à 64 ans, c'est les priver de tout.",
        "On pourrait financer les retraites autrement : taxer les super-profits, élargir l'assiette des cotisations. C'est un choix politique, pas une fatalité.",
        "L'espérance de vie en bonne santé stagne. Repousser l'âge de départ, c'est condamner des millions de Français à travailler malades.",
      ],
      right: [
        "En 1950, on cotisait pendant 35 ans pour 5 ans de retraite. Aujourd'hui c'est 40 ans pour 25 ans de retraite. Les maths ne mentent pas.",
        "Chaque pays européen repousse l'âge de départ. L'Allemagne est à 67 ans. La France à 64, c'est encore en dessous de la moyenne.",
        "Le ratio actifs/retraités passe de 4:1 à 1,7:1. Sans ajustement, ce sont les jeunes générations qui paieront l'addition.",
      ],
    },
    securite: {
      left: [
        "Quand une agression se produit toutes les 40 secondes en France, le 'social' ne suffit plus. Les victimes ont besoin de protection MAINTENANT.",
        "Singapour a l'un des taux de criminalité les plus bas au monde grâce à une politique de tolérance zéro. La fermeté, ça fonctionne.",
        "La justice prononce des peines qu'elle n'applique pas. 100 000 peines de prison non exécutées. Le laxisme est documenté.",
      ],
      right: [
        "Les pays scandinaves investissent massivement dans la prévention et ont des taux de criminalité 3 fois inférieurs aux nôtres. Coïncidence ?",
        "Construire une prison coûte 150 000€ par place. Former un éducateur spécialisé coûte 15 000€. Quel investissement est le plus rentable ?",
        "La récidive après prison est de 60%. Après un programme de réinsertion, elle tombe à 25%. Les chiffres parlent d'eux-mêmes.",
      ],
    },
    ecologie: {
      left: [
        "La France émet 0,9% du CO2 mondial grâce au nucléaire. Se priver de cette énergie propre au nom de l'idéologie serait une erreur historique.",
        "Tesla, les éoliennes offshore, l'hydrogène vert — l'innovation crée des emplois ET réduit les émissions. La décroissance détruit les deux.",
        "Demander aux Français de moins consommer pendant que la Chine ouvre une centrale à charbon par semaine, c'est absurde et injuste.",
      ],
      right: [
        "Le GIEC est clair : il faut réduire nos émissions de 45% d'ici 2030. Aucun scénario technologique ne permet ça sans changer nos modes de vie.",
        "La 'croissance verte' est un oxymore. Chaque point de PIB supplémentaire consomme des ressources. On ne peut pas découpler indéfiniment.",
        "Nous consommons les ressources de 3 planètes Terre. La technologie n'a jamais réduit notre empreinte globale, elle l'a toujours augmentée.",
      ],
    },
    europe: {
      left: [
        "Airbus, Galileo, Erasmus, le marché unique — tout ça n'existerait pas sans l'Europe. Quel pays seul aurait pu créer Airbus ?",
        "Face aux GAFAM américains et aux géants chinois, seule une Europe unie peut imposer des règles. Le RGPD protège 450 millions d'Européens.",
        "En défense, l'Europe est la seule réponse crédible. L'OTAN dépend des USA — et si demain ils se désengagent ?",
      ],
      right: [
        "L'Europe nous impose des quotas migratoires, des normes agricoles absurdes, et nous empêche de protéger nos industries stratégiques.",
        "Le Brexit n'a pas détruit le Royaume-Uni. Leur économie croît, ils signent des accords commerciaux librement. La souveraineté, ça paye.",
        "Bruxelles est dirigée par des technocrates non élus. Les décisions qui affectent 450 millions de personnes sont prises sans mandat démocratique.",
      ],
    },
  };
 
  // Chercher dans les réponses simulées
  const topicReplies = simulated[topicId];
  if (topicReplies && topicReplies[aiSide]) {
    const pool = topicReplies[aiSide];
    // Prendre une réponse pas encore utilisée si possible
    const used = debatHistory.filter(m => m.side === "ai").map(m => m.text);
    const unused = pool.filter(r => !used.includes(r));
    const source = unused.length > 0 ? unused : pool;
    return source[Math.floor(Math.random() * source.length)];
  }
 
  // Fallback générique pour sujets libres et tweets
  const genericReplies = [
    "C'est un argument intéressant, mais il ignore un aspect fondamental du problème. Les données montrent une réalité bien plus nuancée.",
    "Je comprends ta position, mais elle repose sur une prémisse discutable. En pratique, les exemples concrets montrent l'inverse.",
    "Tu simplifies un sujet complexe. Les experts du domaine soulignent des facteurs que tu ne prends pas en compte.",
    "Ton raisonnement se tient en théorie, mais confronté à la réalité du terrain, les résultats sont très différents de ce que tu décris.",
    "C'est exactement ce type d'argument qui semble convaincant en surface, mais qui s'effondre quand on regarde les chiffres de plus près.",
  ];
  const usedGeneric = debatHistory.filter(m => m.side === "ai").map(m => m.text);
  const unusedGeneric = genericReplies.filter(r => !usedGeneric.includes(r));
  const src = unusedGeneric.length > 0 ? unusedGeneric : genericReplies;
  return src[Math.floor(Math.random() * src.length)];
}
 
// ─── SYNTHÈSE FINALE ──────────────────────
 
async function showSynthesis() {
  const synthDiv = document.getElementById("debat-synthesis");
  if (!synthDiv) return;
  synthDiv.style.display = "block";
  synthDiv.innerHTML = `<div class="synthesis-loading">🧠 Analyse du débat en cours...</div>`;
  synthDiv.scrollIntoView({ behavior: "smooth" });
 
  let synthesis, score;
 
  if (typeof API_KEY !== "undefined" && API_KEY && API_KEY.length > 10) {
    // Appel API pour la synthèse
    const debatTranscript = debatHistory.map(m =>
      `[${m.side === "user" ? "Utilisateur" : "IA"} - Round ${m.round}] ${m.text}`
    ).join("\n");
 
    const synthPrompt = `Voici la transcription d'un débat sur "${currentDebat.title}".
L'utilisateur défendait la position "${currentDebat._userCamp.label}".
L'IA défendait la position "${currentDebat._aiCamp.label}".
 
${debatTranscript}
 
Fais une analyse en JSON strict (pas de markdown, pas de backticks) :
{
  "synthesis": {
    "user_strengths": "Les 2-3 meilleurs arguments de l'utilisateur (1-2 phrases)",
    "user_weaknesses": "Ce qui manquait dans l'argumentation de l'utilisateur (1-2 phrases)",
    "ai_strengths": "Les meilleurs arguments du camp opposé (1-2 phrases)",
    "nuance": "Ce que les deux camps oublient ou simplifient (1-2 phrases)",
    "verdict": "Un résumé équilibré en 2 phrases"
  },
  "score": {
    "pertinence": <1-5>,
    "rhetorique": <1-5>,
    "faits": <1-5>,
    "ouverture": <1-5>,
    "total_sur_20": <somme>
  }
}`;
 
    try {
      const raw = await callRealAPI(
        [{ role: "user", content: synthPrompt }],
        "Tu es un analyste de débat neutre et bienveillant. Réponds uniquement en JSON valide, sans backticks ni texte autour."
      );
      const parsed = JSON.parse(raw.replace(/```json?|```/g, "").trim());
      synthesis = parsed.synthesis;
      score = parsed.score;
    } catch(e) {
      console.error("Synthesis parse error:", e);
      synthesis = null;
      score = null;
    }
  }
 
  // Fallback si pas d'API ou erreur
  if (!synthesis) {
    synthesis = generateSimulatedSynthesis();
    score = generateSimulatedScore();
  }
 
  renderSynthesis(synthesis, score);
}
 
function generateSimulatedSynthesis() {
  return {
    user_strengths: "Tu as su défendre ta position avec conviction et apporter des arguments concrets pour appuyer ton point de vue.",
    user_weaknesses: "Ton argumentation gagnerait à intégrer davantage de chiffres et d'exemples internationaux pour renforcer ta crédibilité.",
    ai_strengths: "Le camp opposé a soulevé des points factuels importants qu'il serait difficile d'ignorer dans un débat approfondi.",
    nuance: "Les deux positions ont tendance à simplifier un sujet qui comporte de nombreuses dimensions économiques, sociales et culturelles.",
    verdict: "Un débat équilibré où chaque camp a marqué des points. La vérité se situe probablement dans une approche qui intègre les préoccupations des deux côtés."
  };
}
 
function generateSimulatedScore() {
  const p = 2 + Math.floor(Math.random() * 3);
  const r = 2 + Math.floor(Math.random() * 3);
  const f = 1 + Math.floor(Math.random() * 3);
  const o = 2 + Math.floor(Math.random() * 3);
  return {
    pertinence: p,
    rhetorique: r,
    faits: f,
    ouverture: o,
    total_sur_20: p + r + f + o
  };
}
 
function renderSynthesis(synthesis, score) {
  const synthDiv = document.getElementById("debat-synthesis");
  if (!synthDiv) return;
 
  const starBar = (value, max = 5) => {
    let html = "";
    for (let i = 0; i < max; i++) {
      html += `<span class="score-star ${i < value ? "filled" : ""}">${i < value ? "★" : "☆"}</span>`;
    }
    return html;
  };
 
  const totalClass = score.total_sur_20 >= 15 ? "excellent" :
                     score.total_sur_20 >= 10 ? "bon" : "progresse";
 
  synthDiv.innerHTML = `
    <div class="synthesis-card">
      <div class="synthesis-header">
        <span class="synthesis-icon">🧠</span>
        <span class="synthesis-title">Analyse du débat</span>
      </div>
 
      <div class="synthesis-section">
        <div class="synthesis-label">✅ Tes points forts</div>
        <p>${synthesis.user_strengths}</p>
      </div>
 
      <div class="synthesis-section">
        <div class="synthesis-label">📈 Axes d'amélioration</div>
        <p>${synthesis.user_weaknesses}</p>
      </div>
 
      <div class="synthesis-section">
        <div class="synthesis-label">🤖 Le camp adverse avait raison sur...</div>
        <p>${synthesis.ai_strengths}</p>
      </div>
 
      <div class="synthesis-section">
        <div class="synthesis-label">⚖️ La nuance qui manquait</div>
        <p>${synthesis.nuance}</p>
      </div>
 
      <div class="synthesis-section">
        <div class="synthesis-label">🎯 Verdict</div>
        <p>${synthesis.verdict}</p>
      </div>
 
      <div class="synthesis-score">
        <div class="score-title">📊 Ton score d'argumentation</div>
        <div class="score-grid">
          <div class="score-row">
            <span class="score-label">Pertinence</span>
            <span class="score-stars">${starBar(score.pertinence)}</span>
          </div>
          <div class="score-row">
            <span class="score-label">Rhétorique</span>
            <span class="score-stars">${starBar(score.rhetorique)}</span>
          </div>
          <div class="score-row">
            <span class="score-label">Faits & données</span>
            <span class="score-stars">${starBar(score.faits)}</span>
          </div>
          <div class="score-row">
            <span class="score-label">Ouverture d'esprit</span>
            <span class="score-stars">${starBar(score.ouverture)}</span>
          </div>
        </div>
        <div class="score-total ${totalClass}">
          <span class="score-total-number">${score.total_sur_20}</span>
          <span class="score-total-max">/20</span>
        </div>
      </div>
 
      <div class="synthesis-actions">
        <button class="debat-btn-retry" onclick="retryDebat()">🔄 Rejouer ce débat</button>
        <button class="debat-btn-switch" onclick="switchSideAndRetry()">🔀 Changer de camp</button>
        <button class="debat-btn-new" onclick="resetDuel()">🏠 Nouveau débat</button>
      </div>
    </div>
  `;
 
  synthDiv.scrollIntoView({ behavior: "smooth" });
}
 
// ─── ACTIONS POST-DÉBAT ───────────────────
 
function retryDebat() {
  if (!currentDebat) return;
  startDebat(userSide);
}
 
function switchSideAndRetry() {
  if (!currentDebat) return;
  // Inverse left/right references
  const newSide = userSide === "for" ? "against" : "for";
  startDebat(newSide);
}
 
function resetDuel() {
  currentDebat = null;
  debatHistory = [];
  debatRound = 0;
  userSide = null;
  debatFinished = false;
  isAiTyping = false;
  document.getElementById("duel-setup").style.display = "block";
  document.getElementById("duel-arena").style.display = "none";
  document.getElementById("duel-arena").innerHTML = "";
  initDuel();
}