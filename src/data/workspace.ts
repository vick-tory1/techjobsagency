import type { Project, Task, TeamMember } from "../types/workspace";

export const projects: Project[] = [
  {
    id: "proj-1",
    name: "Senior Frontend Engineer",
    client: "Acme Incorporated",
    status: "Active",
    dueDate: "2026-09-18",
    budget: 145000,
    location: "Remote - US / EMEA",
    workMode: "Remote",
    level: "Senior",
    employmentType: "Full-time",
    skills: ["React", "TypeScript", "Design Systems"],
  },
  {
    id: "proj-2",
    name: "Product Designer, Marketplace",
    client: "Northstar Retail",
    status: "At Risk",
    dueDate: "2026-08-29",
    budget: 98000,
    location: "London, UK",
    workMode: "Hybrid",
    level: "Mid-level",
    employmentType: "Full-time",
    skills: ["Figma", "UX Research", "Marketplace UX"],
  },
  {
    id: "proj-3",
    name: "Customer Success Lead",
    client: "Launch Studio",
    status: "Completed",
    dueDate: "2026-07-30",
    budget: 86000,
    location: "Lagos, Nigeria",
    workMode: "Hybrid",
    level: "Lead",
    employmentType: "Full-time",
    skills: ["SaaS", "Customer Success", "Onboarding"],
  },
  {
    id: "proj-4",
    name: "Cloud Security Engineer",
    client: "Cedar Systems",
    status: "Active",
    dueDate: "2026-10-04",
    budget: 132000,
    location: "New York, NY",
    workMode: "On-site",
    level: "Senior",
    employmentType: "Full-time",
    skills: ["AWS", "Security", "Incident Response"],
  },
];

export const tasks: Task[] = [
  {
    id: "task-1",
    title: "Review shortlisted engineer profiles",
    assignee: "Sarah Johnson",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "task-2",
    title: "Schedule product designer interviews",
    assignee: "Michael Smith",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "task-3",
    title: "Send offer packet to success lead",
    assignee: "Amina Yusuf",
    status: "Completed",
    priority: "Low",
  },
];

export const team: TeamMember[] = [
  {
    id: "team-1",
    name: "Sarah Johnson",
    role: "Candidate Experience Lead",
    capacity: 82,
  },
  {
    id: "team-2",
    name: "Michael Smith",
    role: "Employer Success Manager",
    capacity: 76,
  },
  {
    id: "team-3",
    name: "Amina Yusuf",
    role: "Recruiting Operations Manager",
    capacity: 68,
  },
];
