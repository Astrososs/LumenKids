import React from 'react';

const ChatBubble = ({ message }) => {
 
  const isUser = message.role === 'user';

 
  const bubbleColor = isUser 
    ? "bg-blue-500 text-white rounded-br-none" 
    : "bg-gray-100 text-gray-800 rounded-bl-none";

  const alignment = isUser ? "justify-end" : "justify-start";

  return (
    <div className={`flex w-full mb-4 ${alignment}`}>
      
     
      <div className={`max-w-[75%] p-4 rounded-2xl shadow-sm ${bubbleColor}`}>
        
       
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {message.text}
        </p>

       
        <div className={`text-xs mt-1 text-right opacity-70 ${isUser ? "text-blue-100" : "text-gray-500"}`}>
        
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

      </div>
    </div>
  );
};

export default ChatBubble;