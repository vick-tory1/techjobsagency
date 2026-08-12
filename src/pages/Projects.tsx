import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import type { TechJob } from "../data/techJobs";
import { useStoredList } from "../hooks/useStoredList";
import { useTechJobs } from "../hooks/useTechJobs";
import type { Project, ProjectStatus } from "../types/workspace";

const statuses: ProjectStatus[] = ["Active", "At Risk", "Completed"];
const workModeOptions: NonNullable<Project["workMode"]>[] = ["Remote", "Hybrid", "On-site"];
const levelOptions: NonNullable<Project["level"]>[] = ["Junior", "Mid-level", "Senior", "Lead"];
const employmentTypeOptions: NonNullable<Project["employmentType"]>[] = ["Full-time", "Contract", "Internship"];

function salaryToBudget(salary: string) {
  const amounts = salary.match(/\d[\d,]*/g)?.map((amount) => Number(amount.replace(/,/g, ""))) ?? [];
  return amounts.length ? Math.max(...amounts) : 0;
}

function liveJobToProject(job: TechJob): Project {
  const postedAt = Number.isNaN(new Date(job.postedAt).getTime()) ? new Date() : new Date(job.postedAt);
  const closesAt = new Date(postedAt);
  closesAt.setDate(closesAt.getDate() + 30);

  return {
    id: `live-${job.id}`,
    name: job.title,
    client: job.company,
    status: "Active",
    dueDate: closesAt.toISOString().slice(0, 10),
    budget: salaryToBudget(job.salary),
    location: job.location,
    workMode: job.workMode,
    level: job.level,
    employmentType: job.employmentType,
    skills: job.skills,
  };
}

export default function Projects() {
  const [projects, setProjects] = useStoredList<Project>("flowpilot-projects", []);
  const { jobs: liveJobs, status: liveJobsStatus } = useTechJobs(80);
  const liveProjects = liveJobs.map(liveJobToProject);
  const visibleProjects = [
    ...liveProjects,
    ...projects.filter(
      (project) =>
        !liveProjects.some(
          (liveProject) =>
            liveProject.name.toLowerCase() === project.name.toLowerCase() &&
            liveProject.client.toLowerCase() === project.client.toLowerCase()
        )
    ),
  ];
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("Active");
  const [search, setSearch] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const filteredProjects = visibleProjects.filter((project) => {
    const normalizedSearch = search.trim().toLowerCase();
    const searchable = [project.name, project.client, project.location, project.workMode, project.level, project.employmentType, ...(project.skills ?? [])]
      .join(" ")
      .toLowerCase();

    return (
      (!normalizedSearch || searchable.includes(normalizedSearch)) &&
      (workModeFilter === "All" || project.workMode === workModeFilter) &&
      (levelFilter === "All" || project.level === levelFilter) &&
      (employmentTypeFilter === "All" || project.employmentType === employmentTypeFilter)
    );
  });

  const resetForm = () => {
    setProjectName("");
    setClientName("");
    setDueDate("");
    setBudget("");
    setStatus("Active");
    setEditingId(null);
  };

  const handleSaveProject = () => {
    if (!projectName.trim() || !clientName.trim() || !dueDate || Number(budget) <= 0) {
      setMessage("Complete all fields with a valid budget.");
      return;
    }

    const project: Project = {
      id: editingId ?? crypto.randomUUID(),
      name: projectName.trim(),
      client: clientName.trim(),
      dueDate,
      budget: Number(budget),
      status,
    };

    setProjects((current) =>
      editingId ? current.map((item) => (item.id === editingId ? project : item)) : [project, ...current]
    );
    setMessage(editingId ? "Project updated and dashboard synced." : "Project added and dashboard synced.");
    resetForm();
  };

  const handleEditProject = (project: Project) => {
    setEditingId(project.id);
    setProjectName(project.name);
    setClientName(project.client);
    setDueDate(project.dueDate);
    setBudget(String(project.budget));
    setStatus(project.status);
    setMessage("");
  };

  const handleDeleteProject = (id: string) => {
    if (!window.confirm("Delete this project?")) return;
    setProjects((current) => current.filter((project) => project.id !== id));
    setMessage("Project deleted and dashboard synced.");
    if (editingId === id) resetForm();
  };

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-950 md:text-4xl">Job Posts</h1>
        <p className="mt-2 text-gray-500">Live job API roles appear here automatically. Manual job posts stay editable for direct employer openings.</p>
      </div>

      {message && <div className="rounded-lg bg-green-50 p-4 text-green-800">{message}</div>}
      <div className="rounded-lg bg-green-50 p-4 text-sm font-semibold text-green-800">
        {liveJobsStatus}. Showing {filteredProjects.length} matching jobs from {liveProjects.length} live jobs plus {projects.length} manual records.
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-950">{editingId ? "Edit Job Post" : "Add Job Post"}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input value={projectName} onChange={setProjectName} placeholder="Job title" />
          <Input value={clientName} onChange={setClientName} placeholder="Employer company" />
          <Input value={dueDate} onChange={setDueDate} placeholder="Application close date: 2026-09-18" />
          <Input value={budget} onChange={setBudget} placeholder="Salary: 145000" />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as ProjectStatus)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSaveProject}>{editingId ? "Update Job" : "Add Job"}</Button>
            {editingId && <Button variant="secondary" onClick={resetForm}>Cancel</Button>}
          </div>
        </div>
      </div>

      <div className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_180px_180px_180px]">
        <Input value={search} onChange={setSearch} placeholder="Search role, employer, stack, location..." />
        <select value={workModeFilter} onChange={(event) => setWorkModeFilter(event.target.value)} className="rounded-lg border border-gray-300 px-4 py-3">
          <option>All</option>
          {workModeOptions.map((mode) => (
            <option key={mode}>{mode}</option>
          ))}
        </select>
        <select value={levelFilter} onChange={(event) => setLevelFilter(event.target.value)} className="rounded-lg border border-gray-300 px-4 py-3">
          <option>All</option>
          {levelOptions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select value={employmentTypeFilter} onChange={(event) => setEmploymentTypeFilter(event.target.value)} className="rounded-lg border border-gray-300 px-4 py-3">
          <option>All</option>
          {employmentTypeOptions.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[860px]">
          <thead>
            <tr className="border-b bg-gray-50 text-sm text-gray-600">
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Employer</th>
              <th className="p-4 text-left">Closes</th>
              <th className="p-4 text-left">Salary</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id} className="border-b last:border-b-0">
                <td className="p-4 font-medium text-gray-950">{project.name}</td>
                <td className="p-4 text-gray-600">{project.client}</td>
                <td className="p-4 text-gray-600">{project.dueDate}</td>
                <td className="p-4 text-gray-600">{project.budget ? `$${project.budget.toLocaleString()}` : "Not listed"}</td>
                <td className="p-4 text-gray-600">{project.status}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {project.id.startsWith("live-") ? (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">Live API</span>
                    ) : (
                      <>
                        <Button variant="secondary" onClick={() => handleEditProject(project)}>Edit</Button>
                        <Button variant="danger" onClick={() => handleDeleteProject(project.id)}>Delete</Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
