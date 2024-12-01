const { GoogleGenerativeAI } = require("@google/generative-ai"); // Replace with actual library
const axios = require("axios");

const GEMINI_API_KEY = "AIzaSyAR-OKDmghOQeGonAQlmWiolu0DRtPhwtk";
const API_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjQ0Mjg0OTUyNSwiYWFpIjoxMSwidWlkIjo2OTEyNjkwNywiaWFkIjoiMjAyNC0xMS0zMFQwNToyNjoyMi42NDFaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjY3NTM5NDUsInJnbiI6ImFwc2UyIn0.6XiSLQvPpVvJ0W57G6DBGPEq76Qd4f7iZ4j0ofbZ33M";
const BOARD_ID = "1942033549";

async function fetchGameProgress(gameName) {
  try {
    const query = `
    query {
      boards(ids: ${BOARD_ID}) {
        items_page {
          items {
            id
            name
            subitems {
              id
              name
              board {
                id
              }
              column_values {
                id
                text
              }
            }
          }
        }
      }
    }
    `;
    console.log("Console-5");
    const response = await axios.post(
      "https://api.monday.com/v2",
      { query },
      { headers: { Authorization: `Bearer ${API_TOKEN}` } }
    );
    console.log("Console-6");
    const items = response.data.data.boards[0].items_page.items;
    const gameItem = items.find(
      (item) => item.name.toLowerCase() === gameName.toLowerCase()
    );

    if (!gameItem) {
      return `Game "${gameName}" not found.`;
    }

    // Locate the "Development" subitem
    const developmentSubitem = gameItem.subitems.find(
      (subitem) => subitem.name === "Development"
    );

    if (!developmentSubitem) {
      return `Progress details for "Development" of game "${gameName}" not found.`;
    }

    // Extract required column values
    const actHrs =
      developmentSubitem.column_values.find((column) => column.id === "text")
        ?.text || "N/A";

    const estHrs =
      developmentSubitem.column_values.find((column) => column.id === "text4")
        ?.text || "N/A";

    const timeline =
      developmentSubitem.column_values.find(
        (column) => column.id === "timeline"
      )?.text || "N/A";

    // Compile progress details
    const progressDetails = {
      "Actual Hours (Act Hrs)": actHrs,
      "Estimated Hours (Est Hrs)": estHrs,
      Timeline: timeline,
    };
    console.log("Console-7");
    return progressDetails;
  } catch (error) {
    console.error(
      "Error fetching game progress:",
      error.response?.data || error.message
    );
    return null;
  }
}

async function chatbot(text) {
  console.log("Console-1");
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  console.log("Console-2");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });
  console.log("Console-3");
  // Check if the input matches the progress query format
  const progressMatch = text.match(/(.+?) progress/i);
  if (progressMatch) {
    const gameName = progressMatch[1].trim();
    console.log("Console-4");
    const progressDetails = await fetchGameProgress(gameName);

    if (!progressDetails) {
      return `I'm sorry, I couldn't fetch the progress details for "${gameName}". Please try again later.`;
    }
    console.log("Console-8");
    // Use Gemini AI to craft a more polished response
    const prompt = `
        You are a chatbot assisting users with progress updates for games. Given the progress details below, generate a professional and engaging response.

        Game: ${gameName}
        Progress Details:
        Actual Hours (Act Hrs): ${progressDetails["Actual Hours (Act Hrs)"]}
        Estimated Hours (Est Hrs): ${progressDetails["Estimated Hours (Est Hrs)"]}
        Timeline: ${progressDetails["Timeline"]}

        Response:
        `;
    console.log("Console-9");
    const result = await model.generateContent(prompt);
    console.log("Results -> " + result.content);
    console.log("Console-10");
    return (
      result.response.text() ||
      `Here are the progress details for "${gameName}":\n${progressDetails}`
    );
  }

  // Default to general chatbot response
  const prompt = `You are a helpful chatbot. Respond to the following user input: "${text}"`;
  const result = await model.generateContent(prompt);
  return result.content || "I'm sorry, I couldn't understand your request.";
}

module.exports = { chatbot };
