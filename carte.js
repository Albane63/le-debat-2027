// ═══════════════════════════════════════════
// carte.js — Carte D3 : Régions / Départements / News
// ═══════════════════════════════════════════

let mapView = "region";
let regFeatures = [];
let deptFeatures = [];
let selectedRegionId = null;
let selectedDeptCode = null;
let newsFilter = "Tous";

async function initMap() {
  try {
    const [regGeo, deptGeo] = await Promise.all([
      fetch("https://cdn.jsdelivr.net/gh/gregoiredavid/france-geojson@master/regions-version-simplifiee.geojson").then(r => r.json()),
      fetch("https://cdn.jsdelivr.net/gh/gregoiredavid/france-geojson@master/departements-version-simplifiee.geojson").then(r => r.json()),
    ]);
    const ids = REGIONS.map(r => r.id);
    regFeatures = regGeo.features.filter(f => ids.includes(f.properties.code));
    deptFeatures = deptGeo.features.filter(f => DEPT_TO_REGION[f.properties.code]);
    renderMap();
    renderLegend();
  } catch (e) {
    document.getElementById("map-container").innerHTML = '<p style="padding:40px;text-align:center;color:#94A3B8">Erreur de chargement. Vérifie ta connexion.</p>';
  }
}

function switchMapView(view) {
  mapView = view;
  if (view === "region") { selectedDeptCode = null; selectedRegionId = null; }
  if (view === "dept") { selectedDeptCode = null; selectedRegionId = null; }
  if (view === "news") { selectedDeptCode = null; selectedRegionId = null; }
  document.querySelectorAll(".carte-tab").forEach(t => t.classList.remove("active"));
  const tabs = document.querySelectorAll(".carte-tab");
  if (view === "region" && tabs[0]) tabs[0].classList.add("active");
  if (view === "dept" && tabs[1]) tabs[1].classList.add("active");
  if (view === "news" && tabs[2]) tabs[2].classList.add("active");

  // Show/hide news bar
  const newsBar = document.getElementById("news-bar");
  if (newsBar) newsBar.style.display = view === "news" ? "block" : "none";
  if (view === "news") initNewsBar();

  document.getElementById("map-hint").textContent =
    view === "region" ? "Clic = infos région" :
    view === "dept" ? "Clic = infos département · « ← France » pour revenir" :
    "Clique sur un sujet brûlant pour en débattre";

  // Ensure map data is loaded
 if (deptFeatures.length === 0 || regFeatures.length === 0) {
  initMap();
} else {
  renderMap();
  renderLegend();
}

  // Reset panel
  const panel = document.getElementById("carte-panel");
  if (view === "news") {
    renderNewsList();
  } else {
    panel.innerHTML = `<div class="empty-panel"><span class="empty-icon">👈</span><p>Clique sur ${view === "region" ? "une région" : "un département"}</p></div>`;
  }
}

// ═══════════════════════════════════════════
// RENDER MAP
// ═══════════════════════════════════════════

const MAP_W = 700, MAP_H = 660;

function renderMap() {
  const container = document.getElementById("map-container");
  container.innerHTML = "";
  const svg = d3.select(container).append("svg")
    .attr("viewBox", `0 0 ${MAP_W} ${MAP_H}`)
    .style("width", "100%").style("display", "block");

  if (mapView === "region") renderRegionMap(svg);
  else if (mapView === "dept") renderDeptMap(svg);
  else if (mapView === "news") renderNewsMap(svg);
}

// ── REGION MAP ──
function prettyLabel(name) {
  const m = {
    "Hauts-de-France":["Hauts-de-","France"],"Île-de-France":["Île-de-","France"],
    "Centre-Val de Loire":["Centre-Val","de Loire"],"Pays de la Loire":["Pays de","la Loire"],
    "Nouvelle-Aquitaine":["Nouvelle-","Aquitaine"],"Auvergne-Rhône-Alpes":["Auvergne-","Rhône-Alpes"],
    "Bourgogne-Franche-Comté":["Bourgogne-","Franche-Comté"],"Provence-Alpes-Côte d'Azur":["PACA"],
  };
  return m[name] || [name];
}

