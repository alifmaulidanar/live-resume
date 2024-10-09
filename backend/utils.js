const fs = require("fs");
const pdf = require("pdf-parse");

async function extractTextFromPDF(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const data = await pdf(fileBuffer);
    return data.text;
  } catch (error) {
    console.error("Error saat mengekstrak teks dari PDF:", error);
  }
}

const formatText = (text) => {
  // Split text into lines
  const lines = text.split("\n");
  let formattedText = "";
  let inBulletList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect section titles
    if (line.match(/^[A-Z\s\/]+$/)) {
      if (i > 0 && lines[i - 1].trim() !== "") {
        formattedText += "\n";
      }
      formattedText += `<br><h2>${line}</h2>\n`;
      inBulletList = false;
    } else if (line.startsWith("•")) {
      // Detect bullet list
      if (!inBulletList) {
        formattedText += "<ul>\n";
      }
      formattedText += `<li>${line.substring(1).trim()}</li>\n`;
      inBulletList = true;
    } else {
      // Process the line for contact information and URLs
      if (inBulletList) {
        formattedText += "</ul>\n";
        inBulletList = false;
      }

      let formattedLine = line;

      // Email formatting
      formattedLine = formattedLine.replace(
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
        (email) => `<a href="mailto:${email}">${email}</a>`
      );

      // Format .com URLs that are not emails
      formattedLine = formattedLine.replace(
        /\b(?!mailto:)(\S+\.com\S*)\b/g,
        (url) => {
          if (!url.includes("@")) {
            const prefixedUrl = url.startsWith("http") ? url : `http://${url}`;
            return `<a href="${prefixedUrl}" target="_blank">${url}</a>`;
          }
          return url; // If it resembles an email, return as is
        }
      );

      // Stricter phone number regex to avoid years and unrelated numbers
      formattedLine = formattedLine.replace(
        /\b(\+?\d{1,4}[-.\s]?)?(\(?\d{3,4}\)?[-.\s]?)?[\d\s.-]{6,}\b/g,
        (phone) => {
          const digitsOnly = phone.replace(/\D/g, "");
          // Check if it's likely a phone number by length
          if (digitsOnly.length >= 10) {
            return `<a href="tel:${digitsOnly}">${phone}</a>`;
          }
          return phone; // Return as is if it's likely not a phone number
        }
      );

      formattedText += `<p>${formattedLine}</p>\n`;
    }
  }

  // Close any open <ul> tag
  if (inBulletList) {
    formattedText += "</ul>\n";
  }

  return formattedText.trim();
};

const convertToMarkdown = (text) => {
  // Memisahkan teks menjadi baris-baris
  const lines = text.split("\n");
  let markdownText = "";
  let inBulletList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Mengenali judul section
    if (line.match(/^[A-Z\s\/]+$/)) {
      if (i > 0 && lines[i - 1].trim() !== "") {
        markdownText += "\n";
      }
      markdownText += `## ${line}\n`;
      inBulletList = false;
    } else if (line.startsWith("•")) {
      // Mengenali bullet list
      if (!inBulletList) {
        markdownText += "\n";
      }
      markdownText += `- ${line.substring(1).trim()}\n`;
      inBulletList = true;
    } else {
      // Mengenali kalimat biasa
      if (inBulletList) {
        markdownText += "\n";
        inBulletList = false;
      }
      markdownText += line + "\n";
    }
  }

  return markdownText.trim();
};

const saveTextToFile = (text, outputPath) => {
  try {
    fs.writeFileSync(outputPath, text);
    console.log(`Teks berhasil disimpan ke ${outputPath}`);
  } catch (error) {
    console.error("Error saat menyimpan teks ke file:", error);
  }
};

// const pdfFilePath = "./example_resume.pdf";
// const outputTxtPath = "./output/example_resume.txt";
// const outputMdPath = "./output/example_resume.md";

// const pdfFilePath = "./atssampleresume.pdf";
// const outputTxtPath = "./output/atssampleresume.txt";
// const outputMdPath = "./output/atssampleresume.md";

// const pdfFilePath = "./CV ATS Admin Terbaru.pdf";
// const outputTxtPath = "./output/CV ATS Admin Terbaru.txt";
// const outputMdPath = "./output/CV ATS Admin Terbaru.md";

// extractTextFromPDF(pdfFilePath).then((text) => {
//   if (text) {
//     const formattedText = formatText(text);
//     saveTextToFile(formattedText, outputTxtPath);

//     const markdownText = convertToMarkdown(formattedText);
//     saveTextToFile(markdownText, outputMdPath);
//   }
// });

module.exports = {
  formatText,
  convertToMarkdown,
  saveTextToFile,
  extractTextFromPDF,
};
