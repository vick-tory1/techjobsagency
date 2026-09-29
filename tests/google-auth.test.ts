import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "../lib/types";

let users: User[] = [];

vi.mock("next-auth", () => ({
  default: vi.fn(() => ({ handlers: {}, auth: vi.fn(), signIn: vi.fn(), signOut: vi.fn() })),
}));

vi.mock("next-auth/providers/credentials", () => ({ default: vi.fn((options) => options) }));
vi.mock("next-auth/providers/google", () => ({ default: vi.fn((options) => options) }));

vi.mock("../lib/store", () => ({
  createId: () => "user-google-test",
  store: {
    users: vi.fn(async () => users),
    saveUsers: vi.fn(async (next: User[]) => {
      users = next;
    }),
  },
}));

const { SESSION_MAX_AGE_SECONDS, loginUser, signupUser, upsertGoogleUser } = await import("../auth");

beforeEach(() => {
  users = [];
});

describe("Google account provisioning", () => {
  it("creates verified Google users as job seekers without accepting a requested role", async () => {
    const user = await upsertGoogleUser({
      id: "google-user-1",
      name: "Google User",
      email: "google-user@example.com",
    });

    expect(user?.roles).toEqual(["talent"]);
    expect(users[0]?.roles).toEqual(["talent"]);
  });

  it("preserves an existing stored role instead of adding a Google-selected role", async () => {
    users = [{
      id: "existing-user",
      name: "Existing User",
      email: "existing@example.com",
      roles: ["talent"],
      provider: "credentials",
    }];

    const user = await upsertGoogleUser({
      id: "google-user-2",
      name: "Updated Name",
      email: "existing@example.com",
    });

    expect(user?.roles).toEqual(["talent"]);
    expect(users[0]?.roles).toEqual(["talent"]);
  });
});

describe("credential account provisioning", () => {
  it("uses a fixed eight-hour session lifetime", () => {
    expect(SESSION_MAX_AGE_SECONDS).toBe(60 * 60 * 8);
  });

  it("preserves the legitimate job seeker and employer signup and login flows", async () => {
    const jobSeeker = await signupUser({
      name: "Job Seeker",
      email: "job-seeker@example.com",
      password: "job-seeker-password",
      role: "talent",
    });
    const employer = await signupUser({
      name: "Employer",
      email: "employer@example.com",
      password: "employer-password",
      role: "employer",
    });

    expect(jobSeeker?.roles).toEqual(["talent"]);
    expect(employer?.roles).toEqual(["employer"]);
    expect((await loginUser({ email: "job-seeker@example.com", password: "job-seeker-password" }))?.id).toBe(jobSeeker?.id);
    expect((await loginUser({ email: "employer@example.com", password: "employer-password" }))?.id).toBe(employer?.id);
  });

  it("does not allow credential signup bodies to create an admin account", async () => {
    const user = await signupUser({
      name: "Untrusted Role",
      email: "untrusted-role@example.com",
      password: "untrusted-password",
      role: "admin",
    });

    expect(user?.roles).toEqual(["talent"]);
  });
});
