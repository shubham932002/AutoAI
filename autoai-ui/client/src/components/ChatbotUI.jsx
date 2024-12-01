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
  const [isTyping, setIsTyping] = useState(false);
  const [chatbotResponse, setChatbotResponse] = useState(""); // New state for storing the bot's response

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      setMessages([...messages, { text: userInput, sender: "user" }]);
      setIsTyping(true);

      try {
        let responseMessage = "";

        if (userInput.toLowerCase() === "insert" && file) {
          // Handle file upload
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

          responseMessage = response.data.message;
        } else {
          // Handle normal text input
          const response = await axios.post(
            "http://localhost:5000/process-text",
            { text: userInput }
          );
          console.log("Frontend -> " + JSON.stringify(response, null, 2));
          responseMessage = response.data.message;
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: responseMessage, sender: "bot" },
        ]);
        setChatbotResponse(responseMessage); // Update the chatbot's response
      } catch (error) {
        console.error(error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "There was an error processing your request. Please try again.",
            sender: "bot",
          },
        ]);
        setChatbotResponse("There was an error processing your request.");
      } finally {
        setIsTyping(false);
      }

      setUserInput("");
    }
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const renderMessage = (message) => {
    if (message.type === "structured") {
      return (
        <div className="structured-message">
          <h3>Progress Details:</h3>
          <table>
            <tbody>
              {Object.entries(message.text).map(([key, value], index) => (
                <tr key={index}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return <div>{message.text}</div>;
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
              {renderMessage(message)}
            </div>
          ))}
          {isTyping && <div className="typing-indicator">Bot is typing...</div>}
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

        {/* Displaying chatbot response below the input */}
      </div>
    </div>
  );
};

export default ChatbotUI;
