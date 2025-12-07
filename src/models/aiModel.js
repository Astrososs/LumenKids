const apiKey = import.meta.env.VITE_AI_API_KEY;
console.log("DEBUG: The key is", apiKey);

export const sendMessageToAi = async (question, age, context = []) => {

  // 1. FIX: Format history for Gemini (Strict Requirement!)
  // Gemini requires "parts", NOT "content".
  // Gemini requires "model", NOT "assistant".
  const previousMessages = context.map(msg => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.text }]
  }));

  try {
    // 2. FIX: Use Backticks (`) here, NOT quotes (")
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            // Insert the corrected history
            ...previousMessages,
            // Insert the new question
            {
              role: "user",
              parts: [{ 
                text: `You are a helpful tutor for a ${age}-year-old child. ${question}` 
              }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API Error:", errorData);
      throw new Error(`Gemini responded with status: ${response.status}`);
    }

    const data = await response.json();

    // 3. FIX: Parse Gemini's specific response structure
    const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";

    return {
      role: "assistant", // Keep 'assistant' for your UI to display it correctly
      text: aiResponseText,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error("Error communicating with AI service:", error);
    throw error;
  }
};