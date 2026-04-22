// ═══════════════════════════════════════════
// bilan.js — Profil de débatteur (dashboard)
// Toujours visible, se remplit en temps réel
// ═══════════════════════════════════════════

let bilanScores = { securitaire:0, social:0, liberal:0, ecolo:0, europeen:0, souverainiste:0 };
let bilanAnswers = [];

function initBilan() {
  renderDashboard();
}

// ═══════════════════════════════════════════
// DASHBOARD — toujours rendu, vide ou plein
// ═══════════════════════════════════════════

function renderDashboard() {
  const container = document.getElementById("bilan-container");
  const ui = userInteractions;
  const hasData = ui.total_messages >= 1;
  const A = buildFullAnalysis();

  container.innerHTML = `
    <div class="bd">

      <!-- ROW 1 : Axes + Identité -->
      <div class="bd-row">
        <div class="bd-card">
          <h4 class="bd-card-title">📊 Tes axes politiques</h4>
          ${hasData ? `
            <div class="bd-radar-wrap"><canvas id="bilan-radar" width="240" height="240"></canvas></div>
            <div class="bd-axes">
              ${A.axes.map(a => `
                <div class="bd-axis"><span class="bd-axis-label">${a.icon} ${a.name}</span><div class="bd-axis-track"><div class="bd-axis-fill" style="width:${a.pct}%;background:${a.color}"></div></div><span class="bd-axis-val">${a.val > 0 ? '+':''}${a.val}</span></div>
              `).join("")}
            </div>
          ` : `
            <div class="bd-empty">
              <div class="bd-empty-icon">📊</div>
              <p>Discute avec l'IA sur les différentes sections pour voir tes axes politiques apparaître ici.</p>
              <button class="bd-empty-btn" onclick="goTo('candidats')">👤 Explorer les candidats</button>
            </div>
          `}
        </div>

        <div class="bd-card">
          <h4 class="bd-card-title">🪪 Ton profil de débatteur</h4>
          ${hasData ? `
            <div class="bd-archetype">
              <span class="bd-archetype-emoji">${A.archetype.emoji}</span>
              <div>
                <div class="bd-archetype-name">${A.archetype.name}</div>
                <div class="bd-archetype-desc">${A.archetype.desc}</div>
              </div>
            </div>
            <p class="bd-text">${A.identity}</p>
            <div class="bd-traits">${A.traits.map(t => `<span class="bd-trait" style="background:${t.bg};color:${t.fg}">${t.label}</span>`).join("")}</div>
          ` : `
            <div class="bd-empty">
              <div class="bd-empty-icon">🪪</div>
              <p>Ton archétype de débatteur se construira au fil de tes échanges avec l'IA.</p>
              <button class="bd-empty-btn" onclick="openDebatTab('actu')">💬 Commencer à discuter</button>
            </div>
          `}
        </div>
      </div>

      <!-- ROW 2 : Forces + Faiblesses -->
      <div class="bd-row">
        <div class="bd-card">
          <h4 class="bd-card-title">💪 Tes forces</h4>
          ${A.strengths.length > 0 && hasData ? 
            A.strengths.map(s => `<div class="bd-force ok"><span>✅</span><span>${s}</span></div>`).join("") :
            `<div class="bd-empty-mini"><p>Explore le site pour révéler tes forces argumentatives.</p><button class="bd-empty-btn" onclick="openDebatTab('challenge')">⚔️ Lancer un débat</button></div>`
          }
        </div>
        <div class="bd-card">
          <h4 class="bd-card-title">⚠️ Tes angles morts</h4>
          ${A.weaknesses.length > 0 && hasData ? 
            A.weaknesses.map(w => `<div class="bd-force warn"><span>🔍</span><span>${w}</span></div>`).join("") :
            `<div class="bd-empty-mini"><p>L'IA détectera tes angles morts au fil de tes discussions.</p><button class="bd-empty-btn" onclick="goTo('tendances')">🔥 Décrypter les tendances</button></div>`
          }
        </div>
      </div>

      <!-- FULL : Sujets à travailler -->
      <div class="bd-card">
        <h4 class="bd-card-title">📚 Sujets à approfondir</h4>
        ${hasData ? `
          <p class="bd-sub">Les thèmes où tu as besoin de creuser, avec des pistes concrètes.</p>
          <div class="bd-topics-work">
            ${A.topicsToWork.map(t => `
              <div class="bd-topic-card ${t.urgency}">
                <div class="bd-topic-head">
                  <span class="bd-topic-emoji">${t.emoji}</span>
                  <div>
                    <div class="bd-topic-name">${t.name}</div>
                    <div class="bd-topic-why">${t.why}</div>
                  </div>
                </div>
                <div class="bd-topic-actions">
                  ${t.actions.map(a => `<button class="bd-topic-btn" onclick="goTo('${a.goTo}')">${a.label}</button>`).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        ` : `
          <div class="bd-empty">
            <div class="bd-empty-icon">📚</div>
            <p>Après quelques échanges, l'IA te dira exactement quels sujets creuser et pourquoi.</p>
            <div class="bd-empty-row">
              <button class="bd-empty-btn" onclick="openDebatTab('challenge')">⚔️ Débattre</button>
              <button class="bd-empty-btn" onclick="goTo('tendances')">🔥 Tendances</button>
            </div>
          </div>
        `}
      </div>

      <!-- ROW 3 : Style + Proximité candidats -->
      <div class="bd-row">
        <div class="bd-card">
          <h4 class="bd-card-title">🎯 Ton style de raisonnement</h4>
          ${hasData ? `
            ${A.style.map(s => `
              <div class="bd-gauge">
                <div class="bd-gauge-head"><span>${s.emoji} ${s.name}</span><span class="bd-gauge-pct">${s.score}%</span></div>
                <div class="bd-gauge-track"><div class="bd-gauge-fill" style="width:${s.score}%;background:${s.color}"></div></div>
                <p class="bd-gauge-desc">${s.desc}</p>
              </div>
            `).join("")}
          ` : `
            <div class="bd-empty">
              <div class="bd-empty-icon">🎯</div>
              <p>Conviction, curiosité, ténacité, esprit critique — tes jauges se rempliront au fil de tes échanges.</p>
            </div>
          `}
        </div>

        <div class="bd-card">
          <h4 class="bd-card-title">👤 Tu te rapproches de...</h4>
          ${hasData ? `
            ${A.proximity.slice(0,3).map((c,i) => `
              <div class="bd-match ${i===0?'bd-match-top':''}">
                <span class="bd-match-medal">${['🥇','🥈','🥉'][i]}</span>
                <span class="bd-match-dot" style="background:${c.color}"></span>
                <span class="bd-match-name">${c.name}</span>
                <span class="bd-match-pct">${c.pct}%</span>
              </div>
            `).join("")}
            <p class="bd-disclaimer">⚠️ Indicatif — pas une recommandation de vote.</p>
          ` : `
            <div class="bd-empty">
              <div class="bd-empty-icon">👤</div>
              <p>Tes candidats les plus proches apparaîtront ici quand tu auras exploré le site.</p>
              <button class="bd-empty-btn" onclick="goTo('candidats')">👤 Voir les candidats</button>
            </div>
          `}
        </div>
      </div>

      <!-- FULL : Progression -->
      ${hasData ? `
      <div class="bd-card">
        <h4 class="bd-card-title">📈 Comment progresser</h4>
        <div class="bd-progress">
          ${A.progression.map((p,i) => `
            <div class="bd-step ${p.priority}">
              <div class="bd-step-num">${i+1}</div>
              <div class="bd-step-body">
                <div class="bd-step-head"><span class="bd-step-title">${p.title}</span><span class="bd-step-prio ${p.priority}">${p.priority==='high'?'🔴 Prioritaire':p.priority==='medium'?'🟡 Important':'🟢 Bonus'}</span></div>
                <p class="bd-step-desc">${p.desc}</p>
                ${p.goTo ? `<button class="bd-step-btn" onclick="goTo('${p.goTo}')">${p.btnLabel}</button>` : ''}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
      ` : ''}

      ${A.debatHistory.length > 0 ? `
      <div class="bd-card">
        <h4 class="bd-card-title">📋 Tes débats</h4>
        <div class="bd-hist">
          ${A.debatHistory.map((d,i) => `
            <div class="bd-hist-row"><span class="bd-hist-num">#${i+1}</span><div class="bd-hist-info"><span class="bd-hist-topic">${d.topic}</span><span class="bd-hist-meta">Camp : ${d.userSide}</span></div><span class="bd-hist-score ${d.score>=15?'excellent':d.score>=10?'bon':'progresse'}">${d.score}/20</span></div>
          `).join("")}
        </div>
      </div>
      ` : ''}

    </div>
  `;

  if (hasData) drawRadar();
}

// ═══════════════════════════════════════════
// ANALYSIS
// ═══════════════════════════════════════════

function buildFullAnalysis() {
  const ui = userInteractions, s = bilanScores;
  const axeCfg = [
    {key:'securitaire',name:'Sécuritaire',icon:'🛡️'},{key:'social',name:'Justice sociale',icon:'✊'},
    {key:'liberal',name:'Libéral',icon:'💰'},{key:'ecolo',name:'Écologie',icon:'🌱'},
    {key:'europeen',name:'Européen',icon:'🇪🇺'},{key:'souverainiste',name:'Souverainiste',icon:'🏛️'},
  ];
  const maxAbs = Math.max(...Object.values(s).map(Math.abs), 1);
  const axes = axeCfg.map(a => ({...a, val:s[a.key]||0, pct:Math.max(5,Math.round((Math.abs(s[a.key]||0)/maxAbs)*100)), color:(s[a.key]||0)>0?'#2563EB':'#94A3B8'})).sort((a,b)=>b.val-a.val);

  return {
    axes,
    proximity: calcProximity(s),
    archetype: calcArchetype(axes),
    identity: buildIdentity(axes, ui),
    traits: buildTraits(axes, ui),
    strengths: buildStrengths(axes, ui),
    weaknesses: buildWeaknesses(axes, ui),
    topicsToWork: buildTopicsToWork(axes, ui),
    style: buildStyle(ui),
    progression: buildProgression(axes, ui),
    debatHistory: ui.debats_completed,
  };
}

function calcArchetype(axes) {
  const t1=axes[0]?.key||'social',t2=axes[1]?.key||'liberal';
  const m={
    'securitaire+souverainiste':{emoji:'🦁',name:'Le Gardien',desc:'Protéger et préserver. Ordre et nation.'},
    'securitaire+liberal':{emoji:'🏛️',name:'Le Républicain ferme',desc:'Ordre et liberté économique.'},
    'social+ecolo':{emoji:'🌻',name:'L\'Idéaliste engagé',desc:'Justice sociale et planète d\'abord.'},
    'social+souverainiste':{emoji:'✊',name:'Le Populaire',desc:'Le peuple d\'abord.'},
    'social+europeen':{emoji:'🕊️',name:'Le Social-démocrate',desc:'Solidarité et coopération.'},
    'liberal+europeen':{emoji:'🌐',name:'Le Progressiste libéral',desc:'Ouverture et compétitivité.'},
    'ecolo+europeen':{emoji:'🌍',name:'L\'Éco-européen',desc:'La planète sans frontières.'},
    'ecolo+souverainiste':{emoji:'🌿',name:'Le Souverain vert',desc:'Sobriété et autonomie.'},
    'liberal+souverainiste':{emoji:'🦅',name:'Le Patriote libéral',desc:'Compétitivité nationale.'},
    'securitaire+social':{emoji:'⚖️',name:'Le Pragmatique',desc:'Sécurité ET justice.'},
    'securitaire+ecolo':{emoji:'🌲',name:'Le Conservateur vert',desc:'Ordre et nature.'},
    'liberal+ecolo':{emoji:'💡',name:'L\'Innovateur vert',desc:'La tech au service du climat.'},
    'social+liberal':{emoji:'🔀',name:'Le Centriste social',desc:'Marché et redistribution.'},
  };
  return m[`${t1}+${t2}`]||m[`${t2}+${t1}`]||{emoji:'🔍',name:'L\'Explorateur',desc:'Profil à affiner — explore le site.'};
}

function calcProximity(scores) {
  const c=[
    {name:"Jordan Bardella",party:"RN",axes:{securitaire:3,souverainiste:2,social:-1},color:"#1B2A4A"},
    {name:"Édouard Philippe",party:"Horizons",axes:{liberal:2,europeen:2,securitaire:1},color:"#2563EB"},
    {name:"Raphaël Glucksmann",party:"PS / PP",axes:{social:2,europeen:3,ecolo:1},color:"#E8547C"},
    {name:"Jean-Luc Mélenchon",party:"LFI",axes:{social:3,ecolo:2,souverainiste:1},color:"#DC2626"},
    {name:"Gabriel Attal",party:"Renaissance",axes:{liberal:3,europeen:2},color:"#F59E0B"},
    {name:"Bruno Retailleau",party:"LR",axes:{securitaire:2,liberal:1,souverainiste:1},color:"#1E40AF"},
    {name:"Marine Tondelier",party:"Écologistes",axes:{ecolo:3,social:2,europeen:1},color:"#16A34A"},
    {name:"François Ruffin",party:"Debout !",axes:{social:3,souverainiste:1},color:"#EA580C"},
  ];
  return c.map(x=>{let sc=0,mx=0;Object.entries(x.axes).forEach(([k,v])=>{sc+=(scores[k]||0)*v;mx+=Math.abs(v)*3;});return{...x,score:sc,pct:Math.max(0,Math.round((sc/Math.max(mx,1))*100))};}).sort((a,b)=>b.score-a.score);
}

function buildIdentity(axes,ui){
  const t=axes[0],m=ui.total_messages,src=new Set(ui.conversations.map(c=>c.source));
  if(m<3) return `Profil basé sur ${m} échange${m>1?'s':''}. Continue d'explorer pour affiner.`;
  let r=`En ${m} échanges à travers ${src.size} section${src.size>1?'s':''}, `;
  if(t.val>=4) r+=`tu montres des convictions fortes sur ${t.icon} ${t.name}.`;
  else if(t.val>=2) r+=`tu penches vers ${t.icon} ${t.name} avec de la nuance.`;
  else r+=`ton profil est équilibré — signe de nuance ou de sujets à creuser.`;
  if(ui.debats_completed.length>0) r+=` ${ui.debats_completed.length} débat${ui.debats_completed.length>1?'s':''} complété${ui.debats_completed.length>1?'s':''}.`;
  return r;
}

function buildTraits(axes,ui){
  const t=[],cs=[{bg:'#EFF6FF',fg:'#2563EB'},{bg:'#F0FDF4',fg:'#16A34A'},{bg:'#FEF2F2',fg:'#DC2626'},{bg:'#FFFBEB',fg:'#D97706'}];
  axes.filter(a=>a.val>=2).forEach((a,i)=>t.push({label:`${a.icon} ${a.name}`,...cs[i%cs.length]}));
  const m=ui.total_messages;
  if(m>=15) t.push({label:'🔥 Très engagé',bg:'#FEF2F2',fg:'#DC2626'});
  else if(m>=5) t.push({label:'💬 Actif',bg:'#EFF6FF',fg:'#2563EB'});
  if(new Set(ui.conversations.map(c=>c.source)).size>=3) t.push({label:'🧭 Curieux',bg:'#F0FDF4',fg:'#16A34A'});
  if(ui.debats_completed.length>=1) t.push({label:'⚔️ Débatteur',bg:'#FFFBEB',fg:'#D97706'});
  return t.slice(0,5);
}

function buildStrengths(axes,ui){
  const o=[];
  if(axes[0].val>=3) o.push(`Tu maîtrises ${axes[0].icon} ${axes[0].name} — un sujet qui t'anime.`);
  if(Object.keys(ui.topics_discussed).length>=4) o.push(`${Object.keys(ui.topics_discussed).length} sujets abordés — curiosité au-dessus de la moyenne.`);
  if(new Set(ui.conversations.map(c=>c.source)).size>=3) o.push(`Tu utilises plusieurs sections du site — pas enfermé dans ta zone de confort.`);
  if(ui.debats_completed.length>0){const avg=Math.round(ui.debats_completed.reduce((s,d)=>s+(d.score||0),0)/ui.debats_completed.length);if(avg>=14) o.push(`Score moyen de ${avg}/20 en débat — solide.`);}
  if(o.length===0) o.push(`Continue d'explorer — tes forces apparaîtront vite.`);
  return o.slice(0,3);
}

function buildWeaknesses(axes,ui){
  const o=[];
  const low=axes.filter(a=>a.val<=0);
  if(low.length>=3) o.push(`Angles morts sur ${low.slice(0,2).map(a=>a.icon+' '+a.name.toLowerCase()).join(' et ')}.`);
  const core=['Immigration','Retraites','Écologie','Sécurité','Europe'];
  const disc=Object.keys(ui.topics_discussed);
  const missed=core.filter(t=>!disc.some(d=>d.toLowerCase().includes(t.toLowerCase())));
  if(missed.length>=2) o.push(`Jamais abordé : ${missed.join(', ')}.`);
  if(ui.debats_completed.length===0 && ui.total_messages>=3) o.push(`Aucun débat 1v1 — c'est là que tu testes tes vrais arguments.`);
  if(o.length===0 && ui.total_messages>=3) o.push(`Profil équilibré — mais certains sujets restent à creuser.`);
  return o.slice(0,3);
}

function buildTopicsToWork(axes,ui){
  const topics=[];
  const disc=Object.keys(ui.topics_discussed).join(' ').toLowerCase();

  const all=[
    {key:'immigration',name:'Immigration',emoji:'🌍',match:'immigr'},
    {key:'retraites',name:'Retraites',emoji:'👴',match:'retrait'},
    {key:'ecologie',name:'Écologie / Climat',emoji:'🌱',match:'écolog|climat'},
    {key:'securite',name:'Sécurité',emoji:'🚔',match:'sécurité|police'},
    {key:'europe',name:'Europe / Souveraineté',emoji:'🇪🇺',match:'europ|souverain'},
    {key:'economie',name:'Économie / Fiscalité',emoji:'💰',match:'économi|fiscal|impôt'},
  ];

  all.forEach(t=>{
    const rx=new RegExp(t.match,'i');
    const mentioned=rx.test(disc);
    const axeVal=bilanScores[t.key==='economie'?'liberal':t.key==='securite'?'securitaire':t.key==='ecologie'?'ecolo':t.key==='europe'?'europeen':t.key]||0;

    let urgency='low',why='';
    if(!mentioned && Math.abs(axeVal)<=1){
      urgency='high';
      why='Tu n\'as pas encore abordé ce sujet — un angle mort important pour 2027.';
    } else if(!mentioned){
      urgency='medium';
      why='Tu as des convictions mais tu n\'en as pas encore discuté avec l\'IA.';
    } else if(Math.abs(axeVal)<=1){
      urgency='medium';
      why='Tu en as parlé mais tes positions restent floues — creuse davantage.';
    } else {
      return; // OK, pas besoin de travailler
    }

    topics.push({
      ...t, urgency, why,
      actions:[
        {label:'⚔️ Débattre',goTo:'duel'},
        {label:'💬 En discuter',goTo:'chat'},
      ]
    });
  });

  return topics.sort((a,b)=>{const p={high:0,medium:1,low:2};return p[a.urgency]-p[b.urgency];}).slice(0,4);
}

function buildStyle(ui){
  const m=ui.total_messages,tc=Object.keys(ui.topics_discussed).length,src=new Set(ui.conversations.map(c=>c.source)).size,deb=ui.debats_completed.length;
  const ext=Object.values(bilanScores).reduce((s,v)=>s+Math.abs(v),0);
  return [
    {emoji:'🔥',name:'Conviction',score:Math.min(100,Math.round((ext/15)*100)),color:'#DC2626',desc:ext>8?'Opinions affirmées':'Positions mesurées'},
    {emoji:'🔭',name:'Curiosité',score:Math.min(100,Math.round(((tc+src)/10)*100)),color:'#2563EB',desc:tc>=4?'Tu explores largement':'Diversifie tes thèmes'},
    {emoji:'💪',name:'Ténacité',score:Math.min(100,Math.round((m/15)*100)),color:'#16A34A',desc:m>=10?'Tu creuses en profondeur':'Continue d\'échanger'},
    {emoji:'🧠',name:'Esprit critique',score:Math.min(100,Math.round(((deb*25)+(tc*5)+(src*10))/100*100)),color:'#7C3AED',desc:deb>=1?'Tu débats et tu questionnes':'Débats plus pour progresser'},
  ];
}

function buildProgression(axes,ui){
  const p=[];
  const low=axes.filter(a=>a.val<=0);
  if(low[0]) p.push({title:`Creuse "${low[0].name}"`,desc:`Ton angle mort principal. Comprends les deux camps.`,priority:'high',goTo:'duel',btnLabel:`${low[0].icon} Débattre`});
  if(axes[0]?.val>=3) p.push({title:'Défends le camp opposé',desc:`Tu es marqué sur ${axes[0].icon} ${axes[0].name}. Débats de l'autre côté.`,priority:'high',goTo:'duel',btnLabel:'🔀 Changer de camp'});
  if(ui.debats_completed.length===0) p.push({title:'Teste-toi en débat',desc:'Défendre ses idées face à un contradicteur, c\'est le vrai test.',priority:'medium',goTo:'duel',btnLabel:'⚔️ Débattre'});
  if(ui.candidates_explored.length<3) p.push({title:'Explore d\'autres candidats',desc:'Comprends ceux qui pensent différemment de toi.',priority:'medium',goTo:'candidats',btnLabel:'👤 Candidats'});
  p.push({title:'Vérifie tes croyances',desc:'Fact-checke tes idées reçues avec l\'IA.',priority:'low',goTo:'chat',btnLabel:'💬 Fact-check'});
  return p.slice(0,4);
}

// ═══════════════════════════════════════════
// RADAR
// ═══════════════════════════════════════════

function drawRadar(){
  const canvas=document.getElementById("bilan-radar");
  if(!canvas)return;
  const ctx=canvas.getContext("2d"),sz=canvas.width,c=sz/2,r=c-34;
  const keys=['securitaire','social','liberal','ecolo','europeen','souverainiste'];
  const labs=['Sécuritaire','Social','Libéral','Écologie','Européen','Souverain.'];
  const n=keys.length,mx=Math.max(...keys.map(k=>Math.abs(bilanScores[k]||0)),3);
  ctx.clearRect(0,0,sz,sz);
  for(let ring=1;ring<=3;ring++){const R=(ring/3)*r;ctx.beginPath();for(let i=0;i<=n;i++){const a=(Math.PI*2*i)/n-Math.PI/2,x=c+R*Math.cos(a),y=c+R*Math.sin(a);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle='#E2E8F0';ctx.lineWidth=1;ctx.stroke();}
  keys.forEach((k,i)=>{const a=(Math.PI*2*i)/n-Math.PI/2;ctx.beginPath();ctx.moveTo(c,c);ctx.lineTo(c+r*Math.cos(a),c+r*Math.sin(a));ctx.strokeStyle='#E2E8F0';ctx.stroke();const lx=c+(r+16)*Math.cos(a),ly=c+(r+16)*Math.sin(a);ctx.fillStyle='#475569';ctx.font='9px Sora,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(labs[i],lx,ly);});
  ctx.beginPath();keys.forEach((k,i)=>{const v=Math.max(0,bilanScores[k]||0),R=(v/mx)*r,a=(Math.PI*2*i)/n-Math.PI/2;i===0?ctx.moveTo(c+R*Math.cos(a),c+R*Math.sin(a)):ctx.lineTo(c+R*Math.cos(a),c+R*Math.sin(a));});ctx.closePath();ctx.fillStyle='rgba(37,99,235,0.12)';ctx.fill();ctx.strokeStyle='#2563EB';ctx.lineWidth=2;ctx.stroke();
  keys.forEach((k,i)=>{const v=Math.max(0,bilanScores[k]||0),R=(v/mx)*r,a=(Math.PI*2*i)/n-Math.PI/2;ctx.beginPath();ctx.arc(c+R*Math.cos(a),c+R*Math.sin(a),3,0,Math.PI*2);ctx.fillStyle='#2563EB';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();});
}