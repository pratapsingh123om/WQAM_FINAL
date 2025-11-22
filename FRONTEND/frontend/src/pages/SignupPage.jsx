import React, { useState } from "react";
import axios from "axios";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "user",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/register", formData)
      .then(() => alert("Registered successfully! Wait for admin approval."))
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6 w-96 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <input type="text" placeholder="Name" className="border p-2"
          onChange={(e)=> setFormData({...formData, name:e.target.value})}/>

        <input type="email" placeholder="Email" className="border p-2"
          onChange={(e)=> setFormData({...formData, email:e.target.value})}/>

        <input type="password" placeholder="Password" className="border p-2"
          onChange={(e)=> setFormData({...formData, password:e.target.value})}/>

        <select className="border p-2"
          onChange={(e)=> setFormData({...formData, role:e.target.value})}>
          <option value="user">User (Industry / STP/WTP)</option>
          <option value="validator">Validator</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
