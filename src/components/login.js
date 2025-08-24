import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    navigate("/");
  };

  return (
    <div className="login-container">
      <h2>Log-In</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">👤 Username</label>
        <input id="username" type="text" placeholder="username" required />

        <label htmlFor="password">🔒 Password</label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="password"
          required
        />

        <div className="showp">
          <input
            type="checkbox"
            id="showpass"
            checked={showPassword}
            onChange={() => setShowPassword((prev) => !prev)}
          />
          <label htmlFor="showpass">Show password</label>
        </div>

        <button type="submit">LogIn</button>
      </form>
    </div>
  );
}

export default Login;