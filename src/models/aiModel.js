
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_AI_API_KEY);

export const sendMessageToAi = async (question, age, context = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

   
    const history = context
      .filter(msg => msg.role === 'user' || msg.role === 'assistant' || msg.role === 'model') 
      .map(msg => ({
        role: (msg.role === "assistant" || msg.role === "model") ? "model" : "user",
        parts: [{ text: msg.text }]
      }));

   
    const chat = model.startChat({
      history: history,
      generationConfig: { maxOutputTokens: 200 },
       
    });

    
    const prompt = `(Explain this to a ${age} year old student): ${question}`;
    
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      role: "assistant", 
      text: text,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.warn("⚠️ API Error. Switching to Backup Mode.", error);

    

    await new Promise(r => setTimeout(r, 1000));

    return {
      role: "assistant",
      text: "I'm having trouble reaching my brain servers right now! 🧊 (Check console for error details)",
      timestamp: new Date().toISOString()
    };
  }
};