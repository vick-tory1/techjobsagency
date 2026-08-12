import { useEffect, useMemo, useState } from "react";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import { useRegisteredUsers } from "../hooks/useAuth";
import { useStoredList } from "../hooks/useStoredList";
import type { Client } from "../types/client";

export default function Clients() {
  const registeredUsers = useRegisteredUsers();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Active");

  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    company: "",
    email: "",
  });

  const [editingClientId, setEditingClientId] =
    useState<string | null>(null);

  const [clientList, setClientList] = useStoredList<Client>("flowpilot-clients", []);
  const registeredEmployers: Client[] = registeredUsers
    .filter((user) => user.role === "employer")
    .map((user) => ({
      id: `registered-${user.id}`,
      name: user.name,
      company: user.company || "Registered Employer",
      email: user.email,
      status: "Active",
    }));
  const visibleClients = [
    ...registeredEmployers,
    ...clientList.filter(
      (client) =>
        !registeredEmployers.some(
          (registeredEmployer) => registeredEmployer.email.toLowerCase() === client.email.toLowerCase()
        )
    ),
  ];

  useEffect(() => {
  if (!message) return;

  const timer = setTimeout(() => {
    setMessage("");
  }, 3000);

  return () => clearTimeout(timer);
}, [message]);

useEffect(() => {
  const handleEscape = (
    e: KeyboardEvent
  ) => {
    if (e.key === "Escape") {
      resetForm();
      setIsModalOpen(false);
    }
  };

  window.addEventListener(
    "keydown",
    handleEscape
  );

  return () => {
    window.removeEventListener(
      "keydown",
      handleEscape
    );
  };
}, []);

useEffect(() => {
  if (!name) {
    setErrors((prev) => ({
      ...prev,
      name: "",
    }));
    return;
  }

  setErrors((prev) => ({
    ...prev,
    name:
      name.trim().length < 12
        ? "Client name must be at least 12 characters"
        : "",
  }));
}, [name]);

useEffect(() => {
  if (!company) {
    setErrors((prev) => ({
      ...prev,
      company: "",
    }));
    return;
  }

  setErrors((prev) => ({
    ...prev,
    company:
      company.trim().length < 12
        ? "Company name must be at least 12 characters"
        : "",
  }));
}, [company]);

  const filteredClients = useMemo(() => {
    const normalizedSearch = search.toLowerCase();
    return visibleClients.filter((client) =>
      [client.name, client.company, client.email].join(" ").toLowerCase().includes(normalizedSearch)
    );
  }, [search, visibleClients]);

  const resetForm = () => {
    setName("");
    setCompany("");
    setEmail("");
    setStatus("Active");
    setEditingClientId(null);

    setErrors({
      name: "",
      company: "",
      email: "",
    });
  };

  const handleAddClient = () => {
    const newErrors = {
      name: "",
      company: "",
      email: "",
    };

    let hasError = false;

    if (!name.trim()) {
      newErrors.name =
        "Client name is required";
      hasError = true;
    } else if (name.trim().length < 12) {
      newErrors.name =
        "Client name must be at least 12 characters";
      hasError = true;
    }

    if (!company.trim()) {
      newErrors.company =
        "Company name is required";
      hasError = true;
    } else if (company.trim().length < 12) {
      newErrors.company =
        "Company name must be at least 12 characters";
      hasError = true;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email =
        "Email address is required";
      hasError = true;
    } else if (!emailRegex.test(email)) {
      newErrors.email =
        "Please enter a valid email address";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

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
        <main className="space-y-6">
        {message && (
          <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-800">
            {message}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-950 md:text-4xl">Employers</h1>
            <p className="mt-2 text-gray-500">Registered employer accounts appear here automatically. Manual employer records stay available for direct outreach and account management.</p>
          </div>

          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            Add Employer
          </Button>
        </div>

        <div className="max-w-md">
          <Input
            value={search}
            onChange={setSearch}
            placeholder="Search clients..."
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-4 text-left">
                  Contact
                </th>

                <th className="p-4 text-left">
                  Employer
                </th>

                <th className="p-4 text-left">
                  Hiring Email
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
                    className="p-8 text-center text-gray-500"
                  >
                    No employers found.
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
                          client.status ===
                          "Active"
                            ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                            : "rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                        }
                      >
                        {client.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {client.id.startsWith("registered-") ? (
                          <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">Registered</span>
                        ) : (
                          <>
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
                          </>
                        )}
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
                ? "Edit Employer"
                : "Add Employer"}
            </h2>

            <div className="mb-6 space-y-4">
              <div>
                <Input
                  value={name}
                  onChange={setName}
                  placeholder="Hiring contact"
                />

                {errors.name && (
                  <p className="mt-1 text-sm text-black-600">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <Input
                  value={company}
                  onChange={setCompany}
                  placeholder="Employer company"
                />

                {errors.company && (
                  <p className="mt-1 text-sm text-black-600">
                    {errors.company}
                  </p>
                )}
              </div>

              <div>
                <Input
                  value={email}
                  onChange={setEmail}
                  placeholder="Email Address"
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-black-600">
                    {errors.email}
                  </p>
                )}
              </div>

              <Select
                value={status}
                onChange={setStatus}
              />
            </div>

            <div className="flex flex-wrap justify-end gap-3">
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
                  ? "Update Employer"
                  : "Save Employer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
