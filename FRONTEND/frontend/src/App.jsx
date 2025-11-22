import { useEffect, useState } from "react";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import Auth from "./pages/auth/Auth"; // combined user/validator register+login
import UserDashboard from "./pages/user/UserDashboard";
import ValidatorDashboard from "./pages/validator/ValidatorDashboard";
import "./App.css";

function App() {
  const [path, setPath] = useState(window.location.pathname || "/");

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function navigate(to) {
    if (to === window.location.pathname) return;
    window.history.pushState({}, "", to);
    setPath(to);
  }

  // route handling
  if (path.startsWith("/admin/dashboard")) {
    return <AdminDashboard navigate={navigate} />;
  }
  if (path.startsWith("/admin/login")) {
    return <AdminLogin navigate={navigate} />;
  }
  if (path.startsWith("/auth")) {
    return <Auth navigate={navigate} />;
  }
  if (path.startsWith("/user/dashboard")) {
    return <UserDashboard navigate={navigate} />;
  }
  if (path.startsWith("/validator/dashboard")) {
    return <ValidatorDashboard navigate={navigate} />;
  }

  // default homepage - note: no admin link here (admin has separate page)
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, system-ui" }}>
      <h1>WQAM Dashboard</h1>
      <p>Choose sign-in / register:</p>
      <button onClick={() => navigate("/auth")}>User / Validator — Sign in / Register</button>
      <p style={{ marginTop: 12 }}>
        Admins use a separate page for security. Open <code>/admin/login</code> directly.
      </p>
      <hr />
      <p>Tip: If you want quick admin access, open <code>/admin/login</code>.</p>
    </main>
  );
}

export default App;
