export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  status: "Active" | "Inactive";
  owner?: string;
  segment?: string;
  budget?: number;
}
