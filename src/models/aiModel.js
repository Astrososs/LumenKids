const apiKey= import.meta.env.VITE_AI_API_KEY;


export const mockChatHistory =
[{
  "sessionId":"chat_session_888",
  "userId": "user_abc123",        
  "relatedMissionId": "mission_math_01", 
  "topic": "Volcanoes",
  "startTime": "2024-03-10T14:30:00Z",
  
  "messages": [
    {
      "role": "user",
      "text": "Why is lava hot?",
      "timestamp": "2024-03-10T14:30:05Z"
    },
    {
      "role": "assistant",
      "text": "Lava is hot because it comes from deep inside the Earth where it is very squeezed!",
      "timestamp": "2024-03-10T14:30:10Z"
    }
  ]
}];





export const  sendMessageToAi = async (question, age, context =[]) => {


if(!apiKey){
console.warn("No API Key found for AI service. Using mock response.");
return new Promise((resolve) =>{
setTimeout(() => {
resolve({role: "assistamt",
  text: "This is a mock response. .",
  timestamp: new Date().toISOString()
});



}, 1500);
});
}


const previousMessages = context.map(msg=> ({

role: msg.role,
content: msg.text

}));



try{
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
  model: "gpt-3.5-turbo",
  messages: [{
    role: "system", content: `You are a helpful tutor for a ${age}-year-old child.`},
  
  
  ...previousMessages,
  
    {role: "user", content: question}
  ]
  })
});

if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API Error:", errorData);
      throw new Error(`AI service responded with status: ${response.status}`);
    }



    const data = await response.json();

    return ({
      role: "assistant",
      text: data.choices[0].message.content,
      timestamp: new Date().toISOString()
    });


  } catch (error) {
    console.error("Error communicating with AI service:", error);
    throw error;
  }
};