function renderRegionMap(svg) {
  const proj = d3.geoMercator();
  if (regFeatures.length) proj.fitSize([MAP_W - 20, MAP_H - 30], { type: "FeatureCollection", features: regFeatures });
  const path = d3.geoPath(proj);

  regFeatures.forEach(f => {
    const r = REGION_BY_ID[f.properties.code];
    if (!r) return;
    const c = path.centroid(f);
    const sel = selectedRegionId === r.id;
    const g = svg.append("g").style("cursor", "pointer");

    g.append("path").attr("d", path(f))
      .attr("fill", BLOC_COLORS[r.bloc]).attr("stroke", sel ? "#0F172A" : "#fff").attr("stroke-width", sel ? 3 : 1.5)
      .on("mouseenter", function(){ d3.select(this).attr("stroke","#0F172A").attr("stroke-width",2.5); })
      .on("mouseleave", function(){ d3.select(this).attr("stroke", sel?"#0F172A":"#fff").attr("stroke-width", sel?3:1.5); })
      .on("click", () => selectRegion(r.id));

    if (isFinite(c[0])) {
      const lines = prettyLabel(r.name);
      const txt = g.append("text").attr("x",c[0]).attr("y",c[1]).attr("text-anchor","middle").attr("dominant-baseline","middle")
        .style("fill","#fff").style("font-weight","800").style("font-size", lines.length>1?"10px":"12px")
        .style("pointer-events","none").style("text-shadow","0 1px 3px rgba(0,0,0,0.4)");
      lines.forEach((l,i) => txt.append("tspan").attr("x",c[0]).attr("dy",i===0?0:13).text(l));
    }
  });
}

// ── DEPT MAP (with numbers visible) ──
function renderDeptMap(svg) {
  const proj = d3.geoMercator();
  proj.fitSize([MAP_W - 20, MAP_H - 30], { type: "FeatureCollection", features: deptFeatures });
  const path = d3.geoPath(proj);

  deptFeatures.forEach(f => {
    const code = f.properties.code;
    const bloc = getDeptBloc(code);
    const sel = selectedDeptCode === code;
    const c = path.centroid(f);
    const g = svg.append("g").style("cursor", "pointer");

    g.append("path").attr("d", path(f))
      .attr("fill", BLOC_COLORS[bloc]).attr("stroke", sel ? "#0F172A" : "#fff").attr("stroke-width", sel ? 3 : 1)
      .on("mouseenter", function(){ d3.select(this).attr("stroke","#0F172A").attr("stroke-width",2.5); })
      .on("mouseleave", function(){ d3.select(this).attr("stroke", sel?"#0F172A":"#fff").attr("stroke-width", sel?3:1); })
      .on("click", () => selectDept(code, f.properties.nom));

    // Department number
    if (isFinite(c[0])) {
      g.append("text").attr("x",c[0]).attr("y",c[1])
        .attr("text-anchor","middle").attr("dominant-baseline","middle")
        .style("fill","#fff").style("font-weight","800").style("font-size","9px")
        .style("pointer-events","none").style("text-shadow","0 1px 2px rgba(0,0,0,0.5)")
        .text(code);
    }
  });
}

