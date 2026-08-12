import { useState } from "react";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useStoredList } from "../hooks/useStoredList";
import type { Task } from "../types/workspace";

export default function Tasks() {
  const [tasks, setTasks] = useStoredList<Task>("flowpilot-tasks", []);

  const [taskTitle, setTaskTitle] =
    useState("");

  const [assignee, setAssignee] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [errors, setErrors] = useState({
    taskTitle: "",
    assignee: "",
  });

  const resetForm = () => {
    setTaskTitle("");
    setAssignee("");
    setEditingId(null);

    setErrors({
      taskTitle: "",
      assignee: "",
    });
  };

  const handleSaveTask = () => {
    const newErrors = {
      taskTitle: "",
      assignee: "",
    };

    let hasError = false;

    if (!taskTitle.trim()) {
      newErrors.taskTitle =
        "Task title is required";
      hasError = true;
    } else if (
      taskTitle.trim().length < 12
    ) {
      newErrors.taskTitle =
        "Task title must be at least 12 characters";
      hasError = true;
    }

    if (!assignee.trim()) {
      newErrors.assignee =
        "Assignee is required";
      hasError = true;
    } else if (
      assignee.trim().length < 12
    ) {
      newErrors.assignee =
        "Assignee name must be at least 12 characters";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    if (editingId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingId
            ? {
        ...task,
        title: taskTitle,
        assignee,
        priority: task.priority ?? "Medium",
              }
            : task
        )
      );

      setMessage(
        "Task updated successfully."
      );
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: taskTitle,
        assignee,
        status: "Pending",
        priority: "Medium",
      };

      setTasks((prev) => [
        newTask,
        ...prev,
      ]);

      setMessage(
        "Task added successfully."
      );
    }

    resetForm();
  };

  const handleEditTask = (
    id: string
  ) => {
    const task = tasks.find(
      (t) => t.id === id
    );

    if (!task) return;

    setEditingId(task.id);
    setTaskTitle(task.title);
    setAssignee(task.assignee);
  };

  const handleToggleStatus = (
    id: string
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status:
                task.status === "Completed"
                  ? "Pending"
                  : "Completed",
            }
          : task
      )
    );
  };

  const handleDeleteTask = (
    id: string
  ) => {
    const confirmed = window.confirm(
      "Delete this task?"
    );

    if (!confirmed) return;

    setTasks((prev) =>
      prev.filter(
        (task) => task.id !== id
      )
    );

    setMessage(
      "Task deleted successfully."
    );

    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-950 md:text-4xl">Applications</h1>
        <p className="mt-2 text-gray-500">Track candidate screening work from profile review through interview and offer follow-up.</p>
      </div>

      {message && (
        <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-800">
          {message}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          {editingId
            ? "Edit Task"
            : "Add Application Task"}
        </h2>

        <div className="space-y-4">
          <div>
            <Input
              value={taskTitle}
              onChange={setTaskTitle}
              placeholder="Candidate workflow task"
            />

            {errors.taskTitle && (
              <p className="mt-1 text-sm text-black-600">
                {errors.taskTitle}
              </p>
            )}
          </div>

          <div>
            <Input
              value={assignee}
              onChange={setAssignee}
              placeholder="Recruiter assigned"
            />

            {errors.assignee && (
              <p className="mt-1 text-sm text-black-600">
                {errors.assignee}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleSaveTask}
            >
              {editingId
                ? "Update Task"
                : "Add Application Task"}
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
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4 text-left">
                Application Work
              </th>

              <th className="p-4 text-left">
                Recruiter
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
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="border-b"
              >
                <td className="p-4">
                  {task.title}
                </td>

                <td className="p-4">
                  {task.assignee}
                </td>

                <td className="p-4">
                  <span
                    className={
                      task.status ===
                      "Completed"
                        ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                        : "rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                    }
                  >
                    {task.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        handleEditTask(
                          task.id
                        )
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() =>
                        handleToggleStatus(
                          task.id
                        )
                      }
                    >
                      Toggle Status
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() =>
                        handleDeleteTask(
                          task.id
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
