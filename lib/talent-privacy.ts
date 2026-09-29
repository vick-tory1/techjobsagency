import type { PublicTalentProfile, TalentProfile, User } from "./types";

export function publicTalentProfile(profile: TalentProfile): PublicTalentProfile {
  return {
    id: profile.id,
    userId: profile.userId,
    name: profile.name,
    profilePicture: profile.profilePicture,
    bio: profile.bio,
    skills: profile.skills,
    projects: profile.projects,
    portfolioUrl: profile.portfolioUrl,
    location: profile.location,
    availability: profile.availability,
  };
}

export function isVerifiedEmployer(user: User) {
  return user.roles.includes("employer") && user.employerVerified === true;
}
