export type ClientStatus = "Active" | "Inactive";
export type ProjectStatus = "Active" | "At Risk" | "Completed";
export type TaskStatus = "Pending" | "In Progress" | "Completed";

export type Project = {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  dueDate: string;
  budget: number;
  location?: string;
  workMode?: "Remote" | "Hybrid" | "On-site";
  level?: "Junior" | "Mid-level" | "Senior" | "Lead";
  employmentType?: "Full-time" | "Contract" | "Internship";
  skills?: string[];
};

export type Task = {
  id: string;
  title: string;
  assignee: string;
  status: TaskStatus;
  priority: "High" | "Medium" | "Low";
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  capacity: number;
};
