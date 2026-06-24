import { useState } from "react";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

type Project = {
  id: string;
  name: string;
  client: string;
  status: "Active" | "Completed";
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: crypto.randomUUID(),
      name: "FlowPilot Website",
      client: "Acme Inc",
      status: "Active",
    },
  ]);

  const [projectName, setProjectName] =
    useState("");

  const [clientName, setClientName] =
    useState("");

  const [message, setMessage] =
    useState("");

  const handleAddProject = () => {
    if (
      !projectName.trim() ||
      !clientName.trim()
    ) {
      setMessage(
        "Please complete all fields."
      );
      return;
    }

    const newProject: Project = {
      id: crypto.randomUUID(),
      name: projectName,
      client: clientName,
      status: "Active",
    };

    setProjects((prev) => [
      newProject,
      ...prev,
    ]);

    setProjectName("");
    setClientName("");

    setMessage(
      "Project added successfully."
    );
  };

  const handleDeleteProject = (
    id: string
  ) => {
    const confirmed = window.confirm(
      "Delete this project?"
    );

    if (!confirmed) return;

    setProjects((prev) =>
      prev.filter(
        (project) => project.id !== id
      )
    );
  };

  return (
    <main className="p-8">
      <h1 className="mb-8 text-4xl font-bold">
        Projects
      </h1>

      {message && (
        <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-800">
          {message}
        </div>
      )}

      <div className="mb-8 rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Add Project
        </h2>

        <div className="space-y-4">
          <Input
            value={projectName}
            onChange={setProjectName}
            placeholder="Project Name"
          />

          <Input
            value={clientName}
            onChange={setClientName}
            placeholder="Client Name"
          />

          <Button
            onClick={handleAddProject}
          >
            Add Project
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="p-4 text-left">
                Project
              </th>

              <th className="p-4 text-left">
                Client
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-b"
              >
                <td className="p-4">
                  {project.name}
                </td>

                <td className="p-4">
                  {project.client}
                </td>

                <td className="p-4">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    {project.status}
                  </span>
                </td>

                <td className="p-4">
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleDeleteProject(
                        project.id
                      )
                    }
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}