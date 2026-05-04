import { useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import Layout from "../components/Layout.jsx";
import TaskCard from "../components/TaskCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../utils/formatters.js";

const initialTask = {
  title: "",
  description: "",
  dueDate: "",
  priority: "Medium",
  status: "To Do",
  assignedTo: "",
  projectId: ""
};

const TasksPage = () => {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ projectId: "", status: "" });
  const [form, setForm] = useState(initialTask);
  const [editingTaskId, setEditingTaskId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const memberUsers = useMemo(() => users.filter((user) => user.role === "Member" || user.role === "Admin"), [users]);

  const loadTasks = async () => {
    const params = {};
    if (filters.projectId) {
      params.projectId = filters.projectId;
    }
    if (filters.status) {
      params.status = filters.status;
    }
    const response = await api.get("/tasks", { params });
    setTasks(response.data);
  };

  const loadBaseData = async () => {
    const [projectsResponse, usersResponse] = await Promise.all([api.get("/projects"), api.get("/users")]);
    setProjects(projectsResponse.data);
    setUsers(usersResponse.data);
  };

  useEffect(() => {
    loadBaseData().catch((err) => setError(getErrorMessage(err)));
  }, []);

  useEffect(() => {
    loadTasks().catch((err) => setError(getErrorMessage(err)));
  }, [filters.projectId, filters.status]);

  const saveTask = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title || !form.description || !form.dueDate || !form.assignedTo || !form.projectId) {
      setError("All task fields are required");
      return;
    }

    try {
      if (editingTaskId) {
        await api.put(`/tasks/${editingTaskId}`, form);
        setSuccess("Task updated");
      } else {
        await api.post("/tasks", form);
        setSuccess("Task created");
      }
      setForm(initialTask);
      setEditingTaskId("");
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const updateStatus = async (taskId, status) => {
    setError("");
    setSuccess("");

    try {
      await api.put(`/tasks/${taskId}`, { status });
      setSuccess("Task status updated");
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const deleteTask = async (taskId) => {
    setError("");
    setSuccess("");

    try {
      await api.delete(`/tasks/${taskId}`);
      setSuccess("Task deleted");
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const startEdit = (task) => {
    setEditingTaskId(task._id);
    setForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate?.slice(0, 10) || "",
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedTo?._id || "",
      projectId: task.projectId?._id || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingTaskId("");
    setForm(initialTask);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-950">Tasks</h1>
        <p className="text-sm text-slate-600">Plan work, assign owners, and move tasks through status.</p>
      </div>
      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {success && <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>}
      <section className="panel mb-6">
        <div className="grid gap-3 md:grid-cols-2">
          <select className="field" value={filters.projectId} onChange={(event) => setFilters({ ...filters, projectId: event.target.value })}>
            <option value="">All projects</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>
          <select className="field" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
            <option value="">All statuses</option>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>
      </section>
      {isAdmin && (
        <form className="panel mb-6 grid gap-3 lg:grid-cols-3" onSubmit={saveTask}>
          <div className="lg:col-span-3">
            <h2 className="text-lg font-semibold text-slate-950">{editingTaskId ? "Edit Task" : "Create Task"}</h2>
          </div>
          <input className="field" placeholder="Task title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          <input className="field" type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
          <select className="field" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select className="field" value={form.projectId} onChange={(event) => setForm({ ...form, projectId: event.target.value })}>
            <option value="">Assign to project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>
          <select className="field" value={form.assignedTo} onChange={(event) => setForm({ ...form, assignedTo: event.target.value })}>
            <option value="">Assign to user</option>
            {memberUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
          <select className="field" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
          <textarea
            className="field min-h-24 lg:col-span-2"
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
          <div className="flex flex-wrap gap-2 self-start">
            <button className="btn-primary">{editingTaskId ? "Save task" : "Create task"}</button>
            {editingTaskId && (
              <button type="button" className="btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tasks.length ? (
          tasks.map((task) => <TaskCard key={task._id} task={task} onStatusChange={updateStatus} onDelete={deleteTask} onEdit={startEdit} />)
        ) : (
          <p className="text-sm text-slate-500">No tasks found.</p>
        )}
      </div>
    </Layout>
  );
};

export default TasksPage;
