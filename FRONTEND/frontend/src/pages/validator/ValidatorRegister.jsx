import { useState } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ValidatorRegister({ navigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [validatorType, setValidatorType] = useState("Govt");
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("Registering validator...");
    try {
      // FIX: Added opening backtick for template literal
      const res = await fetch(${API}/register?role=validator, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, organisation, validator_type: validatorType }),
      });
      const json = await res.json();
      if (res.ok) {
        setMsg("Registered — pending admin approval. Check email.");
      } else {
        setMsg("Error: " + (json.detail || JSON.stringify(json)));
      }
    } catch (err) {
      setMsg("Network error: " + err.message);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h3>Validator Register</h3>
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
      <label>Validator Type</label><br />
      <select value={validatorType} onChange={e => setValidatorType(e.target.value)}>
        <option>Govt</option>
        <option>Private</option>
        <option>AI-enabled</option>
      </select>
      <br /><br />
      <button type="submit">Register</button>
      <button type="button" onClick={() => navigate("/auth")} style={{ marginLeft: 8 }}>Back</button>
      <p>{msg}</p>
    </form>
  );
}
