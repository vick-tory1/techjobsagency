import { useState } from "react";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useRegisteredUsers } from "../hooks/useAuth";
import { useStoredList } from "../hooks/useStoredList";
import type { TeamMember } from "../types/workspace";

export default function Team() {
  const [members, setMembers] = useStoredList<TeamMember>("flowpilot-team", []);
  const registeredUsers = useRegisteredUsers();
  const registeredRecruiters: TeamMember[] = registeredUsers
    .filter((user) => user.role === "employer")
    .map((user) => ({
      id: `registered-${user.id}`,
      name: user.name,
      role: user.company ? `${user.company} Hiring Contact` : "Registered Hiring Contact",
      capacity: 70,
    }));
  const visibleMembers = [
    ...registeredRecruiters,
    ...members.filter(
      (member) =>
        !registeredRecruiters.some((registeredMember) => registeredMember.name.toLowerCase() === member.name.toLowerCase())
    ),
  ];

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [capacity, setCapacity] = useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [errors, setErrors] =
    useState({
      name: "",
      role: "",
    });

  const resetForm = () => {
    setName("");
    setRole("");
    setCapacity("");
    setEditingId(null);

    setErrors({
      name: "",
      role: "",
    });
  };

  const handleSaveMember = () => {
    const newErrors = {
      name: "",
      role: "",
    };

    let hasError = false;

    if (!name.trim()) {
      newErrors.name =
        "Member name is required";
      hasError = true;
    } else if (name.trim().length < 12) {
      newErrors.name =
        "Member name must be at least 12 characters";
      hasError = true;
    }

    if (!role.trim()) {
      newErrors.role =
        "Role is required";
      hasError = true;
    } else if (role.trim().length < 12) {
      newErrors.role =
        "Role must be at least 12 characters";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    if (editingId) {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === editingId
            ? {
              ...member,
              name,
              role,
              capacity: Number(capacity) || member.capacity || 70,
              }
            : member
        )
      );

      setMessage(
        "Team member updated successfully."
      );
    } else {
      const newMember: TeamMember = {
        id: crypto.randomUUID(),
        name,
        role,
        capacity: Number(capacity) || 70,
      };

      setMembers((prev) => [
        newMember,
        ...prev,
      ]);

      setMessage(
        "Team member added successfully."
      );
    }

    resetForm();
  };

  const handleEditMember = (
    id: string
  ) => {
    const member = members.find(
      (m) => m.id === id
    );

    if (!member) return;

    setEditingId(member.id);
    setName(member.name);
    setRole(member.role);
    setCapacity(String(member.capacity));
  };

  const handleDeleteMember = (
    id: string
  ) => {
    const confirmed = window.confirm(
      "Delete this team member?"
    );

    if (!confirmed) return;

    setMembers((prev) =>
      prev.filter(
        (member) => member.id !== id
      )
    );

    setMessage(
      "Team member removed successfully."
    );

    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-950 md:text-4xl">Recruiters</h1>
        <p className="mt-2 text-gray-500">Registered employer contacts appear here automatically. Manual recruiter records remain available for internal hiring operations.</p>
      </div>

      {message && (
        <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-800">
          {message}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          {editingId
            ? "Edit Recruiter"
            : "Add Recruiter"}
        </h2>

        <div className="space-y-4">
          <div>
            <Input
              value={name}
              onChange={setName}
              placeholder="Recruiter name"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-black-600">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <Input
              value={role}
              onChange={setRole}
              placeholder="Role"
            />

            {errors.role && (
              <p className="mt-1 text-sm text-black-600">
                {errors.role}
              </p>
            )}
          </div>

          <div>
            <Input
              value={capacity}
              onChange={setCapacity}
              placeholder="Capacity percentage"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleSaveMember}
            >
              {editingId
                ? "Update Recruiter"
                : "Add Recruiter"}
            </Button>

            {editingId && (
              <Button
                variant="secondary"
                onClick={resetForm}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4 text-left">
                Recruiter
              </th>

              <th className="p-4 text-left">
                Role
              </th>

              <th className="p-4 text-left">
                Capacity
              </th>

              <th className="p-4 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleMembers.map((member) => (
              <tr
                key={member.id}
                className="border-b"
              >
                <td className="p-4">
                  {member.name}
                </td>

                <td className="p-4">
                  {member.role}
                </td>

                <td className="p-4">
                  {member.capacity}%
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {member.id.startsWith("registered-") ? (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">Registered</span>
                    ) : (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleEditMember(
                              member.id
                            )
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() =>
                            handleDeleteMember(
                              member.id
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
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
