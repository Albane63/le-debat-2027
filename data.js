// ═══════════════════════════════════════════
// data.js — Toutes les données du site
// ═══════════════════════════════════════════

// ─── CLEF API ────
// La clé est chargée depuis config.local.js (fichier non versionné)
// Si config.local.js n'existe pas, le site utilise l'IA simulée
const API_KEY = (typeof window !== 'undefined' && window.API_KEY) || "";
const API_MODEL = (typeof window !== 'undefined' && window.API_MODEL) || "claude-sonnet-4-6";

// ── CANDIDATS ─────────────────────────────
const CANDIDATES = [
  { id: "bardella", name: "Jordan Bardella", party: "RN", color: "#1B2A4A", sondage: 35, status: "Pressenti", position: "Droite nationale", desc: "Président du RN, 29 ans. Favori des sondages à 35%. Remplaçant de Le Pen si elle reste inéligible.", role: "Président du parti", avatar: "🧑‍💼" },
  { id: "philippe", name: "Édouard Philippe", party: "Horizons", color: "#2563EB", sondage: 16, status: "Déclaré", position: "Centre-droit", desc: "Ex-Premier ministre, maire du Havre. Seul à battre le RN au 2nd tour selon les sondages.", role: "Président du parti", avatar: "👨‍💼" },
  { id: "glucksmann", name: "Raphaël Glucksmann", party: "Place Publique / PS", color: "#E8547C", sondage: 14, status: "Pressenti", position: "Gauche sociale-démocrate", desc: "Eurodéputé, figure de la gauche réformiste. Refuse la primaire. Monte dans les sondages.", role: "Eurodéputé, leader", avatar: "🧑‍🏫" },
  { id: "melenchon", name: "Jean-Luc Mélenchon", party: "LFI", color: "#DC2626", sondage: 11, status: "Pressenti", position: "Gauche radicale", desc: "4e candidature probable. 21,95% en 2022. Diviseur ou rassembleur de la gauche ?", role: "Fondateur, leader", avatar: "👨‍⚖️" },
  { id: "attal", name: "Gabriel Attal", party: "Renaissance", color: "#F59E0B", sondage: 11, status: "Pressenti", position: "Centre", desc: "Ex-Premier ministre, dirige Renaissance. Tente de reprendre le flambeau macroniste.", role: "Secrétaire général", avatar: "🧑‍💻" },
  { id: "retailleau", name: "Bruno Retailleau", party: "LR", color: "#1E40AF", sondage: 10, status: "Déclaré", position: "Droite conservatrice", desc: "Président des LR, ex-ministre de l'Intérieur. Ligne droitière assumée.", role: "Président du parti", avatar: "👨‍💼" },
  { id: "zemmour", name: "Éric Zemmour", party: "Reconquête", color: "#44403C", sondage: 5, status: "Pressenti", position: "Extrême droite", desc: "Fondateur de Reconquête. 7% en 2022. Favorable à une primaire de la droite.", role: "Président du parti", avatar: "🎙️" },
  { id: "tondelier", name: "Marine Tondelier", party: "Écologistes", color: "#16A34A", sondage: 4, status: "Primaire gauche", position: "Écologie", desc: "Secrétaire nationale des Verts. Candidate à la primaire de gauche.", role: "Secrétaire nationale", avatar: "👩‍🌾" },
  { id: "ruffin", name: "François Ruffin", party: "Debout !", color: "#EA580C", sondage: 3, status: "Primaire gauche", position: "Gauche populaire", desc: "Député, ex-LFI. Veut parler aux classes populaires.", role: "Député, fondateur", avatar: "📢" },
];

