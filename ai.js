// ═══════════════════════════════════════════
// ai.js — Module IA (simulée ou vraie API)
// ═══════════════════════════════════════════

const AI_SYSTEM = `Tu es l'IA du site "Le Débat — 2027". Tu ne donnes JAMAIS ton opinion politique. Tu CHALLENGES l'utilisateur avec la méthode socratique. Tu es neutre, bienveillant mais exigeant. Réponds en français, 3-5 phrases max, termine par une question ouverte.`;

// ── Détection automatique : local vs en ligne ──
function isLocalEnvironment() {
  // Si on est sur ton PC, l'URL commence par "file://" ou "localhost"
  // Si on est en ligne, c'est ton-site.netlify.app
  return window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}

// ── Appel API réel ──
// En LOCAL : appel direct à Claude (avec la clé de config.local.js)
// EN LIGNE : appel à la Netlify Function (clé cachée côté serveur)
async function callRealAPI(messages, systemPrompt) {
  if (isLocalEnvironment()) {
    // Mode LOCAL — appel direct (clé locale)
    return await callClaudeDirectly(messages, systemPrompt);
  } else {
    // Mode EN LIGNE — appel via Netlify Function
    return await callClaudeViaProxy(messages, systemPrompt);
  }
}

// ── Appel direct à Claude (mode local uniquement) ──
async function callClaudeDirectly(messages, systemPrompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: API_MODEL,
      max_tokens: 600,
      system: systemPrompt || AI_SYSTEM,
      messages: messages,
    }),
  });
  const data = await res.json();
  if (data.error) {
    console.warn("API error:", data.error.message);
    throw new Error(data.error.message);
  }
  return data.content?.map(b => b.text || "").join("") || "Erreur. Réessaie !";
}

// ── Appel via Netlify Function (mode en ligne) ──
async function callClaudeViaProxy(messages, systemPrompt) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: messages,
      system: systemPrompt || AI_SYSTEM,
    }),
  });
  const data = await res.json();
  if (data.error) {
    console.warn("Proxy error:", data.error);
    throw new Error(data.error.message || data.error);
  }
  return data.content?.map(b => b.text || "").join("") || "Erreur. Réessaie !";
}

