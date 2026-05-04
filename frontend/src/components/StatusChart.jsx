const chartItems = [
  { label: "To Do", key: "To Do", color: "#64748b", bar: "bg-slate-500" },
  { label: "In Progress", key: "In Progress", color: "#4f46e5", bar: "bg-indigo-600" },
  { label: "Done", key: "Done", color: "#059669", bar: "bg-emerald-600" }
];

const StatusChart = ({ statuses = {}, total = 0 }) => {
  const safeTotal = total || 0;
  const done = statuses.Done || 0;
  const inProgress = statuses["In Progress"] || 0;
  const doneAngle = safeTotal ? (done / safeTotal) * 360 : 0;
  const progressAngle = safeTotal ? ((done + inProgress) / safeTotal) * 360 : 0;

  return (
    <section className="panel">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex flex-1 justify-center">
          <div
            className="relative grid h-48 w-48 place-items-center rounded-full shadow-inner"
            style={{
              background: safeTotal
                ? `conic-gradient(#059669 0deg ${doneAngle}deg, #4f46e5 ${doneAngle}deg ${progressAngle}deg, #64748b ${progressAngle}deg 360deg)`
                : "#e2e8f0"
            }}
          >
            <div className="grid h-32 w-32 place-items-center rounded-full bg-white text-center shadow-sm">
              <div>
                <p className="text-3xl font-bold text-slate-950">{safeTotal}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tasks</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-[1.4] space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Task Status Chart</h2>
            <p className="text-sm text-slate-600">Total, pending, active, and completed task distribution.</p>
          </div>
          {chartItems.map((item) => {
            const value = statuses[item.key] || 0;
            const percent = safeTotal ? Math.round((value / safeTotal) * 100) : 0;

            return (
              <div key={item.key}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </span>
                  <span className="font-semibold text-slate-950">
                    {value} - {percent}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${item.bar}`} style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatusChart;
