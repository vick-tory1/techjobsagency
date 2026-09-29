import { promises as fs } from "fs";
import path from "path";
import { prisma } from "./prisma";
import { seedApplications, seedJobs, seedTalent, seedUsers } from "./seed";
import type { Application, Job, TalentProfile, User } from "./types";

export type Database = {
  users: User[];
  jobs: Job[];
  applications: Application[];
  talent: TalentProfile[];
};

const dataDir = path.join(process.cwd(), "data");
const databasePath = path.join(dataDir, "database.json");
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

function assertPersistenceMode() {
  if (!hasDatabaseUrl && process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is required in production. Filesystem persistence is development/test only.");
  }
}

function mapUser(user: {
  id: string;
  googleId: string | null;
  name: string;
  email: string;
  profilePicture: string | null;
  roles: User["roles"];
  provider: User["provider"];
  employerVerified?: boolean;
  passwordHash: string | null;
  company: string | null;
  primarySkill: string | null;
  whatsapp: string | null;
  facebook: string | null;
  x: string | null;
  linkedin: string | null;
  portfolio: string | null;
}): User {
  return {
    ...user,
    googleId: user.googleId ?? undefined,
    profilePicture: user.profilePicture ?? undefined,
    employerVerified: user.employerVerified ?? false,
    passwordHash: user.passwordHash ?? undefined,
    company: user.company ?? undefined,
    primarySkill: user.primarySkill ?? undefined,
    whatsapp: user.whatsapp ?? undefined,
    facebook: user.facebook ?? undefined,
    x: user.x ?? undefined,
    linkedin: user.linkedin ?? undefined,
    portfolio: user.portfolio ?? undefined,
  };
}

function mapJob(job: {
  id: string;
  title: string;
  description: string;
  company: string;
  employerId: string;
  skills: string[];
  experienceLevel: string;
  employmentType: string;
  location: string;
  remote: boolean;
  salary: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  salaryPeriod: string | null;
  workplaceType: string | null;
  applicationDeadline: Date | null;
  status: Job["status"];
  createdAt: Date;
  updatedAt: Date;
}): Job {
  return {
    ...job,
    salaryMin: job.salaryMin ?? undefined,
    salaryMax: job.salaryMax ?? undefined,
    salaryCurrency: job.salaryCurrency ?? undefined,
    salaryPeriod: (job.salaryPeriod as Job["salaryPeriod"]) ?? undefined,
    workplaceType: (job.workplaceType as Job["workplaceType"]) ?? undefined,
    applicationDeadline: job.applicationDeadline?.toISOString(),
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  };
}

function mapTalent(profile: {
  id: string;
  userId: string;
  name: string;
  email: string;
  profilePicture: string | null;
  bio: string;
  skills: string[];
  experience: string[];
  education: string[];
  projects: string[];
  portfolioUrl: string | null;
  socialLinks: unknown;
  location: string;
  availability: string;
}): TalentProfile {
  return {
    ...profile,
    profilePicture: profile.profilePicture ?? undefined,
    portfolioUrl: profile.portfolioUrl ?? undefined,
    socialLinks: typeof profile.socialLinks === "object" && profile.socialLinks ? profile.socialLinks as Record<string, string> : {},
  };
}

function mapApplication(application: {
  id: string;
  jobId: string;
  applicantId: string;
  employerId: string;
  resumeProfile: string;
  coverLetter: string;
  submittedAt: Date;
  status: Application["status"];
}): Application {
  return { ...application, submittedAt: application.submittedAt.toISOString() };
}

async function initialDatabase(): Promise<Database> {
  return {
    users: seedUsers,
    jobs: seedJobs,
    applications: seedApplications,
    talent: seedTalent,
  };
}

export async function readDatabase() {
  assertPersistenceMode();
  if (hasDatabaseUrl) {
    const [users, jobs, applications, talent] = await Promise.all([
      prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.job.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.application.findMany({ orderBy: { submittedAt: "desc" } }),
      prisma.talentProfile.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    return {
      users: users.map(mapUser),
      jobs: jobs.map(mapJob),
      applications: applications.map(mapApplication),
      talent: talent.map(mapTalent),
    };
  }
  await fs.mkdir(dataDir, { recursive: true });
  try {
    return JSON.parse(await fs.readFile(databasePath, "utf8")) as Database;
  } catch {
    const created = await initialDatabase();
    await writeDatabase(created);
    return created;
  }
}

export async function writeDatabase(database: Database) {
  assertPersistenceMode();
  if (hasDatabaseUrl) {
    await prisma.$transaction(async (tx) => {
      for (const user of database.users) {
        await tx.user.upsert({
          where: { id: user.id },
          update: user,
          create: user,
        });
      }

      for (const job of database.jobs) {
        const data = {
          ...job,
          applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline) : null,
          createdAt: new Date(job.createdAt),
          updatedAt: new Date(job.updatedAt),
        };
        await tx.job.upsert({
          where: { id: job.id },
          update: data,
          create: data,
        });
      }

      for (const profile of database.talent) {
        const data = { ...profile, socialLinks: profile.socialLinks };
        await tx.talentProfile.upsert({
          where: { id: profile.id },
          update: data,
          create: data,
        });
      }

      for (const application of database.applications) {
        const data = { ...application, submittedAt: new Date(application.submittedAt) };
        await tx.application.upsert({
          where: { id: application.id },
          update: data,
          create: data,
        });
      }

      await tx.application.deleteMany({ where: { id: { notIn: database.applications.map((item) => item.id) } } });
      await tx.talentProfile.deleteMany({ where: { id: { notIn: database.talent.map((item) => item.id) } } });
      await tx.job.deleteMany({ where: { id: { notIn: database.jobs.map((item) => item.id) } } });
      await tx.user.deleteMany({ where: { id: { notIn: database.users.map((item) => item.id) } } });
    });
    return;
  }
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(databasePath, JSON.stringify(database, null, 2));
}

export async function updateDatabase(updater: (database: Database) => Database) {
  const database = await readDatabase();
  const next = updater(database);
  await writeDatabase(next);
  return next;
}
