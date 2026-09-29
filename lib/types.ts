export type Role = "admin" | "employer" | "talent" | "student" | "community";

export type JobStatus = "open" | "paused" | "closed";
export type ApplicationStatus = "submitted" | "reviewing" | "shortlisted" | "interview" | "accepted" | "rejected";

export type Job = {
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
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: "year" | "month" | "hour" | "project";
  workplaceType?: "remote" | "hybrid" | "onsite";
  applicationDeadline?: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
};

export type TalentProfile = {
  id: string;
  userId: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio: string;
  skills: string[];
  experience: string[];
  education: string[];
  projects: string[];
  portfolioUrl?: string;
  socialLinks: Record<string, string>;
  location: string;
  availability: string;
};

export type PublicTalentProfile = Pick<TalentProfile,
  "id" | "userId" | "name" | "profilePicture" | "bio" | "skills" | "projects" | "portfolioUrl" | "location" | "availability"
>;

export type Application = {
  id: string;
  jobId: string;
  applicantId: string;
  employerId: string;
  resumeProfile: string;
  coverLetter: string;
  submittedAt: string;
  status: ApplicationStatus;
};

export type User = {
  id: string;
  googleId?: string;
  name: string;
  email: string;
  profilePicture?: string;
  roles: Role[];
  provider: "google" | "credentials" | "password";
  employerVerified?: boolean;
  passwordHash?: string;
  company?: string;
  primarySkill?: string;
  whatsapp?: string;
  facebook?: string;
  x?: string;
  linkedin?: string;
  portfolio?: string;
};
