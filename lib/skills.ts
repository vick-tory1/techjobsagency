export const skills = [
  "React", "Next.js", "JavaScript", "TypeScript", "Node.js", "Python", "Django", "PHP", "Laravel", "Java", "C#", ".NET", "SQL", "PostgreSQL", "MongoDB", "UI/UX Design", "Figma", "Graphic Design", "Cybersecurity", "DevOps", "AWS", "Docker", "Git", "WordPress", "Flutter", "React Native",
];

export function skillMatchPercentage(requiredSkills: string[], talentSkills: string[]) {
  if (requiredSkills.length === 0) return 0;
  const talentSet = new Set(talentSkills.map((skill) => skill.toLowerCase()));
  const matched = requiredSkills.filter((skill) => talentSet.has(skill.toLowerCase())).length;
  return Math.round((matched / requiredSkills.length) * 100);
}
