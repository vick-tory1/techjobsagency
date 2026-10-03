import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { createId, store } from "./lib/store";
import { dashboardForRoles, isAssignableRole } from "./lib/auth-utils";
import { hashPassword, isLegacyPasswordHash, verifyPassword } from "./lib/password";
import type { Role, User as AppUser } from "./lib/types";

const googleClientId = process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID ?? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_CLIENT_SECRET;

if (process.env.NODE_ENV === "production" && !process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET must be set in production.");
}
const authSecret = process.env.AUTH_SECRET ?? "flowpilot-local-development-secret-change-before-production";
const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase() ?? "";
const adminPassword = process.env.ADMIN_PASSWORD;
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export const isGoogleAuthConfigured = Boolean(googleClientId && googleClientSecret);

function isJwtSessionError(error: Error) {
  return "type" in error && error.type === "JWTSessionError";
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      profilePicture?: string;
      roles: Role[];
      provider: AppUser["provider"];
    };
  }

  interface User {
    roles?: Role[];
    provider?: AppUser["provider"];
    profilePicture?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    roles?: Role[];
    provider?: AppUser["provider"];
    profilePicture?: string;
  }
}

function publicFormFields(credentials: Partial<Record<string, unknown>>) {
  return {
    company: typeof credentials.company === "string" ? credentials.company.trim() : undefined,
    primarySkill: typeof credentials.primarySkill === "string" ? credentials.primarySkill.trim() : undefined,
    whatsapp: typeof credentials.whatsapp === "string" ? credentials.whatsapp.trim() : undefined,
    facebook: typeof credentials.facebook === "string" ? credentials.facebook.trim() : undefined,
    x: typeof credentials.x === "string" ? credentials.x.trim() : undefined,
    linkedin: typeof credentials.linkedin === "string" ? credentials.linkedin.trim() : undefined,
    portfolio: typeof credentials.portfolio === "string" ? credentials.portfolio.trim() : undefined,
  };
}

function authPayload(user: AppUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.profilePicture,
    roles: user.roles,
    provider: user.provider,
    profilePicture: user.profilePicture,
  };
}

async function ensureAdminUser(options: { password?: string; googleId?: string; profilePicture?: string | null; provider?: AppUser["provider"] } = {}) {
  if (!adminEmail) {
    throw new Error("ADMIN_EMAIL must be set to use admin authentication.");
  }
  const users = await store.users();
  const existing = users.find((item) => item.email.toLowerCase() === adminEmail && item.roles.includes("admin"));
  if (existing) {
    const updated: AppUser = {
      ...existing,
      name: process.env.ADMIN_NAME || existing.name || "Adams Ekpe",
      googleId: options.googleId ?? existing.googleId,
      profilePicture: options.profilePicture ?? existing.profilePicture,
      provider: options.provider ?? existing.provider,
      passwordHash: options.password
        ? existing.passwordHash && !isLegacyPasswordHash(existing.passwordHash)
          ? existing.passwordHash
          : await hashPassword(options.password)
        : existing.passwordHash,
    };
    await store.saveUsers(users.map((item) => (item.id === existing.id ? updated : item)));
    return updated;
  }

  const admin: AppUser = {
    id: "admin-1",
    name: process.env.ADMIN_NAME || "Adams Ekpe",
    email: adminEmail,
    roles: ["admin"],
    googleId: options.googleId,
    profilePicture: options.profilePicture ?? undefined,
    provider: options.provider ?? "credentials",
    passwordHash: options.password ? await hashPassword(options.password) : undefined,
  };
  await store.saveUsers([admin, ...users.filter((item) => !item.roles.includes("admin"))]);
  return admin;
}

export async function upsertGoogleUser(authUser: { id?: string | null; name?: string | null; email?: string | null; image?: string | null }) {
  if (!authUser.email) return null;

  const email = authUser.email.toLowerCase();
  if (email === adminEmail) {
    return ensureAdminUser({
      googleId: authUser.id ?? undefined,
      profilePicture: authUser.image,
      provider: "google",
    });
  }

  const users = await store.users();
  const existing = users.find((item) => item.email.toLowerCase() === email);

  if (existing?.roles.includes("admin")) return null;

  if (existing) {
    const updated: AppUser = {
      ...existing,
      googleId: authUser.id ?? existing.googleId,
      name: authUser.name ?? existing.name,
      profilePicture: authUser.image ?? existing.profilePicture,
      provider: "google",
    };
    await store.saveUsers(users.map((item) => (item.id === existing.id ? updated : item)));
    return updated;
  }

  const created: AppUser = {
    id: createId("user"),
    name: authUser.name ?? email.split("@")[0],
    email,
    profilePicture: authUser.image ?? undefined,
    // OAuth users begin with the least-privileged public role. Role selection
    // in the browser is presentation only and must never grant privileges.
    roles: ["talent"],
    provider: "google",
  };
  await store.saveUsers([created, ...users]);
  return created;
}

