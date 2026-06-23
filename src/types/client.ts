export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  status: "Active" | "Inactive";
}