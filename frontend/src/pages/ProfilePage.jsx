import { Camera, Mail, ShieldCheck, UserRound, X } from "lucide-react";
import Layout from "../components/Layout.jsx";
import Avatar from "../components/Avatar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const ProfilePage = () => {
  const { user, updateProfilePhoto } = useAuth();

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 1024 * 1024) {
      alert("Please choose an image smaller than 1 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateProfilePhoto(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-950">Profile</h1>
        <p className="text-sm text-slate-600">Manage your account identity and workspace role.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <section className="panel overflow-hidden p-0">
          <div className="bg-gradient-to-br from-emerald-700 via-teal-700 to-slate-900 px-6 py-8 text-white">
            <Avatar user={user} size="lg" />
            <h2 className="mt-5 text-2xl font-bold">{user?.name}</h2>
            <p className="mt-1 text-sm text-emerald-50">{user?.role}</p>
          </div>
          <div className="space-y-3 p-5">
            <label className="btn-primary w-full cursor-pointer">
              <Camera size={17} />
              Update photo
              <input className="hidden" type="file" accept="image/*" onChange={handlePhotoChange} />
            </label>
            {user?.profilePhoto && (
              <button className="btn-secondary w-full" onClick={() => updateProfilePhoto("")}>
                <X size={17} />
                Remove photo
              </button>
            )}
            {/* <p className="text-xs text-slate-500">Image is saved locally in this browser for demo use.</p> */}
          </div>
        </section>

        <section className="panel">
          <h2 className="text-lg font-semibold text-slate-950">Account Details</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-white text-emerald-700 shadow-sm">
                <UserRound size={20} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</p>
              <p className="mt-1 text-base font-semibold text-slate-950">{user?.name}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-white text-indigo-700 shadow-sm">
                <Mail size={20} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
              <p className="mt-1 break-all text-base font-semibold text-slate-950">{user?.email}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 md:col-span-2">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-white text-amber-700 shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</p>
              <p className="mt-1 text-base font-semibold text-slate-950">{user?.role}</p>
              <p className="mt-2 text-sm text-slate-600">
                {user?.role === "Admin"
                  ? "Admins can manage projects, members, and tasks across their workspace."
                  : "Members can view assigned work and update task status."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProfilePage;
