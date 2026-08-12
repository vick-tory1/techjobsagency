export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-xl font-bold text-gray-950 sm:text-2xl">
            JobBoard Pro workspace
          </h2>

          <p className="text-sm text-gray-500">
            Live hiring data for employers, job posts, candidate pipelines, and recruiter capacity
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right">
            <p className="font-medium">
              Victoria
            </p>

            <p className="text-sm text-gray-500">
              Marketplace admin
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-bold text-white shadow-sm">
            V
          </div>
        </div>
      </div>
    </header>
  );
}
