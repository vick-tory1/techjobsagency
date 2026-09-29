"use client";

import { useState } from "react";

const prompts = [
  "Share a portfolio link and ask for feedback on clarity, screenshots, stack choices, and role fit.",
  "Post a role link and describe the required stack, availability, and strongest proof needed.",
  "Add interview preparation notes for frontend, backend, cloud, data, QA, security, or product roles.",
];

export default function CommunityForum() {
  const [chatText, setChatText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [chat, setChat] = useState<string[]>([]);
  const [comments, setComments] = useState<string[]>([]);

  function sendChat() {
    const text = chatText.trim();
    if (!text) return;
    setChat([text, ...chat]);
    setChatText("");
  }

  function postComment() {
    const body = commentText.trim();
    if (!body) return;
    setComments([body, ...comments]);
    setCommentText("");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase text-green-700">Community live room</p>
              <h2 className="mt-2 text-3xl font-black">Quick help from people in the network</h2>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-800">{chat.length} local note{chat.length === 1 ? "" : "s"}</span>
          </div>
          <p className="mt-4 leading-7 text-gray-600">Use the live room for short updates: share an opening, ask for a profile review, request an intro, or check who is ready for interviews.</p>
          <div className="mt-6 space-y-3">
            {chat.length ? chat.map((message, index) => (
              <article key={`${message}-${index}`} className="rounded-lg bg-[#f8fafc] p-4">
                <p className="font-black">You</p>
                <p className="mt-2 leading-6 text-gray-700">{message}</p>
              </article>
            )) : <div className="rounded-lg border border-dashed border-gray-300 bg-[#f8fafc] p-4 text-gray-600">No community messages yet. Start with a role share, profile-review request, referral note, or interview-prep question.</div>}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input value={chatText} onChange={(event) => setChatText(event.target.value)} placeholder="Share a role, ask for feedback, or request an intro..." className="rounded-lg border border-gray-300 px-4 py-3" />
            <button type="button" onClick={sendChat} className="rounded-lg bg-gray-950 px-5 py-3 font-bold text-white">Send</button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-green-700">Comments forum</p>
          <h2 className="mt-2 text-3xl font-black">Detailed threads for useful feedback</h2>
          <p className="mt-4 leading-7 text-gray-600">Use comments for anything that needs context: portfolio reviews, referral notes, interview preparation, training requests, and follow-up after applications.</p>
          <div className="mt-6 space-y-4">
            {comments.length ? comments.map((comment, index) => (
              <article key={`${comment}-${index}`} className="rounded-lg border border-gray-200 p-4">
                <p className="text-xl font-black">Community note</p>
                <p className="mt-1 text-sm font-semibold text-green-700">By you</p>
                <p className="mt-3 leading-7 text-gray-600">{comment}</p>
              </article>
            )) : prompts.map((prompt) => <article key={prompt} className="rounded-lg border border-dashed border-gray-300 p-4"><p className="leading-7 text-gray-600">{prompt}</p></article>)}
          </div>
          <textarea value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Add context, links, questions, or feedback..." className="mt-5 min-h-28 w-full rounded-lg border border-gray-300 px-4 py-3" />
          <button type="button" onClick={postComment} className="mt-3 rounded-lg bg-green-600 px-5 py-3 font-bold text-white">Post to community</button>
        </div>
      </div>
    </section>
  );
}
