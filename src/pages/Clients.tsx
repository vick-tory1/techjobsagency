import { useEffect, useMemo, useState } from "react";

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

  const [message, setMessage] = useState("");

  const [editingClientId, setEditingClientId] =
    useState<string | null>(null);

  const [clientList, setClientList] = useState<Client[]>(() => {
    const savedClients =
      localStorage.getItem("flowpilot-clients");

    return savedClients
      ? JSON.parse(savedClients)
      : initialClients;
  });

  useEffect(() => {
    localStorage.setItem(
      "flowpilot-clients",
      JSON.stringify(clientList)
    );
  }, [clientList]);

  const filteredClients = useMemo(() => {
    return clientList.filter((client) =>
      client.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, clientList]);

  const resetForm = () => {
    setName("");
    setCompany("");
    setEmail("");
    setStatus("Active");
    setEditingClientId(null);
  };

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

    if (editingClientId) {
      setClientList((prev) =>
        prev.map((client) =>
          client.id === editingClientId
            ? {
                ...client,
                name,
                company,
                email,
                status: status as
                  | "Active"
                  | "Inactive",
              }
            : client
        )
      );

      setMessage(
        "Client updated successfully."
      );
    } else {
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

      setMessage(
        "Client added successfully."
      );
    }

    resetForm();
    setIsModalOpen(false);
  };

  const handleEditClient = (
    clientId: string
  ) => {
    const client = clientList.find(
      (c) => c.id === clientId
    );

    if (!client) return;

    setEditingClientId(client.id);

    setName(client.name);
    setCompany(client.company);
    setEmail(client.email);
    setStatus(client.status);

    setIsModalOpen(true);
  };

  const handleDeleteClient = (
    clientId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (!confirmed) return;

    setClientList((prev) =>
      prev.filter(
        (client) => client.id !== clientId
      )
    );

    setMessage(
      "Client deleted successfully."
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
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
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

                <th className="p-4 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
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
  <span
    className={
      client.status === "Active"
        ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
        : "rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700"
    }
  >
    {client.status}
  </span>
</td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleEditClient(
                              client.id
                            )
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() =>
                            handleDeleteClient(
                              client.id
                            )
                          }
                        >
                          Delete
                        </Button>
                      </div>
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
              {editingClientId
                ? "Edit Client"
                : "Add Client"}
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
                variant="secondary"
                onClick={() => {
                  resetForm();
                  setIsModalOpen(false);
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={handleAddClient}
              >
                {editingClientId
                  ? "Update Client"
                  : "Save Client"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}