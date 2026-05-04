import { Calendar, Pencil, Trash2 } from "lucide-react";
import { formatDate, priorityClasses, statusClasses } from "../utils/formatters.js";
import { useAuth } from "../context/AuthContext.jsx";

const TaskCard = ({ task, onStatusChange, onDelete, onEdit }) => {
  const { isAdmin } = useAuth();

  return (
    <article className="panel space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-950">{task.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{task.description}</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button className="btn-secondary px-2" onClick={() => onEdit(task)} title="Edit task" aria-label="Edit task">
              <Pencil size={16} />
            </button>
            <button className="btn-danger px-2" onClick={() => onDelete(task._id)} title="Delete task" aria-label="Delete task">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 text-xs font-medium">
        <span className={`rounded-full px-2.5 py-1 ${statusClasses[task.status]}`}>{task.status}</span>
        <span className={`rounded-full border px-2.5 py-1 ${priorityClasses[task.priority]}`}>{task.priority}</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={16} />
          {formatDate(task.dueDate)}
        </span>
        <span>{task.assignedTo?.name || "Unassigned"}</span>
      </div>
      <select className="field" value={task.status} onChange={(event) => onStatusChange(task._id, event.target.value)}>
        <option>To Do</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>
    </article>
  );
};

export default TaskCard;
