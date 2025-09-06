import { useEffect, useState } from "react";
import { getMe } from "../../api/users";  // ✅ now works
import useAuthStore from "../../store/useAuthStore";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMe();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard 🚀</h1>
      {profile ? (
        <p className="text-zinc-400">Hello, {profile.name || profile.email}</p>
      ) : (
        <p className="text-zinc-400">Loading profile...</p>
      )}
    </div>
  );
};

export default Dashboard;
