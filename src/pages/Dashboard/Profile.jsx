import { useEffect, useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import { updateUser, deleteUser } from "../../api/users";

const Profile = () => {
  const { user, fetchMe, token, logout } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  // Load user info into form
  useEffect(() => {
    if (token && !user) {
      fetchMe();
    }
    if (user) {
      setFormData({ name: user.name || "", email: user.email || "", password: "" });
    }
  }, [user, token, fetchMe]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateUser(user._id, formData);
      setMessage("Profile updated ✅");
      fetchMe(); // Refresh profile after update
    } catch (err) {
      setMessage("Failed to update ❌");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is permanent.")) {
      try {
        await deleteUser(user._id);
        logout();
        setMessage("Account deleted ❌");
      } catch (err) {
        setMessage("Failed to delete account");
      }
    }
  };

  if (!user) return <p className="text-zinc-400">Loading profile...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Profile 👤</h1>

      {message && <p className="mb-4 text-green-400">{message}</p>}

      <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm text-gray-300">Name</label>
          <input
            type="text"
            name="name"
            className="w-full p-2 rounded bg-[#141515] border border-zinc-700 text-white"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            className="w-full p-2 rounded bg-[#141515] border border-zinc-700 text-white"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300">Password (new)</label>
          <input
            type="password"
            name="password"
            className="w-full p-2 rounded bg-[#141515] border border-zinc-700 text-white"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-500"
        >
          Update Profile
        </button>
      </form>

      <button
        onClick={handleDelete}
        className="mt-6 px-4 py-2 bg-red-600 rounded text-white hover:bg-red-500"
      >
        Delete Account
      </button>
    </div>
  );
};

export default Profile;