// ── PARTIS (blocs politiques) ────────────
const PARTIES = [
  {
    id: "rn", name: "Rassemblement National", color: "#1B2A4A", emoji: "🇫🇷",
    position: "Droite nationale", sondage: 35,
    trend: [8, 14, 18, 21, 25, 28, 33, 35],
    trendLabels: ["2012", "2014", "2017", "2019", "2022", "2024", "2025", "2026"],
    candidats: ["bardella"],
    figures: [
      { name: "Marine Le Pen", role: "Fondatrice historique", avatar: "👩‍⚖️", note: "Inéligible — appel le 7/07/2026", hot: true },
      { name: "Sébastien Chenu", role: "Vice-président, porte-parole", avatar: "🧑‍💼" },
      { name: "Laure Lavalette", role: "Porte-parole", avatar: "👩‍💼" },
    ],
    themes: ["Immigration", "Sécurité", "Pouvoir d'achat", "Souveraineté"],
    actu: "Bardella à 35%, record historique. Le RN gagne des législatives partielles partout. Le Pen inéligible change la donne.",
    force: "Premier parti de France en intentions de vote. Implantation locale record après les municipales 2026.",
    faiblesse: "Crédibilité gouvernementale. Aucune expérience du pouvoir national. Le Pen absente = risque.",
    timeline: ["2011 : Marine Le Pen prend la tête du FN", "2018 : Le FN devient le RN", "2022 : Le Pen au 2nd tour (41%)", "2024 : Bardella président à 28 ans", "2025 : Le Pen condamnée, inéligible", "2026 : Bardella favori à 35%"],
  },
  {
    id: "lr", name: "Les Républicains", color: "#1E40AF", emoji: "🔵",
    position: "Droite conservatrice", sondage: 10,
    trend: [27, 20, 20, 8, 5, 7, 9, 10],
    trendLabels: ["2012", "2014", "2017", "2019", "2022", "2024", "2025", "2026"],
    candidats: ["retailleau"],
    figures: [
      { name: "Laurent Wauquiez", role: "Président région ARA", avatar: "🧑‍💼", hot: true },
      { name: "Gérald Darmanin", role: "Ex-ministre, hésitant", avatar: "👨‍💼" },
    ],
    themes: ["Sécurité", "Autorité", "Fiscalité", "Immigration choisie"],
    actu: "Retailleau candidat déclaré. Wauquiez hésite. Le parti est coincé entre RN et centre.",
    force: "Réseau d'élus locaux dense. Crédibilité régalienne.",
    faiblesse: "Hémorragie d'électeurs vers le RN et le centre depuis 2017.",
    timeline: ["2007 : Sarkozy élu président", "2017 : Fillon éliminé au 1er tour", "2021 : Pécresse candidate (5%)", "2024 : Ciotti rejoint le RN — crise", "2025 : Retailleau prend la présidence", "2026 : 10% dans les sondages"],
  },
  {
    id: "centre", name: "Bloc central", color: "#F59E0B", emoji: "🟡",
    position: "Centre / centre-droit", sondage: 27,
    trend: [9, 10, 24, 28, 28, 22, 18, 27],
    trendLabels: ["2012", "2014", "2017", "2019", "2022", "2024", "2025", "2026"],
    candidats: ["philippe", "attal"],
    figures: [
      { name: "François Bayrou", role: "Premier ministre, MoDem", avatar: "🧓", hot: true },
      { name: "Gérald Darmanin", role: "Hésitant — LR ou centre ?", avatar: "👨‍💼" },
    ],
    themes: ["Europe", "Économie", "Réformes", "Éducation"],
    actu: "Philippe déclaré, Attal pressenti. Le bloc est divisé. Bayrou au pouvoir mais impopulaire.",
    force: "Philippe = seul à battre le RN au 2nd tour. Machine électorale encore en place.",
    faiblesse: "Bilan Macron très impopulaire. 8 Français sur 10 jugent le quinquennat raté.",
    timeline: ["2017 : Macron élu — En Marche!", "2020 : Philippe quitte Matignon", "2022 : Macron réélu (58%)", "2024 : Défaite aux législatives", "2025 : Philippe lance Horizons", "2026 : Attal vs Philippe — duel interne"],
  },
  {
    id: "ps", name: "Gauche social-démocrate", color: "#E8547C", emoji: "🌹",
    position: "Gauche réformiste", sondage: 14,
    trend: [29, 24, 6, 6, 2, 14, 13, 14],
    trendLabels: ["2012", "2014", "2017", "2019", "2022", "2024", "2025", "2026"],
    candidats: ["glucksmann"],
    figures: [
      { name: "Olivier Faure", role: "1er secrétaire du PS", avatar: "🧑‍💼" },
      { name: "Boris Vallaud", role: "Chef du groupe PS", avatar: "👨‍💼" },
    ],
    themes: ["Europe sociale", "Climat", "Démocratie", "Pouvoir d'achat"],
    actu: "Glucksmann refuse la primaire. Il monte seul dans les sondages. Le PS est tiraillé.",
    force: "Glucksmann incarne le renouveau. Score européennes 2024 = 14%. Dynamique réelle.",
    faiblesse: "Refuse l'union de la gauche. Risque de fragmenter le vote anti-RN.",
    timeline: ["2012 : Hollande élu président", "2017 : Hamon à 6% — effondrement", "2022 : Hidalgo à 2% — record négatif", "2024 : Glucksmann 14% aux européennes", "2025 : Place Publique monte", "2026 : 14% — espoir ou plafond ?"],
  },
  {
    id: "lfi", name: "La France Insoumise", color: "#DC2626", emoji: "🔴",
    position: "Gauche radicale", sondage: 11,
    trend: [0, 0, 20, 15, 22, 10, 12, 11],
    trendLabels: ["2012", "2014", "2017", "2019", "2022", "2024", "2025", "2026"],
    candidats: ["melenchon"],
    figures: [
      { name: "Mathilde Panot", role: "Présidente du groupe LFI", avatar: "👩‍⚖️" },
      { name: "Manuel Bompard", role: "Coordinateur national", avatar: "🧑‍💼" },
      { name: "Clémentine Autain", role: "Dissidente, partie", avatar: "👩‍🏫" },
    ],
    themes: ["VIe République", "SMIC à 1600€", "Retraite 60 ans", "Planification écologique"],
    actu: "Mélenchon hésite. LFI refuse la primaire. Le mouvement perd des cadres.",
    force: "22% en 2022. Électorat jeune et urbain très mobilisé.",
    faiblesse: "Mélenchon clivant. Hémorragie de cadres. Refus d'alliance = isolement.",
    timeline: ["2017 : Mélenchon 20% — percée", "2018 : Perquisitions — crise", "2022 : 22% au 1er tour — presque", "2023 : NUPES explose", "2024 : Autain, Ruffin partent", "2026 : 11% — en baisse"],
  },
  {
    id: "ecolo", name: "Écologistes + Gauche pop.", color: "#16A34A", emoji: "🌱",
    position: "Écologie / Gauche populaire", sondage: 7,
    trend: [2, 9, 6, 13, 5, 5, 6, 7],
    trendLabels: ["2012", "2014", "2017", "2019", "2022", "2024", "2025", "2026"],
    candidats: ["tondelier", "ruffin"],
    figures: [
      { name: "Sandrine Rousseau", role: "Députée écoféministe", avatar: "👩‍🏫" },
      { name: "Yannick Jadot", role: "Ex-candidat 2022", avatar: "🧑‍🌾" },
    ],
    themes: ["Climat", "Biodiversité", "Justice sociale", "Agriculture"],
    actu: "Tondelier et Ruffin candidats à la primaire de gauche. Deux visions très différentes.",
    force: "Primaire = visibilité. Sujet climat de plus en plus concret (feux, canicules).",
    faiblesse: "Scores faibles individuellement. Besoin d'un rassemblement.",
    timeline: ["2019 : 13% aux européennes — pic", "2022 : Jadot 5% — déception", "2023 : Tondelier secrétaire nationale", "2024 : 5% aux européennes", "2025 : Ruffin quitte LFI", "2026 : Primaire de gauche annoncée"],
  },
  {
    id: "reconquete", name: "Reconquête", color: "#44403C", emoji: "⚫",
    position: "Extrême droite identitaire", sondage: 5,
    trend: [0, 0, 0, 0, 7, 5, 5, 5],
    trendLabels: ["2012", "2014", "2017", "2019", "2022", "2024", "2025", "2026"],
    candidats: ["zemmour"],
    figures: [
      { name: "Marion Maréchal", role: "VP, partie en 2024", avatar: "👩‍💼" },
      { name: "Nicolas Bay", role: "Parti", avatar: "🧑‍💼" },
    ],
    themes: ["Identité", "Immigration zéro", "Remigration", "Civilisation"],
    actu: "Zemmour veut une primaire de la droite. Marion Maréchal partie. Le parti s'effrite.",
    force: "Électorat très motivé. Présence médiatique de Zemmour.",
    faiblesse: "Hémorragie de cadres. 5% = pas de dynamique. Concurrencé par le RN.",
    timeline: ["2021 : Zemmour lance Reconquête", "2022 : 7% — en dessous des attentes", "2024 : Marion Maréchal part", "2025 : Le parti perd des cadres", "2026 : 5% — stagnation"],
  },
];

