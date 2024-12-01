import React, { useState } from "react";

const Login = ({ setCurrentPage, switchForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  // To store error messages

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleLogin = () => {
    // Reset error state before performing validation
    setError("");

    // Validate email and password
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Check for user in localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      setCurrentPage("chat");
    } else {
      setError("Invalid credentials. Please check your email and password.");
    }
  };

  return (
    <div>
      <form>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
        
        {/* Display a single error message below the form */}
        {error && <div className="error-message">{error}</div>}
      </form>
      
      <div className="switch-link" onClick={switchForm}>
        Don't have an account? Signup here
      </div>
    </div>
  );
};

export default Login;
