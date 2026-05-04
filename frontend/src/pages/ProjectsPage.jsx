import { useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import Layout from "../components/Layout.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../utils/formatters.js";

const initialProject = { title: "", description: "", members: [] };

const ProjectsPage = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialProject);
  const [memberForm, setMemberForm] = useState({ projectId: "", userId: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const memberUsers = useMemo(() => users.filter((user) => user.role === "Member"), [users]);

  const loadData = async () => {
    const [projectsResponse, usersResponse] = await Promise.all([api.get("/projects"), api.get("/users")]);
    setProjects(projectsResponse.data);
    setUsers(usersResponse.data);
  };

  useEffect(() => {
    loadData().catch((err) => setError(getErrorMessage(err)));
  }, []);

  const createProject = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title || !form.description) {
      setError("Project title and description are required");
      return;
    }

    try {
      await api.post("/projects", form);
      setForm(initialProject);
      setSuccess("Project created");
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const updateMember = async (type) => {
    setError("");
    setSuccess("");

    if (!memberForm.projectId || !memberForm.userId) {
      setError("Choose a project and member");
      return;
    }

    try {
      if (type === "add") {
        await api.put(`/projects/${memberForm.projectId}/add-member`, { userId: memberForm.userId });
        setSuccess("Member added");
      } else {
        await api.delete(`/projects/${memberForm.projectId}/remove-member`, { data: { userId: memberForm.userId } });
        setSuccess("Member removed");
      }
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Projects</h1>
          <p className="text-sm text-slate-600">Create workspaces and control team membership.</p>
        </div>
      </div>
      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {success && <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>}
      {isAdmin && (
        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <form className="panel space-y-3" onSubmit={createProject}>
            <h2 className="text-lg font-semibold text-slate-950">Create Project</h2>
            <input className="field" placeholder="Project title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            <textarea
              className="field min-h-24"
              placeholder="Project description"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
            <select
              className="field"
              multiple
              value={form.members}
              onChange={(event) =>
                setForm({
                  ...form,
                  members: Array.from(event.target.selectedOptions, (option) => option.value)
                })
              }
            >
              {memberUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <button className="btn-primary">Create project</button>
          </form>
          <section className="panel space-y-3">
            <h2 className="text-lg font-semibold text-slate-950">Manage Members</h2>
            <select className="field" value={memberForm.projectId} onChange={(event) => setMemberForm({ ...memberForm, projectId: event.target.value })}>
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
            <select className="field" value={memberForm.userId} onChange={(event) => setMemberForm({ ...memberForm, userId: event.target.value })}>
              <option value="">Select member</option>
              {memberUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-primary" onClick={() => updateMember("add")}>
                Add member
              </button>
              <button type="button" className="btn-danger" onClick={() => updateMember("remove")}>
                Remove member
              </button>
            </div>
          </section>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.length ? projects.map((project) => <ProjectCard key={project._id} project={project} />) : <p className="text-sm text-slate-500">No projects found.</p>}
      </div>
    </Layout>
  );
};

export default ProjectsPage;