// ── SUJETS BRÛLANTS ──────────────────────
const HOT_TOPICS = [
  { id: "rn", title: "Le RN à 35% : pourquoi un tel écart ?", desc: "Bardella domine tous les sondages avec 20 points d'avance. Phénomène durable ou bulle ?", emoji: "📊", cat: "Sondages" },
  { id: "lepen", title: "Le Pen inéligible : et maintenant ?", desc: "Condamnée en 2025, appel le 7 juillet 2026. Le RN peut-il gagner sans elle ?", emoji: "⚖️", cat: "Justice" },
  { id: "gauche", title: "La gauche peut-elle s'unir ?", desc: "Primaire le 11 octobre 2026 mais LFI et Place Publique refusent d'y participer.", emoji: "🤝", cat: "Gauche" },
  { id: "centre", title: "L'après-Macron : qui pour le centre ?", desc: "Philippe, Attal, Darmanin… Le bloc central cherche son champion.", emoji: "🏛️", cat: "Centre" },
  { id: "municipales", title: "Municipales 2026 : quelles leçons ?", desc: "LFI et le RN sortent renforcés malgré peu de grandes villes conquises.", emoji: "🗳️", cat: "Élections" },
  { id: "geo", title: "Guerre et prix du carburant", desc: "Le conflit au Moyen-Orient fait monter les prix. Les candidats se ruent sur l'international.", emoji: "⛽", cat: "International" },
];

// ── DUELS ─────────────────────────────────
const DUEL_SUBJECTS = [
  {
    id: "immigration",
    title: "Immigration : faut-il durcir ou ouvrir ?",
    emoji: "🌍",
    left: { label: "Position restrictive", avatar: "🔵", persona: "Tu incarnes un partisan de la restriction de l'immigration. Tu défends le contrôle des frontières, la préférence nationale, et tu penses que l'immigration massive menace la cohésion sociale." },
    right: { label: "Position ouverte", avatar: "🔴", persona: "Tu incarnes un partisan de l'accueil et de l'ouverture. Tu défends le droit d'asile, l'apport économique et culturel de l'immigration, et tu penses que la France a une tradition d'accueil." },
  },
  {
    id: "retraites",
    title: "Retraites : revenir à 62 ans ou garder 64 ?",
    emoji: "👴",
    left: { label: "Retour à 62 ans", avatar: "🔴", persona: "Tu incarnes quelqu'un qui veut abroger la réforme des retraites. Tu défends la justice sociale, le droit au repos, et tu penses qu'on peut financer autrement." },
    right: { label: "Garder 64 ans", avatar: "🔵", persona: "Tu incarnes quelqu'un qui défend la réforme des retraites. Tu parles d'équilibre budgétaire, de démographie, de responsabilité envers les générations futures." },
  },
  {
    id: "securite",
    title: "Sécurité : plus de police ou plus de social ?",
    emoji: "🚔",
    left: { label: "Plus de répression", avatar: "🔵", persona: "Tu incarnes un partisan du tout-sécuritaire. Plus de police, peines plus lourdes, tolérance zéro. La sécurité est la première des libertés." },
    right: { label: "Plus de prévention", avatar: "🔴", persona: "Tu incarnes un partisan de la prévention. Investir dans l'éducation, la culture, les quartiers. La répression seule ne résout rien." },
  },
  {
    id: "ecologie",
    title: "Écologie : croissance verte ou décroissance ?",
    emoji: "🌱",
    left: { label: "Croissance verte", avatar: "🟡", persona: "Tu incarnes un défenseur de la croissance verte. Innovation, nucléaire, technologie. On peut concilier économie et écologie sans sacrifier le niveau de vie." },
    right: { label: "Décroissance", avatar: "🟢", persona: "Tu incarnes un partisan de la sobriété. Il faut consommer moins, relocaliser, changer de modèle. La croissance infinie dans un monde fini est une illusion." },
  },
  {
    id: "europe",
    title: "Europe : plus d'intégration ou souveraineté ?",
    emoji: "🇪🇺",
    left: { label: "Plus d'Europe", avatar: "🟡", persona: "Tu incarnes un fédéraliste européen. L'Europe nous protège, nous rend plus forts face à la Chine et aux USA. Il faut plus d'intégration." },
    right: { label: "Souveraineté nationale", avatar: "🔵", persona: "Tu incarnes un souverainiste. La France doit reprendre le contrôle de ses frontières, sa monnaie, ses lois. L'UE est une machine technocratique." },
  },
];

// ── TENDANCES / TWEETS ───────────────────
const FAKE_TWEETS = [
  { author: "Journaliste politique", handle: "@pol_analyst", text: "Bardella à 35% dans le dernier sondage. Du jamais vu à un an d'une présidentielle. La question n'est plus s'il sera au 2nd tour, mais qui face à lui.", likes: "12.4K", rt: "3.2K", topic: "sondages" },
  { author: "Éditorialiste", handle: "@edito_france", text: "La primaire de gauche sans LFI et sans Place Publique, c'est comme organiser un match de foot sans les deux meilleures équipes. À quoi ça sert ?", likes: "8.7K", rt: "2.1K", topic: "gauche" },
  { author: "Commentateur", handle: "@debat_2027", text: "Édouard Philippe serait le SEUL candidat capable de battre le RN au second tour. Et pourtant, son propre camp hésite à le soutenir. Cherchez l'erreur.", likes: "15.2K", rt: "4.8K", topic: "centre" },
  { author: "Analyste", handle: "@france_pol", text: "Le vrai sujet de 2027 ce n'est pas gauche vs droite. C'est : est-ce que les Français veulent ENCORE du système actuel ou est-ce qu'ils veulent tout casser ?", likes: "22.1K", rt: "6.3K", topic: "systeme" },
  { author: "Reporter terrain", handle: "@sur_le_terrain", text: "Dans les Hauts-de-France, le RN a pris des mairies qu'on pensait imprenables. Les militants PS locaux sont sous le choc. 'On ne reconnaît plus nos électeurs'.", likes: "9.8K", rt: "2.7K", topic: "municipales" },
  { author: "Économiste", handle: "@eco_politique", text: "Le prix de l'essence à 2,20€/L. Les gilets jaunes étaient sortis pour moins que ça. Cette fois, silence. Qu'est-ce qui a changé ?", likes: "18.5K", rt: "5.1K", topic: "economie" },
];

