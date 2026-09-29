import { unstable_noStore as noStore } from "next/cache";
import type { Application, Job, TalentProfile, User } from "./types";
import { readDatabase, updateDatabase } from "./database";

export const store = {
  jobs: async () => {
    noStore();
    return (await readDatabase()).jobs;
  },
  saveJobs: (jobs: Job[]) => updateDatabase((database) => ({ ...database, jobs })),
  applications: async () => {
    noStore();
    return (await readDatabase()).applications;
  },
  saveApplications: (applications: Application[]) => updateDatabase((database) => ({ ...database, applications })),
  talent: async () => {
    noStore();
    return (await readDatabase()).talent;
  },
  saveTalent: (talent: TalentProfile[]) => updateDatabase((database) => ({ ...database, talent })),
  users: async () => {
    noStore();
    return (await readDatabase()).users;
  },
  saveUsers: (users: User[]) => updateDatabase((database) => ({ ...database, users })),
};

export function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}
