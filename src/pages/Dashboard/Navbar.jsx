// src/components/Navbar.jsx
import useAuthStore from "../../store/useAuthStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-3">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-700">{user?.name || "Guest"}</span>
        <button
          onClick={logout}
          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
