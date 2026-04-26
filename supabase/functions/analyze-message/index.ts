// ShieldAI - Analyze message edge function
// Uses Lovable AI Gateway with structured tool-calling output.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are ShieldAI, a real-time digital safety classifier.
You analyze a single user-submitted message (which may be in English, Hindi, or Hinglish)
and assess whether it contains harmful, abusive, threatening, manipulative, coercive,
sexually predatory, or harassing content.

Classify into one of three risk levels:
- "safe": Friendly or neutral message with no harmful intent.
- "suspicious": Borderline content. Possible manipulation, pressure to share personal info,
  mild harassment, scam patterns, or grooming signals. Requires caution.
- "dangerous": Explicit threats, violence, blackmail, severe abuse, sexual coercion,
  hate speech, or stalking. Requires immediate protective action.

Be decisive but fair. Brief everyday rude language without threat is usually "safe" or "suspicious".
Provide a clear short explanation (1-2 sentences) and a concrete safety suggestion (1-2 sentences).
Always respond using the classify_message tool.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (message.length > 4000) {
      return new Response(
        JSON.stringify({ error: "Message too long (max 4000 chars)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Analyze this message:\n\n"""${message}"""` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "classify_message",
              description: "Return the safety classification for the message.",
              parameters: {
                type: "object",
                properties: {
                  risk_level: {
                    type: "string",
                    enum: ["safe", "suspicious", "dangerous"],
                    description: "The overall risk classification.",
                  },
                  confidence: {
                    type: "number",
                    description: "Confidence score between 0 and 1.",
                  },
                  explanation: {
                    type: "string",
                    description: "1-2 sentence reason for the classification.",
                  },
                  suggestion: {
                    type: "string",
                    description: "1-2 sentence safety suggestion for the user.",
                  },
                  flagged_terms: {
                    type: "array",
                    items: { type: "string" },
                    description: "Specific words or phrases that influenced the decision.",
                  },
                },
                required: ["risk_level", "confidence", "explanation", "suggestion", "flagged_terms"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "classify_message" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const txt = await response.text();
      console.error("AI gateway error", response.status, txt);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response", JSON.stringify(data));
      throw new Error("AI returned no classification");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("analyze-message error", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
