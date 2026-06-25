import { useState, useEffect } from "react";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

type Project = {
  id: string;
  name: string;
  client: string;
  status: "Active" | "Completed";
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects =
      localStorage.getItem(
        "flowpilot-projects"
      );

    return savedProjects
      ? JSON.parse(savedProjects)
      : [
          {
            id: crypto.randomUUID(),
            name: "FlowPilot Website",
            client: "Acme Incorporated",
            status: "Active",
          },
        ];
  });

  const [projectName, setProjectName] =
    useState("");

  const [clientName, setClientName] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [errors, setErrors] =
    useState({
      projectName: "",
      clientName: "",
    });

  useEffect(() => {
    localStorage.setItem(
      "flowpilot-projects",
      JSON.stringify(projects)
    );
  }, [projects]);

  const resetForm = () => {
    setProjectName("");
    setClientName("");
    setEditingId(null);

    setErrors({
      projectName: "",
      clientName: "",
    });
  };

  const handleSaveProject = () => {
    const newErrors = {
      projectName: "",
      clientName: "",
    };

    let hasError = false;

    setMessage("");

    if (!projectName.trim()) {
      newErrors.projectName =
        "Project name is required";
      hasError = true;
    } else if (
      projectName.trim().length < 12
    ) {
      newErrors.projectName =
        "Project name must be at least 12 characters";
      hasError = true;
    }

    if (!clientName.trim()) {
      newErrors.clientName =
        "Client name is required";
      hasError = true;
    } else if (
      clientName.trim().length < 12
    ) {
      newErrors.clientName =
        "Client name must be at least 12 characters";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    if (editingId) {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === editingId
            ? {
                ...project,
                name: projectName,
                client: clientName,
              }
            : project
        )
      );

      setMessage(
        "Project updated successfully."
      );
    } else {
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

      setMessage(
        "Project added successfully."
      );
    }

    resetForm();
  };

  const handleEditProject = (
    id: string
  ) => {
    const project = projects.find(
      (p) => p.id === id
    );

    if (!project) return;

    setMessage("");

    setEditingId(project.id);
    setProjectName(project.name);
    setClientName(project.client);
  };

  const handleToggleStatus = (
    id: string
  ) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? {
              ...project,
              status:
                project.status ===
                "Active"
                  ? "Completed"
                  : "Active",
            }
          : project
      )
    );

    setMessage(
      "Project status updated."
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

    setMessage(
      "Project deleted successfully."
    );

    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <main className="p-4 md:p-8">
      <h1 className="mb-8 text-3xl font-bold md:text-4xl">
        Projects
      </h1>

      {message && (
        <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-800">
          {message}
        </div>
      )}

      <div className="mb-8 rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">
          {editingId
            ? "Edit Project"
            : "Add Project"}
        </h2>

        <div className="space-y-4">
          <div>
            <Input
              value={projectName}
              onChange={setProjectName}
              placeholder="Project Name"
            />

            {errors.projectName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.projectName}
              </p>
            )}
          </div>

          <div>
            <Input
              value={clientName}
              onChange={setClientName}
              placeholder="Client Name"
            />

            {errors.clientName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.clientName}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleSaveProject}
            >
              {editingId
                ? "Update Project"
                : "Add Project"}
            </Button>

            {editingId && (
              <Button
                variant="secondary"
                onClick={() => {
                  resetForm();
                  setMessage(
                    "Edit cancelled."
                  );
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[800px]">
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
                  <span
                    className={
                      project.status ===
                      "Completed"
                        ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                        : "rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
                    }
                  >
                    {project.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        handleEditProject(
                          project.id
                        )
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() =>
                        handleToggleStatus(
                          project.id
                        )
                      }
                    >
                      Toggle Status
                    </Button>

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