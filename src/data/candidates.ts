export type Candidate = {
  id: string;
  name: string;
  title: string;
  location: string;
  experience: string;
  availability: string;
  salaryExpectation: number;
  skills: string[];
};

export const candidates: Candidate[] = [
  {
    id: "cand-1",
    name: "Ada Nwosu",
    title: "Senior Frontend Engineer",
    location: "Lagos, Nigeria",
    experience: "6 years",
    availability: "Open immediately",
    salaryExpectation: 78000,
    skills: ["React", "TypeScript", "Accessibility", "Design Systems"],
  },
  {
    id: "cand-2",
    name: "Daniel Okafor",
    title: "Cloud Security Engineer",
    location: "Remote - EMEA",
    experience: "5 years",
    availability: "2 weeks notice",
    salaryExpectation: 112000,
    skills: ["AWS", "Kubernetes", "SIEM", "Threat Modeling"],
  },
  {
    id: "cand-3",
    name: "Maya Chen",
    title: "Product Designer",
    location: "London, UK",
    experience: "4 years",
    availability: "Open to interviews",
    salaryExpectation: 92000,
    skills: ["Figma", "UX Research", "Prototyping", "Marketplace UX"],
  },
];
