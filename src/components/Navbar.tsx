export default function Navbar() {
  return (
    <header className="bg-white border-b">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-2xl font-bold">
          Dashboard
        </h2>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-300" />
        </div>
      </div>
    </header>
  );
}