// ── BILAN : QUESTIONS ────────────────────
const BILAN_QUESTIONS = [
  { id: "q1", text: "L'immigration en France est...", options: [
    { text: "Trop importante, il faut la réduire fortement", score: { securitaire: 3, liberal: -2 } },
    { text: "À mieux réguler, au cas par cas", score: { securitaire: 1, liberal: 0 } },
    { text: "Une richesse qu'il faut mieux accueillir", score: { securitaire: -2, liberal: 2 } },
  ]},
  { id: "q2", text: "Les retraites, c'est...", options: [
    { text: "Retour à 60-62 ans, c'est un droit", score: { social: 3, liberal: -1 } },
    { text: "64 ans c'est raisonnable vu la démographie", score: { social: -1, liberal: 2 } },
    { text: "Il faut surtout un système plus juste, peu importe l'âge", score: { social: 1, liberal: 0 } },
  ]},
  { id: "q3", text: "L'écologie, pour toi c'est...", options: [
    { text: "La priorité absolue, même si ça coûte cher", score: { ecolo: 3, liberal: -1 } },
    { text: "Important mais sans sacrifier l'économie", score: { ecolo: 1, liberal: 1 } },
    { text: "Un sujet exagéré qui pénalise les gens modestes", score: { ecolo: -2, liberal: 1 } },
  ]},
  { id: "q4", text: "L'Union européenne...", options: [
    { text: "Nous protège, il en faut plus", score: { europeen: 3, souverainiste: -2 } },
    { text: "C'est bien mais trop technocratique", score: { europeen: 0, souverainiste: 1 } },
    { text: "Menace notre souveraineté, il faut en sortir ou la changer radicalement", score: { europeen: -2, souverainiste: 3 } },
  ]},
  { id: "q5", text: "La sécurité, c'est avant tout...", options: [
    { text: "Plus de police, des peines plus dures", score: { securitaire: 3, social: -1 } },
    { text: "Plus de prévention, d'éducation, de social", score: { securitaire: -1, social: 3 } },
    { text: "Un équilibre des deux", score: { securitaire: 1, social: 1 } },
  ]},
  { id: "q6", text: "Les impôts des plus riches...", options: [
    { text: "Doivent augmenter fortement pour la redistribution", score: { social: 3, liberal: -2 } },
    { text: "Sont déjà assez élevés, il faut attirer les investisseurs", score: { social: -2, liberal: 3 } },
    { text: "C'est surtout les niches fiscales qu'il faut supprimer", score: { social: 1, liberal: 0 } },
  ]},
  { id: "q7", text: "Le nucléaire...", options: [
    { text: "Est indispensable, construisons de nouvelles centrales", score: { ecolo: -1, souverainiste: 1 } },
    { text: "Doit être progressivement abandonné pour le renouvelable", score: { ecolo: 3, souverainiste: -1 } },
    { text: "On garde l'existant mais on investit aussi dans le reste", score: { ecolo: 1, souverainiste: 0 } },
  ]},
  { id: "q8", text: "La laïcité aujourd'hui...", options: [
    { text: "Doit être appliquée plus strictement", score: { securitaire: 2, social: -1 } },
    { text: "Est bien comme elle est", score: { securitaire: 0, social: 0 } },
    { text: "Est utilisée pour stigmatiser certaines religions", score: { securitaire: -2, social: 2 } },
  ]},
  { id: "q9", text: "Le président idéal serait...", options: [
    { text: "Quelqu'un d'autorité qui remet de l'ordre", score: { securitaire: 3, liberal: 1 } },
    { text: "Un rassembleur pragmatique", score: { europeen: 1, liberal: 1 } },
    { text: "Quelqu'un du peuple qui change le système", score: { social: 2, souverainiste: 1 } },
  ]},
  { id: "q10", text: "En 2027, le plus important c'est...", options: [
    { text: "Le pouvoir d'achat et l'emploi", score: { liberal: 2, social: 1 } },
    { text: "La sécurité et l'immigration", score: { securitaire: 3, souverainiste: 1 } },
    { text: "L'écologie et le climat", score: { ecolo: 3 } },
    { text: "Les inégalités et la justice sociale", score: { social: 3 } },
  ]},
];

// ── MAP DATA ─────────────────────────────
const BLOC_COLORS = {
  rn: "#1B2A4A", droite: "#2563EB", centre: "#F59E0B",
  gauche: "#E11D48", ecolo: "#16A34A", mixte: "#06B6D4", auto: "#7C3AED",
};
const BLOC_LABELS = {
  rn: "RN / droite nationale", droite: "Droite / centre-droit", centre: "Centre / bloc modéré",
  gauche: "Gauche / centre-gauche", ecolo: "Écologie", mixte: "Mixte / contrasté", auto: "Autonomiste",
};

