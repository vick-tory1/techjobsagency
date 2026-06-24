import { useMemo } from "react";
import Card from "../components/ui/Card";
import { clients as initialClients } from "../data/clients";
import type { Client } from "../types/client";

export default function Dashboard() {
  const clientList: Client[] = useMemo(() => {
    const savedClients =
      localStorage.getItem("flowpilot-clients");

    return savedClients
      ? JSON.parse(savedClients)
      : initialClients;
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

  const activeRate =
    totalClients === 0
      ? "0%"
      : `${Math.round(
          (activeClients / totalClients) * 100
        )}%`;

  return (
    <main className="p-8">
      <h1 className="mb-8 text-4xl font-bold">
        Welcome to FlowPilot
      </h1>

      <section
        className="
          grid
          gap-6
          grid-cols-1
          md:grid-cols-2
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
          title="Active Rate"
          value={activeRate}
        />
      </section>
    </main>
  );
}