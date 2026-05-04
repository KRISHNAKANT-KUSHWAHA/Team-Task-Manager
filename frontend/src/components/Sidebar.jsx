import { BarChart3, CheckSquare, FolderKanban, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/profile", label: "Profile", icon: UserRound }
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {open && <button className="fixed inset-0 z-30 bg-slate-950/30 md:hidden" onClick={onClose} aria-label="Close navigation" />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-950/5 backdrop-blur transition md:static md:block md:translate-x-0 md:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 px-2">
            <p className="text-lg font-bold text-slate-900">Workspace</p>
            <p className="text-xs text-slate-500">Team delivery hub</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive ? "bg-emerald-700 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
