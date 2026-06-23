import Card from "../components/ui/Card";

export default function Dashboard() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to FlowPilot
      </h1>

      <section
        className="
          grid
          gap-6
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        <Card
          title="Revenue"
          value="$12,400"
        />

        <Card
          title="Clients"
          value="24"
        />

        <Card
          title="Projects"
          value="12"
        />

        <Card
          title="Tasks"
          value="86"
        />
      </section>
    </main>
  );
}