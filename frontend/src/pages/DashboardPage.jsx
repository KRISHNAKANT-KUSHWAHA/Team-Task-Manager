import { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import StatusChart from "../components/StatusChart.jsx";
import api from "../api/axios.js";
import { formatDate, getErrorMessage } from "../utils/formatters.js";

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard")
      .then((response) => setDashboard(response.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  const statuses = dashboard?.tasksByStatus || {};

  return (
    <Layout>
      <div className="mb-6 rounded-xl bg-slate-950 px-5 py-6 text-white shadow-sm">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-slate-300">Current task load, ownership, and overdue work.</p>
      </div>
      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="grid gap-4 md:grid-cols-4">
        <section className="panel border-l-4 border-l-slate-900">
          <p className="text-sm text-slate-500">Total tasks</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{dashboard?.totalTasks ?? 0}</p>
        </section>
        {["To Do", "In Progress", "Done"].map((status) => (
          <section key={status} className="panel">
            <p className="text-sm text-slate-500">{status}</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{statuses[status] || 0}</p>
          </section>
        ))}
      </div>
      <div className="mt-6">
        <StatusChart statuses={statuses} total={dashboard?.totalTasks || 0} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="panel">
          <h2 className="text-lg font-semibold text-slate-950">Tasks Per User</h2>
          <div className="mt-4 space-y-3">
            {dashboard?.tasksPerUser?.length ? (
              dashboard.tasksPerUser.map((item) => (
                <div key={item.userId} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.email}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-950">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No assigned tasks yet.</p>
            )}
          </div>
        </section>
        <section className="panel">
          <h2 className="text-lg font-semibold text-slate-950">Overdue Tasks</h2>
          <div className="mt-4 space-y-3">
            {dashboard?.overdueTasks?.length ? (
              dashboard.overdueTasks.map((task) => (
                <div key={task._id} className="rounded-md border border-red-100 bg-red-50 px-3 py-2">
                  <p className="text-sm font-semibold text-red-900">{task.title}</p>
                  <p className="text-xs text-red-700">
                    {task.assignedTo?.name} - Due {formatDate(task.dueDate)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No overdue tasks.</p>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default DashboardPage;