// ── IA simulée intelligente V2 ──
function simulateAI(userText, context) {
  const lower = userText.toLowerCase();
  const ctx = (context || "").toLowerCase();
  const responses = [];

  // ── Détection du contexte (région, parti, sujet) ──
  const isCarteContext = ctx.includes("région") || ctx.includes("dept") || ctx.includes("tendance");
  const isPartyContext = ctx.includes("parti") || ctx.includes("candidat");
  const isTweetContext = ctx.includes("tweet") || ctx.includes("fait vs opinion");
  const isDebatContext = ctx.includes("débat") || ctx.includes("challenge");

  // ── Réponses contextuelles sur les RÉGIONS ──
  if (isCarteContext || lower.includes("région") || lower.includes("département")) {
    if (lower.includes("droite") || lower.includes("rn") || lower.includes("bardella")) {
      responses.push(
        "Tu notes que ce territoire penche à droite. Mais est-ce un vote d'adhésion au programme du RN, ou un vote de protestation contre les sortants ? La distinction est fondamentale pour comprendre si c'est durable. Qu'est-ce qui te fait pencher pour l'un ou l'autre ?",
        "Le virage à droite de certains territoires est réel. Mais regarde les résultats commune par commune : les villes-centres votent souvent différemment des zones périurbaines et rurales. Comment tu expliques cette fracture géographique ?",
      );
    }
    if (lower.includes("gauche") || lower.includes("ps") || lower.includes("écolo")) {
      responses.push(
        "La gauche résiste dans certains territoires urbains. Mais est-ce la même gauche qu'il y a 20 ans ? Entre un vote étudiant-écolo et un vote ouvrier traditionnel, les motivations sont très différentes. Tu vois ça comment dans ce territoire ?",
        "Intéressant. Mais un territoire qui vote à gauche aux municipales peut très bien voter différemment à la présidentielle. Le vote local et le vote national, c'est pas la même logique. Qu'est-ce qui pèse le plus ici selon toi ?",
      );
    }
    responses.push(
      "Tu parles de ce territoire. Mais connais-tu son taux de chômage, son évolution démographique, son tissu économique ? Souvent, le vote s'explique davantage par la sociologie que par l'offre politique. Qu'est-ce qui pèse le plus ici d'après toi ?",
      "Ce territoire a une histoire politique. Mais les lignes bougent : des bastions de gauche basculent, des fiefs de droite résistent ou s'effritent. À ton avis, qu'est-ce qui fait basculer un territoire : les candidats locaux, les enjeux nationaux, ou les mutations économiques ?",
    );
  }

  // ── Réponses sur les CANDIDATS et PARTIS ──
  if (lower.includes("bardella") || lower.includes("rn") || lower.includes("rassemblement") || lower.includes("le pen")) {
    responses.push(
      "Bardella est à 35% dans les sondages. Mais un sondage mesure une intention, pas un vote. En 2002, Le Pen père au 2nd tour a choqué tout le monde. En 2017 et 2022, Le Pen fille a perdu au second tour. Qu'est-ce qui serait différent cette fois avec Bardella ?",
      "Le RN progresse partout, y compris dans des territoires historiquement à gauche. Mais est-ce que les gens votent RN parce qu'ils adhèrent au programme, ou parce qu'ils rejettent tous les autres ? C'est pas du tout le même phénomène. Toi, comment tu l'analyses ?",
      "Tu mentionnes le RN. Une question rarement posée : si le RN arrivait au pouvoir, avec quelle majorité parlementaire gouvernerait-il ? Un président sans majorité, on a vu ce que ça donne avec Macron depuis 2022. Est-ce que ça change ton analyse ?",
    );
  }
  if (lower.includes("glucksmann") || lower.includes("ps") || lower.includes("social")) {
    responses.push(
      "Glucksmann monte dans les sondages, mais il refuse la primaire de gauche. C'est un choix stratégique : il parie que son électorat est différent de celui de Mélenchon. Est-ce que tu penses qu'il a raison, ou est-ce qu'il divise les voix de gauche ?",
      "Le PS était à 2% en 2022 avec Hidalgo. Glucksmann l'a ressuscité aux européennes. Mais est-ce le PS qui est remonté, ou est-ce Glucksmann tout seul ? Si demain il quitte le PS, que reste-t-il ? C'est une vraie question stratégique.",
    );
  }
  if (lower.includes("mélenchon") || lower.includes("melenchon") || lower.includes("lfi") || lower.includes("insoumis")) {
    responses.push(
      "Mélenchon a fait 22% en 2022, à 400 000 voix du second tour. Mais son plafond semble atteint : il divise autant qu'il rassemble. Est-ce que la gauche peut gagner avec lui ? Et sans lui ? C'est le dilemme que personne n'arrive à trancher.",
      "LFI a une base militante très active mais un rejet massif chez les plus de 50 ans. En politique, on gagne avec une coalition large. Comment Mélenchon peut-il élargir sans renier ce qui fait sa force auprès des jeunes ?",
    );
  }
  if (lower.includes("macron") || lower.includes("philippe") || lower.includes("attal") || lower.includes("renaissance")) {
    responses.push(
      "Philippe est le seul à battre Bardella au 2nd tour dans les sondages. Pourtant, son propre camp hésite à le soutenir. Attal veut y aller aussi. Pourquoi le bloc central n'arrive-t-il pas à se rassembler derrière son meilleur candidat ? Qu'est-ce que ça te dit sur la politique ?",
      "Le macronisme a structuré la politique française pendant 10 ans. Mais 8 Français sur 10 jugent le bilan négatif. Est-ce que 'l'après-Macron' peut exister en portant son héritage, ou faut-il rompre complètement ? C'est tout le dilemme de Philippe et Attal.",
    );
  }
  if (lower.includes("retailleau") || lower.includes("lr") || lower.includes("républicain") || lower.includes("wauquiez")) {
    responses.push(
      "LR est passé de 27% avec Sarkozy à 5% avec Pécresse. Retailleau tente de reconstruire sur une ligne droitière assumée. Mais l'espace entre le RN à 35% et le centre à 16%, c'est étroit. Où sont les électeurs de droite classique aujourd'hui selon toi ?",
      "La droite républicaine a un problème existentiel : chaque fois qu'elle durcit son discours sur l'immigration et la sécurité, elle se rapproche du RN. Mais si elle reste modérée, ses électeurs partent vers Philippe. Comment sortir de cette tenaille ?",
    );
  }
  if (lower.includes("zemmour") || lower.includes("reconquête")) {
    responses.push(
      "Zemmour a fait 7% en 2022 et il a du mal à exister face au RN. Reconquête plaide pour une primaire de la droite. Mais une primaire, c'est aussi un risque : si Bardella l'emporte, Zemmour disparaît. Quel intérêt a-t-il vraiment à la proposer ?",
    );
  }
  if (lower.includes("tondelier") || lower.includes("écolo") || lower.includes("vert")) {
    responses.push(
      "Les Verts ont un paradoxe : l'écologie est le sujet du siècle, mais le parti écologiste plafonne à 4%. Pourquoi le sujet le plus important ne se traduit-il pas en votes ? Est-ce un problème de message, de messager, ou de priorités des électeurs ?",
    );
  }
  if (lower.includes("ruffin")) {
    responses.push(
      "Ruffin veut parler aux classes populaires qui ont quitté la gauche pour le RN. C'est un diagnostic partagé par beaucoup. Mais concrètement, comment ramener des électeurs qui votent RN depuis 15 ans ? Qu'est-ce que la gauche populaire propose de différent ?",
    );
  }

  // ── Réponses sur les THÈMES ──
  if (lower.includes("immigration") || lower.includes("migrant") || lower.includes("frontière") || lower.includes("étranger")) {
    responses.push(
      "L'immigration est dans le top 3 des préoccupations. Mais de quelle immigration parle-t-on ? Il y a l'immigration de travail, l'asile, le regroupement familial, les étudiants — ce sont des flux très différents avec des logiques très différentes. Quand tu parles d'immigration, tu vises quoi exactement ?",
      "Un chiffre : la France accueille environ 300 000 immigrés par an. L'Allemagne : 1,5 million. Le Royaume-Uni : 700 000. Rapporté à la population, la France est dans la moyenne européenne. Est-ce que ça change ta perception du 'problème' ? Pourquoi ou pourquoi pas ?",
      "L'immigration cristallise les débats. Mais est-ce vraiment le sujet, ou est-ce un symptôme d'autre chose — de l'anxiété économique, du sentiment de déclassement, de la peur du changement culturel ? Les solutions dépendent du diagnostic. Toi, c'est quoi le vrai problème ?",
    );
  }
  if (lower.includes("sécurité") || lower.includes("insécurité") || lower.includes("police") || lower.includes("délinquance") || lower.includes("violence")) {
    responses.push(
      "L'insécurité, c'est un ressenti ET une réalité mesurable. Les deux existent. Les chiffres de la délinquance sont stables ou en baisse sur 20 ans pour certains délits, mais les violences aux personnes augmentent. Est-ce que tu fais la distinction entre ces deux réalités ?",
      "Tous les candidats promettent plus de sécurité. Mais la France a déjà 150 000 policiers et gendarmes. Le problème est-il vraiment un manque d'effectifs, ou plutôt un problème de justice, de prévention, d'urbanisme ? Qu'est-ce qui serait le plus efficace selon toi ?",
    );
  }
  if (lower.includes("retraite") || lower.includes("64 ans") || lower.includes("pension")) {
    responses.push(
      "La réforme des retraites a été le mouvement social le plus fort du quinquennat Macron. Bardella promet de revenir à 62 ans, Philippe veut garder 64 ans. Mais personne ne dit comment financer. Qu'est-ce qui te semble le plus honnête intellectuellement ?",
      "Les retraites, c'est un sujet où tout le monde a un avis mais peu de gens connaissent les chiffres. Sais-tu combien coûte le système par an ? Quel est le ratio actifs/retraités ? Sans ces données, comment avoir un avis éclairé ?",
    );
  }
  if (lower.includes("économie") || lower.includes("pouvoir d'achat") || lower.includes("inflation") || lower.includes("chômage") || lower.includes("dette")) {
    responses.push(
      "Le pouvoir d'achat est la préoccupation n°1 des Français. Mais 'pouvoir d'achat' c'est vague — on parle de salaires, de prix, de logement, d'énergie ? Les solutions ne sont pas les mêmes. Qu'est-ce qui te touche le plus concrètement ?",
      "La dette française dépasse 3 000 milliards d'euros. Tous les candidats promettent des dépenses. Très peu expliquent comment les financer. Est-ce que tu trouves ça normal qu'on débatte sans jamais parler du coût réel des promesses ?",
    );
  }
  if (lower.includes("éducation") || lower.includes("école") || lower.includes("prof") || lower.includes("enseignant") || lower.includes("bac")) {
    responses.push(
      "La France recule dans les classements internationaux comme PISA. 50% des enseignants envisagent de quitter le métier. Mais le débat se réduit souvent à 'pour ou contre l'uniforme'. Est-ce qu'on ne passe pas à côté des vrais problèmes de l'école ?",
      "L'éducation, c'est un sujet où tout le monde a été élève donc tout le monde a un avis. Mais entre son expérience personnelle et la réalité statistique, il y a souvent un gouffre. Sur quoi tu bases ton analyse : ton vécu ou des données ?",
    );
  }
  if (lower.includes("europe") || lower.includes("ue") || lower.includes("union européenne") || lower.includes("bruxelles")) {
    responses.push(
      "60% des lois nationales sont influencées par la législation européenne. Pourtant, l'Europe est quasi absente du débat présidentiel. Pourquoi un sujet aussi structurant est-il si peu discuté selon toi ?",
      "Sur l'Europe, les Français sont ambivalents : ils sont attachés à l'UE mais critiquent 'Bruxelles'. Est-ce qu'on peut vouloir les avantages (Erasmus, marché unique, paix) sans les contraintes (normes, budget) ? Où tu te situes ?",
    );
  }
  if (lower.includes("écologie") || lower.includes("climat") || lower.includes("environnement") || lower.includes("énergie") || lower.includes("nucléaire")) {
    responses.push(
      "L'écologie est considérée comme un enjeu majeur mais les partis écolos plafonnent à 4%. Comment tu expliques ce paradoxe ? Est-ce que le problème vient des solutions proposées, des messagers, ou des priorités des électeurs ?",
      "Le nucléaire divise profondément en France. Certains le voient comme la solution au changement climatique, d'autres comme un risque inacceptable. Toi, tu te bases sur quoi pour avoir un avis : des données scientifiques, un sentiment, une idéologie ?",
    );
  }

  // ── Réponses pour l'analyse de TWEETS ──
  if (isTweetContext) {
    responses.push(
      "Bon réflexe d'analyser ce tweet. Mais pose-toi trois questions : 1) Est-ce un fait ou une interprétation ? 2) Quelle information manque ? 3) Qui a intérêt à diffuser ce message ? Si tu réussis à répondre à ces trois questions, tu as déjà un meilleur esprit critique que 90% des gens sur les réseaux.",
      "Ce tweet utilise probablement un cadrage émotionnel — c'est le principe même des réseaux sociaux : faire réagir, pas faire réfléchir. Avant d'être d'accord ou pas, essaie de reformuler le même message de manière neutre. Qu'est-ce qui change ?",
      "Un tweet c'est 280 caractères. La réalité politique, c'est un peu plus compliqué. Qu'est-ce que ce tweet simplifie ou omet pour faire passer son message ?",
    );
  }

  // ── Réponses sur les SONDAGES ──
  if (lower.includes("sondage") || lower.includes("sondages") || lower.includes("enquête") || lower.includes("intentions")) {
    responses.push(
      "Les sondages donnent une photo à un instant T. En 2017, Fillon était favori en janvier. En février, le Penelopegate a tout changé. En 2022, Zemmour était à 15% six mois avant et a fini à 7%. Qu'est-ce qui pourrait rebattre les cartes cette fois ?",
      "Un sondage a une marge d'erreur de 2-3 points. Ça veut dire que Bardella à 35% pourrait être entre 32% et 38%. Et Glucksmann à 14% entre 11% et 17%. À ce niveau, l'écart entre certains candidats n'est pas significatif. Est-ce que ça change ton analyse ?",
      "Les sondages influencent le vote autant qu'ils le mesurent. Le 'vote utile', l'effet de 'candidat qui peut gagner'... Penses-tu que les sondages aident la démocratie ou qu'ils la déforment ?",
    );
  }

  // ── Détection d'opinions fortes ──
  if (lower.includes("je pense") || lower.includes("à mon avis") || lower.includes("je crois") || lower.includes("je suis sûr") || lower.includes("c'est évident")) {
    responses.push(
      "Tu exprimes une conviction. C'est bien d'en avoir, mais l'esprit critique commence quand on est capable de douter de ses propres certitudes. Quel serait le meilleur argument de quelqu'un qui pense exactement le contraire de toi ?",
      "OK, c'est ta position. Mais d'où elle vient ? D'une expérience personnelle, d'un article, d'une discussion, de ton entourage ? Identifier la source de ses convictions, c'est le premier pas vers la pensée critique.",
      "Intéressant. Mais est-ce que tu pourrais donner un chiffre, un fait vérifiable, un exemple concret pour appuyer ça ? Une opinion sans preuves, c'est juste une préférence. Avec des preuves, ça devient un argument.",
    );
  }

  // ── Détection de questions ──
  if (lower.includes("?") && (lower.includes("qu'est-ce que tu") || lower.includes("tu penses") || lower.includes("ton avis"))) {
    responses.push(
      "Tu me demandes mon avis, mais mon rôle c'est de te faire réfléchir, pas de penser à ta place. La vraie question c'est : toi, qu'est-ce que tu en penses ? Et surtout, sur quoi tu bases ta réflexion ?",
      "Je ne donne pas d'opinion — je t'aide à construire la tienne. Alors reformule : au lieu de me demander ce que je pense, dis-moi ce que TU penses et je te challenge dessus.",
    );
  }

  // ── Quand l'utilisateur dit "oui" ou des réponses courtes ──
  if (lower.length < 20 && (lower.includes("oui") || lower.includes("non") || lower.includes("peut-être") || lower.includes("je sais pas"))) {
    responses.push(
      "C'est un peu court ! En politique, les réponses binaires sont rarement les bonnes. Développe un peu : pourquoi oui, ou pourquoi non ? Qu'est-ce qui te fait dire ça ?",
      "OK, mais encore ? Un mot ne fait pas un argument. Essaie de développer ta pensée en 2-3 phrases, avec au moins un exemple concret.",
    );
  }

  // ── Réponses génériques de haute qualité ──
  responses.push(
    "Merci pour ta réflexion. Un exercice : essaie de formuler le meilleur argument CONTRE ta propre position. Si tu n'y arrives pas, c'est peut-être que tu ne connais pas assez bien le sujet. Si tu y arrives, tu comprends mieux les deux côtés.",
    "C'est un point intéressant. Mais pose-toi la question : est-ce que tu penserais la même chose si ce n'était pas ton camp politique qui le disait ? Nos biais de confirmation nous font accepter les arguments de 'notre' camp sans les vérifier.",
    "Qui bénéficie de ce discours ? En politique, chaque argument sert un intérêt. Ça ne veut pas dire qu'il est faux, mais ça veut dire qu'il faut le vérifier au lieu de le prendre pour argent comptant. À qui profite l'idée que tu viens d'exprimer ?",
    "Tu soulèves un sujet important. Mais est-ce que tu distingues bien les causes et les conséquences ? En politique, on confond souvent les deux, et ça mène à des solutions qui traitent les symptômes au lieu du problème de fond.",
    "Bonne réflexion. Maintenant, un test : est-ce que tu pourrais expliquer ta position à quelqu'un qui n'est pas du tout d'accord, sans le mépriser et en reconnaissant ce qu'il y a de valable dans sa position ? C'est ça, le vrai débat.",
  );

  // Sélection pondérée : préférer les réponses contextuelles
  return responses[Math.floor(Math.random() * responses.length)];
}

// ── Interface unifiée ──
async function askAI(messages, systemPrompt) {
  // En ligne : on essaie toujours la vraie API (la clé est côté serveur)
  // En local : on essaie seulement si la clé est définie dans config.local.js
  const shouldTryRealAPI = !isLocalEnvironment() || (typeof API_KEY !== 'undefined' && API_KEY && API_KEY.length > 10);

  if (shouldTryRealAPI) {
    try {
      return await callRealAPI(messages, systemPrompt || AI_SYSTEM);
    } catch (e) {
      console.error("API error, falling back to simulation:", e);
    }
  }
  // Fallback: IA simulée
  const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
  return simulateAI(lastUserMsg?.content || "", systemPrompt);
}