import { useEffect, useState } from "react";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

type Task = {
  id: string;
  title: string;
  assignee: string;
  status: "Pending" | "Completed";
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks =
      localStorage.getItem("flowpilot-tasks");

    return savedTasks
      ? JSON.parse(savedTasks)
      : [
          {
            id: crypto.randomUUID(),
            title: "Design Homepage",
            assignee: "Sarah",
            status: "Pending",
          },
        ];
  });

  const [taskTitle, setTaskTitle] =
    useState("");

  const [assignee, setAssignee] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [errors, setErrors] = useState({
    taskTitle: "",
    assignee: "",
  });

  useEffect(() => {
    localStorage.setItem(
      "flowpilot-tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  const handleAddTask = () => {
    const newErrors = {
      taskTitle: "",
      assignee: "",
    };

    let hasError = false;

    if (!taskTitle.trim()) {
      newErrors.taskTitle =
        "Task title is required";
      hasError = true;
    }

    if (!assignee.trim()) {
      newErrors.assignee =
        "Assignee is required";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskTitle,
      assignee,
      status: "Pending",
    };

    setTasks((prev) => [
      newTask,
      ...prev,
    ]);

    setTaskTitle("");
    setAssignee("");

    setErrors({
      taskTitle: "",
      assignee: "",
    });

    setMessage(
      "Task added successfully."
    );
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
                task.status === "Pending"
                  ? "Completed"
                  : "Pending",
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
  };

  return (
    <main className="p-4 md:p-8">
      <h1 className="mb-8 text-3xl font-bold md:text-4xl">
        Tasks
      </h1>

      {message && (
        <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-800">
          {message}
        </div>
      )}

      <div className="mb-8 rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Add Task
        </h2>

        <div className="space-y-4">
          <div>
            <Input
              value={taskTitle}
              onChange={setTaskTitle}
              placeholder="Task Title"
            />

            {errors.taskTitle && (
              <p className="mt-1 text-sm text-red-600">
                {errors.taskTitle}
              </p>
            )}
          </div>

          <div>
            <Input
              value={assignee}
              onChange={setAssignee}
              placeholder="Assigned To"
            />

            {errors.assignee && (
              <p className="mt-1 text-sm text-red-600">
                {errors.assignee}
              </p>
            )}
          </div>

          <Button
            onClick={handleAddTask}
          >
            Add Task
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="p-4 text-left">
                Task
              </th>

              <th className="p-4 text-left">
                Assignee
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
                        : "rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700"
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