const REGIONS = [
  { id:"84", name:"Auvergne-Rhône-Alpes", bloc:"droite", tendency:"Centre-droit / droite", cities:"Lyon, Grenoble, Saint-Étienne", old:["Auvergne","Rhône-Alpes"],
    president:"Laurent Wauquiez (LR)", pop:"8,1M hab.", budget:"3,9 Md€", competences:"Lycées, TER, développement économique, formation pro", enjeu:"Wauquiez lorgne l'Élysée mais Retailleau lui barre la route à droite. Lyon bascule-t-elle à gauche ?", resultat2022:"Macron 29% · Le Pen 25% · Mélenchon 22%", deputes:"LR 28, REN 25, RN 18, LFI 12" },
  { id:"27", name:"Bourgogne-Franche-Comté", bloc:"droite", tendency:"Droite / RN selon les territoires", cities:"Dijon, Besançon, Auxerre", old:["Bourgogne","Franche-Comté"],
    president:"Marie-Guite Dufay (PS)", pop:"2,8M hab.", budget:"1,5 Md€", competences:"Lycées, TER, aménagement du territoire", enjeu:"Région coupée en deux : métropoles à gauche, rural en poussée RN. L'industrie auto (PSA Sochaux) en crise.", resultat2022:"Macron 28% · Le Pen 27% · Mélenchon 19%", deputes:"RN 8, LR 7, REN 5" },
  { id:"53", name:"Bretagne", bloc:"gauche", tendency:"Centre-gauche / modéré", cities:"Rennes, Brest, Quimper", old:["Bretagne"],
    president:"Loïg Chesnais-Girard (PS)", pop:"3,4M hab.", budget:"1,8 Md€", competences:"Lycées, ports, TER, langues régionales", enjeu:"Bastion de gauche modérée, mais la crise agricole (algues vertes, PAC) pousse les agriculteurs vers le RN.", resultat2022:"Macron 32% · Mélenchon 22% · Le Pen 19%", deputes:"REN 9, PS 5, LR 4, Ecolo 3" },
  { id:"24", name:"Centre-Val de Loire", bloc:"centre", tendency:"Centre / droite modérée", cities:"Tours, Orléans, Chartres", old:["Centre"],
    president:"François Bonneau (PS)", pop:"2,6M hab.", budget:"1,3 Md€", competences:"Lycées, TER, tourisme (châteaux de la Loire)", enjeu:"Désertification médicale massive. 1 habitant sur 4 n'a pas de médecin traitant. Le sujet santé domine.", resultat2022:"Macron 28% · Le Pen 26% · Mélenchon 20%", deputes:"RN 7, REN 6, LR 5" },
  { id:"94", name:"Corse", bloc:"auto", tendency:"Autonomiste / droite locale", cities:"Ajaccio, Bastia", old:["Corse"],
    president:"Gilles Simeoni (Femu a Corsica)", pop:"349K hab.", budget:"0,6 Md€", competences:"Statut spécial : transports, énergie, culture, langue corse", enjeu:"Négociations d'autonomie avec Paris. Spéculation immobilière : les Corses ne peuvent plus se loger chez eux.", resultat2022:"Macron 28% · Le Pen 25% · Mélenchon 18%", deputes:"Autonomistes 2, LR 1, RN 1" },
  { id:"44", name:"Grand Est", bloc:"droite", tendency:"Droite / RN fort", cities:"Strasbourg, Metz, Nancy", old:["Alsace","Champagne-Ardenne","Lorraine"],
    president:"Franck Leroy (LR)", pop:"5,6M hab.", budget:"3,2 Md€", competences:"Lycées, TER, coopération transfrontalière (Allemagne)", enjeu:"Désindustrialisation de la Lorraine, montée du RN dans les zones rurales. L'Alsace veut son autonomie.", resultat2022:"Macron 27% · Le Pen 27% · Mélenchon 19%", deputes:"RN 16, LR 14, REN 12" },
  { id:"32", name:"Hauts-de-France", bloc:"rn", tendency:"RN fort / droite populaire", cities:"Lille, Amiens, Arras", old:["Nord-Pas-de-Calais","Picardie"],
    president:"Xavier Bertrand (divers droite)", pop:"6M hab.", budget:"3,6 Md€", competences:"Lycées, TER, reconversion industrielle, canal Seine-Nord", enjeu:"1er bastion RN de France. Bertrand résiste mais le RN gagne du terrain aux municipales. Chômage au-dessus de la moyenne nationale.", resultat2022:"Le Pen 31% · Macron 25% · Mélenchon 22%", deputes:"RN 22, REN 12, LFI 8, LR 7" },
  { id:"11", name:"Île-de-France", bloc:"centre", tendency:"Centre / gauche urbaine", cities:"Paris, Versailles, Créteil", old:["Île-de-France"],
    president:"Valérie Pécresse (LR)", pop:"12,3M hab.", budget:"5,7 Md€", competences:"Lycées, transports (Île-de-France Mobilités), logement, Grand Paris Express", enjeu:"Fracture Paris intra-muros (gauche) vs banlieues (LFI au nord, RN au sud). Crise du logement : +40% en 10 ans.", resultat2022:"Macron 30% · Mélenchon 27% · Le Pen 14%", deputes:"REN 30, LFI 22, LR 15, RN 8" },
  { id:"28", name:"Normandie", bloc:"droite", tendency:"Centre-droit / droite", cities:"Rouen, Caen, Le Havre", old:["Basse-Normandie","Haute-Normandie"],
    president:"Hervé Morin (Les Centristes)", pop:"3,3M hab.", budget:"1,9 Md€", competences:"Lycées, TER, ports maritimes (Le Havre = 1er port français)", enjeu:"Après l'incendie de Lubrizol, la question industrielle et environnementale est centrale. Le Havre, ville test de Philippe.", resultat2022:"Macron 27% · Le Pen 27% · Mélenchon 20%", deputes:"RN 8, REN 7, LR 5" },
  { id:"75", name:"Nouvelle-Aquitaine", bloc:"gauche", tendency:"Centre-gauche / modéré", cities:"Bordeaux, Limoges, Poitiers", old:["Aquitaine","Limousin","Poitou-Charentes"],
    president:"Alain Rousset (PS)", pop:"6,1M hab.", budget:"3,3 Md€", competences:"Lycées, TER, agriculture, forêt des Landes, aéronautique", enjeu:"Plus grande région de France. Méga-feux dans les Landes, sécheresse record. L'écologie devient un sujet concret, pas théorique.", resultat2022:"Macron 28% · Le Pen 23% · Mélenchon 22%", deputes:"REN 16, PS 10, RN 10, LR 8" },
  { id:"76", name:"Occitanie", bloc:"gauche", tendency:"Gauche / gauche urbaine", cities:"Toulouse, Montpellier, Nîmes", old:["Languedoc-Roussillon","Midi-Pyrénées"],
    president:"Carole Delga (PS)", pop:"6M hab.", budget:"3,4 Md€", competences:"Lycées, TER, aéronautique (Airbus Toulouse), viticulture", enjeu:"Toulouse = gauche tech, littoral méditerranéen = RN. La région la plus contrastée politiquement de France.", resultat2022:"Macron 26% · Mélenchon 24% · Le Pen 22%", deputes:"REN 13, RN 12, LFI 10, PS 7" },
  { id:"52", name:"Pays de la Loire", bloc:"centre", tendency:"Centre / centre-droit", cities:"Nantes, Angers, Le Mans", old:["Pays de la Loire"],
    president:"Christelle Morançais (LR)", pop:"3,9M hab.", budget:"2,0 Md€", competences:"Lycées, TER, industrie navale (chantiers de Saint-Nazaire)", enjeu:"Nantes veut sa métropole autonome. Tensions centre-droit / gauche urbaine. Industrie navale stratégique (sous-marins).", resultat2022:"Macron 31% · Le Pen 22% · Mélenchon 21%", deputes:"REN 10, LR 7, RN 5, PS 4" },
  { id:"93", name:"Provence-Alpes-Côte d'Azur", bloc:"rn", tendency:"RN fort / droite", cities:"Marseille, Nice, Toulon", old:["PACA"],
    president:"Renaud Muselier (LR)", pop:"5,1M hab.", budget:"2,8 Md€", competences:"Lycées, TER, tourisme, ports (Marseille = 1er port de Méditerranée)", enjeu:"Marseille : narcotrafic, 50 morts en 2025. Nice : 2ème ville RN de France. Le sujet sécurité écrase tout le reste.", resultat2022:"Le Pen 28% · Macron 26% · Mélenchon 22%", deputes:"RN 15, REN 10, LFI 6, LR 5" },
];
const REGION_BY_ID = Object.fromEntries(REGIONS.map(r => [r.id, r]));

