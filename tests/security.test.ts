import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Application, Job, TalentProfile, User } from "../lib/types";

let sessionUser: { id: string; name: string; email: string; roles: User["roles"]; provider: User["provider"] } | null = null;
let sessionExpiresAt: string | null = null;

let jobs: Job[] = [];
let applications: Application[] = [];
let talent: TalentProfile[] = [];
let users: User[] = [];

vi.mock("../auth", () => ({
  auth: vi.fn(async () => (sessionUser ? { user: sessionUser, expires: sessionExpiresAt } : null)),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((destination: string) => {
    throw new Error(`redirect:${destination}`);
  }),
}));

vi.mock("../lib/store", () => ({
  createId: (prefix: string) => `${prefix}-test`,
  store: {
    jobs: vi.fn(async () => jobs),
    saveJobs: vi.fn(async (next: Job[]) => {
      jobs = next;
      return { jobs, applications, talent, users: [] };
    }),
    applications: vi.fn(async () => applications),
    saveApplications: vi.fn(async (next: Application[]) => {
      applications = next;
      return { jobs, applications, talent, users: [] };
    }),
    talent: vi.fn(async () => talent),
    saveTalent: vi.fn(async (next: TalentProfile[]) => {
      talent = next;
      return { jobs, applications, talent, users: [] };
    }),
    users: vi.fn(async () => users),
    saveUsers: vi.fn(async (next: User[]) => {
      users = next;
      return { jobs, applications, talent, users };
    }),
  },
}));

