import { useEffect, useState } from "react";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

type TeamMember = {
  id: string;
  name: string;
  role: string;
};

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>(() => {
    const savedMembers =
      localStorage.getItem("flowpilot-team");

    return savedMembers
      ? JSON.parse(savedMembers)
      : [
          {
            id: crypto.randomUUID(),
            name: "Sarah Johnson",
            role: "UI/UX Designer",
          },
          {
            id: crypto.randomUUID(),
            name: "Michael Smith",
            role: "Frontend Developer",
          },
        ];
  });

  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const [message, setMessage] =
    useState("");

  const [errors, setErrors] =
    useState({
      name: "",
      role: "",
    });

  useEffect(() => {
    localStorage.setItem(
      "flowpilot-team",
      JSON.stringify(members)
    );
  }, [members]);

  const handleAddMember = () => {
    const newErrors = {
      name: "",
      role: "",
    };

    let hasError = false;

    if (!name.trim()) {
      newErrors.name =
        "Member name is required";
      hasError = true;
    }

    if (!role.trim()) {
      newErrors.role =
        "Role is required";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name,
      role,
    };

    setMembers((prev) => [
      newMember,
      ...prev,
    ]);

    setName("");
    setRole("");

    setErrors({
      name: "",
      role: "",
    });

    setMessage(
      "Team member added successfully."
    );
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
  };

  return (
    <main className="p-4 md:p-8">
      <h1 className="mb-8 text-3xl font-bold md:text-4xl">
        Team
      </h1>

      {message && (
        <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-800">
          {message}
        </div>
      )}

      <div className="mb-8 rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Add Team Member
        </h2>

        <div className="space-y-4">
          <div>
            <Input
              value={name}
              onChange={setName}
              placeholder="Member Name"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
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
              <p className="mt-1 text-sm text-red-600">
                {errors.role}
              </p>
            )}
          </div>

          <Button
            onClick={handleAddMember}
          >
            Add Member
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Role
              </th>

              <th className="p-4 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}