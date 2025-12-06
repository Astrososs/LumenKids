// The "Session" Object (Looking at the history list)

export const mockChatHistory =
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


return new Promise((resolve) => {

setTimeout(() => {

const text = question.toLowerCase();
let answerText = "";
if( text.includes("math") || text.includes("numbers")){

  answerText = "Math is like a puzzle! Did you know 0 is the only number that can't be represented by Roman numerals?";
}

else if(text.includes("space") || text.includes("planet")){

  answerText = "Space is huge! The sun is actually a star, just like the tiny dots you see at night.";
}

else if(text.includes("joke")){
  answerText = "Why did the computer go to the doctor? Because it had a virus! 🤖";
}
else{
answerText = "That is a very interesting question! Let's explore that topic together.";
}

resolve({role: "assistant",                                               
        text: answerText,
        timestamp: new Date().toISOString()});

}, 2000);

});

};

export const saveChatSession = (newMessages) => {

const newchat = {
  "sessionId":Date.now(),
  "userId": "user_abc123",       
  "relatedMissionId": "mission_math_01", 
  "topic": "Volcanoes",
  "startTime": new Date().toISOString(),
  
  
  "messages":  newMessages  
  
}

mockChatHistory.push(newchat);
return true;
  
};