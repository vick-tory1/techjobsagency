import { promises as fs } from "fs";
import path from "path";
import { seedApplications, seedJobs, seedTalent, seedUsers } from "./seed";
import type { Application, Job, TalentProfile, User } from "./types";

const dataDir = path.join(process.cwd(), "data");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  await fs.mkdir(dataDir, { recursive: true });
  const filePath = path.join(dataDir, file);
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
  } catch {
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

async function writeJson<T>(file: string, value: T) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, file), JSON.stringify(value, null, 2));
}

export const store = {
  jobs: () => readJson<Job[]>("jobs.json", seedJobs),
  saveJobs: (jobs: Job[]) => writeJson("jobs.json", jobs),
  applications: () => readJson<Application[]>("applications.json", seedApplications),
  saveApplications: (applications: Application[]) => writeJson("applications.json", applications),
  talent: () => readJson<TalentProfile[]>("talent.json", seedTalent),
  saveTalent: (talent: TalentProfile[]) => writeJson("talent.json", talent),
  users: () => readJson<User[]>("users.json", seedUsers),
  saveUsers: (users: User[]) => writeJson("users.json", users),
};

export function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}
