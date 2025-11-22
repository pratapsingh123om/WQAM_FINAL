import { useState } from "react";
import UserRegister from "../user/UserRegister";
import UserLogin from "../user/UserLogin";
import ValidatorRegister from "../validator/ValidatorRegister";
import ValidatorLogin from "../validator/ValidatorLogin";

export default function Auth({ navigate }) {
  const [tab, setTab] = useState("user-login"); // default

  return (
    <div style={{ maxWidth: 820, margin: "2rem auto", fontFamily: "system-ui" }}>
      <h2>Sign in / Register</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setTab("user-login")}>User Login</button>
        <button onClick={() => setTab("user-register")}>User Register</button>
        <button onClick={() => setTab("validator-login")}>Validator Login</button>
        <button onClick={() => setTab("validator-register")}>Validator Register</button>
        <button style={{ marginLeft: "auto" }} onClick={() => navigate("/")}>Back</button>
      </div>

      <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
        {tab === "user-login" && <UserLogin navigate={navigate} />}
        {tab === "user-register" && <UserRegister navigate={navigate} />}
        {tab === "validator-login" && <ValidatorLogin navigate={navigate} />}
        {tab === "validator-register" && <ValidatorRegister navigate={navigate} />}
      </div>
    </div>
  );
}
