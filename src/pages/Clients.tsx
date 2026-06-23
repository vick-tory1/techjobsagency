import { useMemo, useState } from "react";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { clients } from "../data/clients";

export default function Clients() {
  const [search, setSearch] = useState("");

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <main className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          Clients
        </h1>

        <Button>
          Add Client
        </Button>
      </div>

      <div className="mb-6 max-w-md">
        <Input
          value={search}
          onChange={setSearch}
          placeholder="Search clients..."
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-slate-500"
                >
                  No clients found.
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b"
                >
                  <td className="p-4">{client.name}</td>
                  <td className="p-4">{client.company}</td>
                  <td className="p-4">{client.email}</td>
                  <td className="p-4">{client.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}