// ── NEWS MAP (all depts colored + hot pulses + city labels) ──
function renderNewsMap(svg) {
  if (!deptFeatures || !deptFeatures.length) return;

  // Use padding to avoid Corse cutoff
  const proj = d3.geoMercator();
  proj.fitSize([MAP_W - 20, MAP_H - 30], {
    type: "FeatureCollection",
    features: deptFeatures
  });

  const path = d3.geoPath(proj);

  const alerts = Array.isArray(NEWS_ALERTS) ? NEWS_ALERTS : [];
  const filtered = newsFilter === "Tous"
    ? alerts
    : alerts.filter(n => n && n.cat === newsFilter);

  const newsMap = {};
  filtered.forEach(n => {
    if (n && n.dept) newsMap[n.dept] = n;
  });

  // 1. Base layer — all departments
  deptFeatures.forEach(f => {
    const code = f.properties.code;
    const bloc = getDeptBloc(code);
    const news = newsMap[code];
    const g = svg.append("g").style("cursor", news ? "pointer" : "default");

    g.append("path")
      .attr("d", path(f))
      .attr("fill", BLOC_COLORS[bloc] || "#94A3B8")
      .attr("stroke", news ? (news.color || "#0F172A") : "rgba(255,255,255,0.4)")
      .attr("stroke-width", news ? (news.hot ? 3 : 2) : 0.5)
      .attr("opacity", news ? 1 : 0.35)
      .on("mouseenter", function () {
        if (news) d3.select(this).attr("stroke", "#0F172A").attr("stroke-width", 4).attr("opacity", 1);
      })
      .on("mouseleave", function () {
        d3.select(this)
          .attr("stroke", news ? (news.color || "#0F172A") : "rgba(255,255,255,0.4)")
          .attr("stroke-width", news ? (news.hot ? 3 : 2) : 0.5)
          .attr("opacity", news ? 1 : 0.35);
      })
      .on("click", () => { if (news) selectNewsItem(news); });
  });

  // 2. News dots + city labels (on top of all paths)
  filtered.forEach(news => {
    if (!news || !news.dept) return;
    const feat = deptFeatures.find(f => f.properties.code === news.dept);
    if (!feat) return;
    const c = path.centroid(feat);
    if (!c || !isFinite(c[0]) || !isFinite(c[1])) return;

    const g = svg.append("g").style("cursor", "pointer")
      .on("click", () => selectNewsItem(news));

    const dotR = news.hot ? 11 : 8;
    const color = news.color || "#EF4444";

    // Pulse ring (SVG animate)
    const pulse = g.append("circle")
      .attr("cx", c[0]).attr("cy", c[1]).attr("r", dotR)
      .attr("fill", "none").attr("stroke", color).attr("stroke-width", 2)
      .style("pointer-events", "none");
    pulse.append("animate").attr("attributeName", "r")
      .attr("values", `${dotR};${dotR + 10};${dotR}`).attr("dur", "2s").attr("repeatCount", "indefinite");
    pulse.append("animate").attr("attributeName", "opacity")
      .attr("values", "0.6;0;0.6").attr("dur", "2s").attr("repeatCount", "indefinite");

    // Solid dot
    g.append("circle").attr("cx", c[0]).attr("cy", c[1]).attr("r", dotR)
      .attr("fill", color).attr("stroke", "#fff").attr("stroke-width", 2);

    // Emoji
    g.append("text").attr("x", c[0]).attr("y", c[1])
      .attr("text-anchor", "middle").attr("dominant-baseline", "middle")
      .style("font-size", news.hot ? "10px" : "8px").style("pointer-events", "none")
      .text(news.emoji || "•");

    // City name label — small white text with shadow, no black block
    const city = (news.title || "").split(":")[0].trim();
    g.append("text").attr("x", c[0]).attr("y", c[1] + dotR + 11)
      .attr("text-anchor", "middle")
      .style("fill", "#1E293B").style("font-size", "8px").style("font-weight", "700")
      .style("pointer-events", "none")
      .style("paint-order", "stroke").style("stroke", "#fff").style("stroke-width", "3px")
      .text(city);
  });
}
function renderLegend() {
  document.getElementById("map-legend").innerHTML = Object.entries(BLOC_LABELS).map(([k,v]) => `
    <div class="legend-item"><span class="legend-dot" style="background:${BLOC_COLORS[k]}"></span><span>${v.split("/")[0].trim()}</span></div>
  `).join("");
}

// ═══════════════════════════════════════════
// NEWS BAR (ticker + filters)
// ═══════════════════════════════════════════

function initNewsBar() {
  const bar = document.getElementById("news-bar");
  if (!bar) return;
  const cats = typeof NEWS_CATS !== 'undefined' ? NEWS_CATS : ["Tous"];
  const alerts = typeof NEWS_ALERTS !== 'undefined' ? NEWS_ALERTS : [];
  const hotNews = alerts.filter(n => n.hot);

  bar.innerHTML = `
    <div class="news-ticker">
      <span class="ticker-label">🔴 BREAKING</span>
      <div class="ticker-scroll">
        <div class="ticker-track">
          ${[...hotNews, ...hotNews].map(n => `<span class="ticker-item">${n.emoji} ${n.title}</span>`).join('<span class="ticker-sep">·</span>')}
        </div>
      </div>
    </div>
    <div class="news-filters">
      ${cats.map(c => `<button class="news-filter-btn ${c === newsFilter ? 'active' : ''}" onclick="setNewsFilter('${c}')">${c}</button>`).join("")}
    </div>
  `;
}

function setNewsFilter(cat) {
  newsFilter = cat;
  initNewsBar();
  if (mapView === "news") {
    renderMap();
    renderNewsList();
  }
}

// ═══════════════════════════════════════════
// SELECTIONS
// ═══════════════════════════════════════════

function selectRegion(id) {
  selectedRegionId = id;
  selectedDeptCode = null;
  if (typeof logRegionExplored === "function") { const r = REGION_BY_ID[id]; if(r) logRegionExplored(r.name); }
  renderMap();
  renderRegionPanel();
}

