export default function Navbar() {
  return (
    <header className="bg-white border-b">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-2xl font-bold">
          Dashboard
        </h2>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-medium">
              Admin
            </p>

            <p className="text-sm text-slate-500">
              Dashboard Owner
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}