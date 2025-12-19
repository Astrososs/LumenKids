import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { 
  createNewChat, 
  sendMessageToChat, 
  deleteChat, 
  subscribeToChats 
} from '../models/chatModel'; 
import { setChatHistory } from '../store/slices/chatSlice'; 
import { sendMessageToAi } from '../models/aiModel'; 

import ChatView from '../views/ChatView';

export default function ChatPresenter() {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();

  const { data: user } = useSelector((state) => state.user);
  
  const { history: chats } = useSelector((state) => state.chat);

  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hasAutoSelectedRef = useRef(false);

  useEffect(() => {
    if (!user?.uid) return;

    setCurrentChatId(null);
    hasAutoSelectedRef.current = false; 

    
    const unsubscribe = subscribeToChats(user.uid, (data) => {
      dispatch(setChatHistory(data)); 
    });
    return () => unsubscribe();
  }, [user, dispatch]);

  useEffect(() => {
    if (!currentChatId && chats.length > 0 && !hasAutoSelectedRef.current) {
        setCurrentChatId(chats[0].id);
        hasAutoSelectedRef.current = true;
    }
  }, [chats, currentChatId]);

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
        hasAutoSelectedRef.current = true;
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