function request(body: unknown) {
  return new Request("http://localhost/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const owner = { id: "employer-1", name: "Owner", email: "owner@example.com", roles: ["employer"] as const, provider: "credentials" as const };
const verifiedOwner = { ...owner, employerVerified: true };
const otherEmployer = { id: "employer-2", name: "Other", email: "other@example.com", roles: ["employer"] as const, provider: "credentials" as const };
const applicant = { id: "talent-1", name: "Talent", email: "talent@example.com", roles: ["talent"] as const, provider: "credentials" as const };
const admin = { id: "admin-1", name: "Admin", email: "admin@example.com", roles: ["admin"] as const, provider: "credentials" as const };

beforeEach(() => {
  sessionUser = null;
  sessionExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  jobs = [{
    id: "job-1",
    title: "Frontend Engineer",
    description: "Build product UI",
    company: "Flowpilot",
    employerId: owner.id,
    skills: ["React"],
    experienceLevel: "Mid-level",
    employmentType: "Full-time",
    location: "Remote",
    remote: true,
    salary: "$80,000 - $100,000 / year",
    status: "open",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  }];
  talent = [{
    id: "profile-1",
    userId: applicant.id,
    name: applicant.name,
    email: applicant.email,
    bio: "React engineer",
    skills: ["React"],
    experience: [],
    education: [],
    projects: [],
    socialLinks: {},
    location: "Remote",
    availability: "Open",
  }];
  applications = [{
    id: "application-1",
    jobId: "job-1",
    applicantId: applicant.id,
    employerId: owner.id,
    resumeProfile: "profile-1",
    coverLetter: "I can help.",
    submittedAt: "2026-01-02T00:00:00.000Z",
    status: "submitted",
  }];
  users = [owner, otherEmployer, applicant, admin];
});

describe("protected page authorization", () => {
  it("redirects unauthenticated and cross-role direct navigation using the stored role", async () => {
    const { requirePageRole } = await import("../lib/api-auth");

    await expect(requirePageRole(["talent"])).rejects.toThrow("redirect:/login");

    sessionUser = { ...applicant, roles: ["employer"] };
    await expect(requirePageRole(["employer"])).rejects.toThrow("redirect:/talent");

    sessionUser = owner;
    await expect(requirePageRole(["employer"])).resolves.toMatchObject({ id: owner.id, roles: ["employer"] });
  });
});

describe("session expiration", () => {
  it("rejects an expired session before role authorization", async () => {
    const route = await import("../app/api/jobs/route");
    sessionUser = owner;
    sessionExpiresAt = new Date(Date.now() - 1000).toISOString();

    expect((await route.POST(request({}))).status).toBe(401);
  });
});

describe("jobs authorization", () => {
  it("uses the persisted role instead of a stale or manipulated session role", async () => {
    const route = await import("../app/api/jobs/route");
    sessionUser = { ...applicant, roles: ["employer"] };
    const response = await route.POST(request({
      title: "Unauthorized role",
      description: "Attempted with a manipulated session role",
      company: "Attacker",
      experienceLevel: "Mid-level",
      employmentType: "Full-time",
      location: "Remote",
      salaryMin: 60000,
      salaryMax: 80000,
    }));
    expect(response.status).toBe(403);
  });

  it("rejects a session identity that does not match a stored account", async () => {
    const route = await import("../app/api/jobs/route");
    sessionUser = { ...owner, email: "different@example.com" };
    expect((await route.POST(request({}))).status).toBe(401);
  });

  it("rejects unauthenticated mutation", async () => {
    const route = await import("../app/api/jobs/[id]/route");
    const response = await route.PUT(request({ title: "Changed" }), { params: Promise.resolve({ id: "job-1" }) });
    expect(response.status).toBe(401);
  });

  it("rejects applicant and non-owner employer job mutation", async () => {
    const route = await import("../app/api/jobs/[id]/route");
    sessionUser = applicant;
    expect((await route.PUT(request({ title: "Changed" }), { params: Promise.resolve({ id: "job-1" }) })).status).toBe(403);
    sessionUser = otherEmployer;
    expect((await route.PUT(request({ title: "Changed" }), { params: Promise.resolve({ id: "job-1" }) })).status).toBe(403);
  });

  it("allows owner and admin job mutation", async () => {
    const route = await import("../app/api/jobs/[id]/route");
    sessionUser = owner;
    expect((await route.PUT(request({ title: "Owner edit", employerId: otherEmployer.id }), { params: Promise.resolve({ id: "job-1" }) })).status).toBe(200);
    expect(jobs[0].employerId).toBe(owner.id);
    sessionUser = admin;
    expect((await route.PUT(request({ title: "Admin edit" }), { params: Promise.resolve({ id: "job-1" }) })).status).toBe(200);
  });
});

describe("applications authorization", () => {
  it("rejects unauthenticated submission", async () => {
    const route = await import("../app/api/applications/route");
    const response = await route.POST(request({ jobId: "job-1" }));
    expect(response.status).toBe(401);
  });

  it("protects application reads and ignores client identity filters", async () => {
    const route = await import("../app/api/applications/route");
    const detailRoute = await import("../app/api/applications/[id]/route");
    expect((await route.GET(new Request("http://localhost/api/applications"))).status).toBe(401);
    sessionUser = otherEmployer;
    const otherList = await route.GET(new Request("http://localhost/api/applications?employerId=employer-1&applicantId=talent-1"));
    expect(await otherList.json()).toEqual([]);
    expect((await detailRoute.GET(request({}), { params: Promise.resolve({ id: "application-1" }) })).status).toBe(403);
    sessionUser = owner;
    expect((await detailRoute.GET(request({}), { params: Promise.resolve({ id: "application-1" }) })).status).toBe(200);
  });

  it("takes applicant identity and employer identity from the server", async () => {
    const route = await import("../app/api/applications/route");
    applications = [];
    sessionUser = applicant;
    const response = await route.POST(request({ jobId: "job-1", applicantId: "attacker", employerId: "attacker" }));
    expect(response.status).toBe(201);
    expect(applications[0].applicantId).toBe(applicant.id);
    expect(applications[0].employerId).toBe(owner.id);
  });

  it("rejects unauthorized updates and allows employer/admin actions", async () => {
    const route = await import("../app/api/applications/[id]/route");
    sessionUser = otherEmployer;
    expect((await route.PUT(request({ status: "accepted" }), { params: Promise.resolve({ id: "application-1" }) })).status).toBe(403);
    sessionUser = owner;
    expect((await route.PUT(request({ status: "reviewing", applicantId: "attacker" }), { params: Promise.resolve({ id: "application-1" }) })).status).toBe(200);
    expect(applications[0].applicantId).toBe(applicant.id);
    sessionUser = admin;
    expect((await route.PUT(request({ status: "accepted" }), { params: Promise.resolve({ id: "application-1" }) })).status).toBe(200);
  });
});

describe("talent authorization", () => {
  it("returns only public talent fields from public endpoints", async () => {
    const listRoute = await import("../app/api/talent/route");
    const detailRoute = await import("../app/api/talent/[id]/route");
    const listResponse = await listRoute.GET(new Request("http://localhost/api/talent"));
    const detailResponse = await detailRoute.GET(new Request("http://localhost/api/talent/profile-1"), { params: Promise.resolve({ id: "profile-1" }) });
    expect(listResponse.status).toBe(200);
    expect(detailResponse.status).toBe(200);
    expect(await listResponse.json()).toEqual([expect.not.objectContaining({ email: applicant.email })]);
    expect(await detailResponse.json()).not.toHaveProperty("email");
  });

  it("requires authentication for candidate private details", async () => {
    const route = await import("../app/api/talent/[id]/route");
    const response = await route.POST(request({}), { params: Promise.resolve({ id: "profile-1" }) });
    expect(response.status).toBe(401);
  });

  it("rejects public users, other candidates, and unverified employers for candidate private details", async () => {
    const route = await import("../app/api/talent/[id]/route");
    sessionUser = { id: "student-1", name: "Student", email: "student@example.com", roles: ["student"], provider: "credentials" };
    users = [...users, sessionUser];
    expect((await route.POST(request({}), { params: Promise.resolve({ id: "profile-1" }) })).status).toBe(403);
    sessionUser = { id: "talent-2", name: "Other", email: "other-talent@example.com", roles: ["talent"], provider: "credentials" };
    users = [...users, sessionUser];
    expect((await route.POST(request({}), { params: Promise.resolve({ id: "profile-1" }) })).status).toBe(403);
    sessionUser = owner;
    expect((await route.POST(request({}), { params: Promise.resolve({ id: "profile-1" }) })).status).toBe(403);
  });

  it("allows verified employers only when their real hiring workflow authorizes the candidate", async () => {
    const route = await import("../app/api/talent/[id]/route");
    users = [verifiedOwner, otherEmployer, applicant, admin];
    sessionUser = verifiedOwner;
    const allowed = await route.POST(request({}), { params: Promise.resolve({ id: "profile-1" }) });
    expect(allowed.status).toBe(200);
    expect(await allowed.json()).toHaveProperty("email", applicant.email);
    users = [{ ...otherEmployer, employerVerified: true }, applicant, admin];
    sessionUser = { ...otherEmployer, employerVerified: true };
    expect((await route.POST(request({}), { params: Promise.resolve({ id: "profile-1" }) })).status).toBe(403);
  });

  it("does not trust request bodies for employer verification or identity", async () => {
    const route = await import("../app/api/talent/[id]/route");
    sessionUser = otherEmployer;
    const manipulated = await route.POST(request({ employerVerified: true, employerId: owner.id, userId: owner.id }), { params: Promise.resolve({ id: "profile-1" }) });
    expect(manipulated.status).toBe(403);
  });

  it("rejects unauthenticated and cross-user profile mutation", async () => {
    const route = await import("../app/api/talent/[id]/route");
    expect((await route.PUT(request({ bio: "Updated" }), { params: Promise.resolve({ id: "profile-1" }) })).status).toBe(401);
    sessionUser = { id: "talent-2", name: "Other", email: "other-talent@example.com", roles: ["talent"], provider: "credentials" };
    users = [...users, sessionUser];
    expect((await route.PUT(request({ bio: "Updated" }), { params: Promise.resolve({ id: "profile-1" }) })).status).toBe(403);
  });

  it("allows owner and admin profile mutation", async () => {
    const route = await import("../app/api/talent/[id]/route");
    sessionUser = applicant;
    expect((await route.PUT(request({ bio: "Owner update", userId: "attacker" }), { params: Promise.resolve({ id: "profile-1" }) })).status).toBe(200);
    expect(talent[0].userId).toBe(applicant.id);
    sessionUser = admin;
    expect((await route.PUT(request({ bio: "Admin update" }), { params: Promise.resolve({ id: "profile-1" }) })).status).toBe(200);
  });
});
