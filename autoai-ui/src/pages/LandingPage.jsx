import React from "react";
import "../styles/LandingPage.css";

const LandingPage = ({ setCurrentPage }) => {
  const handleGetStarted = () => {
    if (setCurrentPage && typeof setCurrentPage === "function") {
      setCurrentPage("auth");
    } else {
      console.error("setCurrentPage is not a valid function");
    }
  };

  return (
    <div className="landing-page">
      <video autoPlay muted loop className="background-video">
  <source src="/assets/dotconnecting.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
      <div className="container">
        <h1 className="heading">Welcome to AUTOAI</h1>
        <p className="subheading">Revolutionizing the way you interact with AI.</p>
        <button className="get-started-btn" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