function selectDept(code, name) {
  selectedDeptCode = code;
  const rid = DEPT_TO_REGION[code];
  if (rid) selectedRegionId = rid;
  renderMap();
  renderDeptPanel(code, name);
}

function backToFrance() {
  selectedDeptCode = null;
  selectedRegionId = null;
  renderMap();
  document.getElementById("carte-panel").innerHTML = `<div class="empty-panel"><span class="empty-icon">🗺️</span><p>Clique sur un département</p></div>`;
}

// ═══════════════════════════════════════════
// PANELS
// ═══════════════════════════════════════════

function renderRegionPanel() {
  const panel = document.getElementById("carte-panel");
  const r = REGION_BY_ID[selectedRegionId];
  if (!r) return;

  // News in this region
  const regionDepts = Object.entries(DEPT_TO_REGION).filter(([d, rid]) => rid === r.id).map(([d]) => d);
  const regionNews = (typeof NEWS_ALERTS !== 'undefined' ? NEWS_ALERTS : []).filter(n => regionDepts.includes(n.dept));

  panel.innerHTML = `
    <div class="panel-card">
      <div class="panel-header"><span class="panel-dot" style="background:${BLOC_COLORS[r.bloc]}"></span><h3>${r.name}</h3></div>

      <div class="panel-section-label">🏛️ La région</div>
      <div class="panel-info">
        <div class="info-row"><span class="info-label">Président·e</span><span class="info-value">${r.president||'—'}</span></div>
        <div class="info-row"><span class="info-label">Population</span><span class="info-value">${r.pop||'—'}</span></div>
        <div class="info-row"><span class="info-label">Budget</span><span class="info-value">${r.budget||'—'}</span></div>
        <div class="info-row"><span class="info-label">Compétences</span><span class="info-value">${r.competences||'—'}</span></div>
        <div class="info-row"><span class="info-label">Grandes villes</span><span class="info-value">${r.cities}</span></div>
      </div>

      <div class="panel-section-label">📊 Politique & enjeux</div>
      <div class="panel-info">
        <div class="info-row"><span class="info-label">Tendance</span><span class="info-value">${r.tendency}</span></div>
        <div class="info-row"><span class="info-label">1er tour 2022</span><span class="info-value">${r.resultat2022||'—'}</span></div>
        <div class="info-row"><span class="info-label">Députés</span><span class="info-value">${r.deputes||'—'}</span></div>
      </div>
      ${r.enjeu ? `<div class="panel-enjeu">🔥 <strong>Enjeu 2027 :</strong> ${r.enjeu}</div>` : ''}

      ${regionNews.length > 0 ? `
        <div class="panel-section-label">📡 Actualités</div>
        <div class="panel-news-list">
          ${regionNews.slice(0,3).map(n => `<div class="panel-news-item" style="border-left-color:${n.color}"><span>${n.emoji}</span><div><strong>${n.title}</strong><br><span class="panel-news-meta">${n.dept} · ${n.date}</span></div></div>`).join("")}
        </div>
      ` : ''}

      <div class="panel-section-label">💬 Débattre</div>
      <div id="carte-chat" class="panel-chat"></div>
    </div>
  `;

  createChat("carte-chat",
    `${r.name} — ${r.enjeu || r.tendency}. Qu'est-ce que tu en penses ? Je suis là pour te challenger ! 🎯`,
    `Région ${r.name}. Président: ${r.president}. Tendance: ${r.tendency}. Enjeu: ${r.enjeu}. Résultat 2022: ${r.resultat2022}. Challenge l'utilisateur.`
  );
}

