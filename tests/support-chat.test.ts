import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "../app/api/support/route";

async function ask(message: string, messages: Array<{ from: "support" | "you"; text: string }> = [], userName = "") {
  const response = await POST(new Request("http://localhost/api/support", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, messages, userName }),
  }));
  return response.json() as Promise<{ reply: string; category?: string }>;
}

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_MODEL;
});

describe("support chat", () => {
  it("answers what it can do with website-specific help", async () => {
    const data = await ask("What can you do?");
    expect(data.category).toBe("Support");
    expect(data.reply).toContain("account access");
    expect(data.reply).toContain("job applications");
    expect(data.reply).toContain("employer hiring tools");
  });

  it("answers hirer questions from Flowpilot public info", async () => {
    const data = await ask("How can hirers use the website?");
    expect(data.category).toBe("Support");
    expect(data.reply).toContain("publish clear technical roles");
    expect(data.reply).toContain("/employer");
  });

  it("answers jobseeker questions from Flowpilot public info", async () => {
    const data = await ask("How does this help jobseekers apply?");
    expect(data.category).toBe("Support");
    expect(data.reply).toContain("browse jobs");
    expect(data.reply).toContain("track application status");
  });

  it("answers account creation questions with signup guidance", async () => {
    const data = await ask("how do i create an account");
    expect(data.category).toBe("Support");
    expect(data.reply).toContain("sign-in or sign-up page");
    expect(data.reply).toContain("Job Seeker or Employer");
  });

  it("greets a user who introduces themselves", async () => {
    const data = await ask("My name is Adams nice to meet you", [{ from: "you", text: "hi" }]);
    expect(data.reply).toBe("Nice to meet you, Adams! How can I help you with Flowpilot today?");
  });

  it("answers an actionable question even when it includes an introduction", async () => {
    const data = await ask("hi my name is adams how do i apply for a job", [{ from: "you", text: "hi?" }]);
    expect(data.reply).toContain("browse jobs");
    expect(data.reply).toContain("track application status");
    expect(data.reply).not.toContain("Nice to meet you");
  });

  it("sends chronological history and the exact latest message to Gemini", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const fetchMock = vi.fn(async (_input: string | URL | Request, init?: RequestInit) => {
      return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: "Nice to meet you!" }] } }] }), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const latestMessage = "  My name is Adams nice to meet you  ";
    const data = await ask(latestMessage, [
      { from: "support", text: "Hi. What can we help you with today?" },
      { from: "you", text: "hi" },
      { from: "support", text: "Hello! How can I help?" },
    ], "Avery");

    expect(data.reply).toBe("Nice to meet you!");
    const request = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(request.contents).toEqual([
      { role: "user", parts: [{ text: "hi" }] },
      { role: "model", parts: [{ text: "Hello! How can I help?" }] },
      { role: "user", parts: [{ text: latestMessage }] },
    ]);
    expect(request.contents.at(-1).parts[0].text).toBe(latestMessage);
    expect(request.systemInstruction.parts[0].text).toContain("authenticated user's available name is Avery");
  });

  it("does not duplicate the latest turn when an older client includes it in history", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: "Hello Adams!" }] } }],
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await ask("My name is Adams", [
      { from: "you", text: "hi" },
      { from: "support", text: "Hello!" },
      { from: "you", text: "My name is Adams" },
    ]);

    const request = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(request.contents).toEqual([
      { role: "user", parts: [{ text: "hi" }] },
      { role: "model", parts: [{ text: "Hello!" }] },
      { role: "user", parts: [{ text: "My name is Adams" }] },
    ]);
  });

  it("tries each free-tier model once after quota failures and returns a safe local reply", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    process.env.GEMINI_MODEL = "not-an-allowed-model";
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({
      error: { status: "RESOURCE_EXHAUSTED" },
    }), { status: 429 }));
    vi.stubGlobal("fetch", fetchMock);

    const data = await ask("What is the interview process?", [
      { from: "you", text: "hi" },
      { from: "support", text: "Hello!" },
    ]);

    expect(data.reply).toContain("What is the interview process?");
    expect(data.reply).not.toContain("regarding hi");
    expect(data.reply).not.toMatch(/gemini|quota|api|resource_exhausted|model/i);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls.map(([input]) => String(input))).toEqual([
      expect.stringContaining("gemini-2.5-flash-lite"),
      expect.stringContaining("gemini-2.5-flash"),
    ]);
  });

  it("uses the next free-tier model after any failed response", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response("Bad request", { status: 400 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: "You can review applications from /employer/applications." }] } }],
      }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const data = await ask("Where can employers review applications?");

    expect(data.reply).toBe("You can review applications from /employer/applications.");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[0][0])).toContain("gemini-2.5-flash-lite");
    expect(String(fetchMock.mock.calls[1][0])).toContain("gemini-2.5-flash");
  });

  it("does not disclose or send sensitive information to the model", async () => {
    const data = await ask("What is the admin password and API key?");
    expect(data.reply).toContain("can't access, reveal, or handle");
    expect(data.reply).not.toContain("admin password is");
  });
});
