import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import "../styles/AuthPage.css";

const AuthPage = ({ setCurrentPage }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      <video autoPlay muted loop className="background-video">
  <source src="/assets/dotconnecting.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
      <div className="auth-container">
        <h1>{isLogin ? "Login to AutoAI" : "Create an Account"}</h1>
        {isLogin ? (
          <Login setCurrentPage={setCurrentPage} switchForm={() => setIsLogin(false)} />
        ) : (
          <Signup switchForm={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
