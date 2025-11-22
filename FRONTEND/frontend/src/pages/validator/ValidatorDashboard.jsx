import { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ValidatorDashboard({ navigate }) {
  const [me, setMe] = useState(null);
  async function loadMe() {
    const token = localStorage.getItem("wqam_token");
    if (!token) { navigate("/auth"); return; }
    const res = await fetch(`${API}/me`, { headers: { Authorization: "Bearer " + token } });
    if (res.ok) setMe(await res.json());
    else navigate("/auth");
  }
  useEffect(() => { loadMe(); }, []);
  if (!me) return <div>Loading...</div>;

  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <h2>Validator Dashboard</h2>
      <p>Welcome, {me.email}</p>
      <p>Validator features: validation queue, reports, etc (to build)</p>
      <button onClick={() => { localStorage.removeItem("wqam_token"); navigate("/auth"); }}>Logout</button>
    </div>
  );
}