const DEPT_TO_REGION = {
  "01":"84","03":"84","07":"84","15":"84","26":"84","38":"84","42":"84","43":"84","63":"84","69":"84","73":"84","74":"84",
  "21":"27","25":"27","39":"27","58":"27","70":"27","71":"27","89":"27","90":"27",
  "22":"53","29":"53","35":"53","56":"53",
  "18":"24","28":"24","36":"24","37":"24","41":"24","45":"24",
  "2A":"94","2B":"94",
  "08":"44","10":"44","51":"44","52":"44","54":"44","55":"44","57":"44","67":"44","68":"44","88":"44",
  "02":"32","59":"32","60":"32","62":"32","80":"32",
  "75":"11","77":"11","78":"11","91":"11","92":"11","93":"11","94":"11","95":"11",
  "14":"28","27":"28","50":"28","61":"28","76":"28",
  "16":"75","17":"75","19":"75","23":"75","24":"75","33":"75","40":"75","47":"75","64":"75","79":"75","86":"75","87":"75",
  "09":"76","11":"76","12":"76","30":"76","31":"76","32":"76","34":"76","46":"76","48":"76","65":"76","66":"76","81":"76","82":"76",
  "44":"52","49":"52","53":"52","72":"52","85":"52",
  "04":"93","05":"93","06":"93","13":"93","83":"93","84":"93",
};

const DEPT_POLITICS = {
  "02":{bloc:"rn"},"06":{bloc:"droite"},"13":{bloc:"mixte"},"30":{bloc:"rn"},
  "31":{bloc:"gauche"},"33":{bloc:"gauche"},"34":{bloc:"mixte"},"35":{bloc:"gauche"},
  "38":{bloc:"gauche"},"42":{bloc:"droite"},"44":{bloc:"gauche"},"57":{bloc:"rn"},
  "59":{bloc:"mixte"},"62":{bloc:"rn"},"67":{bloc:"centre"},"69":{bloc:"centre"},
  "75":{bloc:"gauche"},"76":{bloc:"mixte"},"77":{bloc:"droite"},"78":{bloc:"droite"},
  "83":{bloc:"rn"},"84":{bloc:"droite"},"92":{bloc:"droite"},"93":{bloc:"gauche"},
  "94":{bloc:"gauche"},"95":{bloc:"centre"},"2A":{bloc:"auto"},"2B":{bloc:"auto"},
};

function getDeptBloc(code) {
  if (DEPT_POLITICS[code]?.bloc) return DEPT_POLITICS[code].bloc;
  const rid = DEPT_TO_REGION[code];
  return REGION_BY_ID[rid]?.bloc || "mixte";
}

// ── NEWS ALERTS — couvrent toutes les régions ──
const NEWS_CATS = ["Tous","Sécurité","Économie","Social","Politique","Sondages","International","Élections","Écologie"];

const NEWS_ALERTS = [
  { dept:"13", title:"Marseille : émeutes après un contrôle policier", cat:"Sécurité", color:"#DC2626", emoji:"🚨", text:"Troisième nuit de violences dans les quartiers nord. Le préfet demande des renforts.", date:"31 mars 2026", hot:true, tweetRef:0 },
  { dept:"59", title:"Valenciennes : fermeture de l'usine Stellantis", cat:"Économie", color:"#F59E0B", emoji:"🏭", text:"1 200 emplois supprimés. Les syndicats appellent à la grève générale dans les Hauts-de-France.", date:"29 mars 2026", hot:true, tweetRef:5 },
  { dept:"75", title:"Paris : 500 000 manifestants contre les retraites", cat:"Social", color:"#E11D48", emoji:"✊", text:"Glucksmann et Ruffin en tête de cortège. La police bloque les Champs-Élysées.", date:"28 mars 2026", hot:true },
  { dept:"33", title:"Bordeaux : Tondelier lance sa campagne", cat:"Politique", color:"#16A34A", emoji:"🌱", text:"La candidate écologiste promet un 'choc écologique' en 100 jours si élue.", date:"27 mars 2026" },
  { dept:"06", title:"Nice : Retailleau promet 30 000 policiers", cat:"Sécurité", color:"#1E40AF", emoji:"🔵", text:"Le candidat LR en visite promet aussi 20 000 places de prison supplémentaires.", date:"26 mars 2026" },
  { dept:"69", title:"Lyon : essence à 2,30€, record historique", cat:"Économie", color:"#F59E0B", emoji:"⛽", text:"Ristourne de 10 centimes jugée insuffisante. Les transporteurs menacent de bloquer l'A7.", date:"25 mars 2026", hot:true },
  { dept:"31", title:"Toulouse : Philippe devance Bardella", cat:"Sondages", color:"#2563EB", emoji:"📊", text:"Exception dans un paysage dominé par le RN : +3 points pour Philippe en Occitanie.", date:"24 mars 2026", tweetRef:2 },
  { dept:"62", title:"Pas-de-Calais : le RN gagne une législative", cat:"Élections", color:"#1B2A4A", emoji:"🗳️", text:"4ème siège conquis. Le PS perd son dernier bastion rural dans le département.", date:"23 mars 2026", hot:true },
  { dept:"67", title:"Strasbourg : accord franco-allemand sur la défense", cat:"International", color:"#7C3AED", emoji:"🤝", text:"Brigade commune de 5 000 soldats. L'Europe de la défense avance.", date:"22 mars 2026" },
  { dept:"93", title:"Saint-Denis : 30% sous le seuil de pauvreté", cat:"Social", color:"#E11D48", emoji:"📉", text:"Rapport INSEE choc. Record de France. Les candidats de gauche réagissent.", date:"21 mars 2026", hot:true },
  { dept:"35", title:"Rennes : grève des agriculteurs bretons", cat:"Économie", color:"#F59E0B", emoji:"🚜", text:"Blocage de la rocade. Protestation contre les importations ukrainiennes.", date:"20 mars 2026" },
  { dept:"21", title:"Dijon : Bardella en meeting, 8 000 personnes", cat:"Politique", color:"#1B2A4A", emoji:"🎤", text:"Le candidat RN remplit le Zénith. Il cible les retraites et l'immigration.", date:"19 mars 2026", tweetRef:0 },
  { dept:"2A", title:"Ajaccio : tensions sur l'autonomie corse", cat:"Politique", color:"#7C3AED", emoji:"🏴", text:"Les autonomistes rejettent la dernière proposition de Paris. Manifestation.", date:"18 mars 2026" },
  { dept:"40", title:"Landes : méga-feu, 3 000 ha brûlés", cat:"Écologie", color:"#16A34A", emoji:"🔥", text:"Troisième été consécutif. Les écologistes demandent un plan national.", date:"17 mars 2026", hot:true },
  { dept:"44", title:"Saint-Nazaire : commande record de sous-marins", cat:"Économie", color:"#2563EB", emoji:"⚓", text:"4 milliards d'euros. 2 000 emplois créés. Filière navale au sommet.", date:"16 mars 2026" },
  { dept:"14", title:"Caen : CHU débordé, 12h d'attente aux urgences", cat:"Social", color:"#E11D48", emoji:"🏥", text:"Les soignants craquent. Le directeur demande l'état d'urgence sanitaire.", date:"15 mars 2026" },
];

