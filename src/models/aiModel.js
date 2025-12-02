// The "Session" Object (Looking at the history list)

export const aiModel =
[{
  "sessionId":"chat_session_888",
  "userId": "user_abc123",        // Matches Omar's User
  "relatedMissionId": "mission_math_01", // Matches Ritwan's Mission (Optional)
  "topic": "Volcanoes",
  "startTime": "2024-03-10T14:30:00Z",
  
  // The actual conversation
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

export const  sendMessageToAi = async (question, age, context) => {


};


export const saveChatSession = (newMessages) => {


  
};