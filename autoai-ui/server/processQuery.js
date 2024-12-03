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
            column_values {
              id
              text
            }
            subitems {
              id
              name
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
    const response = await axios.post(
      "https://api.monday.com/v2",
      { query },
      { headers: { Authorization: `Bearer ${API_TOKEN}` } }
    );

    const items = response.data.data.boards[0].items_page.items;
    const gameItem = items.find(
      (item) => item.name.toLowerCase() === gameName.toLowerCase()
    );

    if (!gameItem) {
      return `Game "${gameName}" not found.`;
    }
    // Extract game column details
    const gameDetails = {};
    gameItem.column_values.forEach((column) => {
      gameDetails[column.id] = column.text || "N/A";
    });

    // Extract subitems details
    const subitemDetails = [];
    gameItem.subitems.forEach((subitem) => {
      const subitemData = { name: subitem.name };
      subitem.column_values.forEach((column) => {
        subitemData[column.id] = column.text || "N/A";
      });
      subitemDetails.push(subitemData);
    });

    return { gameDetails, subitemDetails };
  } catch (error) {
    console.error(
      "Error fetching game progress:",
      error.response?.data || error.message
    );
    return null;
  }
}

async function processUserQuery(query) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });
  console.log("Process User Query");
  try {
    // Extract game name from query
    const gameNameMatch = query.match(
      /(?:status|progress|game)\s*(?:of|for)?\s*([^?]+)\s*$/i
    );
    const gameName = gameNameMatch ? gameNameMatch[1].trim() : null;
    console.log("Game Name -> " + gameName);

    if (!gameName) {
      return "Please specify the game you want information about.";
    }

    const progressDetails = await fetchGameProgress(gameName);

    if (!progressDetails) {
      return `I'm sorry, I couldn't fetch the progress details for "${gameName}". Please try again later.`;
    }

    // Prepare prompt with all column details
    const { gameDetails, subitemDetails } = progressDetails;

    let subitemsText = "";
    subitemDetails.forEach((subitem, index) => {
      subitemsText += `Subitem ${index + 1}: ${subitem.name}\n`;
      Object.entries(subitem).forEach(([key, value]) => {
        if (key !== "name") {
          subitemsText += `  - ${key}: ${value}\n`;
        }
      });
    });
    const details = Object.entries(gameDetails)
      .map(([key, value]) => `  - ${key}: ${value}`)
      .join();
    console.log("Game Name -> " + gameName);
    console.log("Subitems -> " + subitemsText);
    console.log("Details -> " + details);
    const prompt = `
    You are a chatbot assisting users with progress updates for games. Given the details below, generate a professional and engaging response.

    Game: ${gameName}
    Game Details:${details}
    Subitem Details: ${subitemsText}

    Response:
    `;
    const result = await model.generateContent(prompt);
    console.log("Result -> " + JSON.stringify(result, null, 2));
    return result.response.text();
  } catch (error) {
    console.error("Error processing user query:", error.message);
    return "An error occurred while processing your request. Please try again.";
  }
}

module.exports = { processUserQuery };
