import React, { useState } from "react";

const Signup = ({ switchForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // General error message
  const [success, setSuccess] = useState(""); // Success message
  const [emailError, setEmailError] = useState(""); // Email-specific error
  const [passwordError, setPasswordError] = useState(""); // Password-specific error

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleSignup = (e) => {
    e.preventDefault(); // Prevent form submission and page reload
    setError(""); // Reset general error message
    setSuccess(""); // Reset success message
    setEmailError(""); // Reset email-specific error
    setPasswordError(""); // Reset password-specific error

    // Check if email and password are provided
    if (!email) {
      setEmailError("Email is required.");
      return;
    }

    if (!password) {
      setPasswordError("Password is required.");
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    // Get users from localStorage (or an empty array if no users)
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the user already exists
    if (users.some((u) => u.email === email)) {
      setError("User already exists!");
      return;
    }

    // Create new user and save to localStorage
    users.push({ email, password });

    try {
      localStorage.setItem("users", JSON.stringify(users));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }

    // Set success message
    setSuccess("User created successfully! Redirecting to login...");

    // Clear success message after 3 seconds and switch to login form
    setTimeout(() => {
      setSuccess(""); // Clear success message after delay
      switchForm(); // Switch to the login form
    }, 2000);
  };

  return (
    <div>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <div className="error-message">{emailError}</div>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <div className="error-message">{passwordError}</div>}

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit">Signup</button>
      </form>

      <div className="switch-link" onClick={switchForm}>
        Already have an account? Login here
      </div>
    </div>
  );
};

export default Signup;
