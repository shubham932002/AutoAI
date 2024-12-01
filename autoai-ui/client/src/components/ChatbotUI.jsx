// ChatbotUI.js
import React, { useState } from "react";
import axios from "axios";
import "../styles/ChatbotUI.css";

const ChatbotUI = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    "Chat 1",
    "Chat 2",
    "Chat 3",
  ]);
  const [file, setFile] = useState(null);

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      setMessages([...messages, { text: userInput, sender: "user" }]);

      if (userInput.toLowerCase() === "insert" && file) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await axios.post(
            "http://localhost:5000/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          setMessages((prevMessages) => [
            ...prevMessages,
            { text: response.data.message, sender: "bot" },
          ]);
        } catch (error) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: "Failed to process the file. Please try again.",
              sender: "bot",
            },
          ]);
        }
      } else {
        setTimeout(() => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "This is a bot response!", sender: "bot" },
          ]);
        }, 1000);
      }

      setUserInput("");
    }
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
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
              className={`message ${
                message.sender === "user" ? "user" : "bot"
              }`}
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
          <input type="file" onChange={handleFileUpload} />
        </div>
      </div>
    </div>
  );
};

export default ChatbotUI;
