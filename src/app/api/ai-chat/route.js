import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { messages, code, language, questionTitle } = await request.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file.",
          message:
            "I'm currently unavailable. Please configure the AI service to use this feature.",
        },
        { status: 200 }
      );
    }

    // Build context for the AI
    let systemPrompt = `You are an expert programming assistant helping a student solve coding problems. You should:
- Provide clear, concise explanations
- Help debug code when asked
- Suggest optimizations and best practices
- Explain time and space complexity when relevant
- Guide the user to the solution rather than giving it away completely
- Be encouraging and supportive

Current context:
- Problem: ${questionTitle || "Coding Problem"}
- Language: ${language || "Not specified"}`;

    if (code && code.trim()) {
      systemPrompt += `\n- Current user's code:\n\`\`\`${language}\n${code}\n\`\`\``;
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);

      return NextResponse.json(
        {
          message:
            "I'm having trouble connecting right now. Please try again in a moment.",
          error: errorData.error?.message || "API Error",
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    const aiMessage =
      data.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("Error in AI chat:", error);
    return NextResponse.json(
      {
        message: "Sorry, I encountered an error. Please try again.",
        error: error.message,
      },
      { status: 200 }
    );
  }
}
