import { useState } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function UserRegister({ navigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [industryType, setIndustryType] = useState("Industry");
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("Registering...");
    try {
      // FIX: Added opening backtick for template literal
      const res = await fetch(${API}/register?role=user, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, organisation, industry_type: industryType }),
      });
      const json = await res.json();
      if (res.ok) {
        setMsg("Registered — pending admin approval. Check email.");
        // option: auto switch to login after few seconds
      } else {
        setMsg("Error: " + (json.detail || JSON.stringify(json)));
      }
    } catch (err) {
      setMsg("Network error: " + err.message);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h3>User Register</h3>
      <label>Name</label><br />
      <input value={name} onChange={e => setName(e.target.value)} required />
      <br />
      <label>Email</label><br />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <br />
      <label>Password</label><br />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <br />
      <label>Organisation</label><br />
      <input value={organisation} onChange={e => setOrganisation(e.target.value)} />
      <br />
      <label>Industry Type</label><br />
      <select value={industryType} onChange={e => setIndustryType(e.target.value)}>
        <option>Industry</option>
        <option>STP</option>
        <option>WTP</option>
        <option>Custom</option>
      </select>
      <br /><br />
      <button type="submit">Register</button>
      <button type="button" onClick={() => navigate("/auth")} style={{ marginLeft: 8 }}>Back</button>
      <p>{msg}</p>
    </form>
  );
}
