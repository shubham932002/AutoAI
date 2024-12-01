const fs = require("fs");
const xlsx = require("xlsx");
const axios = require("axios");
const API_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjQ0Mjg0OTUyNSwiYWFpIjoxMSwidWlkIjo2OTEyNjkwNywiaWFkIjoiMjAyNC0xMS0zMFQwNToyNjoyMi42NDFaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjY3NTM5NDUsInJnbiI6ImFwc2UyIn0.6XiSLQvPpVvJ0W57G6DBGPEq76Qd4f7iZ4j0ofbZ33M";

// Replace with your Monday.com board details
const BOARD_ID = "1942033549";
// Reads an Excel file and returns an array of objects
const readExcelFile = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // Extract "Game Name" and "Hours" from Excel sheet
  const gamesArray = sheetData.map((row) => [row["Game Name"], row["Hours"]]);
  return gamesArray;
};

// Example function to update estimated hours (customize as needed)
const updateEstimatedHours = async (gamesArray) => {
  try {
    // Step 1: Query the board to get all items and subitems
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

    const response = await axios.post(
      "https://api.monday.com/v2",
      { query },
      { headers: { Authorization: `Bearer ${API_TOKEN}` } }
    );

    const items = response.data.data.boards[0].items_page.items;

    // Iterate through each game in the array
    for (const [gameName, newHours] of gamesArray) {
      const gameItem = items.find((item) => item.name === gameName);
      if (!gameItem) {
        console.log(`Game Item "${gameName}" not found.`);
        continue;
      }

      const subitem = gameItem.subitems.find(
        (subitem) => subitem.name === "Development"
      );
      if (!subitem) {
        console.log(`Subitem "Development" not found for game "${gameName}".`);
        continue;
      }

      const actHrsColumn = subitem.column_values.find(
        (column) => column.id === "text" // Replace "text" with your actual column ID
      );

      // Parse the current value and add the new hours
      const currentHoursText = actHrsColumn?.text || "0 hrs";
      const currentHours = parseInt(currentHoursText.split(" ")[0]) || 0;
      const additionalHours = parseInt(newHours.split(" ")[0]) || 0;
      const updatedHours = currentHours + additionalHours;

      // Step 2: Update the "Act Hrs" column in the subitem
      const mutationQuery = `
      mutation {
        change_column_value(
          board_id: ${subitem.board.id}, 
          item_id: ${subitem.id}, 
          column_id: "text", 
          value: "\\"${updatedHours} hrs\\""
        ) {
          id
        }
      }
      `;

      try {
        const updateResponse = await axios.post(
          "https://api.monday.com/v2",
          { query: mutationQuery },
          { headers: { Authorization: `Bearer ${API_TOKEN}` } }
        );

        console.log(
          `Successfully updated "Act Hrs" for game "${gameName}" to "${updatedHours} hrs".`
        );
      } catch (updateError) {
        console.error(
          `Error updating "Act Hrs" for game "${gameName}":`,
          updateError.response?.data || updateError.message
        );
      }
    }
  } catch (error) {
    console.error(
      "Error querying the board:",
      error.response?.data || error.message
    );
  }
};

module.exports = { readExcelFile, updateEstimatedHours };
