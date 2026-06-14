import StatCard from "../../components/dashboard/StatCard";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          title="Documents"
          value="12"
        />

        <StatCard
          title="Signed"
          value="8"
        />

        <StatCard
          title="Pending"
          value="4"
        />
      </div>
    </div>
  );
}