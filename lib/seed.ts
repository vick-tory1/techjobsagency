import type { Application, Job, TalentProfile, User } from "./types";

export const seedUsers: User[] = [
  { id: "admin-1", name: "TechHire Admin", email: "admin@techhire.market", roles: ["admin"], provider: "password" },
  { id: "talent-1", name: "Adams Ekpe", email: "talent@techhire.market", profilePicture: "/images/candidate-engineer.webp", roles: ["talent"], provider: "password" },
  { id: "employer-1", name: "Hiring Lead", email: "employer@techhire.market", roles: ["employer"], provider: "password" },
];

export const seedJobs: Job[] = [
  {
    id: "job-frontend-developer",
    title: "Frontend Developer",
    description: "Build polished marketplace experiences with React, Next.js, and TypeScript.",
    company: "Example Company",
    employerId: "employer-1",
    skills: ["React", "Next.js", "TypeScript"],
    experienceLevel: "Mid-level",
    employmentType: "Full-time",
    location: "Lagos, Nigeria",
    remote: true,
    salary: "$45,000 - $75,000",
    status: "open",
    createdAt: new Date("2026-08-01T09:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-08-01T09:00:00.000Z").toISOString(),
  },
  {
    id: "job-devops-engineer",
    title: "DevOps Engineer",
    description: "Own deployment pipelines, Docker workflows, and AWS infrastructure for client platforms.",
    company: "CloudBridge Labs",
    employerId: "employer-1",
    skills: ["AWS", "Docker", "DevOps", "Git"],
    experienceLevel: "Senior",
    employmentType: "Contract",
    location: "Remote",
    remote: true,
    salary: "$70/hour",
    status: "open",
    createdAt: new Date("2026-08-05T09:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-08-05T09:00:00.000Z").toISOString(),
  },
];

export const seedTalent: TalentProfile[] = [
  {
    id: "profile-talent-1",
    userId: "talent-1",
    name: "Adams Ekpe",
    email: "talent@techhire.market",
    profilePicture: "/images/candidate-engineer.webp",
    bio: "Frontend developer, graphic designer, and cyber security personnel building practical web products.",
    skills: ["React", "Next.js", "TypeScript", "Figma", "Cybersecurity"],
    experience: ["3+ years building responsive React applications", "Portfolio and marketplace product experience"],
    education: ["Technology and security training"],
    projects: ["TechHire Market", "Agency operations dashboard"],
    portfolioUrl: "https://example.com",
    socialLinks: { linkedin: "https://linkedin.com", x: "https://x.com" },
    location: "Lagos, Nigeria",
    availability: "Open to interviews",
  },
];

export const seedApplications: Application[] = [
  {
    id: "application-1",
    jobId: "job-frontend-developer",
    applicantId: "talent-1",
    employerId: "employer-1",
    resumeProfile: "profile-talent-1",
    coverLetter: "I can help build the marketplace frontend with React, Next.js, and TypeScript.",
    submittedAt: new Date("2026-08-08T09:00:00.000Z").toISOString(),
    status: "submitted",
  },
];
