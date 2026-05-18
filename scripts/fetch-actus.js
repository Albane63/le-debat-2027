// ═══════════════════════════════════════════
// fetch-actus.js — Robot d'actualités pour Le Débat 2027
// Récupère les RSS de médias français, fait trier par Claude,
// génère un actus.json avec tweets, bulles médiatiques et sujets brûlants.
// ═══════════════════════════════════════════

import Parser from "rss-parser";
import fs from "fs";
import path from "path";

const parser = new Parser({ timeout: 15000 });

// ─── Configuration ───
const RSS_FEEDS = [
  { name: "Le Monde - Politique", url: "https://www.lemonde.fr/politique/rss_full.xml" },
  { name: "Le Figaro - Politique", url: "https://www.lefigaro.fr/rss/figaro_politique.xml" },
  { name: "Libération - Politique", url: "https://www.liberation.fr/arc/outboundfeeds/rss/category/politique/?outputType=xml" },
  { name: "Mediapart - À la une", url: "https://www.mediapart.fr/articles/feed" },
  { name: "France Info - Politique", url: "https://www.francetvinfo.fr/politique.rss" },
  { name: "Les Echos - Politique", url: "https://services.lesechos.fr/rss/les-echos-politique.xml" },
];

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const OUTPUT_PATH = path.resolve("actus.json");
const MAX_ARTICLES = 25;

if (!ANTHROPIC_API_KEY) {
  console.error("❌ ANTHROPIC_API_KEY n'est pas définie.");
  console.error("→ Pour lancer en local : $env:ANTHROPIC_API_KEY=\"ta-clé\" ; node scripts/fetch-actus.js");
  process.exit(1);
}

// ─── 1. Récupérer les articles RSS ───
async function fetchAllFeeds() {
  console.log("📡 Récupération des flux RSS...");
  const allArticles = [];

  for (const feed of RSS_FEEDS) {
    try {
      const result = await parser.parseURL(feed.url);
      const articles = (result.items || []).slice(0, 6).map(item => ({
        source: feed.name,
        title: item.title || "",
        summary: (item.contentSnippet || item.content || "").slice(0, 300),
        link: item.link || "",
        date: item.isoDate || item.pubDate || new Date().toISOString(),
      }));
      console.log(`  ✓ ${feed.name} : ${articles.length} articles`);
      allArticles.push(...articles);
    } catch (err) {
      console.warn(`  ⚠️  ${feed.name} : ${err.message}`);
    }
  }

  // Tri par date desc et limitation
  allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
  return allArticles.slice(0, MAX_ARTICLES);
}

// ─── 2. Demander à Claude de tout générer ───
async function askClaudeToGenerate(articles) {
  console.log(`\n🤖 Envoi de ${articles.length} articles à Claude pour analyse...`);

  const articlesText = articles
    .map((a, i) => `${i + 1}. [${a.source}] ${a.title}\n   ${a.summary}`)
    .join("\n\n");

  const prompt = `Tu es l'analyste politique du site "Le Débat — 2027".
À partir de ces ${articles.length} articles d'actualité française récente, génère un objet JSON contenant 3 sections :

ARTICLES À ANALYSER :
${articlesText}

GÉNÈRE UN JSON STRICT (rien d'autre, pas de markdown) avec cette structure exacte :

{
  "tweets": [
    {
      "id": "auto-1",
      "author": "Le Monde",
      "handle": "@lemondefr",
      "topic": "sondages",
      "text": "Texte engageant style tweet (max 240 caractères, en français, sans hashtags exagérés)",
      "likes": 1200,
      "rt": 380
    }
    // 8 tweets au total
  ],
  "mediaTopics": [
    { "label": "Retraites", "pct": 24, "color": "#DC2626" }
    // 7 thèmes au total, pct doit totaliser environ 100
  ],
  "hotTopics": [
    {
      "id": "topic-1",
      "title": "Réforme des retraites",
      "summary": "Phrase d'accroche en 1-2 phrases qui invite à débattre"
    }
    // 6 sujets au total
  ]
}

RÈGLES IMPORTANTES :
- "topic" pour les tweets DOIT être l'une de ces valeurs : "sondages", "gauche", "centre", "systeme", "municipales", "economie"
- Pour mediaTopics : sois neutre et factuel. Utilise des labels concis (1-3 mots).
- Pour hotTopics : pose des sujets qui invitent à la réflexion, pas à la polémique gratuite.
- TOUS les chiffres (likes, rt, pct) doivent être réalistes.
- AUCUN markdown, AUCUN commentaire. JUSTE le JSON.
- TON neutre, factuel, jamais d'opinion politique.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API Claude error ${res.status}: ${txt}`);
  }

  const data = await res.json();
  const text = data.content?.map(b => b.text || "").join("") || "";

  // Extraire le JSON même si Claude le met dans ```json```
  let cleanText = text.trim();
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  }

  return JSON.parse(cleanText);
}

// ─── 3. Écrire actus.json ───
function writeActusFile(generated) {
  const output = {
    lastUpdate: new Date().toISOString(),
    tweets: generated.tweets || [],
    mediaTopics: generated.mediaTopics || [],
    hotTopics: generated.hotTopics || [],
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");
  console.log(`\n✅ actus.json mis à jour avec succès !`);
  console.log(`   • ${output.tweets.length} tweets`);
  console.log(`   • ${output.mediaTopics.length} bulles médiatiques`);
  console.log(`   • ${output.hotTopics.length} sujets brûlants`);
  console.log(`   • mise à jour : ${output.lastUpdate}`);
}

// ─── Main ───
(async () => {
  try {
    const articles = await fetchAllFeeds();
    if (articles.length === 0) {
      console.error("❌ Aucun article récupéré, abandon.");
      process.exit(1);
    }
    const generated = await askClaudeToGenerate(articles);
    writeActusFile(generated);
  } catch (err) {
    console.error("❌ Erreur :", err.message);
    process.exit(1);
  }
})();