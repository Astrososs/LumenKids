import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { 
  createNewChat, 
  sendMessageToChat, 
  deleteChat, 
  subscribeToChats 
} from '../models/chatModel';

import ChatView from '../views/ChatView';
import { sendMessageToAi } from '../models/aimodel'; 

export default function ChatPresenter() {
  const navigate = useNavigate(); 
  const { data: user } = useSelector((state) => state.user);
  
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeToChats(user.uid, (data) => {
      setChats(data);
      if (!currentChatId && data.length > 0) {
        setCurrentChatId(data[0].id);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const activeChat = chats.find(c => c.id === currentChatId);
  const messages = activeChat ? activeChat.messages : [];

  const handleBack = () => {
    navigate('/'); 
  };

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    const userMsg = input;
    setInput(""); 
    setLoading(true);

    try {
      let activeId = currentChatId;
      if (!activeId) {
        activeId = await createNewChat(user.uid, userMsg);
        setCurrentChatId(activeId);
      } else {
        await sendMessageToChat(user.uid, activeId, { role: 'user', content: userMsg });
      }

      const historyContext = messages.map(msg => ({ role: msg.role, text: msg.content }));
      const userAge = user.age || 10; 

      const aiResponseObj = await sendMessageToAi(userMsg, userAge, historyContext);
      
      await sendMessageToChat(user.uid, activeId, { 
        role: 'assistant', 
        content: aiResponseObj.text 
      });

    } catch (error) {
      console.error("Chat Error:", error);
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setIsMobileMenuOpen(false);
    setInput("");
  };

  const handleSelectChat = (id) => {
    setCurrentChatId(id);
    setIsMobileMenuOpen(false);
  };

  const handleDelete = async (e, chatId) => {
    e.stopPropagation(); 
    if (window.confirm("Delete this conversation?")) {
      await deleteChat(user.uid, chatId);
      if (currentChatId === chatId) setCurrentChatId(null);
    }
  };

  return (
    <ChatView
      chats={chats}
      currentChatId={currentChatId}
      messages={messages}
      input={input}
      setInput={setInput}
      loading={loading}
      onSend={handleSend}
      onSelectChat={handleSelectChat}
      onNewChat={handleNewChat}
      onDeleteChat={handleDelete}
      hasActiveChat={!!currentChatId}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      onBack={handleBack} 
    />
  );
}