export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            Dashboard
          </h2>

          <p className="text-sm text-slate-500">
            Manage clients, projects, tasks, and team members
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right">
            <p className="font-medium">
              Admin
            </p>

            <p className="text-sm text-slate-500">
              Dashboard Owner
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
            A
          </div>
        </div>
      </div>
    </header>
  );
}