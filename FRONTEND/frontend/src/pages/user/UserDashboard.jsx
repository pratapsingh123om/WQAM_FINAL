import { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function UserDashboard({ navigate }) {
  const [me, setMe] = useState(null);

  async function loadMe() {
    const token = localStorage.getItem("wqam_token");
    if (!token) {
      navigate("/auth");
      return;
    }
    const res = await fetch(`${API}/me`, { headers: { Authorization: "Bearer " + token } });
    if (res.ok) setMe(await res.json());
    else navigate("/auth");
  }

  useEffect(() => { loadMe(); }, []);

  function logout() {
    localStorage.removeItem("wqam_token");
    localStorage.removeItem("wqam_role");
    navigate("/");
  }

  if (!me) return <div>Loading...</div>;

  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <h2>User Dashboard</h2>
      <p>Welcome, {me.email} (role: {me.role})</p>
      <p>Status: {me.status}</p>
      <p>Choose features: upload CSV, view timeseries, get alerts — (next steps to add)</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
