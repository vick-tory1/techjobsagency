import { NextResponse } from "next/server";

type SupportMessage = {
  from?: "support" | "you";
  text?: string;
};

type GeminiContent = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

type GeminiResult = {
  reply: string;
};

const FREE_TIER_GEMINI_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
] as const;

const websiteContext = [
  "Flowpilot is a technology job agency and hiring marketplace.",
  "Job seekers can create an account at /signup?role=talent, sign in at /login?role=talent, create a professional profile at /talent/profile, browse roles at /jobs, and track applications at /talent/applications.",
  "Employers can create an account at /signup?role=employer, sign in at /login?role=employer, use /employer to manage their hiring workspace, create roles at /employer/jobs/create, review roles at /employer/jobs, review applications at /employer/applications, browse talent at /employer/talent, and manage company context at /employer/profile.",
  "The admin area is for marketplace oversight at /admin, with a separate /admin/login route.",
  "The public site also includes community support at /community, resources at /stories, and this support page at /support.",
  "Do not claim Flowpilot offers features that are not listed here. Never request, disclose, repeat, or infer passwords, verification codes, API keys, tokens, session data, private account data, or internal authorization details.",
].join("\n");

const systemInstruction = [
  "You are Flowpilot Support, a helpful AI support agent for a technology job agency.",
  "Respond to the user's actual latest message and use the conversation history to resolve follow-ups.",
  "Be concise, professional, warm, and conversational. Usually use one short paragraph.",
  "Handle greetings, thanks, introductions, and casual messages naturally. Do not reply with a generic capability list to a greeting or thank-you.",
  "For a simple introduction, respond with a warm greeting using only the stated first name, then ask what Flowpilot can do for them.",
  "For fragments such as 'the admin', ask a focused clarification tied to that area instead of assuming a generic dashboard question.",
  "Answer only from the Flowpilot context below. If the answer is not known, say so plainly and ask one focused follow-up question.",
  "Use Job Seeker and Employer for account terminology. Use Talent where it fits broader marketplace content.",
  "",
  "Flowpilot context:",
  websiteContext,
].join("\n");

function normaliseMessages(messages: unknown): SupportMessage[] {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((message): message is SupportMessage => Boolean(message) && typeof message === "object")
    .map((message): SupportMessage => ({
      from: message.from === "support" ? "support" : "you",
      text: typeof message.text === "string" ? message.text : "",
    }))
    .filter((message) => message.text.trim())
    .slice(-12);
}

const sensitiveRequestPattern = /\b(password|passcode|one[- ]time code|otp|2fa|authentication code|api[- ]?key|access token|refresh token|bearer token|jwt|session cookie|cookie value|secret|private key|database records?|user list|internal authorization|role claims?)\b/i;

function sensitiveRequestReply(message: string) {
  if (!sensitiveRequestPattern.test(message)) return "";
  return "I can't access, reveal, or handle passwords, codes, tokens, private account data, or internal authorization details. Please keep those private and use the relevant Flowpilot sign-in or support path instead.";
}

function introductionReply(message: string) {
  const match = message.trim().match(/(?:^|\b)(?:my name is|i(?:'m| am))\s+([a-z][a-z'-]{0,48})\b/i);
  if (!match) return "";

  const name = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
  return `Nice to meet you, ${name}! How can I help you with Flowpilot today?`;
}

function safeConversation(messages: SupportMessage[]) {
  return messages.map((message) => {
    if (message.from === "you" && sensitiveRequestPattern.test(message.text)) {
      return { ...message, text: "[Sensitive information removed. Do not request, use, or repeat it.]" };
    }
    return message;
  });
}

function geminiContents(messages: SupportMessage[]): GeminiContent[] {
  const firstUserMessage = messages.findIndex((message) => message.from === "you");
  const conversation = firstUserMessage === -1 ? messages : messages.slice(firstUserMessage);

  return conversation.reduce<GeminiContent[]>((contents, message) => {
    const role = message.from === "support" ? "model" : "user";
    const previous = contents[contents.length - 1];

    if (previous?.role === role) {
      previous.parts.push({ text: message.text ?? "" });
    } else {
      contents.push({ role, parts: [{ text: message.text ?? "" }] });
    }

    return contents;
  }, []);
}

function responseText(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";

  const candidate = (payload as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }).candidates?.[0];
  return candidate?.content?.parts
    ?.map((part) => part.text?.trim() ?? "")
    .filter(Boolean)
    .join(" ")
    .trim() ?? "";
}

