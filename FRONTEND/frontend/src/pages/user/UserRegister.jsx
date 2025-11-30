// FRONTEND/frontend/src/pages/user/UserRegister.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function UserRegister() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [industryType, setIndustryType] = useState("Industry");
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("Registering...");
    
    // Frontend validation
    if (!email || !password) {
      setMsg("Email and password are required");
      return;
    }
    
    if (password.length < 6) {
      setMsg("Password must be at least 6 characters");
      return;
    }
    
    if (!email.includes('@')) {
      setMsg("Please enter a valid email address");
      return;
    }

    const requestBody = { 
      name: name.trim() || null, 
      email: email.trim(), 
      password: password,
      organisation: organisation.trim() || null, 
      industry_type: industryType 
    };

    console.log("Registration request:", requestBody);

    try {
      const res = await fetch(`${API}/register?role=user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      const responseText = await res.text();
      console.log("Raw response:", responseText);
      
      let json;
      try {
        json = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        setMsg("Server returned invalid response");
        return;
      }
      
      if (res.ok) {
        setMsg("Registered ✅ - pending admin approval. Check email.");
        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        setOrganisation("");
      } else {
        // Show detailed error from backend
        const errorDetail = json.detail || json.message || "Unknown error";
        setMsg(`Error: ${JSON.stringify(errorDetail)}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      setMsg("Network error: Could not reach the server.");
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h3>User Register</h3>
      
      <label>Name</label><br />
      <input value={name} onChange={e => setName(e.target.value)} />
      <br />
      
      <label>Email *</label><br />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <br />
      
      <label>Password * (min 6 characters)</label><br />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
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