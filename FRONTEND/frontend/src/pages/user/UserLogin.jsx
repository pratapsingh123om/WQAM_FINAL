import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function UserLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("Logging in...");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "user" }),
      });
      const json = await res.json();

      if (res.status === 401) {
          setMsg("Login failed: Invalid email or password.");
      } else if (res.ok) {
        localStorage.setItem("wqam_token", json.access_token);
        localStorage.setItem("wqam_role", json.role);
        setMsg("Login successful. Redirecting...");
        navigate("/user/dashboard");
      } else {
        const detail = json.detail || res.statusText;
        setMsg("Login failed: " + (detail.includes("Invalid email or password") ? "Invalid email or password." : detail));
      }
    } catch (err) {
      setMsg("Network error: Could not reach the server.");
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h3>User Login</h3>
      <label>Email</label><br />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <br />
      <label>Password</label><br />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <br /><br />
      <button type="submit">Login</button>
      <button type="button" onClick={() => navigate("/auth")} style={{ marginLeft: 8 }}>Back</button>
      <p>{msg}</p>
    </form>
  );
}