import React, { useState } from "react";
import "../styles/ChatbotUI.css";

const ChatbotUI = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState(["Chat 1", "Chat 2", "Chat 3"]);

  const handleSendMessage = () => {
    if (userInput.trim()) {
      setMessages([...messages, { text: userInput, sender: "user" }]);
      setUserInput("");

      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "This is a bot response!", sender: "bot" },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Sidebar for chat history */}
      <div className="chatbot-sidebar">
        <h2>Chat History</h2>
        <ul>
          {chatHistory.map((chat, index) => (
            <li key={index}>{chat}</li>
          ))}
        </ul>
      </div>

      {/* Chat area */}
      <div className="chatbot-main">
        <div className="chatbot-header">AutoAI Chatbot</div>

        <div className="chatbot-body">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === "user" ? "user" : "bot"}`}
            >
              {message.text}
            </div>
          ))}
        </div>

        <div className="chatbot-input-container">
          <input
            type="text"
            className="chatbot-input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
          />
          <button className="chatbot-send-button" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotUI;