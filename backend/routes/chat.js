const express = require('express');
const router = express.Router();

function formatGeminiText(text) {
  // Convert lines starting with "-" or "*" to <li>
  const lines = text.split('\n');
  let inList = false;
  let html = '';
  for (const line of lines) {
    if (/^\s*[-*]\s+/.test(line)) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${line.replace(/^\s*[-*]\s+/, '')}</li>`;
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += `<p>${line}</p>`;
    }
  }
  if (inList) html += '</ul>';
  return html;
}

router.post('/', async (req, res) => {
  let { prompt, temperature = 0.7, candidateCount = 1, maxOutputTokens = 256 } = req.body;
  if (!prompt || !prompt.trim()) {
    prompt = "Act like a teacher assistant and give a brief textual response.";
  } else {
    prompt = `Act like a teacher assistant and give a brief textual response. ${prompt}`;
  }

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature,
          candidateCount,
          maxOutputTokens
        }
      })
    });

    const data = await response.json();
    const rawReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";
    const reply = formatGeminiText(rawReply); // Format as HTML
    res.json({ reply });

  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Gemini API call failed" });
  }
});

module.exports = router;