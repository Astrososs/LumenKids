
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(import.meta.env.VITE_AI_API_KEY);

export const sendMessageToAi = async (question, age, context = []) => {
  try {
 
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
 
    const history = context.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.text }]
    }));

  
    const chat = model.startChat({
      history: history,
      generationConfig: { maxOutputTokens: 200 },
    });

    const result = await chat.sendMessage(`(Explain to a ${age} year old): ${question}`);
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
      text: "I'm having trouble reaching my brain servers right now, but that is a fascinating question! Ideally, I would explain it using simple words and fun examples. (Offline Backup Mode)",
      timestamp: new Date().toISOString()
    };
  }
};

