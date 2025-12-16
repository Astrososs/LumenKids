
import React, { useRef, useEffect } from 'react';

const ChatView = ({ 
  chats, currentChatId, messages, 
  input, setInput, loading, 
  onSend, onSelectChat, onNewChat, onDeleteChat,
  hasActiveChat 
}) => {
  

  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-900 text-white overflow-hidden">
      
      
      <div className="w-1/4 min-w-[250px] bg-gray-800 border-r border-gray-700 flex flex-col">
        
       
        <div className="p-4">
          <button 
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition shadow-lg border border-blue-400"
          >
            <span className="text-xl">+</span> New Chat
          </button>
        </div>

      
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {chats.length === 0 && (
            <div className="text-gray-500 text-center text-sm mt-10">No history yet.</div>
          )}

          {chats.map(chat => (
            <div 
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
                chat.id === currentChatId ? 'bg-gray-700 border border-gray-600' : 'hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-lg">💬</span>
                <span className="text-sm text-gray-300 truncate font-medium">
                  {chat.title || "New Conversation"}
                </span>
              </div>
              
            
              <button 
                onClick={(e) => onDeleteChat(e, chat.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition px-2"
                title="Delete Chat"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>

   
      <div className="flex-1 flex flex-col bg-gray-900 relative">
        
        {!hasActiveChat && chats.length === 0 ? (
          
           <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
             <div className="text-6xl mb-4">🤖</div>
             <h2 className="text-2xl font-bold text-white">Lumen AI Buddy</h2>
             <p>Ask me anything about your homework!</p>
           </div>
        ) : (
        
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[70%] p-4 rounded-2xl shadow-md text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-gray-700 text-gray-200 rounded-bl-none border border-gray-600'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 p-4 rounded-2xl rounded-bl-none animate-pulse text-gray-400 text-sm">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

       
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <form 
            onSubmit={(e) => { e.preventDefault(); onSend(); }}
            className="relative max-w-4xl mx-auto"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 shadow-inner"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition disabled:opacity-50"
            >
              🚀
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ChatView;