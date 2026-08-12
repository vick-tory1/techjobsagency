export type UserRole = "job-seeker" | "employer";
export type Permission = "admin" | "job-search" | "applicant-search";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roles?: UserRole[];
  permissions?: Permission[];
  provider?: "manual" | "google";
  googleId?: string;
  company?: string;
  primarySkill?: string;
  profileImage?: string;
  whatsapp?: string;
  facebook?: string;
  x?: string;
  linkedin?: string;
  portfolio?: string;
};
