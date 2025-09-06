import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LogOut, Home, Wallet, BookOpen, Star, User } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

const DashboardLayout = () => {
  const { logout, user } = useAuthStore();

  return (
    <div className="flex w-screen h-screen bg-[#0E100F] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141515] border-r border-zinc-700 flex flex-col">
        <div className="py-2 pl-1 text-2xl font-bold text-blue-400 flex justify-center items-start ">
          <img src="" alt="" />
          <NavLink to='/'>
            <div className="flex items-center space-x-3">
              <div>
                <img src="/Logo.svg" alt="Money Quest Logo" className="w-10 h-10" />
              </div>
              <span className="text-xl font-extrabold font-mono text-zinc-100">Money Quest</span>
            </div>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 px-4 mt-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-600/20 ${isActive ? "bg-blue-600/30 text-blue-400" : "text-zinc-300"
              }`
            }
          >
            <Home size={18} /> Dashboard
          </NavLink>

          <NavLink
            to="/dashboard/budget"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-600/20 ${isActive ? "bg-blue-600/30 text-blue-400" : "text-zinc-300"
              }`
            }
          >
            <Wallet size={18} /> Budget
          </NavLink>

          <NavLink
            to="/dashboard/bits"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-600/20 ${isActive ? "bg-blue-600/30 text-blue-400" : "text-zinc-300"
              }`
            }
          >
            <BookOpen size={18} /> Bits
          </NavLink>

          <NavLink
            to="/dashboard/features"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-600/20 ${isActive ? "bg-blue-600/30 text-blue-400" : "text-zinc-300"
              }`
            }
          >
            <Star size={18} /> Features
          </NavLink>

          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-600/20 ${isActive ? "bg-blue-600/30 text-blue-400" : "text-zinc-300"
              }`
            }
          >
            <User size={18} /> Profile
          </NavLink>
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 mt-auto mb-6 text-red-400 hover:bg-red-500/20 rounded-lg"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="h-14 border-b border-zinc-700 flex items-center justify-between px-6 bg-[#141515]">
          <h1 className="text-lg font-semibold">Welcome, {user?.name || "User"} 👋</h1>
          <span className="text-sm text-gray-400">{user?.email}</span>
        </header>

        {/* Page Content */}
        <section className="flex-1 overflow-y-auto p-6">
          <Outlet /> {/* Renders the child route */}
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
