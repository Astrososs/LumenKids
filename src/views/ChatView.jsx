import React from "react";
// Import a spinner here later for that "3rd party component" requirement

export default function ChatView({ messages, input, setInput, isLoading, onSend }) {
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Chat with Lumen</h2>

  
      <ul style={{ listStyle: "none", padding: 0, height: "400px", overflowY: "auto", border: "1px solid #ccc", borderRadius: "8px", padding: "10px" }}>
        {messages.map((msg, index) => (
          <li 
            key={index} 
            style={{ 
              marginBottom: "10px", 
              textAlign: msg.role === "user" ? "right" : "left",
              color: msg.role === "user" ? "blue" : "black"
            }}
          >
            <strong>{msg.role === "user" ? "You" : "Lumen"}: </strong> 
            {msg.text}
          </li>
        ))}
        
   
        {isLoading && <li style={{ color: "gray", fontStyle: "italic" }}>Lumen is thinking...</li>}
      </ul>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <input 
          style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Ask a question..." 
          disabled={isLoading}
        />
        <button 
          onClick={onSend} 
          disabled={isLoading}
          style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#007AFF", color: "white", border: "none", borderRadius: "4px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}