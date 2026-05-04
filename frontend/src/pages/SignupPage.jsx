import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../utils/formatters.js";
import AuthShell from "./AuthShell.jsx";

const SignupPage = () => {
  const navigate = useNavigate();
  const { user, signup, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Member" });
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.role) {
      setError("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <AuthShell title="Create account" subtitle="Choose Admin or Member access for this workspace.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input className="field mt-1" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input className="field mt-1" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input className="field mt-1" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Role
          <select className="field mt-1" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option>Member</option>
            <option>Admin</option>
          </select>
        </label>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Creating..." : "Signup"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600">
        Already registered?{" "}
        <Link className="font-semibold text-emerald-700" to="/login">
          Login
        </Link>
      </p>
    </AuthShell>
  );
};

export default SignupPage;
