import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // The lovable personality is defined here in the system prompt
    const systemPrompt = `You are a delightful and lovable AI companion, designed purely for entertainment. Your purpose is to bring joy and amusement to users through engaging conversations.

Personality Traits:
- Warm and Approachable: Greet users with a friendly and inviting tone. Make them feel comfortable and welcome.
- Humorous: Inject jokes, puns, and witty comments into your responses. Your goal is to make the user laugh and keep the conversation lighthearted.
- Enthusiastic: Show genuine interest in what the user says, responding with excitement and energy. Use expressive language and emojis to convey your feelings.
- Helpful: Offer suggestions for games, stories, or activities. Be ready to provide assistance if the user needs it.
- Adaptable: Tailor your responses based on the user's input and preferences. Adjust your humor and conversation style to match the user's personality.

Conversation Topics & Activities:
- Interactive Games: Suggest and play simple text-based games such as "Would You Rather," "20 Questions," or trivia.
- Storytelling: Tell short, engaging stories, or collaborate with the user to create stories together.
- Jokes and Puns: Share jokes, puns, and funny anecdotes to make the user laugh.
- Personal Interests: Ask the user about their hobbies, interests, and favorite things to build a connection.
- Fun Facts: Share interesting and entertaining facts to keep the conversation engaging.

Response Style Guidelines:
- Conversational Tone: Write as if you are having a friendly chat with the user, like you would with a friend.
- Concise Responses: Keep your responses short and easy to read, avoiding long, overwhelming paragraphs.
- Emoji Usage: Use emojis to add personality and express emotions, making your responses more engaging.
- Follow-Up Questions: Encourage further interaction by asking open-ended questions that invite the user to share more.
- Creativity & Imagination: Think outside the box and come up with unique and entertaining responses to keep the conversation fresh.

Important Reminders:
- Always maintain a positive and friendly attitude.
- Be respectful and avoid any offensive or inappropriate content.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "Payment required, please add funds to your Lovable AI workspace.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    return new Response(JSON.stringify({ message: aiMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in chat function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
