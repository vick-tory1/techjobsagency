import { useMemo, useState } from "react";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import { clients as initialClients } from "../data/clients";
import type { Client } from "../types/client";

export default function Clients() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Active");

  const [clientList, setClientList] =
    useState<Client[]>(initialClients);

  const [message, setMessage] =
    useState("");

  const filteredClients = useMemo(() => {
    return clientList.filter((client) =>
      client.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, clientList]);

  const handleAddClient = () => {
    if (
      !name.trim() ||
      !company.trim() ||
      !email.trim()
    ) {
      setMessage(
        "Please complete all fields."
      );
      return;
    }

    const newClient: Client = {
      id: crypto.randomUUID(),
      name,
      company,
      email,
      status: status as
        | "Active"
        | "Inactive",
    };

    setClientList((prev) => [
      newClient,
      ...prev,
    ]);

    setName("");
    setCompany("");
    setEmail("");
    setStatus("Active");

    setIsModalOpen(false);

    setMessage(
      "Client added successfully."
    );
  };

  return (
    <>
      <main className="p-8">
        {message && (
          <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-800">
            {message}
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-4xl font-bold">
            Clients
          </h1>

          <Button
            onClick={() => setIsModalOpen(true)}
          >
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
                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Company
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Status
                </th>
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
                    <td className="p-4">
                      {client.name}
                    </td>

                    <td className="p-4">
                      {client.company}
                    </td>

                    <td className="p-4">
                      {client.email}
                    </td>

                    <td className="p-4">
                      {client.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold">
              Add Client
            </h2>

            <div className="mb-6 space-y-4">
              <Input
                value={name}
                onChange={setName}
                placeholder="Client Name"
              />

              <Input
                value={company}
                onChange={setCompany}
                placeholder="Company Name"
              />

              <Input
                value={email}
                onChange={setEmail}
                placeholder="Email Address"
              />

              <Select
                value={status}
                onChange={setStatus}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={() =>
                  setIsModalOpen(false)
                }
              >
                Close
              </Button>

              <Button
                onClick={handleAddClient}
              >
                Save Client
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}