function renderDeptPanel(code, name) {
  const panel = document.getElementById("carte-panel");
  const rid = DEPT_TO_REGION[code];
  const r = REGION_BY_ID[rid];
  const bloc = getDeptBloc(code);
  const news = (typeof NEWS_ALERTS !== 'undefined' ? NEWS_ALERTS : []).find(n => n.dept === code);

  panel.innerHTML = `
    <div class="panel-card">
      <button class="btn-back" onclick="backToFrance()">← Revenir à la France</button>
      <div class="panel-header"><span class="panel-dot" style="background:${BLOC_COLORS[bloc]}"></span><h3>${name} (${code})</h3></div>

      <div class="panel-section-label">🏛️ Informations</div>
      <div class="panel-info">
        <div class="info-row"><span class="info-label">Région</span><span class="info-value">${r?.name||"—"}</span></div>
        <div class="info-row"><span class="info-label">Bord politique</span><span class="info-value">${BLOC_LABELS[bloc]}</span></div>
        <div class="info-row"><span class="info-label">Tendance régionale</span><span class="info-value">${r?.tendency||'—'}</span></div>
      </div>

      ${news ? `
        <div class="panel-section-label">📡 Actualité brûlante</div>
        <div class="panel-news-highlight" style="border-left-color:${news.color}">
          <div class="news-highlight-badge" style="background:${news.color}">${news.emoji} ${news.cat}</div>
          <h4>${news.title}</h4>
          <p>${news.text}</p>
          <span class="panel-news-meta">${news.date}</span>
          ${typeof news.tweetRef === 'number' && typeof FAKE_TWEETS !== 'undefined' ? `<button class="news-tweet-link" onclick="goTo('tendances')">🐦 Voir le tweet lié</button>` : ''}
        </div>
      ` : ''}

      <div class="panel-section-label">💬 Débattre</div>
      <div id="carte-chat" class="panel-chat"></div>
    </div>
  `;

  const intro = news
    ? `📡 "${news.title}" — ${news.text}\n\nQu'est-ce que tu en penses ? 🤔`
    : `On parle de ${name} (${code}) ? Département ${BLOC_LABELS[bloc]}. Qu'est-ce que tu en penses ? 🎯`;
  const ctx = news
    ? `Dept ${code} ${name}. News: "${news.title}" — ${news.text}. Bloc: ${BLOC_LABELS[bloc]}. Sois socratique.`
    : `Dept ${code} ${name}, ${r?.name||""}. Bloc: ${BLOC_LABELS[bloc]}.`;
  createChat("carte-chat", intro, ctx);
}

// ── NEWS LIST (panel right) ──
function renderNewsList() {
  const panel = document.getElementById("carte-panel");
  const alerts = typeof NEWS_ALERTS !== 'undefined' ? NEWS_ALERTS : [];
  const filtered = newsFilter === "Tous" ? alerts : alerts.filter(n => n.cat === newsFilter);

  panel.innerHTML = `
    <div class="panel-card">
      <div class="panel-header"><h3>📡 Fil d'actu · ${newsFilter}</h3></div>
      <div class="news-list-scroll">
        ${filtered.map((n,i) => `
          <div class="news-card ${n.hot ? 'news-hot' : ''}" onclick="selectNewsItem(NEWS_ALERTS[${alerts.indexOf(n)}])" style="border-left-color:${n.color}">
            <div class="news-card-head">
              <span class="news-card-emoji">${n.emoji}</span>
              <div>
                <div class="news-card-title">${n.title}</div>
                <div class="news-card-meta">${n.cat} · Dept ${n.dept} · ${n.date}</div>
              </div>
            </div>
            ${n.hot ? '<span class="news-hot-badge">🔥 HOT</span>' : ''}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function selectNewsItem(news) {
  const panel = document.getElementById("carte-panel");
  panel.innerHTML = `
    <div class="panel-card">
      <button class="btn-back" onclick="renderNewsList()">← Toutes les news</button>
      <div class="news-detail">
        <div class="news-highlight-badge" style="background:${news.color}">${news.emoji} ${news.cat} ${news.hot ? '· 🔥 HOT' : ''}</div>
        <h3 class="news-detail-title">${news.title}</h3>
        <p class="news-detail-meta">Département ${news.dept} · ${news.date}</p>
        <p class="news-detail-text">${news.text}</p>
        ${typeof news.tweetRef === 'number' && typeof FAKE_TWEETS !== 'undefined' ? `
          <div class="news-tweet-ref">
            <span class="news-tweet-ref-label">🐦 Tweet lié</span>
            <p class="news-tweet-ref-text">"${FAKE_TWEETS[news.tweetRef]?.text || ''}"</p>
            <button class="news-tweet-link" onclick="goTo('tendances')">Voir dans Tendances →</button>
          </div>
        ` : ''}
      </div>
      <div class="panel-section-label">💬 Qu'en penses-tu ?</div>
      <div id="carte-chat" class="panel-chat"></div>
    </div>
  `;

  createChat("carte-chat",
    `📡 "${news.title}"\n\n${news.text}\n\nFait ou opinion ? Quels arguments manquent ? Débattons ! 🤔`,
    `News: "${news.title}" — ${news.text}. Dept ${news.dept}, cat ${news.cat}. Challenge: fait vs opinion, biais, ce qui manque. Socratique.`
  );
  if (typeof logInteraction === "function") logInteraction("carte", news.cat, null, null);
  panel.scrollIntoView({ behavior: "smooth" });
}