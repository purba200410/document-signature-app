import { useEffect, useState } from "react";
import API from "../../services/api";
import StatCard from "../../components/dashboard/StatCard";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    completedDocuments: 0,
    pendingDocuments: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await API.get(
        "/docs/dashboard/stats"
      );

      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          title="Documents"
          value={String(
            stats.totalDocuments
          )}
        />

        <StatCard
          title="Signed"
          value={String(
            stats.completedDocuments
          )}
        />

        <StatCard
          title="Pending"
          value={String(
            stats.pendingDocuments
          )}
        />
      </div>
    </div>
  );
}