export async function signupUser(credentials: Partial<Record<string, unknown>>) {
  const email = typeof credentials.email === "string" ? credentials.email.trim().toLowerCase() : "";
  const name = typeof credentials.name === "string" ? credentials.name.trim() : "";
  const password = typeof credentials.password === "string" ? credentials.password : "";
  const role = isAssignableRole(credentials.role) ? credentials.role : "talent";
  const profilePicture = typeof credentials.profilePicture === "string" ? credentials.profilePicture : undefined;

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || email === adminEmail) return null;

  const users = await store.users();
  const existing = users.find((item) => item.email.toLowerCase() === email);
  if (existing) return null;

  const created: AppUser = {
    id: createId("user"),
    name,
    email,
    profilePicture,
    roles: [role],
    provider: "credentials",
    passwordHash: await hashPassword(password),
    ...publicFormFields(credentials),
  };
  await store.saveUsers([created, ...users]);
  return created;
}

export async function loginUser(credentials: Partial<Record<string, unknown>>) {
  const email = typeof credentials.email === "string" ? credentials.email.trim().toLowerCase() : "";
  const password = typeof credentials.password === "string" ? credentials.password : "";
  const users = await store.users();
  const user = users.find((item) => item.email.toLowerCase() === email && !item.roles.includes("admin"));
  if (!user || !(await verifyPassword(password, user.passwordHash))) return null;
  if (isLegacyPasswordHash(user.passwordHash)) {
    const updated = { ...user, passwordHash: await hashPassword(password), provider: "credentials" as const };
    await store.saveUsers(users.map((item) => (item.id === user.id ? updated : item)));
    return updated;
  }
  return user;
}

async function loginAdmin(credentials: Partial<Record<string, unknown>>) {
  const email = typeof credentials.email === "string" ? credentials.email.trim().toLowerCase() : "";
  const password = typeof credentials.password === "string" ? credentials.password : "";
  if (!adminEmail || !adminPassword || email !== adminEmail || password !== adminPassword) return null;

  const admin = await ensureAdminUser({ password: adminPassword, provider: "credentials" });
  return admin;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: authSecret,
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_SECONDS },
  jwt: { maxAge: SESSION_MAX_AGE_SECONDS },
  logger: {
    error(error) {
      // Auth.js already removes an unreadable JWT cookie. This commonly occurs
      // once after AUTH_SECRET changes, so treat that visitor as signed out
      // without surfacing a development error overlay.
      if (isJwtSessionError(error)) {
        if (process.env.NODE_ENV === "production") {
          console.warn("[auth] Discarded an unreadable session cookie; the visitor must sign in again.");
        }
        return;
      }
      console.error(error);
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        mode: {},
        name: {},
        email: {},
        password: {},
        role: {},
        company: {},
        primarySkill: {},
        profilePicture: {},
        whatsapp: {},
        facebook: {},
        x: {},
        linkedin: {},
        portfolio: {},
      },
      async authorize(credentials) {
        const mode = typeof credentials.mode === "string" ? credentials.mode : "login";
        const user = mode === "admin" ? await loginAdmin(credentials) : mode === "signup" ? await signupUser(credentials) : await loginUser(credentials);
        return user ? authPayload(user) : null;
      },
    }),
    ...(isGoogleAuthConfigured
      ? [
          Google({
            clientId: googleClientId!,
            clientSecret: googleClientSecret!,
            allowDangerousEmailAccountLinking: false,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === "credentials") return true;
      if (account?.provider !== "google") return false;
      if (profile && "email_verified" in profile && profile.email_verified === false) return false;
      const appUser = await upsertGoogleUser(user);
      return Boolean(appUser);
    },
    async jwt({ token, account, user }) {
      if (account?.provider === "credentials" && user.email) {
        token.id = user.id;
        token.roles = user.roles ?? [];
        token.provider = user.provider ?? "credentials";
        token.profilePicture = user.profilePicture;
        token.picture = user.profilePicture ?? token.picture;
      }
      if (account?.provider === "google" && user.email) {
        const users = await store.users();
        const appUser = users.find((item) => item.email.toLowerCase() === user.email!.toLowerCase());
        if (appUser) {
          token.id = appUser.id;
          token.roles = appUser.roles;
          token.provider = appUser.provider;
          token.profilePicture = appUser.profilePicture;
          token.picture = appUser.profilePicture ?? token.picture;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id ?? "";
      session.user.roles = token.roles ?? [];
      session.user.provider = token.provider ?? "credentials";
      session.user.profilePicture = token.profilePicture;
      return session;
    },
    authorized({ auth: session }) {
      return Boolean(session?.user);
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return `${baseUrl}${dashboardForRoles(["talent"])}`;
    },
  },
});
