// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const links = [
    { to: "/dashboard", label: "Home" },
    { to: "/dashboard/budget", label: "Budget" },
    { to: "/dashboard/bits", label: "Bits" },
    { to: "/dashboard/features", label: "Features" },
    { to: "/dashboard/profile", label: "Profile" },
  ];

  return (
    <aside className="w-60 bg-gray-900 text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-8">💸 FinApp</h2>
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`p-2 rounded-lg transition ${
              location.pathname === link.to
                ? "bg-indigo-600 text-white"
                : "hover:bg-gray-700"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
