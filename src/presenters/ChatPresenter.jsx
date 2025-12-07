import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addUserMessage, askLumen } from "../store/slices/chatSlice";
import ChatView from "../views/ChatView"; 

export default function ChatPresenter() {

  const [input, setInput] = useState("");


  const { messages, isLoading } = useSelector((state) => state.chat);
  const dispatch = useDispatch();


  const handleSendMessage = () => {
    if (!input.trim()) return;

  
    dispatch(addUserMessage(input));


    dispatch(askLumen({ 
      question: input, 
      age: 8, 
      context: messages 
    }));
    
 
    setInput("");
  };


  return (
    <ChatView 
      messages={messages}
      input={input}
      setInput={setInput}
      isLoading={isLoading}
      onSend={handleSendMessage}
    />
  );
}