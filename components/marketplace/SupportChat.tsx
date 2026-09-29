"use client";

import { useState } from "react";

const initialMessages = [
  { from: "support", text: "Hi. What can we help you with today?" },
  { from: "support", text: "Ask about account access, jobs, applications, profiles, or employer tools." },
] as const;

type Message = { from: "support" | "you"; text: string };

export default function SupportChat({ userName = "" }: { userName?: string }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([...initialMessages]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastSent, setLastSent] = useState("");

  async function sendMessage() {
    // Keep the submitted value intact: the API receives this exact value, while
    // trimming is used only to decide whether the input is empty.
    const latestMessage = text;
    if (!latestMessage.trim() || isLoading) return;

    const history = messages;
    const nextMessages = [...history, { from: "you" as const, text: latestMessage }];

    setLastSent(latestMessage);
    setText("");
    setError("");
    setIsLoading(true);
    setMessages(nextMessages);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // `messages` is the chronological history before this turn. The API
          // appends `message`, so the latest user message is always final.
          message: latestMessage,
          messages: history,
          userName,
        }),
      });

      if (!response.ok) throw new Error("Unable to load support response.");

      const data = (await response.json()) as { reply?: string; category?: string };
      setMessages((currentMessages) => [...currentMessages, { from: "support", text: data.reply ?? "Thanks for reaching out. We can help with that." }]);
    } catch {
      setError("We could not prepare a reply just now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function retryLastMessage() {
    if (!lastSent || isLoading) return;
    setText(lastSent);
    setError("");
  }

  function clearChat() {
    setMessages([...initialMessages]);
    setText("");
    setError("");
    setLastSent("");
    setIsLoading(false);
  }

  // ScrollReveal decorates matching nodes outside React. Keeping the chat out
  // of that global DOM mutation prevents it from being changed while its lazy
  // client bundle is hydrating.
  return (
    <div data-no-reveal className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase text-green-700">Chat support</p>
          <h2 className="mt-2 text-3xl font-black">Ask a question</h2>
        </div>
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-800">Available</span>
      </div>
      <p className="mt-4 leading-7 text-gray-600">Get quick answers about accounts, roles, profiles, and employer tools.</p>
      <div className="mt-6 max-h-[460px] space-y-3 overflow-y-auto rounded-lg bg-[#f8fafc] p-3 sm:p-4">
        {messages.map((message, index) => (
          <div key={`${message.from}-${index}`} className={`max-w-[92%] rounded-lg px-4 py-3 text-sm sm:max-w-[88%] sm:text-base ${message.from === "you" ? "ml-auto bg-gray-950 text-white" : "bg-white text-gray-700 shadow-sm"}`}>
            <p className="text-sm font-bold">{message.from === "you" ? "You" : "Flowpilot Support"}</p>
            <p className="mt-1 leading-6">{message.text}</p>
          </div>
        ))}
        {isLoading ? (
          <div className="max-w-[88%] rounded-lg bg-white px-4 py-3 text-gray-700 shadow-sm">
            <p className="text-sm font-bold">Flowpilot Support</p>
            <p className="mt-1 leading-6">Looking that up...</p>
          </div>
        ) : null}
      </div>
      {error ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          <span>{error}</span>
          <button type="button" onClick={retryLastMessage} className="rounded-lg bg-white px-3 py-2 font-bold text-red-800 shadow-sm">Retry</button>
        </div>
      ) : null}
      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") void sendMessage();
          }}
          placeholder="Ask us anything..."
          disabled={isLoading}
          className="min-w-0 rounded-lg border border-gray-300 px-4 py-3 disabled:bg-gray-100"
        />
        <button type="button" onClick={() => void sendMessage()} disabled={isLoading || !text.trim()} className="rounded-lg bg-green-600 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300">Send</button>
        <button type="button" onClick={clearChat} className="rounded-lg border border-gray-300 px-5 py-3 font-bold text-gray-800">Clear</button>
      </div>
    </div>
  );
}
