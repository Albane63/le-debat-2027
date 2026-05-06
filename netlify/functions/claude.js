// ═══════════════════════════════════════════
// Netlify Function — Proxy sécurisé vers Claude
// La clé API reste cachée côté serveur
// ═══════════════════════════════════════════

export default async (request) => {
  // Autoriser seulement les requêtes POST
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Récupérer les données envoyées par le navigateur
    const body = await request.json();
    const { messages, system } = body;

    // Vérifier qu'on a bien reçu des messages
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages manquants" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Récupérer la clé API depuis les variables d'environnement (sécurisé)
    const apiKey = Netlify.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key non configurée" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Appeler Claude API
    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 600,
        system: system || "Tu es une IA éducative neutre.",
        messages: messages,
      }),
    });

    const data = await claudeResponse.json();

    // Renvoyer la réponse au navigateur
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Erreur dans la fonction Claude:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config = {
  path: "/api/claude",
};