import { LogOut, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn-secondary px-2 md:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation"
            title="Open navigation"
          >
            <Menu size={18} />
          </button>
          <div>
            <p className="text-sm font-semibold text-slate-900">Team Task Manager</p>
            <p className="text-xs text-slate-500">Projects, tasks, and accountability</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/profile" className="flex items-center gap-3 rounded-md px-2 py-1 transition hover:bg-slate-100">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
            <Avatar user={user} size="sm" />
          </Link>
          <button className="btn-secondary px-3" onClick={logout} title="Log out" aria-label="Log out">
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