function geminiRequestBody(messages: SupportMessage[], userName: string) {
  return JSON.stringify({
    systemInstruction: {
      parts: [{
        text: userName
          ? `${systemInstruction}\n\nThe authenticated user's available name is ${userName}. Use it only when it makes the response more natural; do not claim it was provided in chat.`
          : systemInstruction,
      }],
    },
    contents: geminiContents(messages),
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 260,
    },
  });
}

async function askGemini(messages: SupportMessage[], userName: string): Promise<GeminiResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { reply: "" };

  const body = geminiRequestBody(messages, userName);

  // Each model is attempted at most once per reply. This fixed list is the
  // complete free-tier fallback policy; do not add runtime-selected models.
  for (const model of FREE_TIER_GEMINI_MODELS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body,
          signal: controller.signal,
        },
      );

      if (response.ok) {
        const reply = responseText(await response.json());
        if (reply) return { reply };
        continue;
      }

      // A failed model is never retried in this request. Advance through the
      // finite free-tier list so another available model can answer.
      continue;
    } catch {
      // Network failures and timeouts also consume only this model's attempt.
    } finally {
      clearTimeout(timeout);
    }
  }

  return { reply: "" };
}

function conversationWithLatestMessage(history: SupportMessage[], incomingMessage: string) {
  // The client sends history before the current turn. Tolerate an older client
  // that included that turn in `messages` so Gemini still sees it exactly once.
  const last = history.at(-1);
  const priorHistory = last?.from === "you" && last.text === incomingMessage
    ? history.slice(0, -1)
    : history;

  return [...priorHistory, { from: "you" as const, text: incomingMessage }];
}

function fallbackReply(message: string) {
  const value = message.trim();

  if (/^(hi|hello|hey)(\s+there)?[!., ]*$/i.test(value)) {
    return "Hi! How can I help you with Flowpilot today?";
  }

  if (/^(thanks|thank you|thankyou|cheers)[!., ]*$/i.test(value)) {
    return "You're welcome! Let me know if you need anything else.";
  }

  if (/^(what can you do for me|what can you do|how can you help me)[?!. ]*$/i.test(value)) {
    return "I can help you find the right Flowpilot page, explain account access, job applications, profiles, employer hiring tools, or the admin area.";
  }

  if (/^(the )?admin[!?. ]*$/i.test(value)) {
    return "What would you like help with in the admin area: access, reviewing marketplace activity, or a specific page?";
  }

  if (/(hirer|employer|hiring|publish.*role|post.*role)/i.test(value)) {
    return "Employers can publish clear technical roles, review applications, and browse talent from /employer. What part of the hiring workflow do you need help with?";
  }

  if (/(job\s*seeker|jobseeker|apply|application|find.*job|register.*job|register.*role)/i.test(value)) {
    return "Job Seekers can browse jobs at /jobs, apply with their profile, and track application status at /talent/applications. What are you trying to do?";
  }

  if (/(access.*account|account.*access|sign\s*in|login|log\s*in|sign\s*up|signup|create.*account)/i.test(value)) {
    return "Choose Job Seeker or Employer on the sign-in or sign-up page. Job Seeker access uses /login?role=talent or /signup?role=talent; Employer access uses the same pages with role=employer. Admin access is separate at /admin/login. Never send a password, code, or token in chat.";
  }

  // An introduction can accompany a real support question. Handle the question
  // above first so a name never replaces the user's actual request.
  const introduction = introductionReply(value);
  if (introduction) return introduction;

  return `I need a little more detail to help with your question: ${value}. What Flowpilot task are you trying to complete?`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  // Preserve the message verbatim for Gemini. Whitespace is only normalized for
  // validation and deterministic fallback matching.
  const incomingMessage = typeof body.message === "string" ? body.message : "";
  const messages = normaliseMessages(body.messages);
  const userName = typeof body.userName === "string" ? body.userName.trim().slice(0, 100) : "";

  if (!incomingMessage.trim()) {
    return NextResponse.json({ reply: "What can I help you with today?", category: "Support" });
  }

  const protectedReply = sensitiveRequestReply(incomingMessage);
  if (protectedReply) return NextResponse.json({ reply: protectedReply, category: "Support" });

  const conversation = conversationWithLatestMessage(messages, incomingMessage);

  const gemini = await askGemini(safeConversation(conversation), userName);
  const reply = gemini.reply || fallbackReply(incomingMessage);
  return NextResponse.json({ reply, category: "Support" });
}