// ── ARCHIVES DES DÉBATS ──────────────────
const ARCHIVE_DEBATS = [
  {
    id: "hollande-sarkozy-2012",
    title: "Hollande vs Sarkozy",
    date: "2 mai 2012",
    year: 2012,
    youtubeId: "po7WkXwfP1k",
    cover: "https://img.youtube.com/vi/po7WkXwfP1k/hqdefault.jpg",
    resume: "Dernier grand duel avant l'arrivée du macronisme. Affrontement frontal entre le président sortant Nicolas Sarkozy et François Hollande sur le bilan, la présidence et la justice sociale.",
    themes: ["Bilan du quinquennat", "Crise économique", "Fiscalité", "Présidentialité"],
    leftName: "François Hollande",
    rightName: "Nicolas Sarkozy",
    leftPosition: "Changement, justice sociale, présidence normale, rééquilibrage fiscal.",
    rightPosition: "Expérience, autorité, compétitivité, défense du bilan face à la crise.",
    context: "Le débat se tient dans un climat de crise de la zone euro et de forte usure du pouvoir. Sarkozy joue la stature et le combat, Hollande cherche à apparaître comme une alternance crédible et stable."
  },
  {
    id: "royal-sarkozy-2007",
    title: "Ségolène Royal vs Sarkozy",
    date: "2 mai 2007",
    year: 2007,
    youtubeId: "mV9lRkU4Kyg",
    cover: "https://img.youtube.com/vi/mV9lRkU4Kyg/hqdefault.jpg",
    resume: "Un débat très tendu, marqué par les styles personnels, l'autorité, l'école et la question du rôle présidentiel.",
    themes: ["Ordre juste", "Travail", "Éducation", "Style présidentiel"],
    leftName: "Ségolène Royal",
    rightName: "Nicolas Sarkozy",
    leftPosition: "Protection, justice sociale, démocratie participative, encadrement des marchés.",
    rightPosition: "Travail, autorité, rupture, valorisation du mérite et réforme de l'État.",
    context: "Ce débat cristallise l'opposition entre une droite de rupture et une gauche cherchant à réinventer son logiciel après les années Jospin."
  },
  {
    id: "macron-lepen-2017",
    title: "Macron vs Le Pen",
    date: "3 mai 2017",
    year: 2017,
    youtubeId: "Qj6jbJglJj8",
    cover: "https://img.youtube.com/vi/Qj6jbJglJj8/hqdefault.jpg",
    resume: "Premier duel entre Emmanuel Macron et Marine Le Pen. L'euroscepticisme, la mondialisation et la crédibilité gouvernementale dominent l'échange.",
    themes: ["Europe", "Mondialisation", "Terrorisme", "Pouvoir d'achat"],
    leftName: "Emmanuel Macron",
    rightName: "Marine Le Pen",
    leftPosition: "Europe, ouverture économique, dépassement du clivage traditionnel, réforme pro-investissement.",
    rightPosition: "Souveraineté, critique de l'euro, protectionnisme, priorité nationale.",
    context: "Le débat intervient après l'effondrement des partis traditionnels. Macron veut apparaître comme le candidat du renouvellement central ; Le Pen tente de normaliser l'extrême droite tout en conservant un discours de rupture."
  },
  {
    id: "melenchon-zemmour-2021",
    title: "Mélenchon vs Zemmour",
    date: "23 septembre 2021",
    year: 2021,
    youtubeId: "xH0N0K8wLYY",
    cover: "https://img.youtube.com/vi/xH0N0K8wLYY/hqdefault.jpg",
    resume: "Face-à-face hors présidentielle officielle, mais devenu référence : choc idéologique total entre gauche populiste et droite identitaire.",
    themes: ["Immigration", "Identité", "République", "Classes populaires"],
    leftName: "Jean-Luc Mélenchon",
    rightName: "Éric Zemmour",
    leftPosition: "Égalité sociale, créolisation, rupture avec le néolibéralisme, défense des services publics.",
    rightPosition: "Assimilation, identité nationale, déclin civilisationnel, politique migratoire radicale.",
    context: "Ce duel révèle une autre géographie du débat public : plus culturelle, plus polarisée, plus médiatique. Il a fortement marqué la pré-campagne de 2022."
  },
  {
    id: "macron-lepen-2022",
    title: "Macron vs Le Pen",
    date: "20 avril 2022",
    year: 2022,
    youtubeId: "47XRl6K9QpQ",
    cover: "https://img.youtube.com/vi/47XRl6K9QpQ/hqdefault.jpg",
    resume: "Revanche de 2017 : Marine Le Pen cherche à apparaître plus crédible et plus sociale, Emmanuel Macron défend son bilan et pointe les ambiguïtés de sa rivale.",
    themes: ["Inflation", "Énergie", "Ukraine", "Pouvoir d'achat"],
    leftName: "Emmanuel Macron",
    rightName: "Marine Le Pen",
    leftPosition: "Bilan, Europe, transition industrielle, protection par la réforme.",
    rightPosition: "Pouvoir d'achat, proximité sociale, critique de la verticalité macroniste, souveraineté.",
    context: "Le débat se déroule dans le contexte de la guerre en Ukraine et de l'inflation. Le Pen veut rassurer ; Macron veut réactiver le doute sur sa capacité à gouverner."
  }
];

