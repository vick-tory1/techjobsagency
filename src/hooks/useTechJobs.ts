import { useEffect, useState } from "react";
import { normalizeRemotiveJob, type TechJob } from "../data/techJobs";

type RemotiveResponse = {
  jobs?: Array<{
    id: number;
    title: string;
    company_name: string;
    category: string;
    job_type?: string;
    publication_date: string;
    candidate_required_location?: string;
    salary?: string;
    url: string;
  }>;
};

const techSearchTerms = [
  "ai",
  "analytics",
  "android",
  "api",
  "application",
  "automation",
  "backend",
  "cloud",
  "cyber",
  "data",
  "database",
  "designer",
  "developer",
  "devops",
  "engineer",
  "frontend",
  "full stack",
  "ios",
  "javascript",
  "machine learning",
  "mobile",
  "platform",
  "product",
  "programmer",
  "qa",
  "react",
  "security",
  "software",
  "sre",
  "systems",
  "technical product",
  "test",
  "typescript",
  "ui",
  "ux",
  "web",
];

export function useTechJobs(limit = 100) {
  const [jobs, setJobs] = useState<TechJob[]>([]);
  const [status, setStatus] = useState("Loading available tech roles from the free Remotive jobs API");

  useEffect(() => {
    const controller = new AbortController();

    async function loadJobs() {
      try {
        const response = await fetch(`https://remotive.com/api/remote-jobs?limit=${limit * 3}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to load live jobs");

        const data = (await response.json()) as RemotiveResponse;
        const liveJobs = (data.jobs ?? [])
          .filter((job) => {
            const searchable = `${job.title} ${job.category}`.toLowerCase();
            return techSearchTerms.some((term) => searchable.includes(term));
          })
          .slice(0, limit)
          .map(normalizeRemotiveJob);

        if (liveJobs.length > 0) {
          setJobs(liveJobs.slice(0, limit));
          setStatus("Available jobs across software, data, cloud, DevOps, design, QA, mobile, AI, product, and security from the free Remotive jobs API");
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setJobs([]);
          setStatus("Live jobs API is unavailable right now");
        }
      }
    }

    loadJobs();
    return () => controller.abort();
  }, [limit]);

  return { jobs, status };
}
