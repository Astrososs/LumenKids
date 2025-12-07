import React from "react";
// import Spinner from "react-spinners/ClipLoader"; // Optional for that extra UX point

export default function ChatView({ messages, input, setInput, isLoading, onSend }) {
  return (
    <div className="chat-layout">
    
       <button onClick={onSend} disabled={isLoading}>Send</button>
    </div>
  );
}