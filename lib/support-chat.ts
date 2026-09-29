export type SupportMessage = {
  from: "support" | "you";
  text: string;
};

type KnowledgeItem = {
  title: string;
  href: string;
  keywords: string[];
  answer: string;
};

const stopWords = new Set([
  "a",
  "about",
  "am",
  "an",
  "and",
  "are",
  "can",
  "do",
  "does",
  "for",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "please",
  "the",
  "to",
  "what",
  "where",
  "with",
  "you",
]);

const baseKnowledge: KnowledgeItem[] = [
  {
    title: "Account and login",
    href: "/support",
    keywords: ["account", "login", "log", "signin", "sign", "signup", "google", "oauth", "redirect", "auth", "access", "profile image"],
    answer:
      "Having trouble logging in? Check that you're using the right email and password, or try signing in with Google. If you see a redirect error, try clearing your browser cache or using a different browser. Still stuck? Email us with the error message and we'll fix it.",
  },
  {
    title: "Contact us",
    href: "/support",
    keywords: ["email", "whatsapp", "facebook", "linkedin", "instagram", "x", "contact", "support", "urgent", "social", "reach"],
    answer:
      "Use the support page chat for account or application issues. Include the affected account email, the page involved, and what you were trying to do so the team has useful context.",
  },
  {
    title: "Browse jobs",
    href: "/jobs",
    keywords: ["job", "jobs", "role", "roles", "application", "apply", "status", "details", "salary", "remote", "hybrid", "onsite"],
    answer:
      "Visit /jobs to see all open roles. Each listing shows the tech stack, seniority level, work style, salary, and location. Filter by skill or search for specific types of work. Click a role to apply.",
  },
  {
    title: "Find talent",
    href: "/talent",
    keywords: ["talent", "candidate", "candidates", "profile", "shortlist", "portfolio", "availability", "skills", "location"],
    answer:
      "Visit /talent to browse candidate profiles. Filter by skill, location, availability, or work preference. Each profile shows portfolio links, GitHub, work experience, and salary expectations. Perfect for finding your next hire.",
  },
  {
    title: "Employer dashboard",
    href: "/employer",
    keywords: ["employer", "company", "hire", "hiring", "publish", "post", "applicants", "manage"],
    answer:
      "As an employer, manage your company profile, post clear job openings, review applications, and search technical profiles by skill, location, portfolio evidence, and availability. Visit /employer to manage open roles and candidate review.",
  },
  {
    title: "Building your profile",
    href: "/student",
    keywords: ["student", "junior", "internship", "entry", "portfolio", "interview", "learning", "prepare", "profile"],
    answer:
      "Build a strong profile by picking your target role, listing the technologies you know, adding portfolio links that show your work, and keeping your availability updated. A complete profile gets better matches.",
  },
  {
    title: "Community & referrals",
    href: "/community",
    keywords: ["community", "mentor", "referral", "feedback", "review", "interview", "members", "comments"],
    answer:
      "Ask your network for help on the Community page. Get profile feedback, referrals to open roles, interview tips from members, and connect with other technology professionals.",
  },
  {
    title: "Market updates",
    href: "/stories",
    keywords: ["stories", "updates", "news", "signals", "market", "feed"],
    answer:
      "Check /stories for career resources, hiring guidance, interview preparation, portfolio advice, and current public roles or profiles when they are available.",
  },
];

const knowledge = baseKnowledge;

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .split(" ")
    .filter((word) => word.length > 1 && !stopWords.has(word));
}

function lastUserMessage(messages: SupportMessage[]) {
  return [...messages].reverse().find((message) => message.from === "you")?.text ?? "";
}

function scoreItem(item: KnowledgeItem, tokens: string[]) {
  const haystack = `${item.title} ${item.answer} ${item.href} ${item.keywords.join(" ")}`.toLowerCase();
  return tokens.reduce((score, token) => {
    if (item.keywords.some((keyword) => keyword.toLowerCase() === token)) return score + 5;
    if (haystack.includes(token)) return score + 2;
    if (token.endsWith("s") && haystack.includes(token.slice(0, -1))) return score + 1;
    return score;
  }, 0);
}

function isClarification(message: string) {
  const tokens = tokenize(message);
  return tokens.length <= 3 || /^(help|issue|problem|question|hi|hello|hey)$/i.test(message.trim());
}

export function createSupportReply(message: string, messages: SupportMessage[]) {
  const currentTokens = tokenize(message);
  const previousTokens = tokenize(lastUserMessage(messages));
  const tokens = Array.from(new Set([...currentTokens, ...previousTokens.slice(0, 5)]));

  if (isClarification(message)) {
    return "What can we help you with? Account issues, jobs and applications, finding talent, employer tools, community, or something else?";
  }

  const matches = knowledge
    .map((item) => ({ item, score: scoreItem(item, tokens) }))
    .filter((match) => match.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (!matches.length) {
    return "I did not find a specific answer for that. Share the affected page, account email, and what you were trying to do so support can help.";
  }

  const [best, second] = matches;
  const followUp = second && second.score >= best.score - 2 ? ` See also: ${second.item.title} at ${second.item.href}` : "";

  return `${best.item.answer}${followUp}`;
}
