import React, { useState } from 'react';

import IconButton from './src/components/common/IconButton';

const ChatInput = ({ onSend, disabled }) => {
  
  const [text, setText] = useState("");

  
  const handleSubmit = (e) => {
    e.preventDefault(); 
    
  
    if (text.trim() && !disabled) {
      onSend(text);
      setText(""); 
    }
  };

 
  const sendIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
  );

  return (
    <div className="border-t border-gray-100 p-4 bg-white">
      <form 
        onSubmit={handleSubmit}
        className="flex items-center gap-2"
      >
        
        
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={disabled ? "Lumen is thinking..." : "Ask me anything..."}
          disabled={disabled}
          className={`flex-1 bg-gray-100 text-gray-800 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all
            ${disabled ? "opacity-50 cursor-not-allowed" : "bg-gray-100"}
          `}
        />

        
        <IconButton 
          icon={sendIcon}
          onClick={() => {}} // Form handles submit, so we can leave this empty or pass null
          disabled={!text.trim() || disabled} 
          color="blue"
        />

      </form>
    </div>
  );
};

export default ChatInput;