import React, { useState } from "react";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");

  const renderPage = () => {
    if (currentPage === "landing") {
      return <LandingPage setCurrentPage={setCurrentPage} />;
    } else if (currentPage === "auth") {
      return <AuthPage setCurrentPage={setCurrentPage} />;
    } else if (currentPage === "chat") {
      return <ChatPage />;
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;
