import React, { useEffect, useRef } from "react";

export default function ChatView({ messages, input, setInput, isLoading, onSend }) {

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (

    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col h-[85vh]">
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Chat with Lumen 🤖</h2>
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-700">
            Powered by Gemini
        </span>
      </div>


      <div className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl p-4 overflow-y-auto space-y-4 shadow-inner custom-scrollbar">
        {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
                <div 
                    key={index} 
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                    <div 
                        className={`max-w-[80%] md:max-w-[70%] p-3 rounded-2xl text-sm md:text-base leading-relaxed shadow-md ${
                            isUser 
                            ? "bg-blue-600 text-white rounded-br-none" 
                            : "bg-gray-700 text-gray-100 rounded-bl-none border border-gray-600"
                        }`}
                    >
                        <strong className="block text-xs opacity-75 mb-1">
                            {isUser ? "You" : "Lumen"}
                        </strong>
                        {msg.text}
                    </div>
                </div>
            );
        })}


        {isLoading && (
            <div className="flex justify-start animate-pulse">
                <div className="bg-gray-700 text-gray-400 p-3 rounded-2xl rounded-bl-none text-sm border border-gray-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    <span>Thinking...</span>
                </div>
            </div>
        )}
        

        <div ref={messagesEndRef} />
      </div>


      <div className="mt-4 flex gap-2 md:gap-4">
        <input 
          className="flex-1 bg-gray-800 text-white border border-gray-600 focus:border-blue-500 rounded-xl p-4 outline-none transition shadow-lg placeholder-gray-500"
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && !isLoading && onSend()}
          placeholder="Ask a question about space, math, or science..." 
          disabled={isLoading}
        />
        <button 
          onClick={onSend} 
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl px-6 md:px-8 transition shadow-lg flex items-center gap-2"
        >
          <span>Send</span>
          <span className="text-xl">🚀</span>
        </button>
      </div>
    </div>
  );
}