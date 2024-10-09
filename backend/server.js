const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const pdf = require("pdf-parse");
const express = require("express");
const { formatText } = require("./utils");

const upload = multer({ dest: "uploads/" });

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Endpoint untuk mengunggah dan mengekstrak CV ATS PDF
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = path.join(__dirname, "uploads", req.file.filename);
    const fileBuffer = fs.readFileSync(filePath);
    const data = await pdf(fileBuffer);
    const text = data.text;

    // Ekstrak teks dari PDF dan format teks
    const formattedText = formatText(text);
    // console.log({ formattedText });

    // Hapus file setelah selesai
    fs.unlinkSync(filePath);
    res.json({ content: formattedText });
  } catch (error) {
    console.error("Error saat mengekstrak teks dari PDF:", error);
    res.status(500).json({ error: "Error saat mengekstrak teks dari PDF" });
  }
});

// Endpoint untuk menyimpan hasil editing final
app.post("/save", (req, res) => {
  const { content } = req.body;
  // console.log({ content });
  res.json({ message: "Content saved successfully" });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