// ── SUJETS MÉDIATIQUES (poids dans l'actu) ──
const MEDIA_TOPICS = {
  national: [
    { id: "retraites-manif", label: "Retraites", pct: 24, emoji: "✊", color: "#DC2626", desc: "La réforme des retraites reste le sujet n°1. Manifestations, blocages, débat parlementaire.", context: "500 000 manifestants le 28 mars. Glucksmann et Ruffin en tête. La question du financement divise même au sein de la gauche.", debate: "Faut-il revenir à 62 ans ou trouver un autre financement ?" },
    { id: "securite-marseille", label: "Sécurité / Narcotrafic", pct: 18, emoji: "🚨", color: "#EF4444", desc: "Marseille, narcotrafic, violences urbaines. Le débat répression vs prévention s'intensifie.", context: "50 morts liés au narcotrafic à Marseille en 2025. Retailleau promet 30 000 policiers. La gauche parle éducation et insertion.", debate: "Plus de police ou plus de social — qu'est-ce qui marche vraiment ?" },
    { id: "presidentielle-sondages", label: "Présidentielle 2027", pct: 16, emoji: "🗳️", color: "#2563EB", desc: "Bardella à 35%, Philippe déclaré, la gauche divisée. La course est lancée.", context: "Le RN domine à 1 an du scrutin. Philippe seul à pouvoir le battre au 2nd tour. Mélenchon hésite.", debate: "Le RN peut-il vraiment gagner cette fois ?" },
    { id: "pouvoir-achat", label: "Pouvoir d'achat", pct: 14, emoji: "💶", color: "#F59E0B", desc: "Essence à 2,30€, inflation alimentaire, logement. Les Français souffrent.", context: "Le prix du carburant bat des records. Le logement représente 35% du budget des ménages. Les candidats rivalisent de propositions.", debate: "Le pouvoir d'achat est-il un problème de salaires ou de prix ?" },
    { id: "education", label: "Éducation", pct: 8, emoji: "📚", color: "#7C3AED", desc: "Classements PISA en baisse, profs en grève, réforme du bac contestée.", context: "La France recule dans les classements internationaux. 50% des enseignants envisagent de quitter le métier. Le débat porte sur les moyens vs les méthodes.", debate: "L'école française est-elle en déclin ou en transformation ?" },
    { id: "sante", label: "Santé / Hôpital", pct: 7, emoji: "🏥", color: "#06B6D4", desc: "Déserts médicaux, urgences saturées, burn-out des soignants.", context: "12h d'attente aux urgences à Caen. 1 Français sur 4 sans médecin traitant. Le Ségur de la santé jugé insuffisant.", debate: "Comment sauver l'hôpital public ?" },
    { id: "immigration-nat", label: "Immigration", pct: 13, emoji: "🌍", color: "#1B2A4A", desc: "Loi immigration, régularisations, débat identitaire permanent.", context: "500 000 titres de séjour par an. Le RN veut un référendum. La gauche défend le droit d'asile. Le centre cherche un compromis.", debate: "L'immigration est-elle un problème ou une solution ?" },
  ],
  international: [
    { id: "guerre-ukraine", label: "Guerre en Ukraine", pct: 22, emoji: "🇺🇦", color: "#2563EB", desc: "3 ans de guerre. Négociations au point mort. L'Europe s'arme.", context: "Trump menace de couper l'aide. L'UE augmente ses budgets défense de 40%. La France envoie des missiles longue portée. Zelensky demande des garanties.", debate: "L'Europe doit-elle continuer à armer l'Ukraine ?" },
    { id: "iran-tensions", label: "Tensions Iran", pct: 18, emoji: "🇮🇷", color: "#DC2626", desc: "Programme nucléaire, sanctions, menaces sur le détroit d'Ormuz.", context: "L'Iran enrichit l'uranium à 60%. Israël menace de frappes. Le prix du pétrole monte. Les négociations sont au point mort depuis 2023.", debate: "Faut-il négocier ou sanctionner l'Iran ?" },
    { id: "chine-taiwan", label: "Chine / Taïwan", pct: 14, emoji: "🇨🇳", color: "#EF4444", desc: "Exercices militaires, semi-conducteurs, nouvelle guerre froide.", context: "La Chine multiplie les manœuvres autour de Taïwan. 90% des puces avancées viennent de TSMC. L'Europe dépend de cette chaîne.", debate: "La France doit-elle prendre position sur Taïwan ?" },
    { id: "climat-mondial", label: "Climat mondial", pct: 12, emoji: "🌡️", color: "#16A34A", desc: "+1,5°C dépassé. COP31 en préparation. Les engagements ne sont pas tenus.", context: "2025 a été l'année la plus chaude jamais enregistrée. Les émissions mondiales n'ont pas baissé. Les pays du Sud demandent des financements.", debate: "Les accords climat servent-ils à quelque chose ?" },
    { id: "usa-elections", label: "Politique US", pct: 11, emoji: "🇺🇸", color: "#1B2A4A", desc: "Trump au pouvoir. Retrait du multilatéralisme. Impact sur l'Europe.", context: "Trump impose des tarifs douaniers à l'Europe. L'OTAN est fragilisée. La relation transatlantique se tend.", debate: "L'Europe peut-elle se passer des États-Unis ?" },
    { id: "afrique-sahel", label: "Sahel / Afrique", pct: 10, emoji: "🌍", color: "#F59E0B", desc: "Retrait français, influence russe, juntes militaires.", context: "La France a quitté le Mali, le Burkina et le Niger. Wagner/Africa Corps remplace. La Chine investit massivement.", debate: "La France a-t-elle perdu l'Afrique ?" },
    { id: "migration-mondiale", label: "Migrations mondiales", pct: 8, emoji: "🚢", color: "#7C3AED", desc: "Méditerranée, route des Balkans, mur de la Manche.", context: "Record de traversées de la Manche en 2025. L'accord UE-Tunisie contesté. Les morts en Méditerranée continuent.", debate: "Peut-on contrôler les migrations sans renoncer au droit d'asile ?" },
    { id: "ia-regulation", label: "IA / Régulation tech", pct: 5, emoji: "🤖", color: "#06B6D4", desc: "Course mondiale à l'IA. L'Europe régule, les USA et la Chine accélèrent.", context: "L'AI Act européen entre en vigueur. OpenAI, Google et Anthropic dominent. La Chine ferme la marche. 40% des emplois menacés selon le FMI.", debate: "L'Europe a-t-elle raison de réguler l'IA ?" },
  ]
};