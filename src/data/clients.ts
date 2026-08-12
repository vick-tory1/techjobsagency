import type { Client } from "../types/client";

export const clients: Client[] = [
  {
    id: "1",
    name: "People Operations Lead",
    company: "Acme Incorporated",
    email: "hiring@acme.com",
    status: "Active",
    owner: "Amina Yusuf",
    segment: "Enterprise employer",
    budget: 18,
  },
  {
    id: "2",
    name: "Talent Acquisition Manager",
    company: "Northstar Retail",
    email: "talent@northstarretail.com",
    status: "Active",
    owner: "Michael Smith",
    segment: "Retail hiring team",
    budget: 11,
  },
  {
    id: "3",
    name: "Founder Hiring Desk",
    company: "Launch Studio",
    email: "careers@launchstudio.com",
    status: "Inactive",
    owner: "Sarah Johnson",
    segment: "Startup recruiter",
    budget: 4,
  },
];
