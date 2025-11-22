import { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

function authHeader() {
  const token = localStorage.getItem("wqam_token");
  return token ? { Authorization: "Bearer " + token } : {};
}

export default function AdminDashboard({ navigate }) {
  const [pending, setPending] = useState([]);
  const [msg, setMsg] = useState("");

  async function loadPending() {
    setMsg("loading...");
    const res = await fetch(`${API}/admin/pending`, { headers: {...authHeader()} });
    if (res.ok) {
      setPending(await res.json());
      setMsg("");
    } else {
      setMsg("Unable to load pending (maybe auth).");
    }
  }

  useEffect(() => { loadPending(); }, []);

  async function approve(id) {
    const res = await fetch(`${API}/admin/approve/${id}`, { method: "POST", headers: {...authHeader()} });
    if (res.ok) {
      setMsg("Approved");
      loadPending();
    } else {
      setMsg("Approve failed");
    }
  }

  async function reject(id) {
    const res = await fetch(`${API}/admin/reject/${id}`, { method: "POST", headers: {...authHeader()} });
    if (res.ok) {
      setMsg("Rejected");
      loadPending();
    } else setMsg("Reject failed");
  }

  function logout() {
    localStorage.removeItem("wqam_token");
    localStorage.removeItem("wqam_role");
    navigate("/");
  }

  return (
    <div style={{ maxWidth: 1000, margin: "1rem auto", fontFamily: "system-ui" }}>
      <h2>Admin Dashboard</h2>
      <button onClick={logout}>Log out</button>
      <p>{msg}</p>
      <h3>Pending accounts</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr><th>Email</th><th>Name</th><th>Role</th><th>Org</th><th>Type</th><th>Action</th></tr>
        </thead>
        <tbody>
          {pending.length === 0 && <tr><td colSpan="6">No pending accounts</td></tr>}
          {pending.map(p => (
            <tr key={p.id}>
              <td>{p.email}</td>
              <td>{p.name}</td>
              <td>{p.role}</td>
              <td>{p.organisation}</td>
              <td>{p.industry_type || p.validator_type}</td>
              <td>
                <button onClick={() => approve(p.id)}>Approve</button>
                <button onClick={() => reject(p.id)} style={{ marginLeft: 8 }}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
