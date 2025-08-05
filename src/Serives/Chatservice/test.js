// test.js
const Groq = require('groq-sdk');

// Initialize the Groq SDK with the 'dangerouslyAllowBrowser' option
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "", // Utilisez une variable d'environnement
  dangerouslyAllowBrowser: true // Enable for browser usage (with caution)
});

async function sendMessageToGroq(message) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "llama-3.3-70b-versatile",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false, // Full response
      stop: null
    });

    return chatCompletion.choices[0]?.message?.content || "No response from AI.";
  } catch (error) {
    console.error("Error with Groq API:", error);
    return "Error occurred.";
  }
}

// Export the function for use in Angular or other files
module.exports = { sendMessageToGroq };
