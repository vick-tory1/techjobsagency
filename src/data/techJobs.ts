export type TechJob = {
  id: string;
  title: string;
  company: string;
  category: string;
  location: string;
  workMode: "Remote" | "Hybrid" | "On-site";
  level: "Junior" | "Mid-level" | "Senior" | "Lead";
  employmentType: "Full-time" | "Contract" | "Internship";
  salary: string;
  skills: string[];
  source: "Live Remotive" | "TechHire Context";
  url: string;
  postedAt: string;
};

const roles = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "Cloud Security Engineer",
  "DevOps Engineer",
  "Data Engineer",
  "AI Engineer",
  "Product Designer",
  "UX Researcher",
  "Cyber Security Analyst",
];

const companies = [
  "Acme Cloud",
  "Northstar Systems",
  "Cedar Labs",
  "Flowbyte",
  "LaunchGrid",
  "BluePeak AI",
  "SecurePath",
  "PixelForge",
  "DataNest",
  "OrbitOps",
];

const skillGroups = [
  ["React", "TypeScript", "Accessibility"],
  ["Node.js", "PostgreSQL", "REST APIs"],
  ["Python", "FastAPI", "Docker"],
  ["AWS", "IAM", "Incident Response"],
  ["Kubernetes", "CI/CD", "Terraform"],
  ["SQL", "Airflow", "Analytics"],
  ["Python", "LLMs", "Vector Search"],
  ["Figma", "Design Systems", "UX"],
  ["Research", "Prototyping", "Usability Testing"],
  ["SIEM", "Network Security", "Linux"],
];

const levels: TechJob["level"][] = ["Junior", "Mid-level", "Senior", "Lead"];
const workModes: TechJob["workMode"][] = ["Remote", "Hybrid", "On-site"];
const employmentTypes: TechJob["employmentType"][] = ["Full-time", "Contract", "Internship"];

export const techJobFallbacks: TechJob[] = Array.from({ length: 100 }, (_, index) => {
  const roleIndex = index % roles.length;
  const level = levels[index % levels.length];
  const workMode = workModes[index % workModes.length];
  const salaryBase = 65000 + index * 1200;

  return {
    id: `context-tech-job-${index + 1}`,
    title: `${level} ${roles[roleIndex]}`,
    company: companies[index % companies.length],
    category: roleIndex === 7 || roleIndex === 8 ? "Product Design" : roleIndex >= 3 && roleIndex <= 4 ? "Cloud and DevOps" : roleIndex === 9 ? "Cyber Security" : "Software Development",
    location: workMode === "Remote" ? "Remote" : workMode === "Hybrid" ? "Hybrid - Lagos / London / New York" : "On-site - Lagos / London / New York",
    workMode,
    level,
    employmentType: employmentTypes[index % employmentTypes.length],
    salary: `$${salaryBase.toLocaleString()} - $${(salaryBase + 28000).toLocaleString()}`,
    skills: skillGroups[roleIndex],
    source: "TechHire Context",
    url: "/signup",
    postedAt: new Date(Date.UTC(2026, index % 12, (index % 27) + 1)).toISOString(),
  };
});

export function normalizeRemotiveJob(job: {
  id: number;
  title: string;
  company_name: string;
  category: string;
  job_type?: string;
  publication_date: string;
  candidate_required_location?: string;
  salary?: string;
  url: string;
}): TechJob {
  const title = job.title.toLowerCase();
  const level: TechJob["level"] = title.includes("lead")
    ? "Lead"
    : title.includes("senior") || title.includes("sr.")
      ? "Senior"
      : title.includes("junior") || title.includes("intern")
        ? "Junior"
        : "Mid-level";

  const employmentType: TechJob["employmentType"] = job.job_type?.includes("contract")
    ? "Contract"
    : job.job_type?.includes("intern")
      ? "Internship"
      : "Full-time";

  return {
    id: `remotive-${job.id}`,
    title: job.title,
    company: job.company_name,
    category: job.category,
    location: job.candidate_required_location || "Remote",
    workMode: "Remote",
    level,
    employmentType,
    salary: job.salary || "Salary not listed",
    skills: inferSkills(job.title, job.category),
    source: "Live Remotive",
    url: job.url,
    postedAt: job.publication_date,
  };
}

function inferSkills(title: string, category: string) {
  const text = `${title} ${category}`.toLowerCase();
  if (text.includes("react") || text.includes("front")) return ["React", "TypeScript", "Frontend"];
  if (text.includes("python") || text.includes("data")) return ["Python", "SQL", "Data"];
  if (text.includes("security")) return ["Security", "Cloud", "Risk"];
  if (text.includes("devops") || text.includes("cloud")) return ["AWS", "DevOps", "CI/CD"];
  if (text.includes("design") || text.includes("product")) return ["Figma", "UX", "Product"];
  return ["Software Development", "Remote Work", "Technical Delivery"];
}
