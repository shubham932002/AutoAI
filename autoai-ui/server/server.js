const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { readExcelFile, updateEstimatedHours } = require("./fileProcessor");
const { chatbot } = require("./chatbot");

const app = express();
const upload = multer({ dest: "uploads/" }); // Temporary upload directory

app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Optional: Parses URL-encoded data

// Handle file upload and processing
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  const filePath = path.resolve(__dirname, req.file.path);

  try {
    const dataArray = readExcelFile(filePath); // Read Excel file
    await updateEstimatedHours(dataArray); // Process data
    res.status(200).send({ message: "File processed successfully!" });
  } catch (error) {
    console.error("Error processing the file:", error);
    res.status(500).send({ message: "Error processing the file" });
  } finally {
    // Clean up the uploaded file after processing
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting temporary file:", err);
    });
  }
});

app.post("/process-text", async (req, res) => {
  try {
    const { text } = req.body;
    const chatbotResponse = await chatbot(text);
    console.log("Console-11");
    console.log("Content -> " + chatbotResponse);
    res.json({
      success: true,
      message: chatbotResponse,
    });
  } catch (error) {
    console.error("Error processing text:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while processing your request.",
    });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
