import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AdminLogin.scss";
import apiRequest from "../../lib/apiRequest";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await apiRequest.post("/admin/auth/login", {
        username,
        password,
      });

      if (response.status === 200) {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setError("Invalid credentials or server error");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default AdminLogin;