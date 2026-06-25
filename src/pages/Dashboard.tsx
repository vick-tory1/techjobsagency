import { useMemo } from "react";
import Card from "../components/ui/Card";
import { clients as initialClients } from "../data/clients";
import type { Client } from "../types/client";

type Project = {
  id: string;
  name: string;
  client: string;
  status: "Active" | "Completed";
};

type Task = {
  id: string;
  title: string;
  assignee: string;
  status: "Pending" | "Completed";
};

type TeamMember = {
  id: string;
  name: string;
  role: string;
};

export default function Dashboard() {
  const clientList: Client[] = useMemo(() => {
    const savedClients =
      localStorage.getItem("flowpilot-clients");

    return savedClients
      ? JSON.parse(savedClients)
      : initialClients;
  }, []);

  const projects: Project[] = useMemo(() => {
    const savedProjects =
      localStorage.getItem(
        "flowpilot-projects"
      );

    return savedProjects
      ? JSON.parse(savedProjects)
      : [];
  }, []);

  const tasks: Task[] = useMemo(() => {
    const savedTasks =
      localStorage.getItem(
        "flowpilot-tasks"
      );

    return savedTasks
      ? JSON.parse(savedTasks)
      : [];
  }, []);

  const team: TeamMember[] = useMemo(() => {
    const savedTeam =
      localStorage.getItem(
        "flowpilot-team"
      );

    return savedTeam
      ? JSON.parse(savedTeam)
      : [];
  }, []);

  const totalClients =
    clientList.length;

  const activeClients =
    clientList.filter(
      (client) => client.status === "Active"
    ).length;

  const inactiveClients =
    clientList.filter(
      (client) => client.status === "Inactive"
    ).length;

  const totalProjects =
    projects.length;

  const activeProjects =
    projects.filter(
      (project) =>
        project.status === "Active"
    ).length;

  const totalTasks =
    tasks.length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "Completed"
    ).length;

  const pendingTasks =
    tasks.filter(
      (task) =>
        task.status === "Pending"
    ).length;

  const totalTeamMembers =
    team.length;

  return (
    <main className="p-4 md:p-8">
      <h1 className="mb-2 text-3xl font-bold md:text-4xl">
        Welcome to FlowPilot
      </h1>

      <p className="mb-8 text-slate-500">
        Agency Management Dashboard
      </p>

      <section
        className="
          grid
          gap-6
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <Card
          title="Total Clients"
          value={String(totalClients)}
        />

        <Card
          title="Active Clients"
          value={String(activeClients)}
        />

        <Card
          title="Inactive Clients"
          value={String(inactiveClients)}
        />

        <Card
          title="Projects"
          value={String(totalProjects)}
        />

        <Card
          title="Active Projects"
          value={String(activeProjects)}
        />

        <Card
          title="Tasks"
          value={String(totalTasks)}
        />

        <Card
          title="Completed Tasks"
          value={String(completedTasks)}
        />

        <Card
          title="Pending Tasks"
          value={String(pendingTasks)}
        />

        <Card
          title="Team Members"
          value={String(totalTeamMembers)}
        />
      </section>

      <section className="mt-10 rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-2xl font-semibold">
          Agency Overview
        </h2>

        <div className="space-y-3 text-slate-600">
          <p>
            • Clients managed:{" "}
            <strong>{totalClients}</strong>
          </p>

          <p>
            • Active clients:{" "}
            <strong>{activeClients}</strong>
          </p>

          <p>
            • Active projects:{" "}
            <strong>{activeProjects}</strong>
          </p>

          <p>
            • Tasks tracked:{" "}
            <strong>{totalTasks}</strong>
          </p>

          <p>
            • Pending tasks:{" "}
            <strong>{pendingTasks}</strong>
          </p>

          <p>
            • Completed tasks:{" "}
            <strong>{completedTasks}</strong>
          </p>

          <p>
            • Team members:{" "}
            <strong>{totalTeamMembers}</strong>
          </p>
        </div>
      </section>
    </main>
  );
}