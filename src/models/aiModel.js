import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_AI_API_KEY);

export const sendMessageToAi = async (question, age, context = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const history = context.map(msg => ({
        role: (msg.role === "assistant" || msg.role === "model") ? "model" : "user",
        parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({ history });
    const prompt = `(Explain this to a ${age} year old student): ${question}`;
    const result = await chat.sendMessage(prompt);
    return { role: "assistant", text: result.response.text(), timestamp: new Date().toISOString() };
  } catch (error) {
    console.warn("AI Error", error);
    return { role: "assistant", text: "I'm having trouble reaching my brain servers!", timestamp: new Date().toISOString() };
  }
};

export const generateCourseWithAi = async (topic, age) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `
      Create a course on "${topic}" for a ${age}-year-old.
      Return VALID JSON ONLY. No markdown formatting.
      
      Structure:
      {
        "title": "Course Title",
        "description": "Short exciting description",
        "icon": "Emoji",
        "color": "bg-blue-600",
        "units": [
          {
            "id": "u1", "title": "Unit Title", "description": "...", 
            "missions": [
               { 
                 "id": "m1", "title": "Lesson Title", "type": "theory", "xpReward": 10, 
                 "tasks": [
                    { "type": "theory", "content": "The educational content text goes here." }
                 ] 
               },
               { 
                 "id": "m2", "title": "Quiz Title", "type": "quiz", "xpReward": 20, 
                 "tasks": [
                    { 
                      "type": "quiz", 
                      "question": "The quiz question text?", 
                      "options": ["Option A", "Option B"], 
                      "correct": "Option A" 
                    }
                 ] 
               }
            ]
          }
        ]
      }
      
      IMPORTANT RULES:
      1. For 'theory' tasks, YOU MUST USE the key "content".
      2. For 'quiz' tasks, YOU MUST USE the key "question".
      3. Ensure "correct" matches one of the "options" exactly.
    `;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Gen Error", error);
    throw new Error("Failed to generate course.");
  }
};

export const refineCourseWithAi = async (currentCourse, userInstruction, age) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `
      Act as a Curriculum Editor (Target Age: ${age}).
      
      CURRENT JSON:
      ${JSON.stringify(currentCourse)}

      USER INSTRUCTION:
      "${userInstruction}"

      TASK:
      1. Modify the JSON to fulfill the instruction.
      2. You can Add/Remove/Reorder Units or Missions.
      3. KEEP the same JSON structure.
      4. Ensure "correct" answers match "options" exactly.
      5. Use "content" for theory tasks and "question" for quiz tasks.
      
      RETURN VALID JSON ONLY.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(text);

  } catch (error) {
    console.error("AI Refine Error", error);
    throw new Error("Failed to edit course.");
  }
};